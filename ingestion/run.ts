import { allSources, validateAllSources } from './sources'
import { fetchRSS, fetchJSON, fetchHTML, fetchCSV } from './fetchers'
import { normalizeAndUpsert } from './normalize'

export async function ingestAll() {
  console.log('🚀 Starting GYI opportunity ingestion...')
  
  // Validate all sources first
  const validationErrors = validateAllSources()
  if (Object.keys(validationErrors).length > 0) {
    console.error('❌ Source validation errors:')
    Object.entries(validationErrors).forEach(([sourceName, errors]) => {
      console.error(`  ${sourceName}: ${errors.join(', ')}`)
    })
    console.error('Please fix source configuration errors before proceeding.')
    return { error: 'Source validation failed', details: validationErrors }
  }
  
  console.log(`📊 Found ${allSources.length} configured sources`)
  
  let totalCreated = 0
  let totalUpdated = 0
  let totalSkipped = 0
  let totalErrors = 0
  
  const results: Record<string, any> = {}
  
  for (const source of allSources) {
    try {
      console.log(`\n🔄 Processing source: ${source.name} (${source.kind})`)
      console.log(`   URL: ${source.url}`)
      
      let items: any[] = []
      let startTime = Date.now()
      
      switch (source.kind) {
        case 'rss':
          items = await fetchRSS(source.url)
          break
        case 'json':
          items = await fetchJSON(source.url, source.path, source.map)
          break
        case 'html':
          items = await fetchHTML(source as any)
          break
        case 'csv':
          items = await fetchCSV(source.url, source.headers)
          break
        default:
          console.warn(`⚠️  Unknown source kind: ${source.kind}`)
          continue
      }
      
      const fetchTime = Date.now() - startTime
      
      if (items.length === 0) {
        console.warn(`⚠️  No items found for source: ${source.name}`)
        results[source.name] = { status: 'no_items', items: 0, time: fetchTime }
        continue
      }
      
      console.log(`✅ Found ${items.length} items from ${source.name} (${fetchTime}ms)`)
      
      // Process and upsert items
      startTime = Date.now()
      const result = await normalizeAndUpsert(items, source)
      const processTime = Date.now() - startTime
      
      totalCreated += result.created
      totalUpdated += result.updated
      totalSkipped += result.skipped
      
      results[source.name] = {
        status: 'success',
        items: items.length,
        created: result.created,
        updated: result.updated,
        skipped: result.skipped,
        fetchTime,
        processTime
      }
      
      console.log(`✅ Processed ${source.name}: ${result.created} created, ${result.updated} updated, ${result.skipped} skipped (${processTime}ms)`)
      
    } catch (error) {
      totalErrors++
      console.error(`❌ Ingestion error for source ${source.name}:`, error)
      results[source.name] = {
        status: 'error',
        error: error instanceof Error ? error.message : String(error),
        items: 0
      }
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(60))
  console.log('📊 INGESTION SUMMARY')
  console.log('='.repeat(60))
  console.log(`Total Sources: ${allSources.length}`)
  console.log(`Successful: ${allSources.length - totalErrors}`)
  console.log(`Failed: ${totalErrors}`)
  console.log(`Total Items: ${totalCreated + totalUpdated + totalSkipped}`)
  console.log(`Created: ${totalCreated}`)
  console.log(`Updated: ${totalUpdated}`)
  console.log(`Skipped: ${totalSkipped}`)
  console.log('='.repeat(60))
  
  // Detailed results
  console.log('\n📋 DETAILED RESULTS:')
  Object.entries(results).forEach(([sourceName, result]) => {
    const status = result.status === 'success' ? '✅' : result.status === 'no_items' ? '⚠️' : '❌'
    console.log(`${status} ${sourceName}: ${JSON.stringify(result)}`)
  })
  
  return {
    totalCreated,
    totalUpdated,
    totalSkipped,
    totalErrors,
    results
  }
}

// Run if called directly
if (require.main === module) {
  ingestAll()
    .then((result) => {
      if (result.error) {
        console.error('❌ Ingestion failed:', result.error)
        process.exit(1)
      }
      console.log('✅ Ingestion completed successfully')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Ingestion failed:', error)
      process.exit(1)
    })
}

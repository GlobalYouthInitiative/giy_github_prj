import { prisma } from '@/lib/prisma'
import { validateUrl } from '@/lib/utils'

export async function checkAllLinks() {
  console.log('Starting link validation...')
  
  // Get all approved opportunities with application URLs
  const opportunities = await prisma.opportunity.findMany({
    where: {
      approved: true,
      applicationUrl: { not: null }
    },
    select: {
      id: true,
      title: true,
      applicationUrl: true,
      lastChecked: true
    }
  })
  
  console.log(`Found ${opportunities.length} opportunities to check`)
  
  let valid = 0
  let broken = 0
  let skipped = 0
  
  for (const opportunity of opportunities) {
    try {
      // Skip if checked recently (within last 24 hours)
      if (opportunity.lastChecked && 
          Date.now() - opportunity.lastChecked.getTime() < 24 * 60 * 60 * 1000) {
        skipped++
        continue
      }
      
      console.log(`Checking: ${opportunity.title}`)
      
      const isValid = await validateUrl(opportunity.applicationUrl!)
      
      if (isValid) {
        await prisma.opportunity.update({
          where: { id: opportunity.id },
          data: {
            broken: false,
            lastChecked: new Date()
          }
        })
        valid++
      } else {
        await prisma.opportunity.update({
          where: { id: opportunity.id },
          data: {
            broken: true,
            lastChecked: new Date()
          }
        })
        broken++
        console.warn(`Broken link detected: ${opportunity.title} - ${opportunity.applicationUrl}`)
      }
      
      // Small delay to be respectful to servers
      await new Promise(resolve => setTimeout(resolve, 100))
      
    } catch (error) {
      console.error(`Error checking link for ${opportunity.title}:`, error)
      // Mark as broken if we can't check it
      await prisma.opportunity.update({
        where: { id: opportunity.id },
        data: {
          broken: true,
          lastChecked: new Date()
        }
      })
      broken++
    }
  }
  
  console.log(`Link check complete! Valid: ${valid}, Broken: ${broken}, Skipped: ${skipped}`)
  
  return {
    valid,
    broken,
    skipped
  }
}

// Run if called directly
if (require.main === module) {
  checkAllLinks()
    .then(() => {
      console.log('Link checking completed successfully')
      process.exit(0)
    })
    .catch((error) => {
      console.error('Link checking failed:', error)
      process.exit(1)
    })
}

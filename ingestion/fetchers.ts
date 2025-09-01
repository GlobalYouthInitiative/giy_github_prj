import * as cheerio from 'cheerio'
import Parser from 'rss-parser'

export interface FetchedItem {
  title: string
  url: string
  summary: string
  deadline?: string
  country?: string
  category?: string
  source: string
  organization?: string
  type?: string
  educationLevel?: string
  fields?: string[]
  duration?: string
  eligibility?: string
  funding?: string
  tags?: string[]
  requirements?: string[]
  benefits?: string[]
}

export async function fetchRSS(url: string): Promise<FetchedItem[]> {
  try {
    const parser = new Parser()
    const feed = await parser.parseURL(url)
    
    return feed.items.map(item => ({
      title: item.title ?? '',
      url: item.link ?? '',
      summary: item.contentSnippet ?? item.content ?? '',
      deadline: item.isoDate ?? item.pubDate ?? undefined,
      source: url,
      organization: feed.title || 'Unknown Organization',
      type: 'COMPETITION', // Default type for RSS feeds
      educationLevel: 'ALL_LEVELS',
      fields: ['General'],
      duration: 'Varies',
      eligibility: 'Check requirements',
      funding: 'Varies',
      tags: item.categories || [],
      requirements: [],
      benefits: []
    }))
  } catch (error) {
    console.error(`RSS fetch error for ${url}:`, error)
    return []
  }
}

export async function fetchJSON(url: string, path?: string, map?: string): Promise<FetchedItem[]> {
  try {
    const res = await fetch(url, { 
      headers: { 'user-agent': 'GYI/1.0 (+https://gyi.org/contact)' } 
    })
    
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`)
    }
    
    const json = await res.json()
    const data = path ? path.split('.').reduce((o: any, k: string) => o?.[k], json) : json
    
    if (!data) {
      throw new Error('No data found at specified path')
    }
    
    const items = Array.isArray(data) ? data : [data]
    
    if (map) {
      // Safe evaluation of the mapping function
      const fn = new Function('item', map) as (x: any) => any
      return items.map(fn)
    }
    
    return items.map((item: any) => ({
      title: item.title || item.name || '',
      url: item.url || item.link || item.applicationUrl || '',
      summary: item.summary || item.description || item.desc || '',
      deadline: item.deadline || item.dueDate || item.expiryDate,
      country: item.country || item.location || '',
      category: item.category || item.type || '',
      source: url,
      organization: item.organization || item.org || item.company || 'Unknown Organization',
      type: item.type || 'COMPETITION',
      educationLevel: item.educationLevel || 'ALL_LEVELS',
      fields: item.fields || [item.category || 'General'],
      duration: item.duration || 'Varies',
      eligibility: item.eligibility || 'Check requirements',
      funding: item.funding || 'Varies',
      tags: item.tags || [],
      requirements: item.requirements || [],
      benefits: item.benefits || []
    }))
  } catch (error) {
    console.error(`JSON fetch error for ${url}:`, error)
    return []
  }
}

export async function fetchHTML(config: {
  url: string
  item: string
  title: string
  link: string
  summary?: string
  date?: string
  extra?: Record<string, string>
}): Promise<FetchedItem[]> {
  try {
    const html = await (await fetch(config.url, { 
      headers: { 'user-agent': 'GYI/1.0 (+https://gyi.org/contact)' } 
    })).text()
    
    const $ = cheerio.load(html)
    const items = $(config.item).toArray()
    
    return items.map(el => {
      const $el = $(el)
      const linkHref = $el.find(config.link).attr('href')
      
      return {
        title: $el.find(config.title).text().trim(),
        url: linkHref ? new URL(linkHref, config.url).toString() : '',
        summary: config.summary ? $el.find(config.summary).text().trim() : '',
        deadline: config.date ? $el.find(config.date).text().trim() : undefined,
        source: config.url,
        organization: 'Unknown Organization',
        type: 'COMPETITION',
        educationLevel: 'ALL_LEVELS',
        fields: ['General'],
        duration: 'Varies',
        eligibility: 'Check requirements',
        funding: 'Varies',
        tags: [],
        requirements: [],
        benefits: []
      }
    }).filter(item => item.title && item.url) // Only return items with required fields
  } catch (error) {
    console.error(`HTML fetch error for ${config.url}:`, error)
    return []
  }
}

export async function fetchCSV(url: string, headers?: Record<string, string>): Promise<FetchedItem[]> {
  try {
    const text = await (await fetch(url)).text()
    const lines = text.split('\n').filter(Boolean)
    
    if (lines.length < 2) {
      throw new Error('CSV must have at least header and one data row')
    }
    
    const [head, ...rows] = lines.map(line => 
      line.split(',').map(cell => cell.trim().replace(/^"|"$/g, ''))
    )
    
    const getIndex = (key: string) => {
      const headerKey = headers?.[key] || key
      return head.findIndex(h => h.toLowerCase() === headerKey.toLowerCase())
    }
    
    return rows.map(cols => ({
      title: cols[getIndex('title')] || '',
      url: cols[getIndex('applicationUrl')] || cols[getIndex('url')] || '',
      summary: cols[getIndex('summary')] || cols[getIndex('description')] || '',
      deadline: cols[getIndex('deadline')] || cols[getIndex('dueDate')] || undefined,
      country: cols[getIndex('country')] || '',
      category: cols[getIndex('category')] || cols[getIndex('type')] || '',
      source: url,
      organization: cols[getIndex('organization')] || cols[getIndex('org')] || 'Unknown Organization',
      type: cols[getIndex('type')] || 'COMPETITION',
      educationLevel: cols[getIndex('educationLevel')] || 'ALL_LEVELS',
      fields: cols[getIndex('fields')] ? cols[getIndex('fields')].split(';') : ['General'],
      duration: cols[getIndex('duration')] || 'Varies',
      eligibility: cols[getIndex('eligibility')] || 'Check requirements',
      funding: cols[getIndex('funding')] || 'Varies',
      tags: cols[getIndex('tags')] ? cols[getIndex('tags')].split(';') : [],
      requirements: cols[getIndex('requirements')] ? cols[getIndex('requirements')].split(';') : [],
      benefits: cols[getIndex('benefits')] ? cols[getIndex('benefits')].split(';') : []
    })).filter(item => item.title && item.url) // Only return items with required fields
  } catch (error) {
    console.error(`CSV fetch error for ${url}:`, error)
    return []
  }
}

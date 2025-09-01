import sourcesConfig from './sources.json'

export type Source =
  | { kind: 'rss'; name: string; url: string; countryHints?: string[]; categories?: string[]; description?: string }
  | { kind: 'json'; name: string; url: string; path?: string; map?: string; description?: string } // eval-safe mapper
  | { kind: 'html'; name: string; url: string; item: string; title: string; link: string; summary?: string; date?: string; extra?: Record<string, string>; description?: string }
  | { kind: 'csv'; name: string; url: string; headers?: Record<string, string>; description?: string }

// Load sources from JSON file
export const sources: Source[] = sourcesConfig as Source[]

// Also support environment variable override
export const envSources: Source[] = process.env.OPP_SOURCES_JSON 
  ? JSON.parse(process.env.OPP_SOURCES_JSON) 
  : []

// Combine sources (JSON file takes precedence, then env)
export const allSources: Source[] = [...sources, ...envSources]

// Get sources by type
export const getSourcesByType = (type: 'rss' | 'json' | 'html' | 'csv') => {
  return allSources.filter(source => source.kind === type)
}

// Get source by name
export const getSourceByName = (name: string) => {
  return allSources.find(source => source.name === name)
}

// Validate source configuration
export const validateSource = (source: Source): string[] => {
  const errors: string[] = []
  
  if (!source.name || source.name.trim() === '') {
    errors.push('Source name is required')
  }
  
  if (!source.url || source.url.trim() === '') {
    errors.push('Source URL is required')
  }
  
  if (!source.kind || !['rss', 'json', 'html', 'csv'].includes(source.kind)) {
    errors.push('Invalid source kind')
  }
  
  // Validate URL format
  try {
    new URL(source.url)
  } catch {
    errors.push('Invalid URL format')
  }
  
  // Type-specific validation
  switch (source.kind) {
    case 'json':
      if (source.map && typeof source.map !== 'string') {
        errors.push('JSON source map must be a string')
      }
      break
    case 'html':
      if (!source.item || !source.title || !source.link) {
        errors.push('HTML source requires item, title, and link selectors')
      }
      break
  }
  
  return errors
}

// Validate all sources
export const validateAllSources = () => {
  const allErrors: Record<string, string[]> = {}
  
  allSources.forEach(source => {
    const errors = validateSource(source)
    if (errors.length > 0) {
      allErrors[source.name] = errors
    }
  })
  
  return allErrors
}

// Example sources (for reference - these should be configured via sources.json)
export const exampleSources: Source[] = [
  {
    kind: 'csv',
    name: 'GYI Sheet',
    url: 'https://docs.google.com/spreadsheets/d/<ID>/export?format=csv',
    description: 'Example Google Sheets CSV source'
  },
  {
    kind: 'rss',
    name: 'Org A Opportunities',
    url: 'https://example.org/opportunities/rss',
    description: 'Example RSS feed source'
  },
  {
    kind: 'json',
    name: 'Org B API',
    url: 'https://api.example.com/opps',
    path: 'data.items',
    map: 'return { title:item.title, url:item.apply_url, summary:item.desc, deadline:item.deadline, country:item.country, category:item.type }',
    description: 'Example JSON API source'
  },
  {
    kind: 'html',
    name: 'Org C Board',
    url: 'https://example.com/opportunities',
    item: '.card',
    title: '.card-title',
    link: 'a.apply',
    summary: '.card-desc',
    date: '.deadline',
    description: 'Example HTML scraping source'
  }
]

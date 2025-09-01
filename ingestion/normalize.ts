import { prisma } from '@/lib/prisma'
import { normalizeUrl } from '@/lib/utils'
import { FetchedItem } from './fetchers'
import { Source } from './sources'

// Country name to ISO code mapping
const countryMap: Record<string, string> = {
  'United States': 'US',
  'USA': 'US',
  'United Kingdom': 'GB',
  'UK': 'GB',
  'Germany': 'DE',
  'France': 'FR',
  'Canada': 'CA',
  'Australia': 'AU',
  'Japan': 'JP',
  'China': 'CN',
  'India': 'IN',
  'Brazil': 'BR',
  'Mexico': 'MX',
  'South Korea': 'KR',
  'Singapore': 'SG',
  'Netherlands': 'NL',
  'Switzerland': 'CH',
  'Sweden': 'SE',
  'Norway': 'NO',
  'Denmark': 'DK',
  'Finland': 'FI',
  'Italy': 'IT',
  'Spain': 'ES',
  'Portugal': 'PT',
  'Belgium': 'BE',
  'Austria': 'AT',
  'Poland': 'PL',
  'Czech Republic': 'CZ',
  'Hungary': 'HU',
  'Slovakia': 'SK',
  'Slovenia': 'SI',
  'Croatia': 'HR',
  'Romania': 'RO',
  'Bulgaria': 'BG',
  'Greece': 'GR',
  'Cyprus': 'CY',
  'Malta': 'MT',
  'Estonia': 'EE',
  'Latvia': 'LV',
  'Lithuania': 'LT',
  'Luxembourg': 'LU',
  'Ireland': 'IE',
  'Iceland': 'IS',
  'New Zealand': 'NZ',
  'South Africa': 'ZA',
  'Egypt': 'EG',
  'Nigeria': 'NG',
  'Kenya': 'KE',
  'Ghana': 'GH',
  'Ethiopia': 'ET',
  'Morocco': 'MA',
  'Tunisia': 'TN',
  'Algeria': 'DZ',
  'Libya': 'LY',
  'Sudan': 'SD',
  'Chad': 'TD',
  'Niger': 'NE',
  'Mali': 'ML',
  'Burkina Faso': 'BF',
  'Senegal': 'SN',
  'Guinea': 'GN',
  'Sierra Leone': 'SL',
  'Liberia': 'LR',
  'Ivory Coast': 'CI',
  'Togo': 'TG',
  'Benin': 'BJ',
  'Cameroon': 'CM',
  'Central African Republic': 'CF',
  'Equatorial Guinea': 'GQ',
  'Gabon': 'GA',
  'Congo': 'CG',
  'Democratic Republic of the Congo': 'CD',
  'Angola': 'AO',
  'Zambia': 'ZM',
  'Zimbabwe': 'ZW',
  'Botswana': 'BW',
  'Namibia': 'NA',
  'Lesotho': 'LS',
  'Eswatini': 'SZ',
  'Madagascar': 'MG',
  'Mauritius': 'MU',
  'Seychelles': 'SC',
  'Comoros': 'KM',
  'Mayotte': 'YT',
  'Reunion': 'RE',
  'Djibouti': 'DJ',
  'Somalia': 'SO',
  'Eritrea': 'ER',
  'Yemen': 'YE',
  'Oman': 'OM',
  'UAE': 'AE',
  'United Arab Emirates': 'AE',
  'Qatar': 'QA',
  'Bahrain': 'BH',
  'Kuwait': 'KW',
  'Iraq': 'IQ',
  'Iran': 'IR',
  'Afghanistan': 'AF',
  'Pakistan': 'PK',
  'Nepal': 'NP',
  'Bhutan': 'BT',
  'Bangladesh': 'BD',
  'Myanmar': 'MM',
  'Thailand': 'TH',
  'Laos': 'LA',
  'Cambodia': 'KH',
  'Vietnam': 'VN',
  'Malaysia': 'MY',
  'Indonesia': 'ID',
  'Philippines': 'PH',
  'Taiwan': 'TW',
  'Hong Kong': 'HK',
  'Mongolia': 'MN',
  'Kazakhstan': 'KZ',
  'Uzbekistan': 'UZ',
  'Turkmenistan': 'TM',
  'Tajikistan': 'TJ',
  'Kyrgyzstan': 'KG',
  'Georgia': 'GE',
  'Armenia': 'AM',
  'Azerbaijan': 'AZ',
  'Turkey': 'TR',
  'Syria': 'SY',
  'Lebanon': 'LB',
  'Jordan': 'JO',
  'Israel': 'IL',
  'Palestine': 'PS',
  'Saudi Arabia': 'SA',
  'Kuwait': 'KW',
  'Bahrain': 'BH',
  'Qatar': 'QA',
  'UAE': 'AE',
  'United Arab Emirates': 'AE',
  'Oman': 'OM',
  'Yemen': 'YE',
  'Russia': 'RU',
  'Ukraine': 'UA',
  'Belarus': 'BY',
  'Moldova': 'MD',
  'Albania': 'AL',
  'North Macedonia': 'MK',
  'Kosovo': 'XK',
  'Serbia': 'RS',
  'Montenegro': 'ME',
  'Bosnia and Herzegovina': 'BA',
  'Vatican City': 'VA',
  'San Marino': 'SM',
  'Monaco': 'MC',
  'Liechtenstein': 'LI',
  'Andorra': 'AD',
  'Gibraltar': 'GI',
  'Faroe Islands': 'FO',
  'Greenland': 'GL',
  'Bermuda': 'BM',
  'Cayman Islands': 'KY',
  'British Virgin Islands': 'VG',
  'Anguilla': 'AI',
  'Montserrat': 'MS',
  'Turks and Caicos': 'TC',
  'Aruba': 'AW',
  'Curacao': 'CW',
  'Sint Maarten': 'SX',
  'Bonaire': 'BQ',
  'Falkland Islands': 'FK',
  'South Georgia': 'GS',
  'French Guiana': 'GF',
  'Suriname': 'SR',
  'Guyana': 'GY',
  'Venezuela': 'VE',
  'Colombia': 'CO',
  'Ecuador': 'EC',
  'Peru': 'PE',
  'Bolivia': 'BO',
  'Paraguay': 'PY',
  'Uruguay': 'UY',
  'Chile': 'CL',
  'Argentina': 'AR',
  'Fiji': 'FJ',
  'Papua New Guinea': 'PG',
  'Solomon Islands': 'SB',
  'Vanuatu': 'VU',
  'New Caledonia': 'NC',
  'French Polynesia': 'PF',
  'Samoa': 'WS',
  'Tonga': 'TO',
  'Kiribati': 'KI',
  'Tuvalu': 'TV',
  'Nauru': 'NR',
  'Palau': 'PW',
  'Marshall Islands': 'MH',
  'Micronesia': 'FM',
  'Guam': 'GU',
  'Northern Mariana Islands': 'MP',
  'American Samoa': 'AS',
  'Cook Islands': 'CK',
  'Niue': 'NU',
  'Tokelau': 'TK',
  'Pitcairn': 'PN',
  'Wallis and Futuna': 'WF',
  'Easter Island': 'CL',
  'Galapagos': 'EC',
  'Tristan da Cunha': 'SH',
  'Saint Helena': 'SH',
  'Ascension': 'AC',
  'Tristan da Cunha': 'TA',
  'Gough Island': 'SH',
  'Inaccessible Island': 'SH',
  'Nightingale Islands': 'SH',
  'Tristan da Cunha': 'SH',
  'Gough Island': 'SH',
  'Inaccessible Island': 'SH',
  'Nightingale Islands': 'SH'
}

// Normalize country names
function normalizeCountry(country: string): string {
  if (!country) return 'Unknown'
  
  const normalized = country.trim()
  return countryMap[normalized] || normalized
}

// Normalize opportunity type
function normalizeType(type: string): string {
  const typeMap: Record<string, string> = {
    'internship': 'INTERNSHIP',
    'scholarship': 'SCHOLARSHIP',
    'summer program': 'SUMMER_PROGRAM',
    'summer-program': 'SUMMER_PROGRAM',
    'research': 'RESEARCH',
    'competition': 'COMPETITION',
    'contest': 'COMPETITION',
    'award': 'SCHOLARSHIP',
    'grant': 'SCHOLARSHIP',
    'fellowship': 'SCHOLARSHIP',
    'program': 'SUMMER_PROGRAM',
    'workshop': 'SUMMER_PROGRAM',
    'course': 'SUMMER_PROGRAM',
    'training': 'SUMMER_PROGRAM'
  }
  
  const normalized = type.toLowerCase().trim()
  return typeMap[normalized] || 'COMPETITION'
}

// Normalize education level
function normalizeEducationLevel(level: string): string {
  const levelMap: Record<string, string> = {
    'high school': 'HIGH_SCHOOL',
    'high-school': 'HIGH_SCHOOL',
    'highschool': 'HIGH_SCHOOL',
    'secondary': 'HIGH_SCHOOL',
    'undergraduate': 'UNDERGRADUATE',
    'college': 'UNDERGRADUATE',
    'university': 'UNDERGRADUATE',
    'bachelor': 'UNDERGRADUATE',
    'graduate': 'GRADUATE',
    'masters': 'GRADUATE',
    'master': 'GRADUATE',
    'postgraduate': 'POSTGRADUATE',
    'phd': 'POSTGRADUATE',
    'doctorate': 'POSTGRADUATE',
    'all levels': 'ALL_LEVELS',
    'all-levels': 'ALL_LEVELS',
    'any': 'ALL_LEVELS',
    'open': 'ALL_LEVELS'
  }
  
  const normalized = level.toLowerCase().trim()
  return levelMap[normalized] || 'ALL_LEVELS'
}

// Parse deadline string to Date
function parseDeadline(deadline: string | undefined): Date | null {
  if (!deadline) return null
  
  try {
    // Try various date formats
    const date = new Date(deadline)
    if (isNaN(date.getTime())) return null
    return date
  } catch {
    return null
  }
}

// Check for duplicate opportunities using similarity
async function findSimilarOpportunity(item: FetchedItem): Promise<string | null> {
  const normalizedUrl = normalizeUrl(item.url)
  if (!normalizedUrl) return null
  
  // First check by exact URL match
  const existing = await prisma.opportunity.findFirst({
    where: {
      OR: [
        { url: normalizedUrl },
        { applicationUrl: normalizedUrl }
      ]
    },
    select: { id: true }
  })
  
  if (existing) return existing.id
  
  // Check by title + organization similarity (basic approach)
  const similar = await prisma.opportunity.findFirst({
    where: {
      AND: [
        { title: { contains: item.title.slice(0, 50), mode: 'insensitive' } },
        { organization: { contains: item.organization?.slice(0, 30) || '', mode: 'insensitive' } }
      ]
    },
    select: { id: true }
  })
  
  return similar?.id || null
}

export async function normalizeAndUpsert(items: FetchedItem[], source: Source) {
  let created = 0
  let updated = 0
  let skipped = 0
  
  for (const item of items) {
    try {
      // Normalize URLs
      const normalizedUrl = normalizeUrl(item.url)
      const normalizedApplicationUrl = normalizeUrl(item.applicationUrl || item.url)
      
      // Skip if no valid URLs
      if (!normalizedUrl && !normalizedApplicationUrl) {
        console.warn(`Skipping item with no valid URLs: ${item.title}`)
        skipped++
        continue
      }
      
      // Check for duplicates
      const existingId = await findSimilarOpportunity(item)
      
      // Prepare data for upsert
      const data = {
        title: item.title,
        organization: item.organization || 'Unknown Organization',
        country: normalizeCountry(item.country || 'Unknown'),
        type: normalizeType(item.type || 'COMPETITION'),
        educationLevel: normalizeEducationLevel(item.educationLevel || 'ALL_LEVELS'),
        fields: item.fields || [item.category || 'General'],
        description: item.summary || 'No description available',
        duration: item.duration || 'Varies',
        eligibility: item.eligibility || 'Check requirements',
        funding: item.funding || 'Varies',
        deadline: parseDeadline(item.deadline),
        tags: item.tags || [],
        url: normalizedUrl,
        applicationUrl: normalizedApplicationUrl,
        requirements: item.requirements || [],
        benefits: item.benefits || [],
        source: source.name,
        sourceType: source.kind.toUpperCase() as any,
        approved: !!normalizedApplicationUrl, // Auto-approve if we have application URL
        broken: false,
        lastChecked: new Date()
      }
      
      if (existingId) {
        // Update existing
        await prisma.opportunity.update({
          where: { id: existingId },
          data: {
            ...data,
            updatedAt: new Date()
          }
        })
        updated++
      } else {
        // Create new
        await prisma.opportunity.create({
          data
        })
        created++
      }
    } catch (error) {
      console.error(`Error processing item ${item.title}:`, error)
      skipped++
    }
  }
  
  console.log(`Ingestion complete for ${source.name}: ${created} created, ${updated} updated, ${skipped} skipped`)
  return { created, updated, skipped }
}

export type CompanyBrand = {
  id: string
  label: string
  logo: string
  /** Intrinsic width / height of the logo asset */
  aspect: number
}

/**
 * Logos shown beside company names on the career timeline.
 * Keys match `ExperienceRole.company`.
 */
export const companiesByName: Record<string, CompanyBrand> = {
  Cynebo: {
    id: 'cynebo',
    label: 'Cynebo',
    logo: '/brand/companies/cynebo.webp',
    aspect: 99 / 128,
  },
  Boosta: {
    id: 'boosta',
    label: 'Boosta',
    logo: '/brand/companies/boosta.svg',
    aspect: 320 / 215,
  },
  Yaradin: {
    id: 'yaradin',
    label: 'Yaradin',
    logo: '/brand/companies/yaradin.webp',
    /** Wordmark is wide; keep height with tech icons, grow width. */
    aspect: 278 / 64,
  },
}

export function resolveCompany(name: string): CompanyBrand | undefined {
  return companiesByName[name]
}

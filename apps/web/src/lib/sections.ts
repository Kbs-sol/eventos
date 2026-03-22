import config from '@eventos/config'

type PageKey = keyof typeof config.sections

export function getSectionDefaults(page: PageKey): Record<string, boolean> {
  const pageConfig = config.sections[page]
  const result: Record<string, boolean> = {}

  for (const [key, value] of Object.entries(pageConfig)) {
    result[`${page}_${key}`] = value as boolean
  }

  return result
}

export function mergeSectionVisibility(
  page: PageKey,
  dbOverrides: Record<string, boolean>,
): Record<string, boolean> {
  const defaults = getSectionDefaults(page)
  return { ...defaults, ...dbOverrides }
}

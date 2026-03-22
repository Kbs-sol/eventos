import config from '../../brand.config'
import type { ShadowLevel } from './types'

const shadowMap: Record<ShadowLevel, string> = {
  none:   'none',
  subtle: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
  medium: '0 4px 24px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
  strong: '0 10px 40px rgba(0,0,0,0.16), 0 4px 16px rgba(0,0,0,0.08)',
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r} ${g} ${b}`
}

function lighten(hex: string, pct: number): string {
  const r = Math.min(255, parseInt(hex.slice(1, 3), 16) + Math.round(255 * pct / 100))
  const g = Math.min(255, parseInt(hex.slice(3, 5), 16) + Math.round(255 * pct / 100))
  const b = Math.min(255, parseInt(hex.slice(5, 7), 16) + Math.round(255 * pct / 100))
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`
}

function darken(hex: string, pct: number): string {
  const r = Math.max(0, parseInt(hex.slice(1, 3), 16) - Math.round(255 * pct / 100))
  const g = Math.max(0, parseInt(hex.slice(3, 5), 16) - Math.round(255 * pct / 100))
  const b = Math.max(0, parseInt(hex.slice(5, 7), 16) - Math.round(255 * pct / 100))
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`
}

export function generateCSSVars(): string {
  const { colors, fonts, style } = config.brand
  return `
    :root {
      /* Core palette */
      --color-primary:       ${colors.primary};
      --color-primary-rgb:   ${hexToRgb(colors.primary)};
      --color-primary-light: ${lighten(colors.primary, 15)};
      --color-primary-dark:  ${darken(colors.primary, 15)};
      --color-primary-10:    color-mix(in srgb, ${colors.primary} 10%, transparent);
      --color-primary-20:    color-mix(in srgb, ${colors.primary} 20%, transparent);
      --color-secondary:     ${colors.secondary};
      --color-secondary-rgb: ${hexToRgb(colors.secondary)};
      --color-accent:        ${colors.accent};
      --color-bg:            ${colors.background};
      --color-surface:       ${colors.surface};
      --color-text:          ${colors.text};
      --color-text-muted:    ${colors.textMuted};
      --color-border:        ${colors.border};
      /* Typography */
      --font-display:        '${fonts.display}', Georgia, serif;
      --font-body:           '${fonts.body}', system-ui, sans-serif;
      --font-accent:         '${fonts.accent ?? fonts.display}', sans-serif;
      /* Geometry */
      --radius-card:         ${style.cardRadius};
      --radius-button:       ${style.buttonRadius};
      --shadow-card:         ${shadowMap[style.shadowLevel]};
      --shadow-button:       ${shadowMap[style.shadowLevel === 'strong' ? 'medium' : style.shadowLevel]};
      /* Motion */
      --transition-base:     200ms ease;
      --animation-level:     '${style.animationLevel}';
    }
  `
}

export function getGoogleFontsUrl(): string {
  const { display, body, accent } = config.brand.fonts
  const families = [display, body, accent].filter(Boolean) as string[]
  const unique = [...new Set(families)]
  const params = unique.map(f => `family=${encodeURIComponent(f)}:wght@300;400;500;600;700`).join('&')
  return `https://fonts.googleapis.com/css2?${params}&display=swap`
}

// Single import point for all apps. NEVER import from brand.config.ts directly.
// @ts-ignore
import _config from '../../brand.config'
import type { BrandConfig } from './types'

const config = _config as unknown as BrandConfig;

export default config

export { generateCSSVars, getGoogleFontsUrl } from './theme'

export type {
  BrandConfig,
  LayoutVariant,
  HeroStyle,
  ButtonStyle,
  AnimationLevel,
  ShadowLevel,
  NavStyle,
  ServiceItem,
  StatItem,
  WhyUsPoint,
} from './types'

// Single import point for all apps. NEVER import from brand.config.ts directly.
import config from '../../brand.config';
export default config;
export { generateCSSVars, getGoogleFontsUrl } from './theme';

// Single import point for all apps. NEVER import from brand.config.ts directly.
// @ts-ignore
import _config from '../../brand.config';
const config = _config;
export default config;
export { generateCSSVars, getGoogleFontsUrl } from './theme';

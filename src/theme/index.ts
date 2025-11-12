/**
 * Theme Index - Export all theme tokens
 */

import colors from './colors';
import tokens from './tokens';
import animations from './animations';

// Export individual token properties for easier imports
export { colors, animations };
export const { spacing, borderRadius, typography, shadows, layout } = tokens;

export const theme = {
  colors,
  ...tokens,
  animations,
};

export default theme;

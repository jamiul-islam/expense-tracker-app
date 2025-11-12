/**
 * Theme Index - Export all theme tokens
 */

import colors from './colors';
import tokens from './tokens';
import animations from './animations';

export { colors, tokens, animations };

export const theme = {
  colors,
  ...tokens,
  animations,
};

export default theme;

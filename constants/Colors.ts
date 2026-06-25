import { Theme } from './Theme';

const tintColorLight = Theme.colors.primary;
const tintColorDark = Theme.colors.accentLight;

export default {
  light: {
    text: Theme.colors.text,
    background: Theme.colors.background,
    tint: tintColorLight,
    tabIconDefault: '#9CA3AF',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#F0F4F2',
    background: '#0A1F16',
    tint: tintColorDark,
    tabIconDefault: '#6B7280',
    tabIconSelected: tintColorDark,
  },
};

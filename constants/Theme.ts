export const lightColors = {
  primary: '#0B5E3C',
  primaryDark: '#064028',
  primaryLight: '#1A8B5C',
  secondary: '#1E7A52',
  accent: '#C9A227',
  accentLight: '#E8D48B',
  background: '#F4F9F6',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  text: '#1A2E24',
  textSecondary: '#5A7268',
  textLight: '#FFFFFF',
  border: '#D8E8DF',
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  prayerFajr: '#4A6FA5',
  prayerDhuhr: '#D4A017',
  prayerAsr: '#E07B39',
  prayerMaghrib: '#C0392B',
  prayerIsha: '#2C3E6B',
  gradientStart: '#0B5E3C',
  gradientEnd: '#1A8B5C',
  cardShadow: 'rgba(11, 94, 60, 0.12)',
  tafsirBody: '#2A3D34',
  muted: '#E8F2EC',
};

export const darkColors = {
  primary: '#2DB87A',
  primaryDark: '#1A8B5C',
  primaryLight: '#3DD68C',
  secondary: '#2DB87A',
  accent: '#E8C547',
  accentLight: '#F5E6A8',
  background: '#0C1410',
  surface: '#162019',
  surfaceElevated: '#1E2B24',
  text: '#E8F2EC',
  textSecondary: '#9BB5A8',
  textLight: '#FFFFFF',
  border: '#2A3D34',
  success: '#4ADE80',
  warning: '#FBBF24',
  error: '#F87171',
  prayerFajr: '#6B8FC7',
  prayerDhuhr: '#E8B84A',
  prayerAsr: '#F09555',
  prayerMaghrib: '#E05A4F',
  prayerIsha: '#5A6FA0',
  gradientStart: '#0A3D28',
  gradientEnd: '#145A3A',
  cardShadow: 'rgba(0, 0, 0, 0.35)',
  tafsirBody: '#D4E4DA',
  muted: '#1E2B24',
};

export const Theme = {
  colors: lightColors,
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 999,
  },
  fontSize: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 28,
    hero: 36,
    arabic: 22,
    arabicLarge: 28,
    tafsir: 16,
    tafsirLine: 28,
  },
};

export type ThemeColors = typeof lightColors;

export function getThemeColors(darkMode: boolean): ThemeColors {
  return darkMode ? darkColors : lightColors;
}

export type FeatureItem = {
  id: string;
  title: string;
  titleBn: string;
  icon: string;
  color: string;
  route: string;
};

export const FEATURES: FeatureItem[] = [
  { id: 'prayer', title: 'Prayer Times', titleBn: 'নামাজের সময়', icon: 'time', color: '#4A6FA5', route: '/features/prayer-times' },
  { id: 'quran', title: 'Al-Quran', titleBn: 'পবিত্র কুরআন', icon: 'book', color: '#0B5E3C', route: '/(tabs)/quran' },
  { id: 'nurani', title: 'Nurani Qaida', titleBn: 'নূরানী কায়দা', icon: 'school', color: '#1B6B4A', route: '/features/nurani-qaida' },
  { id: 'hifz', title: 'Hifz', titleBn: 'হিফজ ও তিলাওয়াত', icon: 'ribbon', color: '#2E7D5A', route: '/features/hifz' },
  { id: 'hadith', title: 'Hadith', titleBn: 'হাদিস', icon: 'library', color: '#8B5E3C', route: '/features/hadith' },
  { id: 'dua', title: 'Dua & Azkar', titleBn: 'দোয়া ও যিকির', icon: 'heart', color: '#C0392B', route: '/features/dua' },
  { id: 'fitness', title: 'Fitness', titleBn: 'ফিটনেস', icon: 'footsteps', color: '#2E86AB', route: '/features/fitness' },
  { id: 'tasbih', title: 'Tasbih', titleBn: 'তসবিহ', icon: 'ellipse', color: '#1A8B5C', route: '/features/tasbih' },
  { id: 'qibla', title: 'Qibla', titleBn: 'কিবলা', icon: 'compass', color: '#2C3E6B', route: '/features/qibla' },
  { id: 'zakat', title: 'Zakat', titleBn: 'যাকাত', icon: 'calculator', color: '#D4A017', route: '/features/zakat' },
  { id: 'calendar', title: 'Islamic Calendar', titleBn: 'ইসলামিক ক্যালেন্ডার', icon: 'calendar', color: '#6B4C9A', route: '/features/calendar' },
  { id: 'names', title: '99 Names', titleBn: 'আল্লাহর ৯৯ নাম', icon: 'star', color: '#C9A227', route: '/features/names-of-allah' },
  { id: 'hajj', title: 'Hajj & Umrah', titleBn: 'হজ্জ ও উমরাহ', icon: 'location', color: '#0D4A6B', route: '/features/hajj' },
  { id: 'scholar', title: 'Ask Scholar', titleBn: 'আলেমদের প্রশ্ন', icon: 'chatbubbles', color: '#3D7A5C', route: '/features/scholar' },
  { id: 'matrimonial', title: 'Matrimonial', titleBn: 'বিবাহ', icon: 'people', color: '#B56576', route: '/features/matrimonial' },
];

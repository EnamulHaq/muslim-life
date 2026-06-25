import { useAppSettings, type AppLanguage } from '@/hooks/useAppSettings';

const strings = {
  settings: { en: 'Settings', bn: 'সেটিংস' },
  offlineReading: { en: 'Offline Reading', bn: 'অফলাইন পড়া' },
  offlineDesc: {
    en: 'Quran, Hadith, Dua & Tafsir stored on device',
    bn: 'কুরআন, হাদিস, দোয়া ও তাফসীর ডিভাইসে সংরক্ষিত',
  },
  offlineReady: { en: 'All reading content available offline', bn: 'সব পড়ার কনটেন্ট অফলাইনে প্রস্তুত' },
  offlineDownload: { en: 'Tap to download for offline use', bn: 'অফলাইন ব্যবহারের জন্য ডাউনলোড করুন' },
  prayerSection: { en: 'Prayer', bn: 'নামাজ' },
  appSection: { en: 'App', bn: 'অ্যাপ' },
  supportSection: { en: 'Support', bn: 'সাহায্য' },
  prayerNotifications: { en: 'Prayer Notifications', bn: 'নামাজের নোটিফিকেশন' },
  prayerNotificationsDesc: { en: 'Alerts before each prayer time', bn: 'প্রতি নামাজের সময় সতর্কতা' },
  adhanSound: { en: 'Adhan Sound', bn: 'আজানের শব্দ' },
  adhanSoundDesc: { en: 'Play sound with prayer alerts', bn: 'নামাজের সতর্কতায় আজান বাজানো' },
  language: { en: 'Language', bn: 'ভাষা' },
  calculationMethod: { en: 'Calculation Method', bn: 'গণনা পদ্ধতি' },
  asrMethod: { en: 'Asr Method', bn: 'আসর পদ্ধতি' },
  darkMode: { en: 'Dark Mode', bn: 'ডার্ক মোড' },
  darkModeDesc: { en: 'Easier reading at night', bn: 'রাতে পড়া সহজ' },
  support: { en: 'Support', bn: 'সাহায্য' },
  about: { en: 'About', bn: 'সম্পর্কে' },
  greeting: { en: 'Assalamu Alaikum', bn: 'আসসালামু আলাইকুম' },
  notificationDenied: {
    en: 'Notification permission denied. Enable in device settings.',
    bn: 'নোটিফিকেশন অনুমতি দেওয়া হয়নি। ডিভাইস সেটিংসে চালু করুন।',
  },
  tafsir: { en: 'Tafsir', bn: 'তাফসীর' },
  selectTafsir: { en: 'Choose Tafsir', bn: 'তাফসীর নির্বাচন' },
  ayah: { en: 'Ayah', bn: 'আয়াত' },
  readSurah: { en: 'Read Surah', bn: 'সূরা পড়ুন' },
  expandAll: { en: 'Expand all', bn: 'সব খুলুন' },
  collapseAll: { en: 'Collapse all', bn: 'সব বন্ধ করুন' },
  noTafsir: { en: 'No tafsir available for this ayah.', bn: 'এই আয়াতের তাফসীর পাওয়া যায়নি।' },
  loadingTafsir: { en: 'Loading tafsir...', bn: 'তাফসীর লোড হচ্ছে...' },
  verses: { en: 'verses', bn: 'আয়াত' },
  home: { en: 'Home', bn: 'হোম' },
  quran: { en: 'Quran', bn: 'কুরআন' },
  explore: { en: 'Explore', bn: 'এক্সপ্লোর' },
} as const;

export type LabelKey = keyof typeof strings;

export function getLabel(key: LabelKey, language: AppLanguage): string {
  return strings[key][language];
}

export function useLabels() {
  const { settings } = useAppSettings();
  const t = (key: LabelKey) => getLabel(key, settings.language);
  return { t, language: settings.language, isBn: settings.language === 'bn' };
}

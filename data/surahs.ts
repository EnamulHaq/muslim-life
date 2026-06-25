export type Surah = {
  number: number;
  nameArabic: string;
  nameEnglish: string;
  nameBangla: string;
  verses: number;
  revelation: 'Meccan' | 'Medinan';
};

export const SURAHS: Surah[] = [
  { number: 1, nameArabic: 'الفاتحة', nameEnglish: 'Al-Fatihah', nameBangla: 'আল-ফাতিহা', verses: 7, revelation: 'Meccan' },
  { number: 2, nameArabic: 'البقرة', nameEnglish: 'Al-Baqarah', nameBangla: 'আল-বাকারা', verses: 286, revelation: 'Medinan' },
  { number: 3, nameArabic: 'آل عمران', nameEnglish: 'Ali Imran', nameBangla: 'আল-ইমরান', verses: 200, revelation: 'Medinan' },
  { number: 4, nameArabic: 'النساء', nameEnglish: 'An-Nisa', nameBangla: 'আন-নিসা', verses: 176, revelation: 'Medinan' },
  { number: 5, nameArabic: 'المائدة', nameEnglish: 'Al-Maidah', nameBangla: 'আল-মায়িদাহ', verses: 120, revelation: 'Medinan' },
  { number: 6, nameArabic: 'الأنعام', nameEnglish: 'Al-Anam', nameBangla: 'আল-আনআম', verses: 165, revelation: 'Meccan' },
  { number: 7, nameArabic: 'الأعراف', nameEnglish: 'Al-Araf', nameBangla: 'আল-আরাফ', verses: 206, revelation: 'Meccan' },
  { number: 8, nameArabic: 'الأنفال', nameEnglish: 'Al-Anfal', nameBangla: 'আল-আনফাল', verses: 75, revelation: 'Medinan' },
  { number: 9, nameArabic: 'التوبة', nameEnglish: 'At-Tawbah', nameBangla: 'আত-তাওবাহ', verses: 129, revelation: 'Medinan' },
  { number: 10, nameArabic: 'يونس', nameEnglish: 'Yunus', nameBangla: 'ইউনুস', verses: 109, revelation: 'Meccan' },
  { number: 11, nameArabic: 'هود', nameEnglish: 'Hud', nameBangla: 'হুদ', verses: 123, revelation: 'Meccan' },
  { number: 12, nameArabic: 'يوسف', nameEnglish: 'Yusuf', nameBangla: 'ইউসুফ', verses: 111, revelation: 'Meccan' },
  { number: 13, nameArabic: 'الرعد', nameEnglish: 'Ar-Rad', nameBangla: 'আর-রাদ', verses: 43, revelation: 'Medinan' },
  { number: 14, nameArabic: 'إبراهيم', nameEnglish: 'Ibrahim', nameBangla: 'ইব্রাহিম', verses: 52, revelation: 'Meccan' },
  { number: 15, nameArabic: 'الحجر', nameEnglish: 'Al-Hijr', nameBangla: 'আল-হিজর', verses: 99, revelation: 'Meccan' },
  { number: 16, nameArabic: 'النحل', nameEnglish: 'An-Nahl', nameBangla: 'আন-নাহল', verses: 128, revelation: 'Meccan' },
  { number: 17, nameArabic: 'الإسراء', nameEnglish: 'Al-Isra', nameBangla: 'আল-ইসরা', verses: 111, revelation: 'Meccan' },
  { number: 18, nameArabic: 'الكهف', nameEnglish: 'Al-Kahf', nameBangla: 'আল-কাহফ', verses: 110, revelation: 'Meccan' },
  { number: 19, nameArabic: 'مريم', nameEnglish: 'Maryam', nameBangla: 'মারইয়াম', verses: 98, revelation: 'Meccan' },
  { number: 20, nameArabic: 'طه', nameEnglish: 'Taha', nameBangla: 'তাহা', verses: 135, revelation: 'Meccan' },
  { number: 21, nameArabic: 'الأنبياء', nameEnglish: 'Al-Anbiya', nameBangla: 'আল-আম্বিয়া', verses: 112, revelation: 'Meccan' },
  { number: 22, nameArabic: 'الحج', nameEnglish: 'Al-Hajj', nameBangla: 'আল-হজ্জ', verses: 78, revelation: 'Medinan' },
  { number: 23, nameArabic: 'المؤمنون', nameEnglish: 'Al-Muminun', nameBangla: 'আল-মুমিনুন', verses: 118, revelation: 'Meccan' },
  { number: 24, nameArabic: 'النور', nameEnglish: 'An-Nur', nameBangla: 'আন-নূর', verses: 64, revelation: 'Medinan' },
  { number: 25, nameArabic: 'الفرقان', nameEnglish: 'Al-Furqan', nameBangla: 'আল-ফুরকান', verses: 77, revelation: 'Meccan' },
  { number: 26, nameArabic: 'الشعراء', nameEnglish: 'Ash-Shuara', nameBangla: 'আশ-শুআরা', verses: 227, revelation: 'Meccan' },
  { number: 27, nameArabic: 'النمل', nameEnglish: 'An-Naml', nameBangla: 'আন-নামল', verses: 93, revelation: 'Meccan' },
  { number: 28, nameArabic: 'القصص', nameEnglish: 'Al-Qasas', nameBangla: 'আল-কাসাস', verses: 88, revelation: 'Meccan' },
  { number: 29, nameArabic: 'العنكبوت', nameEnglish: 'Al-Ankabut', nameBangla: 'আল-আনকাবুত', verses: 69, revelation: 'Meccan' },
  { number: 30, nameArabic: 'الروم', nameEnglish: 'Ar-Rum', nameBangla: 'আর-রুম', verses: 60, revelation: 'Meccan' },
  { number: 36, nameArabic: 'يس', nameEnglish: 'Ya-Sin', nameBangla: 'ইয়াসিন', verses: 83, revelation: 'Meccan' },
  { number: 55, nameArabic: 'الرحمن', nameEnglish: 'Ar-Rahman', nameBangla: 'আর-রাহমান', verses: 78, revelation: 'Medinan' },
  { number: 56, nameArabic: 'الواقعة', nameEnglish: 'Al-Waqiah', nameBangla: 'আল-ওয়াকিয়াহ', verses: 96, revelation: 'Meccan' },
  { number: 67, nameArabic: 'الملك', nameEnglish: 'Al-Mulk', nameBangla: 'আল-মুলক', verses: 30, revelation: 'Meccan' },
  { number: 78, nameArabic: 'النبأ', nameEnglish: 'An-Naba', nameBangla: 'আন-নাবা', verses: 40, revelation: 'Meccan' },
  { number: 112, nameArabic: 'الإخلاص', nameEnglish: 'Al-Ikhlas', nameBangla: 'আল-ইখলাস', verses: 4, revelation: 'Meccan' },
  { number: 113, nameArabic: 'الفلق', nameEnglish: 'Al-Falaq', nameBangla: 'আল-ফালাক', verses: 5, revelation: 'Meccan' },
  { number: 114, nameArabic: 'الناس', nameEnglish: 'An-Nas', nameBangla: 'আন-নাস', verses: 6, revelation: 'Meccan' },
];

export const SAMPLE_VERSES: Record<number, { arabic: string; bangla: string; english: string }[]> = {
  1: [
    {
      arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      bangla: 'পরম করুণাময় অতি দয়ালু আল্লাহর নামে',
      english: 'In the name of Allah, the Entirely Merciful, the Especially Merciful',
    },
    {
      arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
      bangla: 'সমস্ত প্রশংসা আল্লাহর, যিনি সকল সৃষ্টির রব',
      english: 'All praise is due to Allah, Lord of the worlds',
    },
    {
      arabic: 'الرَّحْمَٰنِ الرَّحِيمِ',
      bangla: 'যিনি পরম করুণাময়, অতি দয়ালু',
      english: 'The Entirely Merciful, the Especially Merciful',
    },
    {
      arabic: 'مَالِكِ يَوْمِ الدِّينِ',
      bangla: 'যিনি বিচার দিনের মালিক',
      english: 'Sovereign of the Day of Recompense',
    },
    {
      arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
      bangla: 'আমরা কেবল তোমারই ইবাদত করি এবং কেবল তোমারই কাছে সাহায্য চাই',
      english: 'It is You we worship and You we ask for help',
    },
    {
      arabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
      bangla: 'আমাদেরকে সরল পথ দেখাও',
      english: 'Guide us to the straight path',
    },
    {
      arabic: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
      bangla: 'তাদের পথ, যাদের প্রতি তুমি অনুগ্রহ করেছ, যাদের প্রতি ক্রোধ করা হয়নি এবং যারা পথভ্রষ্ট নয়',
      english: 'The path of those upon whom You have bestowed favor, not of those who have earned anger or gone astray',
    },
  ],
  112: [
    {
      arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
      bangla: 'বলুন, তিনি আল্লাহ, এক ও অদ্বিতীয়',
      english: 'Say, He is Allah, the One',
    },
    {
      arabic: 'اللَّهُ الصَّمَدُ',
      bangla: 'আল্লাহ অমুখাপেক্ষী',
      english: 'Allah, the Eternal Refuge',
    },
    {
      arabic: 'لَمْ يَلِدْ وَلَمْ يُولَدْ',
      bangla: 'তিনি কাউকে জন্ম দেননি এবং তাঁকেও জন্ম দেওয়া হয়নি',
      english: 'He neither begets nor is born',
    },
    {
      arabic: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
      bangla: 'আর তাঁর সমতুল্য কেউ নেই',
      english: 'Nor is there to Him any equivalent',
    },
  ],
};

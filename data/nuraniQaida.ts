export type NuraniItem = {
  id: string;
  arabic: string;
  transliteration: string;
  nameBn: string;
  noteBn?: string;
};

export type NuraniLesson = {
  id: number;
  titleBn: string;
  titleEn: string;
  descriptionBn: string;
  items: NuraniItem[];
};

const HAROOF: NuraniItem[] = [
  { id: 'alif', arabic: 'ا', transliteration: 'আলিফ', nameBn: 'আলিফ', noteBn: 'গলনালির শব্দ' },
  { id: 'ba', arabic: 'ب', transliteration: 'বা', nameBn: 'বা', noteBn: 'নিচের দাঁতের সাহায্যে' },
  { id: 'ta', arabic: 'ت', transliteration: 'তা', nameBn: 'তা', noteBn: 'জিহ্বার ডগা' },
  { id: 'tha', arabic: 'ث', transliteration: 'সা', nameBn: 'সা (থা)', noteBn: 'জিহ্বা ও দাঁত' },
  { id: 'jim', arabic: 'ج', transliteration: 'জিম', nameBn: 'জিম', noteBn: 'জিহ্বার মাঝ' },
  { id: 'ha', arabic: 'ح', transliteration: 'হা', nameBn: 'হা', noteBn: 'গলনালি' },
  { id: 'kha', arabic: 'خ', transliteration: 'খা', nameBn: 'খা', noteBn: 'গলনালি' },
  { id: 'dal', arabic: 'د', transliteration: 'দাল', nameBn: 'দাল', noteBn: 'জিহ্বার ডগা' },
  { id: 'dhal', arabic: 'ذ', transliteration: 'জাল', nameBn: 'জাল (ধাল)', noteBn: 'জিহ্বা ও দাঁত' },
  { id: 'ra', arabic: 'ر', transliteration: 'রা', nameBn: 'রা', noteBn: 'জিহ্বার ডগা' },
  { id: 'zay', arabic: 'ز', transliteration: 'জা', nameBn: 'জা (জয়)', noteBn: 'জিহ্বা ও দাঁত' },
  { id: 'sin', arabic: 'س', transliteration: 'সিন', nameBn: 'সিন', noteBn: 'জিহ্বার নিচ' },
  { id: 'shin', arabic: 'ش', transliteration: 'শিন', nameBn: 'শিন', noteBn: 'জিহ্বার মাঝ' },
  { id: 'sad', arabic: 'ص', transliteration: 'সোয়াদ', nameBn: 'সোয়াদ', noteBn: 'জিহ্বার নিচ' },
  { id: 'dad', arabic: 'ض', transliteration: 'দোয়াদ', nameBn: 'দোয়াদ', noteBn: 'জিহ্বার একপাশ' },
  { id: 'taa', arabic: 'ط', transliteration: 'তোয়া', nameBn: 'তোয়া', noteBn: 'জিহ্বার ডগা' },
  { id: 'zaa', arabic: 'ظ', transliteration: 'জোয়া', nameBn: 'জোয়া', noteBn: 'জিহ্বা ও দাঁত' },
  { id: 'ayn', arabic: 'ع', transliteration: 'আইন', nameBn: 'আইন', noteBn: 'গলনালি' },
  { id: 'ghayn', arabic: 'غ', transliteration: 'গাইন', nameBn: 'গাইন', noteBn: 'গলনালি' },
  { id: 'fa', arabic: 'ف', transliteration: 'ফা', nameBn: 'ফা', noteBn: 'উপরের ঠোঁট ও দাঁত' },
  { id: 'qaf', arabic: 'ق', transliteration: 'কাফ', nameBn: 'কাফ', noteBn: 'জিহ্বার পিছন' },
  { id: 'kaf', arabic: 'ك', transliteration: 'কাফ', nameBn: 'কাফ (কাফ)', noteBn: 'জিহ্বার পিছন' },
  { id: 'lam', arabic: 'ل', transliteration: 'লাম', nameBn: 'লাম', noteBn: 'জিহ্বার ডগা' },
  { id: 'mim', arabic: 'م', transliteration: 'মিম', nameBn: 'মিম', noteBn: 'ঠোঁট বন্ধ' },
  { id: 'nun', arabic: 'ن', transliteration: 'নুন', nameBn: 'নুন', noteBn: 'জিহ্বার ডগা' },
  { id: 'ha2', arabic: 'ه', transliteration: 'হা', nameBn: 'হা (হা)', noteBn: 'হালক ঘোষ' },
  { id: 'waw', arabic: 'و', transliteration: 'ওয়াও', nameBn: 'ওয়াও', noteBn: 'ঠোঁট গোল' },
  { id: 'ya', arabic: 'ي', transliteration: 'য়া', nameBn: 'য়া', noteBn: 'জিহ্বার মাঝ' },
];

function withFatha(letter: string, bn: string): NuraniItem {
  return {
    id: `fatha-${letter}`,
    arabic: `${letter}َ`,
    transliteration: `${bn} + জবর`,
    nameBn: `${bn} — জবর (আ)`,
    noteBn: 'হরফের উপরে জবর থাকলে “আ” এর মতো পড়া হয়',
  };
}

function withKasra(letter: string, bn: string): NuraniItem {
  return {
    id: `kasra-${letter}`,
    arabic: `${letter}ِ`,
    transliteration: `${bn} + জের`,
    nameBn: `${bn} — জের (ই)`,
    noteBn: 'হরফের নিচে জের থাকলে “ই” এর মতো পড়া হয়',
  };
}

function withDamma(letter: string, bn: string): NuraniItem {
  return {
    id: `damma-${letter}`,
    arabic: `${letter}ُ`,
    transliteration: `${bn} + পেশ`,
    nameBn: `${bn} — পেশ (উ)`,
    noteBn: 'হরফের উপরে পেশ থাকলে “উ” এর মতো পড়া হয়',
  };
}

const SAMPLE_LETTERS: [string, string][] = [
  ['ب', 'বা'],
  ['ت', 'তা'],
  ['ج', 'জিম'],
  ['د', 'দাল'],
  ['ر', 'রা'],
  ['س', 'সিন'],
  ['ف', 'ফা'],
  ['ل', 'লাম'],
  ['م', 'মিম'],
  ['ن', 'নুন'],
];

export const NURANI_LESSONS: NuraniLesson[] = [
  {
    id: 1,
    titleBn: 'আরবি হরফ পরিচয়',
    titleEn: 'Arabic Letters',
    descriptionBn: '২৯টি আরবি হরফ শিখুন — নূরানী পদ্ধতির প্রথম ধাপ',
    items: HAROOF,
  },
  {
    id: 2,
    titleBn: 'জবর (ফাতহা)',
    titleEn: 'Fatha (Zabar)',
    descriptionBn: 'হরফের উপরে জবর — “আ” এর মতো উচ্চারণ',
    items: SAMPLE_LETTERS.map(([l, bn]) => withFatha(l, bn)),
  },
  {
    id: 3,
    titleBn: 'জের (কাসরা)',
    titleEn: 'Kasra (Zer)',
    descriptionBn: 'হরফের নিচে জের — “ই” এর মতো উচ্চারণ',
    items: SAMPLE_LETTERS.map(([l, bn]) => withKasra(l, bn)),
  },
  {
    id: 4,
    titleBn: 'পেশ (দাম্মা)',
    titleEn: 'Damma (Pesh)',
    descriptionBn: 'হরফের উপরে পেশ — “উ” এর মতো উচ্চারণ',
    items: SAMPLE_LETTERS.map(([l, bn]) => withDamma(l, bn)),
  },
  {
    id: 5,
    titleBn: 'জবর-জের-পেশ একত্র',
    titleEn: 'Combined Harakat',
    descriptionBn: 'একই হরফে জবর, জের, পেশ — পার্থক্য বুঝুন',
    items: [
      { id: 'c1', arabic: 'بَ', transliteration: 'বা', nameBn: 'বা (জবর)', noteBn: 'বা' },
      { id: 'c2', arabic: 'بِ', transliteration: 'বি', nameBn: 'বি (জের)', noteBn: 'বি' },
      { id: 'c3', arabic: 'بُ', transliteration: 'বু', nameBn: 'বু (পেশ)', noteBn: 'বু' },
      { id: 'c4', arabic: 'نَ', transliteration: 'না', nameBn: 'না', noteBn: 'নুন + জবর' },
      { id: 'c5', arabic: 'نِ', transliteration: 'নি', nameBn: 'নি', noteBn: 'নুন + জের' },
      { id: 'c6', arabic: 'نُ', transliteration: 'নু', nameBn: 'নু', noteBn: 'নুন + পেশ' },
    ],
  },
  {
    id: 6,
    titleBn: 'মাদ (দীর্ঘস্বর)',
    titleEn: 'Madd',
    descriptionBn: 'আলিফ, ওয়াও, যা দিয়ে হরফ টেনে পড়া হয়',
    items: [
      { id: 'm1', arabic: 'بَا', transliteration: 'বা-আ', nameBn: 'বা + আলিফ মাদ', noteBn: '২ হরফ টেনে পড়ুন' },
      { id: 'm2', arabic: 'يِي', transliteration: 'য়ী', nameBn: 'য়া + যা মাদ', noteBn: '“য়ী” টেনে' },
      { id: 'm3', arabic: 'نُو', transliteration: 'নূ', nameBn: 'নুন + ওয়াও মাদ', noteBn: '“নূ” টেনে' },
      { id: 'm4', arabic: 'قَالَ', transliteration: 'কালা', nameBn: 'কালা', noteBn: 'মাঝে আলিফ মাদ' },
      { id: 'm5', arabic: 'كِتَاب', transliteration: 'কিতাব', nameBn: 'কিতাব', noteBn: 'শব্দে মাদ' },
    ],
  },
  {
    id: 7,
    titleBn: 'তানভীন',
    titleEn: 'Tanween',
    descriptionBn: 'দ্বৈত জবর, জের, পেশ — “আন”, “ইন”, “উন” এর শব্দ',
    items: [
      { id: 't1', arabic: 'بً', transliteration: 'বান', nameBn: 'তানভীন ফাতহ', noteBn: 'বান' },
      { id: 't2', arabic: 'بٍ', transliteration: 'বিন', nameBn: 'তানভীন কাসর', noteBn: 'বিন' },
      { id: 't3', arabic: 'بٌ', transliteration: 'বুন', nameBn: 'তানভীন দাম্ম', noteBn: 'বুন' },
      { id: 't4', arabic: 'كِتَابٌ', transliteration: 'কিতাবুন', nameBn: 'কিতাবুন', noteBn: 'শব্দের শেষে তানভীন' },
      { id: 't5', arabic: 'رَحِيمٌ', transliteration: 'রাহীমুন', nameBn: 'রাহীমুন', noteBn: 'তানভীন দাম্ম' },
    ],
  },
  {
    id: 8,
    titleBn: 'সুকুন (জযম)',
    titleEn: 'Sukoon',
    descriptionBn: 'হরফের উপর ছোট দাঁড়ি — হরফ থামিয়ে পড়া',
    items: [
      { id: 's1', arabic: 'بْ', transliteration: 'ব্', nameBn: 'বা সুকুন', noteBn: 'থামিয়ে “ব্”' },
      { id: 's2', arabic: 'نْ', transliteration: 'ন্', nameBn: 'নুন সুকুন', noteBn: 'থামিয়ে “ন্”' },
      { id: 's3', arabic: 'مِن', transliteration: 'মিন', nameBn: 'মিন', noteBn: 'নুন সুকুন — মিন' },
      { id: 's4', arabic: 'عَلَى', transliteration: 'আলা', nameBn: 'আলা', noteBn: 'যা সুকুন' },
      { id: 's5', arabic: 'الْحَمْدُ', transliteration: 'আল-হামদু', nameBn: 'আলহামদু', noteBn: 'মিম সুকুন' },
    ],
  },
  {
    id: 9,
    titleBn: 'তাশদীদ',
    titleEn: 'Shadda',
    descriptionBn: 'হরফ দুবার পড়া — তাশদীদ চিহ্ন',
    items: [
      { id: 'sh1', arabic: 'بّ', transliteration: 'ব্ব', nameBn: 'বা তাশদীদ', noteBn: 'ব দুবার' },
      { id: 'sh2', arabic: 'نّ', transliteration: 'ন্ন', nameBn: 'নুন তাশদীদ', noteBn: 'ন দুবার' },
      { id: 'sh3', arabic: 'إِنَّ', transliteration: 'ইন্না', nameBn: 'ইন্না', noteBn: 'নুন তাশদীদ' },
      { id: 'sh4', arabic: 'الرَّحْمَٰن', transliteration: 'আর-রাহমান', nameBn: 'রাহমান', noteBn: 'রা তাশদীদ' },
      { id: 'sh5', arabic: 'مُحَمَّد', transliteration: 'মুহাম্মাদ', nameBn: 'মুহাম্মাদ', noteBn: 'মিম তাশদীদ' },
    ],
  },
  {
    id: 10,
    titleBn: 'গুন্নাহ',
    titleEn: 'Ghunnah',
    descriptionBn: 'নাসাল ধ্বনি — নুন ও মিমের গুন্নাহ',
    items: [
      { id: 'g1', arabic: 'مِن', transliteration: 'মিন', nameBn: 'মিন — গুন্নাহ', noteBn: 'নুন থেকে নাক দিয়ে শব্দ' },
      { id: 'g2', arabic: 'إِنَّ', transliteration: 'ইন্না', nameBn: 'ইন্না — ২ হরফ গুন্নাহ', noteBn: 'তাশদীদ + গুন্নাহ' },
      { id: 'g3', arabic: 'مِمَّ', transliteration: 'মিম্মা', nameBn: 'মিম্মা', noteBn: 'মিম গুন্নাহ' },
      { id: 'g4', arabic: 'أَنْعَمْتَ', transliteration: 'আনআমতা', nameBn: 'আনআমতা', noteBn: 'নুন গুন্নাহ' },
    ],
  },
  {
    id: 11,
    titleBn: 'হরফ মিলিয়ে শব্দ — ১',
    titleEn: 'Word Building 1',
    descriptionBn: 'ছোট আরবি শব্দ পড়ার অনুশীলন',
    items: [
      { id: 'w1', arabic: 'بَاب', transliteration: 'বাব', nameBn: 'বাব (দরজা)', noteBn: 'বা-আ-ব' },
      { id: 'w2', arabic: 'كِتَاب', transliteration: 'কিতাব', nameBn: 'কিতাব (বই)', noteBn: 'কি-তা-ব' },
      { id: 'w3', arabic: 'رَبّ', transliteration: 'রাব্ব', nameBn: 'রাব্ব (পালনকর্তা)', noteBn: 'রা-ব্ব' },
      { id: 'w4', arabic: 'عَلِيم', transliteration: 'আলীম', nameBn: 'আলীম (সর্বজ্ঞ)', noteBn: 'আ-লী-ম' },
      { id: 'w5', arabic: 'حَمِيد', transliteration: 'হামীদ', nameBn: 'হামীদ (প্রশংসিত)', noteBn: 'হা-মী-দ' },
    ],
  },
  {
    id: 12,
    titleBn: 'হরফ মিলিয়ে শব্দ — ২',
    titleEn: 'Word Building 2',
    descriptionBn: 'আরও শব্দ — কুরআনে প্রায়শই আসে',
    items: [
      { id: 'w6', arabic: 'صَلَاة', transliteration: 'সালাত', nameBn: 'সালাত (নামাজ)', noteBn: 'সা-লা-ত' },
      { id: 'w7', arabic: 'جَنَّة', transliteration: 'জান্নাহ', nameBn: 'জান্নাত', noteBn: 'জা-ন্না-ত' },
      { id: 'w8', arabic: 'نُور', transliteration: 'নূর', nameBn: 'নূর (আলো)', noteBn: 'নূ-র' },
      { id: 'w9', arabic: 'هُدًى', transliteration: 'হুদা', nameBn: 'হুদা (পথনির্দেশ)', noteBn: 'হু-দা' },
      { id: 'w10', arabic: 'شَكُر', transliteration: 'শুকর', nameBn: 'শুকর (কৃতজ্ঞতা)', noteBn: 'শু-কু-র' },
    ],
  },
  {
    id: 13,
    titleBn: 'ছোট আয়াত অনুশীলন',
    titleEn: 'Short Ayah Practice',
    descriptionBn: 'কায়দা শেষে ছোট আয়াত পড়ার অনুশীলন',
    items: [
      {
        id: 'a1',
        arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
        transliteration: 'বিসমিল্লাহির রাহমানির রাহীম',
        nameBn: 'বিসমিল্লাহ',
        noteBn: 'সূরা শুরুর দোয়া',
      },
      {
        id: 'a2',
        arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
        transliteration: 'কুল হুয়াল্লাহু আহাদ',
        nameBn: 'সূরা ইখলাস ১',
        noteBn: 'কুল হুয়াল্লাহু আহাদ',
      },
      {
        id: 'a3',
        arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
        transliteration: 'আলহামদু লিল্লাহি রাব্বিল আলামীন',
        nameBn: 'সূরা ফাতিহা ২',
        noteBn: 'সমস্ত প্রশংসা আল্লাহর',
      },
      {
        id: 'a4',
        arabic: 'رَبِّ زِدْنِي عِلْمًا',
        transliteration: 'রাব্বি জিদনী ইলমা',
        nameBn: 'দোয়া',
        noteBn: 'হে রব, আমার জ্ঞান বৃদ্ধি করুন',
      },
    ],
  },
  {
    id: 14,
    titleBn: 'সূরা আল-ফাতিহা',
    titleEn: 'Surah Al-Fatiha',
    descriptionBn: '৭টি আয়াত — নামাজে পড়া হয়',
    items: [
      {
        id: 'f1',
        arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
        transliteration: 'বিসমিল্লাহির রাহমানির রাহীম',
        nameBn: 'আয়াত ১ (বিসমিল্লাহ)',
      },
      {
        id: 'f2',
        arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
        transliteration: 'আলহামদু লিল্লাহি রাব্বিল আলামীন',
        nameBn: 'আয়াত ২',
      },
      {
        id: 'f3',
        arabic: 'الرَّحْمَٰنِ الرَّحِيمِ',
        transliteration: 'আর রাহমানির রাহীম',
        nameBn: 'আয়াত ৩',
      },
      {
        id: 'f4',
        arabic: 'مَالِكِ يَوْمِ الدِّينِ',
        transliteration: 'মালিকি ইয়াওমিদ্দীন',
        nameBn: 'আয়াত ৪',
      },
      {
        id: 'f5',
        arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
        transliteration: 'ইয়্যাকা নাবুদু ওয়া ইয়্যাকা নাসতাইন',
        nameBn: 'আয়াত ৫',
      },
      {
        id: 'f6',
        arabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
        transliteration: 'ইহদিনাস সিরাতাল মুস্তাকীম',
        nameBn: 'আয়াত ৬',
      },
      {
        id: 'f7',
        arabic: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ',
        transliteration: 'সিরাতাল্লাজীনা আনআমতা আলাইহিম',
        nameBn: 'আয়াত ৭ (অংশ)',
      },
    ],
  },
  {
    id: 15,
    titleBn: 'আম পারা — শুরুর সূরা',
    titleEn: 'Juz Amma Start',
    descriptionBn: 'নূরানী কায়দা শেষে আম পারার সূরা অনুশীলন',
    items: [
      {
        id: 'j1',
        arabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
        transliteration: 'কুল আউযু বিরাব্বিন নাস',
        nameBn: 'সূরা আন-নাস ১',
        noteBn: 'আম পারা — সূরা ১১৪',
      },
      {
        id: 'j2',
        arabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ',
        transliteration: 'কুল আউযু বিরাব্বিল ফালাক',
        nameBn: 'সূরা আল-ফালাক ১',
        noteBn: 'সূরা ১১৩',
      },
      {
        id: 'j3',
        arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
        transliteration: 'কুল হুয়াল্লাহু আহাদ',
        nameBn: 'সূরা আল-ইখলাস ১',
        noteBn: 'সূরা ১১২',
      },
      {
        id: 'j4',
        arabic: 'إِذَا جَاءَ نَصْرُ اللَّهِ',
        transliteration: 'ইযা জাআ নাসরুল্লাহ',
        nameBn: 'সূরা আন-নাসর ১',
        noteBn: 'সূরা ১১০',
      },
    ],
  },
];

export function getNuraniLesson(id: number): NuraniLesson | undefined {
  return NURANI_LESSONS.find((l) => l.id === id);
}

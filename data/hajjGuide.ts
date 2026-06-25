export type HajjStep = {
  id: string;
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
  icon: string;
};

export const HAJJ_STEPS: HajjStep[] = [
  {
    id: '1',
    title: 'Ihram',
    titleBn: 'ইহরাম',
    description: 'Enter the state of Ihram before crossing Miqat. Make intention (niyyah) and recite Talbiyah.',
    descriptionBn: 'মীকাত অতিক্রম করার আগে ইহরামে প্রবেশ করুন। নিয়ত করুন এবং তালবিয়াহ পড়ুন।',
    icon: 'shirt',
  },
  {
    id: '2',
    title: 'Tawaf',
    titleBn: 'তাওয়াফ',
    description: 'Perform seven circuits around the Kaaba, starting from the Black Stone (Hajar al-Aswad).',
    descriptionBn: 'কাবা ঘরের চারপাশে সাতবার প্রদক্ষিণ করুন, হাজরে আসওয়াদ থেকে শুরু করুন।',
    icon: 'sync',
  },
  {
    id: '3',
    title: 'Sa\'i',
    titleBn: 'সাঈ',
    description: 'Walk seven times between the hills of Safa and Marwah, commemorating Hajar\'s search for water.',
    descriptionBn: 'সাফা ও মারওয়া পাহাড়ের মধ্যে সাতবার চলাফেরা করুন, হাজেরা (আ.)-এর পানি খোঁজার স্মরণে।',
    icon: 'walk',
  },
  {
    id: '4',
    title: 'Day of Arafah',
    titleBn: 'আরাফার দিন',
    description: 'Stand at the plain of Arafah from noon until sunset on the 9th of Dhul Hijjah. The most important day of Hajj.',
    descriptionBn: '৯ জিলহজ দুপুর থেকে সূর্যাস্ত পর্যন্ত আরাফার ময়দানে অবস্থান করুন। হজ্জের সবচেয়ে গুরুত্বপূর্ণ দিন।',
    icon: 'sunny',
  },
  {
    id: '5',
    title: 'Muzdalifah',
    titleBn: 'মুজদালিফা',
    description: 'After sunset on Arafah, proceed to Muzdalifah. Collect pebbles for stoning and pray Maghrib and Isha combined.',
    descriptionBn: 'আরাফার সূর্যাস্তের পর মুজদালিফায় যান। রমি করার জন্য কঙ্কর সংগ্রহ করুন এবং মাগরিব-এশা একত্রে আদায় করুন।',
    icon: 'moon',
  },
  {
    id: '6',
    title: 'Rami (Stoning)',
    titleBn: 'রমি (কঙ্কর নিক্ষেপ)',
    description: 'Throw pebbles at the Jamarat pillars on the 10th, 11th, and 12th of Dhul Hijjah.',
    descriptionBn: '১০, ১১ ও ১২ জিলহজ জামারাতের স্তম্ভে কঙ্কর নিক্ষেপ করুন।',
    icon: 'ellipse',
  },
  {
    id: '7',
    title: 'Qurbani',
    titleBn: 'কুরবানি',
    description: 'Sacrifice an animal on the 10th of Dhul Hijjah (Eid al-Adha) following the Sunnah of Prophet Ibrahim (AS).',
    descriptionBn: '১০ জিলহজ (ঈদুল আযহা) নবী ইব্রাহিম (আ.)-এর সুন্নাহ অনুসারে কুরবানি করুন।',
    icon: 'gift',
  },
  {
    id: '8',
    title: 'Halq or Taqsir',
    titleBn: 'হালক বা তাকসীর',
    description: 'Men shave their heads (Halq) or trim hair (Taqsir). Women cut a fingertip-length of hair.',
    descriptionBn: 'পুরুষরা মাথা মুণ্ডন (হালক) বা চুল কাটেন (তাকসীর)। মহিলারা আঙুলের ডগমাত্র চুল কাটেন।',
    icon: 'cut',
  },
  {
    id: '9',
    title: 'Tawaf al-Ifadah',
    titleBn: 'তাওয়াফে ইফাদা',
    description: 'Perform Tawaf around the Kaaba after returning from Mina. This is a pillar of Hajj.',
    descriptionBn: 'মিনা থেকে ফিরে কাবা ঘরের তাওয়াফ করুন। এটি হজ্জের একটি রুকন।',
    icon: 'sync',
  },
  {
    id: '10',
    title: 'Farewell Tawaf',
    titleBn: 'বিদায়ী তাওয়াফ',
    description: 'Before leaving Makkah, perform a final Tawaf (Tawaf al-Wada) as the farewell to the Holy Kaaba.',
    descriptionBn: 'মক্কা ত্যাগ করার আগে শেষ তাওয়াফ (তাওয়াফে ওয়াদা) করুন, পবিত্র কাবার প্রতি বিদায় জানানোর জন্য।',
    icon: 'heart',
  },
];

export const UMRAH_STEPS: HajjStep[] = [
  {
    id: 'u1',
    title: 'Ihram',
    titleBn: 'ইহরাম',
    description: 'Enter Ihram at the Miqat with intention for Umrah.',
    descriptionBn: 'উমরাহর নিয়ত সহ মীকাতে ইহরামে প্রবেশ করুন।',
    icon: 'shirt',
  },
  {
    id: 'u2',
    title: 'Tawaf',
    titleBn: 'তাওয়াফ',
    description: 'Perform seven circuits around the Kaaba.',
    descriptionBn: 'কাবা ঘরের চারপাশে সাতবার প্রদক্ষিণ করুন।',
    icon: 'sync',
  },
  {
    id: 'u3',
    title: 'Sa\'i',
    titleBn: 'সাঈ',
    description: 'Walk seven times between Safa and Marwah.',
    descriptionBn: 'সাফা ও মারওয়ার মধ্যে সাতবার চলাফেরা করুন।',
    icon: 'walk',
  },
  {
    id: 'u4',
    title: 'Halq/Taqsir',
    titleBn: 'হালক/তাকসীর',
    description: 'Shave or trim hair to exit Ihram and complete Umrah.',
    descriptionBn: 'চুল মুণ্ডন বা কাটার মাধ্যমে ইহরাম থেকে বের হন এবং উমরাহ সম্পন্ন করুন।',
    icon: 'cut',
  },
];

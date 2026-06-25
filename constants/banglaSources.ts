export const HADITH_BANGLA_CDN = 'https://cdn.jsdelivr.net/gh/md-rifatkhan/hadithbangla@main';

export const HADITH_BANGLA_COLLECTIONS: Record<string, string> = {
  bukhari: 'Bukhari',
  muslim: 'Muslim',
  abudawud: 'AbuDaud',
  ibnmajah: 'Ibne-Mazah',
  nasai: 'Al-Nasai',
  tirmidhi: 'At-tirmizi',
};

export const HADITH_BANGLA_SUPPORTED = new Set(Object.keys(HADITH_BANGLA_COLLECTIONS));

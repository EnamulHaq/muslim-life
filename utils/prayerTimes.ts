import {
  CalculationMethod,
  Coordinates,
  Madhab,
  PrayerTimes as AdhanPrayerTimes,
} from 'adhan';

export type PrayerName = 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export type PrayerTime = {
  name: PrayerName;
  label: string;
  labelBn: string;
  time: Date;
  color: string;
};

const PRAYER_META: Record<PrayerName, { label: string; labelBn: string; color: string }> = {
  fajr: { label: 'Fajr', labelBn: 'ফজর', color: '#4A6FA5' },
  sunrise: { label: 'Sunrise', labelBn: 'সূর্যোদয়', color: '#F59E0B' },
  dhuhr: { label: 'Dhuhr', labelBn: 'যোহর', color: '#D4A017' },
  asr: { label: 'Asr', labelBn: 'আসর', color: '#E07B39' },
  maghrib: { label: 'Maghrib', labelBn: 'মাগরিব', color: '#C0392B' },
  isha: { label: 'Isha', labelBn: 'এশা', color: '#2C3E6B' },
};

export function getPrayerTimes(
  latitude: number,
  longitude: number,
  date = new Date(),
  options?: {
    calculationMethod?: 'MuslimWorldLeague' | 'Karachi' | 'Egyptian' | 'UmmAlQura' | 'NorthAmerica';
    asrMethod?: 'Hanafi' | 'Shafi';
  }
): PrayerTime[] {
  const coordinates = new Coordinates(latitude, longitude);
  const methodMap = {
    MuslimWorldLeague: CalculationMethod.MuslimWorldLeague,
    Karachi: CalculationMethod.Karachi,
    Egyptian: CalculationMethod.Egyptian,
    UmmAlQura: CalculationMethod.UmmAlQura,
    NorthAmerica: CalculationMethod.NorthAmerica,
  } as const;

  const params = methodMap[options?.calculationMethod ?? 'MuslimWorldLeague']();
  params.madhab = options?.asrMethod === 'Shafi' ? Madhab.Shafi : Madhab.Hanafi;

  const prayerTimes = new AdhanPrayerTimes(coordinates, date, params);

  const entries: [PrayerName, Date][] = [
    ['fajr', prayerTimes.fajr],
    ['sunrise', prayerTimes.sunrise],
    ['dhuhr', prayerTimes.dhuhr],
    ['asr', prayerTimes.asr],
    ['maghrib', prayerTimes.maghrib],
    ['isha', prayerTimes.isha],
  ];

  return entries.map(([name, time]) => ({
    name,
    ...PRAYER_META[name],
    time,
  }));
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function getNextPrayer(prayers: PrayerTime[]): PrayerTime | null {
  const now = new Date();
  const upcoming = prayers.find((p) => p.name !== 'sunrise' && p.time > now);
  return upcoming ?? prayers.find((p) => p.name === 'fajr') ?? null;
}

export function getTimeUntil(target: Date): { hours: number; minutes: number; seconds: number } {
  const now = new Date();
  let diff = target.getTime() - now.getTime();
  if (diff < 0) diff += 24 * 60 * 60 * 1000;

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { hours, minutes, seconds };
}

export function getHijriDate(date = new Date()): { day: number; month: string; monthBn: string; year: number } {
  const formatter = new Intl.DateTimeFormat('en-u-ca-islamic', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const parts = formatter.formatToParts(date);
  const day = parseInt(parts.find((p) => p.type === 'day')?.value ?? '1', 10);
  const month = parts.find((p) => p.type === 'month')?.value ?? '';
  const year = parseInt(parts.find((p) => p.type === 'year')?.value ?? '1446', 10);

  const monthBnMap: Record<string, string> = {
    Muharram: 'মুহাররম',
    Safar: 'সফর',
    'Rabiʻ I': 'রবিউল আউয়াল',
    'Rabiʻ II': 'রবিউস সানি',
    'Jumada I': 'জমাদিউল আউয়াল',
    'Jumada II': 'জমাদিউস সানি',
    Rajab: 'রজব',
    'Shaʻban': 'শাবান',
    Ramadan: 'রমজান',
    Shawwal: 'শাওয়াল',
    "Dhuʻl-Qiʻdah": 'জিলকদ',
    "Dhuʻl-Hijjah": 'জিলহজ',
  };

  return { day, month, monthBn: monthBnMap[month] ?? month, year };
}

function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

export type ForbiddenTimeWindow = {
  id: string;
  titleBn: string;
  titleEn: string;
  start: Date;
  end: Date;
  descBn: string;
};

export function getForbiddenTimeWindows(prayers: PrayerTime[]): ForbiddenTimeWindow[] {
  const sunrise = prayers.find((p) => p.name === 'sunrise')?.time;
  const dhuhr = prayers.find((p) => p.name === 'dhuhr')?.time;
  const maghrib = prayers.find((p) => p.name === 'maghrib')?.time;

  const windows: ForbiddenTimeWindow[] = [];

  if (sunrise) {
    windows.push({
      id: 'after-sunrise',
      titleBn: 'সূর্যোদয়ের পর',
      titleEn: 'After sunrise',
      start: sunrise,
      end: addMinutes(sunrise, 20),
      descBn: 'সূর্যোদয় থেকে প্রায় ২০ মিনিট — নফল নামাজ মাকরুহ',
    });
  }

  if (dhuhr) {
    windows.push({
      id: 'zawal',
      titleBn: 'যাওয়াল',
      titleEn: 'Zawal',
      start: addMinutes(dhuhr, -10),
      end: dhuhr,
      descBn: 'জোহরের ১০ মিনিট আগে থেকে জোহর পর্যন্ত নামাজ নিষিদ্ধ',
    });
  }

  if (maghrib) {
    windows.push({
      id: 'before-sunset',
      titleBn: 'সূর্যাস্তের আগে',
      titleEn: 'Before sunset',
      start: addMinutes(maghrib, -20),
      end: maghrib,
      descBn: 'মাগরিবের ২০ মিনিট আগে থেকে মাগরিব পর্যন্ত নামাজ নিষিদ্ধ',
    });
  }

  return windows;
}

export function isInForbiddenTime(prayers: PrayerTime[], now = new Date()): ForbiddenTimeWindow | null {
  return getForbiddenTimeWindows(prayers).find((w) => now >= w.start && now < w.end) ?? null;
}

export type PrayerWindow = {
  name: PrayerName;
  start: Date;
  end: Date;
  validBn: string;
  invalidBn: string;
};

export function getFardPrayerWindows(prayers: PrayerTime[]): PrayerWindow[] {
  const map = new Map(prayers.map((p) => [p.name, p.time]));
  const fajr = map.get('fajr');
  const sunrise = map.get('sunrise');
  const dhuhr = map.get('dhuhr');
  const asr = map.get('asr');
  const maghrib = map.get('maghrib');
  const isha = map.get('isha');

  const nextFajr = fajr ? addMinutes(fajr, 24 * 60) : new Date();

  const windows: PrayerWindow[] = [];

  if (fajr && sunrise) {
    windows.push({
      name: 'fajr',
      start: fajr,
      end: sunrise,
      validBn: 'ফজরের আজান থেকে সূর্যোদয় পর্যন্ত',
      invalidBn: 'সূর্যোদয়ের পর ফজর কাজা হয় না',
    });
  }
  if (dhuhr && asr) {
    windows.push({
      name: 'dhuhr',
      start: dhuhr,
      end: asr,
      validBn: 'যোহরের আজান থেকে আসরের আজান পর্যন্ত',
      invalidBn: 'যাওয়ালে ও আসরের পর কাজা',
    });
  }
  if (asr && maghrib) {
    windows.push({
      name: 'asr',
      start: asr,
      end: addMinutes(maghrib, -20),
      validBn: 'আসরের আজান থেকে সূর্যাস্তের নিষিদ্ধ সময় পর্যন্ত',
      invalidBn: 'সূর্যাস্তের নিষিদ্ধ সময় ও মাগরিবের পর কাজা',
    });
  }
  if (maghrib && isha) {
    windows.push({
      name: 'maghrib',
      start: maghrib,
      end: isha,
      validBn: 'মাগরিবের আজান থেকে এশার আজান পর্যন্ত',
      invalidBn: 'এশার পর কাজা',
    });
  }
  if (isha && fajr) {
    windows.push({
      name: 'isha',
      start: isha,
      end: nextFajr,
      validBn: 'এশার আজান থেকে ফজরের আজান পর্যন্ত',
      invalidBn: 'ফজরের পর কাজা',
    });
  }

  return windows;
}

export function getComputedSalahTimes(prayers: PrayerTime[]) {
  const map = new Map(prayers.map((p) => [p.name, p.time]));
  const sunrise = map.get('sunrise');
  const dhuhr = map.get('dhuhr');
  const isha = map.get('isha');
  const fajr = map.get('fajr');

  return {
    ishraq: sunrise ? addMinutes(sunrise, 18) : null,
    duhaStart: sunrise ? addMinutes(sunrise, 20) : null,
    duhaEnd: dhuhr ? addMinutes(dhuhr, -10) : null,
    tahajjudStart:
      isha && fajr
        ? (() => {
            const nextFajr = addMinutes(fajr, 24 * 60);
            const nightMs = nextFajr.getTime() - isha.getTime();
            return new Date(isha.getTime() + (nightMs * 2) / 3);
          })()
        : null,
    witrEnd: fajr ?? null,
  };
}

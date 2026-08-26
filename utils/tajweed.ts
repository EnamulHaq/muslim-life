/**
 * Tajweed rule definitions and color palette synced 1:1 with Quran.com
 * Reference: https://api.quran.com/api/v4/quran/verses/uthmani_tajweed
 */

export const TAJWEED_COLORS: Record<string, string> = {
  // Madd Rules (Elongations)
  madda_necessary: '#EF4444', // Madd Lazim (6 counts) — Vibrant Red
  madda_obligatory: '#F97316', // Madd Muttasil (4-5 counts) — Coral / Red-Orange
  madda_permissible: '#FB923C', // Madd Munfasil / Arid (2,4,5 counts) — Orange
  madda_normal: '#38BDF8', // Madd Tabiee (2 counts) — Sky Blue
  madda_jaiz: '#FB923C',

  // Ghunnah & Ikhfa Rules (Nasalization & Hiding)
  ghunnah: '#22C55E', // Ghunnah (Noon/Meem with Shaddah) — Green
  ikhfa: '#22C55E', // Ikhfa — Bright Green
  ikhafa: '#22C55E', // API spelling alias
  ikhfa_shafawi: '#22C55E',
  ikhafa_shafawi: '#22C55E',

  // Idgham Rules (Assimilation / Merging)
  idgham_ghunnah: '#14B8A6', // Idgham with Ghunnah — Teal / Green
  idgham_with_ghunnah: '#14B8A6',
  idgham_wo_ghunnah: '#94A3B8', // Idgham without Ghunnah — Muted Gray
  idgham_without_ghunnah: '#94A3B8',
  idgham_mutajanisayn: '#14B8A6',
  idgham_mutaqaribayn: '#14B8A6',
  idgham_shafawi: '#14B8A6',

  // Iqlab (Conversion of Noon/Tanween to Meem)
  iqlab: '#06B6D4', // Iqlab — Cyan / Aqua

  // Qalqalah (Echoing / Bouncing)
  qalqalah: '#3B82F6', // Qalqalah (Qaf, Taa, Baa, Jeem, Dal) — Vibrant Blue
  qalaqah: '#3B82F6', // API spelling alias

  // Silent letters & Hamzatul Wasl
  ham_wasl: '#94A3B8', // Hamzatul Wasl — Muted Gray
  slnt: '#94A3B8', // Silent letter — Muted Gray
  laam_shamsiyah: '#94A3B8', // Solar Laam — Muted Gray
};

export type TajweedSegment = {
  text: string;
  color?: string;
  className?: string;
  isEndMarker?: boolean;
  endNumber?: string;
};

// Zero-width joiner to preserve Arabic cursive ligatures across styled text tags in React Native
const ZWJ = '\u200D';

// Non-connecting Arabic characters (letters that do NOT join with the following letter on the left)
const NON_JOINING_LEFT = new Set(['ا', 'أ', 'إ', 'آ', 'ٱ', 'د', 'ذ', 'ر', 'ز', 'و', 'ؤ', 'ة', 'ى', 'ـٰ', 'ء']);

/**
 * Parses official Quran.com Tajweed tagged HTML strings.
 * Handles both `<tajweed class="...">` and `<rule class="...">` tags.
 * Automatically inserts Zero-Width Joiners (ZWJ) at intra-word split boundaries
 * so Arabic cursive letters connect properly across React Native <Text> nodes.
 */
export function parseQuranComTajweed(raw: string): TajweedSegment[] {
  if (!raw) return [];

  const segments: TajweedSegment[] = [];
  const regex =
    /<(?:tajweed|rule)\s+class=["']?([^"'>\s]+)["']?>([\s\S]*?)<\/(?:tajweed|rule)>|<span\s+class=["']?end["']?>([\s\S]*?)<\/span>|([^<]+)/gi;
  let match;

  while ((match = regex.exec(raw)) !== null) {
    if (match[1] && match[2]) {
      const cls = match[1];
      const text = match[2];
      const color = TAJWEED_COLORS[cls] || undefined;
      segments.push({ text, color, className: cls });
    } else if (match[3] !== undefined) {
      segments.push({ text: match[3], isEndMarker: true, endNumber: match[3].trim() });
    } else if (match[4]) {
      segments.push({ text: match[4] });
    }
  }

  // Post-process: insert ZWJ across split boundaries inside words to prevent ligature breaking
  for (let i = 0; i < segments.length; i++) {
    const cur = segments[i];
    if (cur.isEndMarker) continue;

    const prev = i > 0 ? segments[i - 1] : null;
    const next = i < segments.length - 1 ? segments[i + 1] : null;

    // Connect to prev if inside the same word and prev's ending letter connects left
    if (prev && !prev.isEndMarker && !prev.text.endsWith(' ') && !cur.text.startsWith(' ')) {
      const lastChar = prev.text.replace(/[\u064B-\u065F\u0670\u200D]/g, '').slice(-1);
      if (lastChar && !NON_JOINING_LEFT.has(lastChar) && !cur.text.startsWith(ZWJ)) {
        cur.text = ZWJ + cur.text;
      }
    }

    // Connect to next if inside the same word and cur's ending letter connects left
    if (next && !next.isEndMarker && !cur.text.endsWith(' ') && !next.text.startsWith(' ')) {
      const lastChar = cur.text.replace(/[\u064B-\u065F\u0670\u200D]/g, '').slice(-1);
      if (lastChar && !NON_JOINING_LEFT.has(lastChar) && !cur.text.endsWith(ZWJ)) {
        cur.text = cur.text + ZWJ;
      }
    }
  }

  return segments;
}

export const BISMILLAH_TAJWEED_RAW =
  'بِسْمِ <tajweed class=ham_wasl>ٱ</tajweed>للَّهِ <tajweed class=ham_wasl>ٱ</tajweed><tajweed class=laam_shamsiyah>ل</tajweed>رَّحْمَ<tajweed class=madda_normal>ـٰ</tajweed>نِ <tajweed class=ham_wasl>ٱ</tajweed><tajweed class=laam_shamsiyah>ل</tajweed>رَّح<tajweed class=madda_permissible>ِي</tajweed>مِ';

export function getTajweedStyledBismillah(): TajweedSegment[] {
  return parseQuranComTajweed(BISMILLAH_TAJWEED_RAW);
}

import { ISLAMIC_API_BASE } from '@/constants/islamicApi';

type ApiEnvelope<T> = {
  code: number;
  status: string;
  data: T;
};

export async function islamicGet<T>(path: string): Promise<T> {
  const response = await fetch(`${ISLAMIC_API_BASE}${path}`);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const json = (await response.json()) as ApiEnvelope<T>;
  if (json.code !== 200) {
    throw new Error(json.status || 'Request failed');
  }

  return json.data;
}

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function parseHisnBody(html: string) {
  const transliteration =
    html.match(/class="transliteration">([\s\S]*?)<\/span>/)?.[1]?.trim() ?? '';
  const translation =
    html.match(/class="translation">([\s\S]*?)<\/span>/)?.[1]?.trim() ?? '';
  const reference =
    html.match(/hisn_english_reference">([\s\S]*?)<\/span>/)?.[1]?.trim() ?? '';

  return {
    transliteration: transliteration === '--' ? '' : transliteration,
    translation,
    reference,
  };
}

import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import { Platform } from 'react-native';

const GITHUB_REPO = 'EnamulHaq/muslim-life';
const GITHUB_RELEASES_API = `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`;

export type AppUpdateInfo = {
  hasUpdate: boolean;
  latestVersion: string;
  currentVersion: string;
  releaseTitle: string;
  releaseNotes: string;
  apkDownloadUrl: string | null;
  htmlUrl: string;
  publishedAt: string;
};

/**
 * Compares two semantic version strings (e.g., '1.0.1' > '1.0.0')
 * Returns 1 if v1 > v2, -1 if v1 < v2, 0 if equal
 */
export function compareVersions(v1: string, v2: string): number {
  const clean1 = v1.replace(/^[vV]/, '').trim();
  const clean2 = v2.replace(/^[vV]/, '').trim();

  const parts1 = clean1.split('.').map((n) => parseInt(n, 10) || 0);
  const parts2 = clean2.split('.').map((n) => parseInt(n, 10) || 0);

  const maxLen = Math.max(parts1.length, parts2.length);
  for (let i = 0; i < maxLen; i++) {
    const num1 = parts1[i] || 0;
    const num2 = parts2[i] || 0;
    if (num1 > num2) return 1;
    if (num1 < num2) return -1;
  }
  return 0;
}

/**
 * Checks GitHub Releases API for a newer version of the app.
 */
export async function checkForAppUpdate(): Promise<AppUpdateInfo | null> {
  try {
    const currentVersion =
      Constants.expoConfig?.version ||
      (Constants as any).nativeAppVersion ||
      Constants.manifest2?.extra?.expoClient?.version ||
      '1.0.0';

    // 1. Primary: Try GitHub Releases API
    try {
      const response = await fetch(GITHUB_RELEASES_API, {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'MuslimLife-App',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const rawTag: string = data.tag_name || data.name || '';
        const latestVersion = rawTag.replace(/^[vV]/, '').trim();

        if (latestVersion) {
          const hasUpdate = compareVersions(latestVersion, currentVersion) > 0;
          let apkDownloadUrl: string | null = null;
          if (Array.isArray(data.assets)) {
            const apkAsset = data.assets.find(
              (asset: { name: string; browser_download_url: string }) =>
                asset.name.endsWith('.apk')
            );
            if (apkAsset) {
              apkDownloadUrl = apkAsset.browser_download_url;
            }
          }

          return {
            hasUpdate,
            latestVersion,
            currentVersion,
            releaseTitle: data.name || `Version ${latestVersion}`,
            releaseNotes: data.body || 'Bug fixes and performance improvements.',
            apkDownloadUrl,
            htmlUrl: data.html_url || `https://github.com/${GITHUB_REPO}/releases`,
            publishedAt: data.published_at || '',
          };
        }
      }
    } catch {
      // Fallback below
    }

    // 2. Secondary Fallback: raw.githubusercontent.com / version.json
    try {
      const fallbackRes = await fetch(
        `https://raw.githubusercontent.com/${GITHUB_REPO}/main/version.json?t=${Date.now()}`
      );
      if (fallbackRes.ok) {
        const vData = await fallbackRes.json();
        const latestVersion = (vData.version || '').replace(/^[vV]/, '').trim();
        if (latestVersion) {
          return {
            hasUpdate: compareVersions(latestVersion, currentVersion) > 0,
            latestVersion,
            currentVersion,
            releaseTitle: vData.title || `Version ${latestVersion}`,
            releaseNotes: vData.notes || 'Bug fixes and performance improvements.',
            apkDownloadUrl: vData.downloadUrl || null,
            htmlUrl: vData.htmlUrl || `https://github.com/${GITHUB_REPO}/releases`,
            publishedAt: vData.publishedAt || '',
          };
        }
      }
    } catch {
      // ignore
    }

    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Downloads and triggers the installation of the latest update.
 */
export async function openAppUpdate(updateInfo: AppUpdateInfo): Promise<void> {
  const targetUrl =
    Platform.OS === 'android' && updateInfo.apkDownloadUrl
      ? updateInfo.apkDownloadUrl
      : updateInfo.htmlUrl;

  const supported = await Linking.canOpenURL(targetUrl);
  if (supported) {
    await Linking.openURL(targetUrl);
  }
}

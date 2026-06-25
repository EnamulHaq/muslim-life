# Muslim Life

A complete Islamic lifestyle app for Android and iOS — inspired by Muslim Bangla, built with React Native and Expo.

## Features

- **Prayer Times** — Accurate salah times with countdown and location support
- **Al-Quran** — Surah list with Arabic, Bangla, and English
- **Hadith** — Collection from Sahih Bukhari, Muslim, and more
- **Dua & Azkar** — Daily supplications with Arabic transliteration
- **Tasbih** — Digital dhikr counter with haptic feedback
- **Qibla Compass** — Direction to Kaaba using device magnetometer
- **Zakat Calculator** — Calculate 2.5% zakat on your wealth
- **Islamic Calendar** — Hijri dates and important Islamic events
- **99 Names of Allah** — Asma ul Husna with meanings
- **Hajj & Umrah Guide** — Step-by-step pilgrimage guide
- **Ask Scholar** — Islamic Q&A platform (coming soon)
- **Matrimonial** — Muslim marriage service (coming soon)

## Quran Data

The Quran section uses the free [islamic.app API](https://docs.islamic.app/introduction) — no API key or token required.

- All **114 surahs** with Arabic Uthmani text
- **Bangla** translation (Taisirul Quran)
- **English** translation (Sahih International)
- Works immediately — no setup needed

## Tech Stack

- React Native + Expo SDK 56
- Expo Router (file-based navigation)
- TypeScript
- [islamic.app API](https://api.islamic.app) — free Quran data
- Adhan library for prayer time calculations
- Expo Location & Sensors

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on Android
npm run android

# Run on iOS (macOS only)
npm run ios

# Run on web
npm run web
```

## Building for Production

```bash
# Install EAS CLI
npm install -g eas-cli

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

## Project Structure

```
app/
  (tabs)/          # Main tab navigation (Home, Quran, Explore, Settings)
  features/        # Feature screens (Prayer, Hadith, Dua, etc.)
  quran/           # Quran surah detail screens
components/ui/     # Reusable UI components
constants/         # Theme, colors, feature definitions
data/              # Static content (surahs, duas, hadith, etc.)
hooks/             # Custom React hooks
utils/             # Prayer times, Qibla calculations
```

## License

Private — All rights reserved.

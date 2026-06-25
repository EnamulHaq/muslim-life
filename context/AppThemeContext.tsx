import { createContext, useContext, useMemo } from 'react';
import { getThemeColors, Theme, type ThemeColors } from '@/constants/Theme';
import { useAppSettings } from '@/hooks/useAppSettings';

type AppThemeValue = {
  colors: ThemeColors;
  isDark: boolean;
  spacing: typeof Theme.spacing;
  borderRadius: typeof Theme.borderRadius;
  fontSize: typeof Theme.fontSize;
};

const AppThemeContext = createContext<AppThemeValue>({
  colors: Theme.colors,
  isDark: false,
  spacing: Theme.spacing,
  borderRadius: Theme.borderRadius,
  fontSize: Theme.fontSize,
});

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useAppSettings();
  const value = useMemo<AppThemeValue>(
    () => ({
      colors: getThemeColors(settings.darkMode),
      isDark: settings.darkMode,
      spacing: Theme.spacing,
      borderRadius: Theme.borderRadius,
      fontSize: Theme.fontSize,
    }),
    [settings.darkMode]
  );

  return <AppThemeContext.Provider value={value}>{children}</AppThemeContext.Provider>;
}

export function useAppTheme() {
  return useContext(AppThemeContext);
}

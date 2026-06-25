import { Platform, ViewStyle } from 'react-native';

type ShadowConfig = {
  color: string;
  offset: { width: number; height: number };
  radius: number;
  elevation?: number;
};

export function shadowStyle(config: ShadowConfig): ViewStyle {
  const { color, offset, radius, elevation = 0 } = config;

  if (Platform.OS === 'web') {
    return {
      boxShadow: `${offset.width}px ${offset.height}px ${radius}px ${color}`,
    } as ViewStyle;
  }

  return {
    shadowColor: color,
    shadowOffset: offset,
    shadowOpacity: 1,
    shadowRadius: radius,
    elevation,
  };
}

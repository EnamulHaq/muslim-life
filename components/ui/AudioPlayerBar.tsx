import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Theme } from '@/constants/Theme';
import { RecitationButton } from '@/components/ui/RecitationButton';

type Props = {
  title: string;
  subtitle?: string;
  playId: string;
  activeId: string | null;
  isPlaying: boolean;
  isLoading: boolean;
  onPlay: () => void;
  onStop: () => void;
};

export function AudioPlayerBar({
  title,
  subtitle,
  playId,
  activeId,
  isPlaying,
  isLoading,
  onPlay,
  onStop,
}: Props) {
  const isActive = activeId === playId && isPlaying;

  return (
    <View style={styles.bar}>
      <View style={styles.info}>
        <Ionicons name="musical-notes" size={20} color={Theme.colors.accent} />
        <View style={styles.textWrap}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </View>
      <View style={styles.actions}>
        <RecitationButton
          id={playId}
          activeId={activeId}
          isPlaying={isPlaying}
          isLoading={isLoading}
          onPress={onPlay}
          label={isActive ? 'Playing' : 'Play Surah'}
          size="md"
        />
        {isActive ? (
          <Pressable onPress={onStop} style={styles.stopBtn} hitSlop={8}>
            <Ionicons name="stop" size={18} color={Theme.colors.error} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.lg,
    borderWidth: 1,
    borderColor: Theme.colors.accent + '40',
    gap: Theme.spacing.sm,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
    flex: 1,
  },
  textWrap: {
    flex: 1,
  },
  title: {
    fontSize: Theme.fontSize.sm,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  subtitle: {
    fontSize: Theme.fontSize.xs,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.xs,
  },
  stopBtn: {
    width: 32,
    height: 32,
    borderRadius: Theme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.colors.error + '12',
  },
});

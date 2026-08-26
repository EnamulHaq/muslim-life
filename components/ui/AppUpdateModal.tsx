import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Theme } from '@/constants/Theme';
import type { AppUpdateInfo } from '@/services/appUpdateService';

type Props = {
  visible: boolean;
  updateInfo: AppUpdateInfo | null;
  onUpdate: () => void;
  onDismiss: () => void;
};

export function AppUpdateModal({
  visible,
  updateInfo,
  onUpdate,
  onDismiss,
}: Props) {
  if (!updateInfo) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header Banner */}
          <LinearGradient
            colors={[Theme.colors.gradientStart, Theme.colors.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
            <View style={styles.iconCircle}>
              <Ionicons name="sparkles" size={28} color={Theme.colors.textLight} />
            </View>
            <Text style={styles.headerTitle}>Update Available</Text>
            <Text style={styles.headerSubtitle}>
              Muslim Life v{updateInfo.latestVersion}
            </Text>
          </LinearGradient>

          {/* Content Body */}
          <View style={styles.body}>
            <View style={styles.versionBadgeRow}>
              <View style={styles.badge}>
                <Text style={styles.badgeLabel}>Current:</Text>
                <Text style={styles.badgeVal}>v{updateInfo.currentVersion}</Text>
              </View>
              <Ionicons name="arrow-forward" size={16} color={Theme.colors.primary} />
              <View style={[styles.badge, styles.badgeActive]}>
                <Text style={styles.badgeLabelActive}>Latest:</Text>
                <Text style={styles.badgeValActive}>v{updateInfo.latestVersion}</Text>
              </View>
            </View>

            <Text style={styles.notesLabel}>What's New:</Text>
            <ScrollView
              style={styles.notesScroll}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.notesText}>{updateInfo.releaseNotes}</Text>
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.buttonRow}>
              <Pressable style={styles.dismissBtn} onPress={onDismiss}>
                <Text style={styles.dismissText}>Later</Text>
              </Pressable>

              <Pressable style={styles.updateBtn} onPress={onUpdate}>
                <LinearGradient
                  colors={[Theme.colors.gradientStart, Theme.colors.gradientEnd]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.updateGradient}
                >
                  <Ionicons name="download-outline" size={18} color="#FFFFFF" />
                  <Text style={styles.updateText}>Update Now</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Theme.colors.border,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
  },
  header: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: Theme.fontSize.xl,
    fontWeight: '700',
    color: Theme.colors.textLight,
  },
  headerSubtitle: {
    fontSize: Theme.fontSize.sm,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 4,
  },
  body: {
    padding: 20,
  },
  versionBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 16,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.background,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: Theme.borderRadius.md,
    gap: 4,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  badgeActive: {
    backgroundColor: Theme.colors.primary + '15',
    borderColor: Theme.colors.primary + '30',
  },
  badgeLabel: {
    fontSize: Theme.fontSize.xs,
    color: Theme.colors.textSecondary,
  },
  badgeVal: {
    fontSize: Theme.fontSize.xs,
    fontWeight: '600',
    color: Theme.colors.text,
  },
  badgeLabelActive: {
    fontSize: Theme.fontSize.xs,
    color: Theme.colors.primary,
  },
  badgeValActive: {
    fontSize: Theme.fontSize.xs,
    fontWeight: '700',
    color: Theme.colors.primary,
  },
  notesLabel: {
    fontSize: Theme.fontSize.sm,
    fontWeight: '600',
    color: Theme.colors.text,
    marginBottom: 8,
  },
  notesScroll: {
    maxHeight: 120,
    backgroundColor: Theme.colors.background,
    borderRadius: Theme.borderRadius.md,
    padding: 12,
    marginBottom: 20,
  },
  notesText: {
    fontSize: Theme.fontSize.xs,
    lineHeight: 18,
    color: Theme.colors.textSecondary,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dismissBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  dismissText: {
    fontSize: Theme.fontSize.sm,
    fontWeight: '600',
    color: Theme.colors.textSecondary,
  },
  updateBtn: {
    flex: 2,
    borderRadius: Theme.borderRadius.md,
    overflow: 'hidden',
  },
  updateGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  updateText: {
    fontSize: Theme.fontSize.sm,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

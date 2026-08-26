import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  FONT_STYLES,
  INDOPAK_LINES,
  QuranFontStyle,
  QuranScriptType,
  useQuranSettings,
} from '@/hooks/useQuranSettings';
import { Theme } from '@/constants/Theme';
import { ReciterPickerModal } from './ReciterPickerModal';
import { getTajweedStyledBismillah } from '@/utils/tajweed';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function QuranSettingsSheet({ visible, onClose }: Props) {
  const { quranSettings, activeReciter, updateQuranSettings } = useQuranSettings();
  const [showReciterPicker, setShowReciterPicker] = useState(false);
  const [showFontPicker, setShowFontPicker] = useState(false);
  const [showLinesPicker, setShowLinesPicker] = useState(false);
  const [tooltipActive, setTooltipActive] = useState(true);

  const {
    scriptType,
    fontStyle,
    indopakLines,
    showTajweedRules,
    copyAsGlyphs,
    fontSize,
  } = quranSettings;

  const tajweedTokens = getTajweedStyledBismillah();

  // Arabic font size calculation based on stepper (1 to 7)
  const previewArabicSize = 22 + (fontSize - 1) * 3;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Top Bar with Dismiss */}
          <View style={styles.topBar}>
            <View style={styles.dragIndicator} />
            <Pressable onPress={onClose} hitSlop={10} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color="#94A3B8" />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
            {/* 1. Preview Box */}
            <View style={styles.previewContainer}>
              <Text style={styles.previewLabel}>Preview:</Text>
              <View style={styles.previewDivider} />

              <View style={styles.previewContent}>
                {/* Floating Word Tooltip Bubble */}
                {tooltipActive && (
                  <View style={styles.tooltipWrap}>
                    <View style={styles.tooltipBubble}>
                      <Text style={styles.tooltipText}>the Most Gracious</Text>
                    </View>
                    <View style={styles.tooltipArrow} />
                  </View>
                )}

                {/* Bismillah Text according to Script Type */}
                <Pressable
                  onPress={() => setTooltipActive(!tooltipActive)}
                  style={styles.arabicRow}
                >
                  {scriptType === 'tajweed' && showTajweedRules ? (
                    <Text
                      style={[
                        styles.arabicText,
                        { fontSize: previewArabicSize, lineHeight: previewArabicSize * 1.6 },
                      ]}
                    >
                      {tajweedTokens.map((token, i) => (
                        <Text
                          key={i}
                          style={token.color ? { color: token.color } : { color: '#FFFFFF' }}
                        >
                          {token.text}
                        </Text>
                      ))}
                    </Text>
                  ) : scriptType === 'indopak' ? (
                    <Text
                      style={[
                        styles.arabicText,
                        styles.indopakText,
                        { fontSize: previewArabicSize, lineHeight: previewArabicSize * 1.6 },
                      ]}
                    >
                      بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                    </Text>
                  ) : (
                    <Text
                      style={[
                        styles.arabicText,
                        { fontSize: previewArabicSize, lineHeight: previewArabicSize * 1.6 },
                      ]}
                    >
                      <Text style={{ color: '#FFFFFF' }}>بِسْمِ ٱللَّهِ </Text>
                      <Text style={{ color: tooltipActive ? '#2CA4AB' : '#FFFFFF' }}>
                        ٱلرَّحْمَٰنِ{' '}
                      </Text>
                      <Text style={{ color: '#FFFFFF' }}>ٱلرَّحِيمِ</Text>
                    </Text>
                  )}
                </Pressable>

                {/* Translation */}
                <Text style={styles.translationText}>
                  In the Name of Allah—the Most Compassionate, Most Merciful.
                </Text>
              </View>
            </View>

            {/* 2. Segmented Script Switcher: Uthmani | IndoPak | Tajweed */}
            <View style={styles.segmentedControl}>
              {(['uthmani', 'indopak', 'tajweed'] as QuranScriptType[]).map((type) => {
                const isActive = scriptType === type;
                const label =
                  type === 'uthmani'
                    ? 'Uthmani'
                    : type === 'indopak'
                    ? 'IndoPak'
                    : 'Tajweed';
                return (
                  <Pressable
                    key={type}
                    style={[styles.segmentBtn, isActive && styles.segmentBtnActive]}
                    onPress={() => updateQuranSettings({ scriptType: type })}
                  >
                    <Text
                      style={[styles.segmentText, isActive && styles.segmentTextActive]}
                    >
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* 3. Dynamic Controls Depending on Script Type */}
            <View style={styles.optionsList}>
              {/* UTHMANI CONTROLS */}
              {scriptType === 'uthmani' && (
                <>
                  {/* Font style dropdown */}
                  <View style={styles.controlRow}>
                    <Text style={styles.controlLabel}>Font style</Text>
                    <Pressable
                      style={styles.dropdownBtn}
                      onPress={() => setShowFontPicker(true)}
                    >
                      <Text style={styles.dropdownText}>{fontStyle}</Text>
                      <Ionicons name="chevron-down" size={16} color="#94A3B8" />
                    </Pressable>
                  </View>

                  {/* Copy verse as glyphs */}
                  <View style={styles.controlRow}>
                    <Text style={styles.controlLabel}>Copy verse as glyphs</Text>
                    <Pressable
                      style={[styles.checkbox, copyAsGlyphs && styles.checkboxChecked]}
                      onPress={() =>
                        updateQuranSettings({ copyAsGlyphs: !copyAsGlyphs })
                      }
                    >
                      {copyAsGlyphs && (
                        <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                      )}
                    </Pressable>
                  </View>
                </>
              )}

              {/* INDOPAK CONTROLS */}
              {scriptType === 'indopak' && (
                <>
                  {/* Lines dropdown */}
                  <View style={styles.controlRow}>
                    <Text style={styles.controlLabel}>Lines</Text>
                    <Pressable
                      style={styles.dropdownBtn}
                      onPress={() => setShowLinesPicker(true)}
                    >
                      <Text style={styles.dropdownText}>{indopakLines}</Text>
                      <Ionicons name="chevron-down" size={16} color="#94A3B8" />
                    </Pressable>
                  </View>
                </>
              )}

              {/* TAJWEED CONTROLS */}
              {scriptType === 'tajweed' && (
                <>
                  {/* Show Tajweed rules while reading */}
                  <View style={styles.controlRow}>
                    <Text style={styles.controlLabel}>
                      Show Tajweed rules while reading:
                    </Text>
                    <Pressable
                      style={[
                        styles.checkbox,
                        showTajweedRules && styles.checkboxChecked,
                      ]}
                      onPress={() =>
                        updateQuranSettings({
                          showTajweedRules: !showTajweedRules,
                        })
                      }
                    >
                      {showTajweedRules && (
                        <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                      )}
                    </Pressable>
                  </View>

                  {/* Copy verse as glyphs */}
                  <View style={styles.controlRow}>
                    <Text style={styles.controlLabel}>Copy verse as glyphs</Text>
                    <Pressable
                      style={[styles.checkbox, copyAsGlyphs && styles.checkboxChecked]}
                      onPress={() =>
                        updateQuranSettings({ copyAsGlyphs: !copyAsGlyphs })
                      }
                    >
                      {copyAsGlyphs && (
                        <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                      )}
                    </Pressable>
                  </View>
                </>
              )}

              {/* FONT SIZE STEPPER (Present in all modes) */}
              <View style={styles.controlRow}>
                <Text style={styles.controlLabel}>Font size</Text>
                <View style={styles.stepperWrap}>
                  <Pressable
                    style={styles.stepperBtn}
                    onPress={() =>
                      updateQuranSettings({ fontSize: Math.max(1, fontSize - 1) })
                    }
                  >
                    <Text style={styles.stepperSymbol}>—</Text>
                  </Pressable>
                  <Text style={styles.stepperValue}>{fontSize}</Text>
                  <Pressable
                    style={styles.stepperBtn}
                    onPress={() =>
                      updateQuranSettings({ fontSize: Math.min(7, fontSize + 1) })
                    }
                  >
                    <Ionicons name="add" size={18} color="#FFFFFF" />
                  </Pressable>
                </View>
              </View>

              {/* SELECTED RECITER ROW (Card with Chevron) */}
              <Pressable
                style={styles.reciterCard}
                onPress={() => setShowReciterPicker(true)}
              >
                <View style={styles.reciterInfo}>
                  <Text style={styles.reciterLabel}>Selected Reciter</Text>
                  <Text style={styles.reciterName} numberOfLines={1}>
                    {activeReciter.name}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>

      {/* Reciter Picker Modal */}
      <ReciterPickerModal
        visible={showReciterPicker}
        selectedId={quranSettings.selectedReciterId}
        onSelect={(reciter) =>
          updateQuranSettings({ selectedReciterId: reciter.id })
        }
        onClose={() => setShowReciterPicker(false)}
      />

      {/* Font Style Picker Modal */}
      <Modal
        visible={showFontPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowFontPicker(false)}
      >
        <Pressable
          style={styles.pickerOverlay}
          onPress={() => setShowFontPicker(false)}
        >
          <View style={styles.pickerMenu}>
            <Text style={styles.pickerMenuTitle}>Select Font Style</Text>
            {FONT_STYLES.map((style) => (
              <Pressable
                key={style}
                style={[
                  styles.pickerMenuItem,
                  fontStyle === style && styles.pickerMenuItemActive,
                ]}
                onPress={() => {
                  updateQuranSettings({ fontStyle: style });
                  setShowFontPicker(false);
                }}
              >
                <Text
                  style={[
                    styles.pickerMenuText,
                    fontStyle === style && styles.pickerMenuTextActive,
                  ]}
                >
                  {style}
                </Text>
                {fontStyle === style && (
                  <Ionicons name="checkmark" size={18} color="#2CA4AB" />
                )}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* Lines Picker Modal */}
      <Modal
        visible={showLinesPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLinesPicker(false)}
      >
        <Pressable
          style={styles.pickerOverlay}
          onPress={() => setShowLinesPicker(false)}
        >
          <View style={styles.pickerMenu}>
            <Text style={styles.pickerMenuTitle}>Select Page Lines</Text>
            {INDOPAK_LINES.map((lines) => (
              <Pressable
                key={lines}
                style={[
                  styles.pickerMenuItem,
                  indopakLines === lines && styles.pickerMenuItemActive,
                ]}
                onPress={() => {
                  updateQuranSettings({ indopakLines: lines });
                  setShowLinesPicker(false);
                }}
              >
                <Text
                  style={[
                    styles.pickerMenuText,
                    indopakLines === lines && styles.pickerMenuTextActive,
                  ]}
                >
                  {lines}
                </Text>
                {indopakLines === lines && (
                  <Ionicons name="checkmark" size={18} color="#2CA4AB" />
                )}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#1E232B',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '88%',
    paddingBottom: 24,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
    position: 'relative',
  },
  dragIndicator: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#384252',
  },
  closeBtn: {
    position: 'absolute',
    right: 16,
    top: 10,
  },
  scroll: {
    paddingHorizontal: 20,
  },
  previewContainer: {
    marginTop: 8,
    marginBottom: 20,
  },
  previewLabel: {
    color: '#94A3B8',
    fontSize: 13,
    marginBottom: 8,
  },
  previewDivider: {
    height: 1,
    backgroundColor: '#2A323D',
    marginBottom: 16,
  },
  previewContent: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  tooltipWrap: {
    alignItems: 'center',
    marginBottom: 4,
  },
  tooltipBubble: {
    backgroundColor: '#2CA4AB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  tooltipText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  tooltipArrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#2CA4AB',
  },
  arabicRow: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  arabicText: {
    fontFamily: 'System',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  indopakText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  translationText: {
    color: '#E2E8F0',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 12,
    paddingHorizontal: 8,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#2A323D',
    borderRadius: 28,
    padding: 4,
    marginBottom: 24,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 24,
  },
  segmentBtnActive: {
    backgroundColor: '#1E232B',
  },
  segmentText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '600',
  },
  segmentTextActive: {
    color: '#FFFFFF',
  },
  optionsList: {
    gap: 20,
    paddingBottom: 20,
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 44,
  },
  controlLabel: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
  },
  dropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A323D',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 8,
  },
  dropdownText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#475569',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#2CA4AB',
    borderColor: '#2CA4AB',
  },
  stepperWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  stepperBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperSymbol: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  stepperValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    minWidth: 16,
    textAlign: 'center',
  },
  reciterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2A323D',
    borderRadius: 14,
    padding: 16,
    marginTop: 4,
  },
  reciterInfo: {
    flex: 1,
    marginRight: 12,
  },
  reciterLabel: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  reciterName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  pickerMenu: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#1E232B',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#384252',
  },
  pickerMenuTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  pickerMenuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  pickerMenuItemActive: {
    backgroundColor: '#2A323D',
  },
  pickerMenuText: {
    color: '#CBD5E1',
    fontSize: 15,
  },
  pickerMenuTextActive: {
    color: '#2CA4AB',
    fontWeight: '600',
  },
});

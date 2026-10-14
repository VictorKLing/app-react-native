import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

type MessagePanelProps = {
  title: string;
  description: string;
  tone?: 'neutral' | 'error' | 'success';
  loading?: boolean;
};

export function MessagePanel({ title, description, tone = 'neutral', loading = false }: MessagePanelProps) {
  const isError = tone === 'error';
  const isSuccess = tone === 'success';

  return (
    <View
      accessibilityRole={isError || isSuccess ? 'alert' : undefined}
      style={[styles.panel, isError && styles.errorPanel, isSuccess && styles.successPanel]}
    >
      <View style={[styles.icon, isError && styles.errorIcon, isSuccess && styles.successIcon]}>
        {loading ? <ActivityIndicator color="#176B55" size="small" /> : (
          <Text style={[styles.iconText, isError && styles.errorIconText, isSuccess && styles.successIconText]}>
            {isError ? '!' : isSuccess ? '✓' : 'i'}
          </Text>
        )}
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderColor: '#E3E9EF',
    borderWidth: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  errorPanel: { borderColor: '#F0D7D5' },
  successPanel: { borderColor: '#D2E9D9' },
  icon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF4FF',
    marginBottom: 14,
  },
  errorIcon: { backgroundColor: '#FFF0EF' },
  successIcon: { backgroundColor: '#EAF7EF' },
  iconText: { color: '#176B55', fontSize: 20, fontWeight: '700' },
  errorIconText: { color: '#BD3B32' },
  successIconText: { color: '#207443' },
  title: { color: '#263343', fontSize: 16, fontWeight: '700', textAlign: 'center' },
  description: { color: '#70737B', fontSize: 14, lineHeight: 21, marginTop: 7, textAlign: 'center' },
});

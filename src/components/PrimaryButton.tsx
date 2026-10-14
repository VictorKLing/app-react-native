import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
};

export function PrimaryButton({ label, onPress, disabled = false, loading = false }: PrimaryButtonProps) {
  const unavailable = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: unavailable, busy: loading }}
      disabled={unavailable}
      onPress={onPress}
      style={({ pressed }) => [styles.button, unavailable && styles.unavailable, pressed && !unavailable && styles.pressed]}
    >
      {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.label}>{label}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    backgroundColor: '#1769E0',
    paddingHorizontal: 20,
  },
  label: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  unavailable: { opacity: 0.48 },
  pressed: { opacity: 0.84 },
});

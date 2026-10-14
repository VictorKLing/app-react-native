import { StyleSheet, Text, TextInput, View, type KeyboardTypeOptions, type TextInputProps } from 'react-native';

type FormTextFieldProps = {
  label: string;
  value: string;
  onChangeText?: (value: string) => void;
  placeholder: string;
  helper?: string;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: TextInputProps['autoCapitalize'];
  maxLength?: number;
  editable?: boolean;
  returnKeyType?: TextInputProps['returnKeyType'];
  onSubmitEditing?: TextInputProps['onSubmitEditing'];
};

export function FormTextField({
  label,
  value,
  onChangeText,
  placeholder,
  helper,
  keyboardType = 'default',
  autoCapitalize = 'none',
  maxLength,
  editable = true,
  returnKeyType = 'next',
  onSubmitEditing,
}: FormTextFieldProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        accessibilityHint={helper}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
        editable={editable}
        keyboardType={keyboardType}
        maxLength={maxLength}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        placeholder={placeholder}
        placeholderTextColor="#A0A3AA"
        returnKeyType={returnKeyType}
        selectionColor="#176B55"
        style={[styles.input, !editable && styles.disabled]}
        value={value}
      />
      {helper && <Text style={styles.helper}>{helper}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%' },
  label: { color: '#364454', fontSize: 13, fontWeight: '700', marginBottom: 8 },
  input: {
    height: 54,
    borderColor: '#DDE5EB',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#FAFBFC',
    color: '#263343',
    fontSize: 14,
    paddingHorizontal: 15,
  },
  disabled: { color: '#8A8D95', opacity: 0.72 },
  helper: { color: '#8A8D95', fontSize: 12, lineHeight: 17, marginTop: 8 },
});

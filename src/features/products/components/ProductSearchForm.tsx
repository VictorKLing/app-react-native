import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { PrimaryButton } from '@/components/PrimaryButton';

type ProductSearchFormProps = {
  loading: boolean;
  onSearch: (id: number) => void;
  onValueChange: () => void;
};

export function ProductSearchForm({ loading, onSearch, onValueChange }: ProductSearchFormProps) {
  const [codigo, setCodigo] = useState('');
  const codigoValido = /^\d+$/.test(codigo) && Number(codigo) > 0;

  function buscar() {
    if (codigoValido && !loading) {
      onSearch(Number(codigo));
    }
  }

  function alterarCodigo(valor: string) {
    setCodigo(valor.replace(/[^\d]/g, '').slice(0, 9));
    onValueChange();
  }

  return (
    <View style={styles.card}>
      <Text style={styles.label}>Código do produto</Text>
      <TextInput
        accessibilityLabel="Código do produto"
        autoCapitalize="none"
        autoCorrect={false}
        editable={!loading}
        keyboardType="number-pad"
        maxLength={9}
        onChangeText={alterarCodigo}
        onSubmitEditing={buscar}
        placeholder="Digite o ID"
        placeholderTextColor="#A0A3AA"
        returnKeyType="search"
        selectionColor="#1769E0"
        style={styles.input}
        value={codigo}
      />
      <Text style={styles.hint}>Use o ID retornado ao cadastrar o produto.</Text>
      <View style={styles.buttonWrap}>
        <PrimaryButton label="Buscar produto" onPress={buscar} disabled={!codigoValido} loading={loading} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E8E9ED',
    borderWidth: 1,
    borderRadius: 22,
    padding: 20,
  },
  label: { color: '#37383D', fontSize: 14, fontWeight: '600', marginBottom: 9 },
  input: {
    height: 54,
    borderColor: '#DCDDDF',
    borderWidth: 1,
    borderRadius: 14,
    backgroundColor: '#FBFBFC',
    color: '#1D1D1F',
    fontSize: 16,
    paddingHorizontal: 15,
  },
  hint: { color: '#8A8D95', fontSize: 12, lineHeight: 17, marginTop: 8 },
  buttonWrap: { marginTop: 18 },
});

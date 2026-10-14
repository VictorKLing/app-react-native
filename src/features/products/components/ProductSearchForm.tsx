import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { FormTextField } from '@/components/FormTextField';
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
      <FormTextField
        label="Código do produto"
        value={codigo}
        onChangeText={alterarCodigo}
        onSubmitEditing={buscar}
        placeholder="Digite o ID"
        helper="Use o ID retornado ao cadastrar o produto."
        keyboardType="number-pad"
        maxLength={9}
        editable={!loading}
        returnKeyType="search"
      />
      <View style={styles.buttonWrap}>
        <PrimaryButton label="Buscar produto" onPress={buscar} disabled={!codigoValido} loading={loading} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E3E9EF',
    borderWidth: 1,
    borderRadius: 14,
    padding: 20,
  },
  buttonWrap: { marginTop: 18 },
});

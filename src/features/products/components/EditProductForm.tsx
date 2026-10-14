import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { Produto } from '@/services/api';
import { FormTextField } from '@/components/FormTextField';
import { PrimaryButton } from '@/components/PrimaryButton';

type EditProductFormProps = {
  produto: Produto;
  loading: boolean;
  onSubmit: (quantidade: number) => void;
  onChange: () => void;
};

export function EditProductForm({ produto, loading, onSubmit, onChange }: EditProductFormProps) {
  const [quantidade, setQuantidade] = useState(String(produto.qtdDisponivel));
  const quantidadeValida = /^\d+$/.test(quantidade);

  function alterarQuantidade(value: string) {
    setQuantidade(value.replace(/[^\d]/g, '').slice(0, 8));
    onChange();
  }

  function salvar() {
    if (quantidadeValida && !loading) onSubmit(Number(quantidade));
  }

  return (
    <View style={styles.card}>
      <FormTextField
        label="Produto"
        value={produto.nome}
        placeholder="Nome do produto"
        helper={`ID ${produto.id} · o nome é definido no cadastro e não pode ser alterado por esta API.`}
        editable={false}
      />
      <View style={styles.fieldSpacing} />
      <FormTextField
        label="Quantidade disponível"
        value={quantidade}
        onChangeText={alterarQuantidade}
        placeholder="Ex.: 12"
        helper="Informe um número inteiro igual ou maior que zero."
        keyboardType="number-pad"
        maxLength={8}
        editable={!loading}
        returnKeyType="done"
        onSubmitEditing={salvar}
      />
      <View style={styles.buttonSpacing}>
        <PrimaryButton label="Salvar alterações" onPress={salvar} disabled={!quantidadeValida} loading={loading} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#FFFFFF', borderColor: '#E3E9EF', borderWidth: 1, borderRadius: 14, padding: 20 },
  fieldSpacing: { height: 19 },
  buttonSpacing: { marginTop: 22 },
});

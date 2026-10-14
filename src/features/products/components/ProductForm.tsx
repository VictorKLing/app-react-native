import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { Produto } from '@/services/api';
import { FormTextField } from '@/components/FormTextField';
import { PrimaryButton } from '@/components/PrimaryButton';

type ProductFormProps = {
  loading: boolean;
  success: boolean;
  onSubmit: (dados: Omit<Produto, 'id'>) => void;
  onChange: () => void;
  onReset: () => void;
};

export function ProductForm({ loading, success, onSubmit, onChange, onReset }: ProductFormProps) {
  const [nome, setNome] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const nomeValido = nome.trim().length > 0;
  const quantidadeValida = /^\d+$/.test(quantidade);

  function alterarNome(value: string) {
    setNome(value);
    onChange();
  }

  function alterarQuantidade(value: string) {
    setQuantidade(value.replace(/[^\d]/g, '').slice(0, 8));
    onChange();
  }

  function enviar() {
    if (success) {
      setNome('');
      setQuantidade('');
      onReset();
      return;
    }

    if (nomeValido && quantidadeValida && !loading) {
      onSubmit({ nome: nome.trim(), qtdDisponivel: Number(quantidade) });
    }
  }

  return (
    <View style={styles.card}>
      <FormTextField
        label="Nome do produto"
        value={nome}
        onChangeText={alterarNome}
        placeholder="Ex.: Caderno universitário"
        helper="Use um nome fácil de reconhecer."
        autoCapitalize="words"
        maxLength={80}
        editable={!loading}
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
        onSubmitEditing={enviar}
      />
      <View style={styles.buttonSpacing}>
        <PrimaryButton
          label={success ? 'Cadastrar outro produto' : 'Cadastrar produto'}
          onPress={enviar}
          disabled={success ? false : !nomeValido || !quantidadeValida}
          loading={loading}
        />
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
  fieldSpacing: { height: 19 },
  buttonSpacing: { marginTop: 22 },
});

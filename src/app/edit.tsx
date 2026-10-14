import { useEffect, useState } from 'react';
import { Keyboard, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_BASE_URL } from '@/services/api';
import { MessagePanel } from '@/components/MessagePanel';
import { ProductCard } from '@/features/products/components/ProductCard';
import { ProductSearchForm } from '@/features/products/components/ProductSearchForm';
import { EditProductForm } from '@/features/products/components/EditProductForm';
import { useEditProduct } from '@/features/products/hooks/useEditProduct';

export default function EditProductScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { produto, status, mensagemErro, consultar, salvar, limparMensagem, reiniciar } = useEditProduct();
  const [ultimaBusca, setUltimaBusca] = useState<number | null>(null);
  const [searchVersion, setSearchVersion] = useState(0);

  function buscar(id: number) {
    Keyboard.dismiss();
    setUltimaBusca(id);
    void consultar(id);
  }

  function procurarOutro() {
    reiniciar();
    setUltimaBusca(null);
    setSearchVersion((version) => version + 1);
  }

  const pesquisando = status === 'loadingProduct';
  const salvando = status === 'saving';

  useEffect(() => {
    const productId = Number(id);
    if (id && Number.isInteger(productId) && productId > 0) {
      void Promise.resolve().then(() => consultar(productId));
    }
  }, [id, consultar]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <View style={styles.brandMark}><View style={styles.brandMarkInner} /></View>
            <Text style={styles.brand}>INVENTÁRIO</Text>
          </View>
          <Text style={styles.title}>Editar produto</Text>
          <Text style={styles.subtitle}>Busque pelo ID e atualize a quantidade disponível no estoque.</Text>
        </View>

        {!produto && (
          <ProductSearchForm
            key={searchVersion}
            loading={pesquisando}
            onSearch={buscar}
            onValueChange={() => {
              if (status !== 'idle' && status !== 'loadingProduct') {
                setUltimaBusca(null);
              }
            }}
          />
        )}

        <View style={styles.resultSection}>
          {status === 'idle' && !produto && (
            <MessagePanel title="Busque um produto" description="Informe o ID para carregar os dados atuais antes de editar o estoque." />
          )}
          {pesquisando && (
            <MessagePanel title="Consultando produto…" description={`Buscando o item ${ultimaBusca ?? ''} na API de produtos.`} loading />
          )}
          {status === 'notFound' && (
            <MessagePanel title="Produto não encontrado" description={`A API não retornou dados para o ID ${ultimaBusca ?? ''}. Confira o número e tente novamente.`} tone="error" />
          )}
          {status === 'error' && !produto && (
            <MessagePanel title="Não foi possível consultar" description={mensagemErro} tone="error" />
          )}
          {produto && (
            <>
              <Text style={styles.sectionTitle}>Dados do produto</Text>
              <EditProductForm
                key={`${produto.id}-${produto.qtdDisponivel}`}
                produto={produto}
                loading={salvando}
                onSubmit={(quantidade) => void salvar(quantidade)}
                onChange={limparMensagem}
              />
              {status === 'saving' && (
                <MessagePanel title="Salvando alterações…" description="Atualizando a quantidade na API de produtos." loading />
              )}
              {status === 'success' && (
                <MessagePanel title="Estoque atualizado" description="A nova quantidade foi salva pela API." tone="success" />
              )}
              {status === 'error' && (
                <MessagePanel title="Não foi possível salvar" description={mensagemErro} tone="error" />
              )}
              <ProductCard produto={produto} />
              <Pressable accessibilityRole="button" onPress={procurarOutro} style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>Consultar outro produto</Text>
              </Pressable>
            </>
          )}
        </View>

        <Text style={styles.footer}>API DE PRODUTOS · {API_BASE_URL}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F5F5F7' },
  content: { flexGrow: 1, width: '100%', maxWidth: 560, alignSelf: 'center', paddingHorizontal: 22, paddingTop: 18, paddingBottom: 28 },
  header: { marginBottom: 25 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 13 },
  brandMark: { width: 18, height: 18, borderRadius: 6, backgroundColor: '#1769E0', alignItems: 'center', justifyContent: 'center' },
  brandMarkInner: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FFFFFF' },
  brand: { color: '#737780', fontSize: 11, fontWeight: '700', letterSpacing: 1.5 },
  title: { color: '#1D1D1F', fontSize: 32, fontWeight: '700', letterSpacing: -1 },
  subtitle: { color: '#747780', fontSize: 15, lineHeight: 22, marginTop: 5 },
  resultSection: { gap: 14, marginTop: 20 },
  sectionTitle: { color: '#777A82', fontSize: 13, fontWeight: '600', marginBottom: -3 },
  secondaryButton: { minHeight: 48, justifyContent: 'center', alignItems: 'center' },
  secondaryButtonText: { color: '#1769E0', fontSize: 15, fontWeight: '600' },
  footer: { color: '#9A9CA3', fontSize: 10, fontWeight: '600', letterSpacing: 0.65, marginTop: 'auto', paddingTop: 30, textAlign: 'center' },
});

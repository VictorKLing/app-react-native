import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_BASE_URL } from '@/services/api';
import { MessagePanel } from '@/components/MessagePanel';
import { ProductCard } from '@/features/products/components/ProductCard';
import { ProductForm } from '@/features/products/components/ProductForm';
import { useCreateProduct } from '@/features/products/hooks/useCreateProduct';

export default function CreateProductScreen() {
  const { produto, status, mensagemErro, cadastrar, limpar } = useCreateProduct();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <View style={styles.brandMark}><View style={styles.brandMarkInner} /></View>
            <Text style={styles.brand}>NOVO CADASTRO</Text>
          </View>
          <Text style={styles.title}>Cadastrar produto</Text>
          <Text style={styles.subtitle}>Preencha os dados abaixo para adicionar um produto ao estoque.</Text>
        </View>

        <ProductForm
          loading={status === 'loading'}
          success={status === 'success'}
          onSubmit={cadastrar}
          onChange={() => {
            if (status !== 'idle' && status !== 'loading') limpar();
          }}
          onReset={limpar}
        />

        <View style={styles.resultSection}>
          {status === 'loading' && (
            <MessagePanel title="Cadastrando produto…" description="Enviando os dados para a API de produtos." loading />
          )}
          {status === 'error' && <MessagePanel title="Não foi possível cadastrar" description={mensagemErro} tone="error" />}
          {status === 'success' && produto && (
            <>
              <MessagePanel
                title="Produto cadastrado"
                description={`A API atribuiu o ID ${produto.id}. Você já pode consultá-lo pelo menu lateral.`}
                tone="success"
              />
              <View style={styles.productCard}>
                <ProductCard produto={produto} />
              </View>
            </>
          )}
        </View>

        <Text style={styles.footer}>API DE PRODUTOS · {API_BASE_URL}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F2F5F7' },
  content: { flexGrow: 1, width: '100%', maxWidth: 560, alignSelf: 'center', paddingHorizontal: 22, paddingTop: 18, paddingBottom: 28 },
  header: { marginBottom: 25 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 13 },
  brandMark: { width: 18, height: 18, borderRadius: 6, backgroundColor: '#176B55', alignItems: 'center', justifyContent: 'center' },
  brandMarkInner: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FFFFFF' },
  brand: { color: '#737780', fontSize: 11, fontWeight: '700', letterSpacing: 1.5 },
  title: { color: '#1B2938', fontSize: 32, fontWeight: '700', letterSpacing: -1 },
  subtitle: { color: '#747780', fontSize: 15, lineHeight: 22, marginTop: 5 },
  resultSection: { gap: 14, marginTop: 20 },
  productCard: { marginTop: 2 },
  footer: { color: '#9A9CA3', fontSize: 10, fontWeight: '600', letterSpacing: 0.65, marginTop: 'auto', paddingTop: 30, textAlign: 'center' },
});

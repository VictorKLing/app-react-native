import { useState } from 'react';
import { Keyboard, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_BASE_URL } from '@/services/api';
import { MessagePanel } from '@/components/MessagePanel';
import { ProductCard } from '@/features/products/components/ProductCard';
import { ProductSearchForm } from '@/features/products/components/ProductSearchForm';
import { useProductLookup } from '@/features/products/hooks/useProductLookup';

export default function ProductsScreen() {
  const { produto, status, mensagemErro, consultar, limpar } = useProductLookup();
  const [ultimaBusca, setUltimaBusca] = useState<number | null>(null);

  function buscar(id: number) {
    Keyboard.dismiss();
    setUltimaBusca(id);
    void consultar(id);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <View style={styles.brandMark}><View style={styles.brandMarkInner} /></View>
            <Text style={styles.brand}>INVENTÁRIO</Text>
          </View>
          <Text style={styles.title}>Produtos</Text>
          <Text style={styles.subtitle}>Consulte os detalhes e a disponibilidade de um produto.</Text>
        </View>

        <ProductSearchForm
          loading={status === 'loading'}
          onSearch={buscar}
          onValueChange={() => {
            if (status !== 'idle') {
              setUltimaBusca(null);
              limpar();
            }
          }}
        />

        <View style={styles.resultSection}>
          <Text style={styles.sectionTitle}>Resultado</Text>
          {status === 'idle' && (
            <MessagePanel
              title="Encontre um produto"
              description="Informe o código acima para consultar o nome e a quantidade disponível."
            />
          )}
          {status === 'loading' && (
            <MessagePanel
              title="Consultando produto…"
              description={`Buscando o item ${ultimaBusca ?? ''} na API de produtos.`}
              loading
            />
          )}
          {status === 'notFound' && (
            <MessagePanel
              title="Produto não encontrado"
              description={`A API não retornou dados para o código ${ultimaBusca ?? ''}. Confira o número e tente novamente.`}
            />
          )}
          {status === 'error' && (
            <MessagePanel title="Não foi possível consultar" description={mensagemErro} tone="error" />
          )}
          {status === 'found' && produto && <ProductCard produto={produto} />}
        </View>

        <Text style={styles.footer}>API DE PRODUTOS · {API_BASE_URL}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F2F5F7' },
  content: { flexGrow: 1, width: '100%', maxWidth: 560, alignSelf: 'center', paddingHorizontal: 22, paddingTop: 22, paddingBottom: 28 },
  header: { marginBottom: 25 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 13 },
  brandMark: { width: 18, height: 18, borderRadius: 6, backgroundColor: '#176B55', alignItems: 'center', justifyContent: 'center' },
  brandMarkInner: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FFFFFF' },
  brand: { color: '#737780', fontSize: 11, fontWeight: '700', letterSpacing: 1.5 },
  title: { color: '#1B2938', fontSize: 36, fontWeight: '700', letterSpacing: -1.2 },
  subtitle: { color: '#747780', fontSize: 15, lineHeight: 22, marginTop: 5 },
  resultSection: { marginTop: 28 },
  sectionTitle: { color: '#777A82', fontSize: 13, fontWeight: '600', marginBottom: 11 },
  footer: { color: '#9A9CA3', fontSize: 10, fontWeight: '600', letterSpacing: 0.65, marginTop: 'auto', paddingTop: 30, textAlign: 'center' },
});

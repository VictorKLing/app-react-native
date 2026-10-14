import { useEffect } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_BASE_URL } from '@/services/api';
import { MessagePanel } from '@/components/MessagePanel';
import { ProductCard } from '@/features/products/components/ProductCard';
import { useProductLookup } from '@/features/products/hooks/useProductLookup';

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { produto, status, mensagemErro, consultar } = useProductLookup();
  const productId = Number(id);
  const idValido = Number.isInteger(productId) && productId > 0;

  useEffect(() => {
    if (idValido) void consultar(productId);
  }, [consultar, idValido, productId]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>‹  Produtos</Text>
          </Pressable>
          <Text style={styles.title}>Detalhes do produto</Text>
          <Text style={styles.subtitle}>Informações carregadas diretamente da API.</Text>
        </View>

        {!idValido && <MessagePanel title="Código inválido" description="O endereço não contém um ID de produto válido." tone="error" />}
        {idValido && status === 'loading' && (
          <MessagePanel title="Carregando produto…" description={`Buscando o item ${productId} na API de produtos.`} loading />
        )}
        {idValido && status === 'notFound' && (
          <MessagePanel title="Produto não encontrado" description={`A API não retornou dados para o ID ${productId}.`} tone="error" />
        )}
        {idValido && status === 'error' && <MessagePanel title="Não foi possível consultar" description={mensagemErro} tone="error" />}
        {status === 'found' && produto && (
          <>
            <ProductCard produto={produto} />
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push({ pathname: '/edit', params: { id: String(produto.id) } })}
              style={styles.editButton}
            >
              <Text style={styles.editButtonText}>Editar quantidade</Text>
            </Pressable>
          </>
        )}
        {status === 'idle' && idValido && <ActivityIndicator color="#1769E0" />}
        <Text style={styles.footer}>API DE PRODUTOS · {API_BASE_URL}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F5F5F7' },
  content: { flexGrow: 1, width: '100%', maxWidth: 560, alignSelf: 'center', paddingHorizontal: 22, paddingTop: 18, paddingBottom: 28 },
  header: { marginBottom: 25 },
  backButton: { alignSelf: 'flex-start', paddingVertical: 8, paddingRight: 12, marginBottom: 16 },
  backText: { color: '#1769E0', fontSize: 15, fontWeight: '600' },
  title: { color: '#1D1D1F', fontSize: 30, fontWeight: '700', letterSpacing: -0.8 },
  subtitle: { color: '#747780', fontSize: 15, lineHeight: 22, marginTop: 5 },
  editButton: { minHeight: 52, marginTop: 18, alignItems: 'center', justifyContent: 'center', borderRadius: 15, backgroundColor: '#1769E0' },
  editButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  footer: { color: '#9A9CA3', fontSize: 10, fontWeight: '600', letterSpacing: 0.65, marginTop: 'auto', paddingTop: 30, textAlign: 'center' },
});

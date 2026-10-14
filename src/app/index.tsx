import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ApiError, API_BASE_URL, type Produto } from '@/services/api';
import { MessagePanel } from '@/components/MessagePanel';
import { ProductTable } from '@/features/products/components/ProductTable';
import { useProductList } from '@/features/products/hooks/useProductList';

export default function ProductsScreen() {
  const { produtos, status, mensagemErro, carregar, excluir } = useProductList();
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);
  const [excluindo, setExcluindo] = useState(false);
  const [erroExclusao, setErroExclusao] = useState('');
  const [exclusaoIndisponivel, setExclusaoIndisponivel] = useState(false);

  async function confirmarExclusao() {
    if (!produtoSelecionado) return;
    setExcluindo(true);
    setErroExclusao('');
    setExclusaoIndisponivel(false);

    try {
      await excluir(produtoSelecionado.id);
      setProdutoSelecionado(null);
    } catch (error) {
      if (error instanceof ApiError && (error.status === 404 || error.status === 405)) {
        setExclusaoIndisponivel(true);
      } else {
        setErroExclusao(error instanceof Error ? error.message : 'Não foi possível excluir o produto.');
      }
    } finally {
      setExcluindo(false);
    }
  }

  function abrirDetalhes(produto: Produto) {
    router.push(`/${produto.id}`);
  }

  function editarProduto(produto: Produto) {
    router.push({ pathname: '/edit', params: { id: String(produto.id) } });
  }

  function pedirExclusao(produto: Produto) {
    setErroExclusao('');
    setExclusaoIndisponivel(false);
    setProdutoSelecionado(produto);
  }

  const atualizandoLista = status === 'loading';
  const mensagemListaVazia = status === 'ready' ? 'Nenhum produto cadastrado.' : 'A lista será exibida quando a API oferecer a rota GET /produtos.';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <View style={styles.brandMark}><View style={styles.brandMarkInner} /></View>
            <Text style={styles.brand}>INVENTÁRIO</Text>
          </View>
          <View style={styles.titleRow}>
            <View style={styles.titleCopy}>
              <Text style={styles.title}>Produtos</Text>
              <Text style={styles.subtitle}>Estoque e disponibilidade em um só lugar.</Text>
            </View>
            <Pressable accessibilityRole="button" onPress={() => router.push('/create')} style={styles.addButton}>
              <Text style={styles.addButtonText}>＋</Text>
            </Pressable>
          </View>
        </View>

        {status === 'loading' && (
          <View style={styles.notice}>
            <MessagePanel title="Carregando produtos…" description={`Consultando a API em ${API_BASE_URL}.`} loading />
          </View>
        )}
        {status === 'unavailable' && (
          <View style={styles.notice}>
            <MessagePanel
              title="Listagem ainda não disponível"
              description="A API atual não possui GET /produtos. A tela está pronta para exibir os itens quando essa rota for adicionada."
            />
          </View>
        )}
        {status === 'error' && (
          <View style={styles.notice}>
            <MessagePanel title="Não foi possível carregar os produtos" description={mensagemErro} tone="error" />
            <Pressable accessibilityRole="button" onPress={() => void carregar()} style={styles.retryButton}>
              <Text style={styles.refreshText}>Tentar novamente</Text>
            </Pressable>
          </View>
        )}

        {(status === 'ready' || status === 'unavailable') && (
          <>
            <View style={styles.tableHeading}>
              <Text style={styles.sectionTitle}>ESTOQUE</Text>
              <Pressable accessibilityRole="button" disabled={atualizandoLista} onPress={() => void carregar()}>
                <Text style={styles.refreshText}>Atualizar</Text>
              </Pressable>
            </View>
            <ProductTable
              produtos={produtos}
              refreshing={atualizandoLista}
              onRefresh={() => void carregar()}
              emptyMessage={mensagemListaVazia}
              onOpen={abrirDetalhes}
              onEdit={editarProduto}
              onDelete={pedirExclusao}
            />
          </>
        )}

        {status === 'unavailable' && (
          <Pressable accessibilityRole="button" onPress={() => router.push('/lookup')} style={styles.lookupButton}>
            <Text style={styles.lookupButtonText}>Consultar produto pelo ID</Text>
          </Pressable>
        )}

        <Text style={styles.footer}>API DE PRODUTOS · {API_BASE_URL}</Text>
      </View>

      <Modal transparent animationType="fade" visible={produtoSelecionado !== null} onRequestClose={() => setProdutoSelecionado(null)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Excluir produto?</Text>
            <Text style={styles.modalDescription}>
              {exclusaoIndisponivel
                ? 'A API atual ainda não possui a rota DELETE /produtos/:id. Nenhum produto foi removido.'
                : erroExclusao ? 'A exclusão não foi concluída. Verifique a conexão e tente novamente.' : `O produto “${produtoSelecionado?.nome ?? ''}” será removido do estoque.`}
            </Text>
            {erroExclusao !== '' && <Text accessibilityRole="alert" style={styles.modalError}>{erroExclusao}</Text>}
            <View style={styles.modalActions}>
              <Pressable accessibilityRole="button" disabled={excluindo} onPress={() => setProdutoSelecionado(null)} style={styles.cancelButton}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </Pressable>
              {!exclusaoIndisponivel && (
                <Pressable accessibilityRole="button" disabled={excluindo} onPress={() => void confirmarExclusao()} style={styles.confirmButton}>
                  <Text style={styles.confirmText}>{excluindo ? 'Excluindo…' : 'Excluir'}</Text>
                </Pressable>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F5F5F7' },
  content: { flex: 1, width: '100%', maxWidth: 700, alignSelf: 'center', paddingHorizontal: 22, paddingTop: 22, paddingBottom: 18 },
  header: { marginBottom: 25 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 13 },
  brandMark: { width: 18, height: 18, borderRadius: 6, backgroundColor: '#1769E0', alignItems: 'center', justifyContent: 'center' },
  brandMarkInner: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FFFFFF' },
  brand: { color: '#737780', fontSize: 11, fontWeight: '700', letterSpacing: 1.5 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  titleCopy: { flex: 1 },
  title: { color: '#1D1D1F', fontSize: 36, fontWeight: '700', letterSpacing: -1.2 },
  subtitle: { color: '#747780', fontSize: 15, lineHeight: 22, marginTop: 5 },
  addButton: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 16, backgroundColor: '#1769E0' },
  addButtonText: { color: '#FFFFFF', fontSize: 30, fontWeight: '400', lineHeight: 34 },
  notice: { marginBottom: 20 },
  retryButton: { alignSelf: 'flex-end', paddingVertical: 8, paddingHorizontal: 4 },
  tableHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 11 },
  sectionTitle: { color: '#777A82', fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  refreshText: { color: '#1769E0', fontSize: 13, fontWeight: '600', paddingVertical: 5, paddingHorizontal: 4 },
  lookupButton: { minHeight: 48, alignItems: 'center', justifyContent: 'center', marginTop: 14, borderWidth: 1, borderColor: '#D9E5FC', borderRadius: 14, backgroundColor: '#FFFFFF' },
  lookupButtonText: { color: '#1769E0', fontSize: 14, fontWeight: '600' },
  footer: { color: '#9A9CA3', fontSize: 10, fontWeight: '600', letterSpacing: 0.65, marginTop: 'auto', paddingTop: 24, textAlign: 'center' },
  modalBackdrop: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: 'rgba(25, 27, 31, 0.38)' },
  modalCard: { width: '100%', maxWidth: 400, padding: 22, borderRadius: 22, backgroundColor: '#FFFFFF' },
  modalTitle: { color: '#1D1D1F', fontSize: 20, fontWeight: '700' },
  modalDescription: { color: '#71747C', fontSize: 14, lineHeight: 21, marginTop: 9 },
  modalError: { color: '#B33A32', fontSize: 13, lineHeight: 19, marginTop: 10 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 22 },
  cancelButton: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 16, borderRadius: 12, backgroundColor: '#F1F2F4' },
  cancelText: { color: '#42444A', fontSize: 14, fontWeight: '600' },
  confirmButton: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 18, borderRadius: 12, backgroundColor: '#C43E36' },
  confirmText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
});

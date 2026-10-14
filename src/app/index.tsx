import { useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ApiError, API_BASE_URL, type Produto } from '@/services/api';
import { MessagePanel } from '@/components/MessagePanel';
import { ProductTable } from '@/features/products/components/ProductTable';
import { useProductList } from '@/features/products/hooks/useProductList';

function MetricCard({ label, value, caption, accent }: { label: string; value: string; caption: string; accent: string }) {
  return (
    <View style={styles.metricCard}>
      <View style={[styles.metricAccent, { backgroundColor: accent }]} />
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricCaption}>{caption}</Text>
    </View>
  );
}

export default function ProductsScreen() {
  const { width } = useWindowDimensions();
  const compacto = width < 640;
  const { produtos, status, mensagemErro, carregar, excluir } = useProductList();
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);
  const [excluindo, setExcluindo] = useState(false);
  const [erroExclusao, setErroExclusao] = useState('');
  const [exclusaoIndisponivel, setExclusaoIndisponivel] = useState(false);
  const [busca, setBusca] = useState('');

  async function confirmarExclusao() {
    if (!produtoSelecionado) return;
    setExcluindo(true);
    setErroExclusao('');
    setExclusaoIndisponivel(false);

    try {
      await excluir(produtoSelecionado.id);
      setProdutoSelecionado(null);
    } catch (error) {
      if (error instanceof ApiError && error.status === 405) {
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

  const produtosFiltrados = useMemo(() => {
    const termo = busca.trim().toLocaleLowerCase();
    if (!termo) return produtos;
    return produtos.filter((produto) =>
      produto.nome.toLocaleLowerCase().includes(termo) || String(produto.id).includes(termo),
    );
  }, [busca, produtos]);

  const dadosDisponiveis = status === 'ready';
  const contagemProdutos = dadosDisponiveis ? String(produtos.length) : '—';
  const totalUnidades = dadosDisponiveis
    ? String(produtos.reduce((total, produto) => total + produto.qtdDisponivel, 0))
    : '—';
  const semEstoque = dadosDisponiveis
    ? String(produtos.filter((produto) => produto.qtdDisponivel === 0).length)
    : '—';
  const mensagemListaVazia = busca.trim()
    ? 'Nenhum produto corresponde a essa busca.'
    : dadosDisponiveis
      ? 'Nenhum produto cadastrado.'
      : 'A tabela será preenchida quando a API disponibilizar a rota GET /produtos.';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <View style={styles.topLine}>
          <View style={styles.breadcrumb}>
            <Text style={styles.breadcrumbMuted}>ESTOQUE</Text>
            <Text style={styles.breadcrumbDivider}>/</Text>
            <Text style={styles.breadcrumbCurrent}>Produtos</Text>
          </View>
          <View style={styles.apiStatus}>
            <View style={[styles.statusDot, status === 'ready' ? styles.statusOnline : status === 'loading' ? styles.statusLoading : styles.statusOffline]} />
            <Text style={styles.apiStatusText}>{status === 'ready' ? 'API conectada' : status === 'loading' ? 'Conectando' : 'API indisponível'}</Text>
          </View>
        </View>

        <View style={styles.pageHeader}>
          <View style={styles.titleCopy}>
            <Text style={styles.eyebrow}>CONTROLE DE INVENTÁRIO</Text>
          <Text style={[styles.title, compacto && styles.titleCompact]}>Produtos</Text>
            <Text style={styles.subtitle}>Acompanhe os itens e o saldo disponível no estoque.</Text>
          </View>
          <Pressable accessibilityRole="button" onPress={() => router.push('/create')} style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}>
            <Text style={styles.addIcon}>＋</Text>
            <Text style={styles.addButtonText}>Novo produto</Text>
          </Pressable>
        </View>

        <View style={styles.metrics}>
          <MetricCard label={compacto ? 'Produtos' : 'Produtos cadastrados'} value={contagemProdutos} caption={compacto ? 'no catálogo' : 'Itens no catálogo'} accent="#1A785E" />
          <MetricCard label={compacto ? 'Unidades' : 'Unidades em estoque'} value={totalUnidades} caption={compacto ? 'disponíveis' : 'Saldo disponível'} accent="#5679B8" />
          <MetricCard label={compacto ? 'Zerados' : 'Sem estoque'} value={semEstoque} caption={compacto ? 'sem saldo' : 'Produtos zerados'} accent="#C68148" />
        </View>

        {status === 'loading' && (
          <View style={styles.notice}>
            <MessagePanel title="Carregando produtos" description={`Consultando a API em ${API_BASE_URL}.`} loading />
          </View>
        )}
        {status === 'unavailable' && (
          <View style={styles.notice}>
            <MessagePanel
              title="A lista depende de uma rota da API"
              description="O backend atual ainda não oferece GET /produtos. Quando essa rota estiver disponível, os produtos serão carregados aqui."
            />
          </View>
        )}
        {status === 'error' && (
          <View style={styles.notice}>
            <MessagePanel title="Não foi possível carregar os produtos" description={mensagemErro} tone="error" />
            <Pressable accessibilityRole="button" onPress={() => void carregar()} style={styles.retryButton}>
              <Text style={styles.actionLink}>Tentar novamente</Text>
            </Pressable>
          </View>
        )}

        {(status === 'ready' || status === 'unavailable') && (
          <View style={styles.catalogCard}>
            <View style={styles.catalogHeader}>
              <View>
                <Text style={styles.catalogTitle}>Catálogo de produtos</Text>
                <Text style={styles.catalogSubtitle}>{dadosDisponiveis ? `${produtos.length} itens encontrados` : 'Consulte e gerencie os produtos'}</Text>
              </View>
              <Pressable accessibilityRole="button" onPress={() => void carregar()} style={styles.refreshButton}>
                <Text style={styles.refreshIcon}>↻</Text>
                <Text style={styles.actionLink}>Atualizar</Text>
              </Pressable>
            </View>

            <View style={styles.searchBox}>
              <Text style={styles.searchIcon}>⌕</Text>
              <TextInput
                accessibilityLabel="Buscar produto por nome ou código"
                placeholder="Buscar por nome ou código"
                placeholderTextColor="#8B97A5"
                value={busca}
                onChangeText={setBusca}
                style={styles.searchInput}
                returnKeyType="search"
              />
            </View>

            <ProductTable
              produtos={produtosFiltrados}
              refreshing={false}
              onRefresh={() => void carregar()}
              emptyMessage={mensagemListaVazia}
              onOpen={abrirDetalhes}
              onEdit={editarProduto}
              onDelete={pedirExclusao}
            />
            <Text style={styles.tableFootnote}>Toque em uma linha para ver os detalhes do produto.</Text>
          </View>
        )}

        {status === 'unavailable' && (
          <Pressable accessibilityRole="button" onPress={() => router.push('/lookup')} style={styles.lookupButton}>
            <Text style={styles.lookupButtonText}>Consultar um produto pelo ID</Text>
            <Text style={styles.lookupArrow}>›</Text>
          </Pressable>
        )}

        <Text style={styles.footer}>VÉRTICE GESTÃO · API {API_BASE_URL}</Text>
      </View>

      <Modal transparent animationType="fade" visible={produtoSelecionado !== null} onRequestClose={() => setProdutoSelecionado(null)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalIcon}><Text style={styles.modalIconText}>!</Text></View>
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
                <Pressable accessibilityRole="button" disabled={excluindo} onPress={() => void confirmarExclusao()} style={[styles.confirmButton, excluindo && styles.disabledButton]}>
                  <Text style={styles.confirmText}>{excluindo ? 'Excluindo…' : 'Excluir produto'}</Text>
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
  safeArea: { flex: 1, backgroundColor: '#F2F5F7' },
  content: { flex: 1, width: '100%', maxWidth: 1180, alignSelf: 'center', paddingHorizontal: 24, paddingTop: 24, paddingBottom: 18 },
  topLine: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 23 },
  breadcrumb: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  breadcrumbMuted: { color: '#8793A0', fontSize: 10, fontWeight: '700', letterSpacing: 1.1 },
  breadcrumbDivider: { color: '#B5BEC7', fontSize: 12 },
  breadcrumbCurrent: { color: '#405064', fontSize: 12, fontWeight: '600' },
  apiStatus: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 11, paddingVertical: 7, borderRadius: 20, backgroundColor: '#FFFFFF' },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  statusOnline: { backgroundColor: '#24845F' },
  statusLoading: { backgroundColor: '#C68148' },
  statusOffline: { backgroundColor: '#9AA5B1' },
  apiStatusText: { color: '#627181', fontSize: 11, fontWeight: '600' },
  pageHeader: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, marginBottom: 24 },
  titleCopy: { flex: 1 },
  eyebrow: { color: '#1A785E', fontSize: 10, fontWeight: '700', letterSpacing: 1.3, marginBottom: 7 },
  title: { color: '#1B2938', fontSize: 34, fontWeight: '700', letterSpacing: -1.1 },
  titleCompact: { fontSize: 29, letterSpacing: -0.7 },
  subtitle: { color: '#758292', fontSize: 14, lineHeight: 21, marginTop: 5 },
  addButton: { minHeight: 45, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 16, borderRadius: 11, backgroundColor: '#176B55' },
  addIcon: { color: '#FFFFFF', fontSize: 20, lineHeight: 22 },
  addButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  pressed: { opacity: 0.82 },
  metrics: { flexDirection: 'row', gap: 14, marginBottom: 22 },
  metricCard: { flex: 1, minHeight: 112, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#E3E9EF', backgroundColor: '#FFFFFF' },
  metricAccent: { width: 24, height: 3, borderRadius: 2, marginBottom: 12 },
  metricLabel: { color: '#718092', fontSize: 11, fontWeight: '600' },
  metricValue: { color: '#1B2938', fontSize: 25, fontWeight: '700', letterSpacing: -0.5, marginTop: 4 },
  metricCaption: { color: '#99A3AE', fontSize: 10, marginTop: 3 },
  notice: { marginBottom: 18 },
  retryButton: { alignSelf: 'flex-end', paddingVertical: 8, paddingHorizontal: 4 },
  actionLink: { color: '#176B55', fontSize: 12, fontWeight: '700' },
  catalogCard: { flex: 1, minHeight: 280, padding: 16, borderWidth: 1, borderColor: '#E3E9EF', borderRadius: 14, backgroundColor: '#FFFFFF' },
  catalogHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 17 },
  catalogTitle: { color: '#243244', fontSize: 16, fontWeight: '700' },
  catalogSubtitle: { color: '#8995A2', fontSize: 11, marginTop: 4 },
  refreshButton: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 9, paddingVertical: 8 },
  refreshIcon: { color: '#176B55', fontSize: 18, lineHeight: 18 },
  searchBox: { height: 42, flexDirection: 'row', alignItems: 'center', gap: 9, paddingHorizontal: 12, marginBottom: 15, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8EE', backgroundColor: '#FAFBFC' },
  searchIcon: { color: '#718092', fontSize: 21, lineHeight: 24 },
  searchInput: { flex: 1, color: '#263343', fontSize: 13, paddingVertical: 0 },
  tableFootnote: { color: '#98A3AE', fontSize: 10, marginTop: 12 },
  lookupButton: { minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, marginTop: 14, borderWidth: 1, borderColor: '#DCE8E2', borderRadius: 11, backgroundColor: '#FFFFFF' },
  lookupButtonText: { color: '#176B55', fontSize: 12, fontWeight: '600' },
  lookupArrow: { color: '#176B55', fontSize: 22 },
  footer: { color: '#9BA5AF', fontSize: 9, fontWeight: '600', letterSpacing: 0.8, marginTop: 'auto', paddingTop: 17, textAlign: 'right' },
  modalBackdrop: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: 'rgba(25, 39, 53, 0.44)' },
  modalCard: { width: '100%', maxWidth: 400, padding: 24, borderRadius: 18, backgroundColor: '#FFFFFF' },
  modalIcon: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center', marginBottom: 13, borderRadius: 12, backgroundColor: '#FFF1ED' },
  modalIconText: { color: '#B94B39', fontSize: 18, fontWeight: '700' },
  modalTitle: { color: '#1B2938', fontSize: 19, fontWeight: '700' },
  modalDescription: { color: '#718092', fontSize: 13, lineHeight: 20, marginTop: 8 },
  modalError: { color: '#B33A32', fontSize: 12, lineHeight: 18, marginTop: 10 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 9, marginTop: 22 },
  cancelButton: { minHeight: 42, justifyContent: 'center', paddingHorizontal: 14, borderRadius: 10, backgroundColor: '#F1F4F6' },
  cancelText: { color: '#536171', fontSize: 12, fontWeight: '700' },
  confirmButton: { minHeight: 42, justifyContent: 'center', paddingHorizontal: 15, borderRadius: 10, backgroundColor: '#B94B39' },
  confirmText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  disabledButton: { opacity: 0.55 },
});

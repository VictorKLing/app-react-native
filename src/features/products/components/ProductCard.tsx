import { StyleSheet, Text, View } from 'react-native';
import type { Produto } from '@/services/api';

type ProductCardProps = { produto: Produto };

export function ProductCard({ produto }: ProductCardProps) {
  const disponivel = produto.qtdDisponivel > 0;

  return (
    <View accessibilityLabel={`Detalhes do produto ${produto.nome}`} style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.eyebrow}>PRODUTO {String(produto.id).padStart(3, '0')}</Text>
        <View style={[styles.badge, disponivel ? styles.availableBadge : styles.emptyBadge]}>
          <View style={[styles.dot, disponivel ? styles.availableDot : styles.emptyDot]} />
          <Text style={[styles.badgeText, disponivel ? styles.availableText : styles.emptyText]}>
            {disponivel ? 'DISPONÍVEL' : 'SEM ESTOQUE'}
          </Text>
        </View>
      </View>

      <Text style={styles.name}>{produto.nome || 'Produto sem nome'}</Text>
      <View style={styles.divider} />
      <Text style={styles.stockLabel}>Quantidade disponível</Text>
      <View style={styles.stockRow}>
        <Text style={styles.stockValue}>{produto.qtdDisponivel}</Text>
        <Text style={styles.stockUnit}>{produto.qtdDisponivel === 1 ? 'unidade' : 'unidades'}</Text>
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
    padding: 22,
    shadowColor: '#1D1D1F',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.045,
    shadowRadius: 14,
    elevation: 2,
  },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  eyebrow: { color: '#8A8D95', fontSize: 11, fontWeight: '700', letterSpacing: 1.1 },
  badge: { alignItems: 'center', flexDirection: 'row', gap: 6, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 6 },
  availableBadge: { backgroundColor: '#EAF7EF' },
  emptyBadge: { backgroundColor: '#F1F1F3' },
  dot: { width: 6, height: 6, borderRadius: 3 },
  availableDot: { backgroundColor: '#23814A' },
  emptyDot: { backgroundColor: '#777A82' },
  badgeText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.35 },
  availableText: { color: '#207443' },
  emptyText: { color: '#666970' },
  name: { color: '#1D1D1F', fontSize: 24, fontWeight: '600', lineHeight: 30, marginTop: 21 },
  divider: { height: 1, backgroundColor: '#ECEDEF', marginVertical: 20 },
  stockLabel: { color: '#777A82', fontSize: 14 },
  stockRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 4 },
  stockValue: { color: '#1D1D1F', fontSize: 42, fontWeight: '600', letterSpacing: -1.2 },
  stockUnit: { color: '#777A82', fontSize: 15 },
});

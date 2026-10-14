import { FlatList, Pressable, StyleSheet, Text, View, type ListRenderItem } from 'react-native';
import type { Produto } from '@/services/api';

type ProductTableProps = {
  produtos: Produto[];
  refreshing: boolean;
  emptyMessage?: string;
  onRefresh: () => void;
  onOpen: (produto: Produto) => void;
  onEdit: (produto: Produto) => void;
  onDelete: (produto: Produto) => void;
};

function PencilIcon() {
  return (
    <View style={styles.pencilIcon}>
      <View style={styles.pencilBody} />
      <View style={styles.pencilTip} />
    </View>
  );
}

function TrashIcon() {
  return (
    <View style={styles.trashIcon}>
      <View style={styles.trashLid} />
      <View style={styles.trashHandle} />
      <View style={styles.trashBody}>
        <View style={styles.trashLine} />
        <View style={styles.trashLine} />
      </View>
    </View>
  );
}

export function ProductTable({ produtos, refreshing, emptyMessage, onRefresh, onOpen, onEdit, onDelete }: ProductTableProps) {
  const renderItem: ListRenderItem<Produto> = ({ item }) => (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Abrir detalhes de ${item.nome}`}
        onPress={() => onOpen(item)}
        style={({ pressed }) => [styles.productCell, pressed && styles.pressed]}
      >
        <Text style={styles.id} numberOfLines={1}>{item.id}</Text>
        <View style={styles.nameCell}>
          <Text style={styles.name} numberOfLines={1}>{item.nome}</Text>
          <Text style={styles.rowHint}>Ver detalhes</Text>
        </View>
        <Text style={styles.quantity} numberOfLines={1}>{item.qtdDisponivel}</Text>
      </Pressable>
      <View style={styles.actions}>
        <Pressable accessibilityRole="button" accessibilityLabel={`Editar ${item.nome}`} onPress={() => onEdit(item)} style={styles.actionButton}>
          <PencilIcon />
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel={`Excluir ${item.nome}`} onPress={() => onDelete(item)} style={[styles.actionButton, styles.deleteButton]}>
          <TrashIcon />
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.table}>
      <View style={styles.headerRow}>
        <Text style={styles.headerId}>ID</Text>
        <Text style={styles.headerName}>PRODUTO</Text>
        <Text style={styles.headerQuantity}>QTD.</Text>
        <Text style={styles.headerActions}>AÇÕES</Text>
      </View>
      <FlatList
        data={produtos}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={emptyMessage ? <Text style={styles.empty}>{emptyMessage}</Text> : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  table: { flex: 1, overflow: 'hidden', borderRadius: 18, borderWidth: 1, borderColor: '#E7E8EC', backgroundColor: '#FFFFFF' },
  headerRow: { minHeight: 44, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, backgroundColor: '#F8F8FA', borderBottomWidth: 1, borderBottomColor: '#E7E8EC' },
  headerId: { width: 36, color: '#898C94', fontSize: 10, fontWeight: '700', letterSpacing: 0.6 },
  headerName: { flex: 1, color: '#898C94', fontSize: 10, fontWeight: '700', letterSpacing: 0.6 },
  headerQuantity: { width: 48, color: '#898C94', fontSize: 10, fontWeight: '700', letterSpacing: 0.4, textAlign: 'center' },
  headerActions: { width: 82, color: '#898C94', fontSize: 10, fontWeight: '700', letterSpacing: 0.4, textAlign: 'center' },
  row: { minHeight: 72, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14 },
  productCell: { flex: 1, minWidth: 0, minHeight: 72, flexDirection: 'row', alignItems: 'center' },
  pressed: { opacity: 0.65 },
  id: { width: 36, color: '#767982', fontSize: 13, fontWeight: '600' },
  nameCell: { flex: 1, minWidth: 0, paddingRight: 5 },
  name: { color: '#25262A', fontSize: 14, fontWeight: '600' },
  rowHint: { color: '#9A9CA3', fontSize: 11, marginTop: 3 },
  quantity: { width: 48, color: '#25262A', fontSize: 14, fontWeight: '600', textAlign: 'center' },
  actions: { width: 82, flexDirection: 'row', justifyContent: 'center', gap: 5 },
  actionButton: { width: 36, height: 38, alignItems: 'center', justifyContent: 'center', borderRadius: 11, backgroundColor: '#EEF4FF' },
  deleteButton: { backgroundColor: '#FFF1F0' },
  separator: { height: 1, marginLeft: 14, backgroundColor: '#F0F0F2' },
  empty: { color: '#81848C', fontSize: 13, lineHeight: 19, paddingHorizontal: 18, paddingVertical: 22, textAlign: 'center' },
  pencilIcon: { width: 19, height: 19, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '45deg' }] },
  pencilBody: { width: 4, height: 15, borderRadius: 2, backgroundColor: '#1769E0' },
  pencilTip: { position: 'absolute', bottom: 0, width: 0, height: 0, borderLeftWidth: 3, borderRightWidth: 3, borderTopWidth: 4, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: '#1769E0' },
  trashIcon: { width: 18, height: 20, alignItems: 'center', justifyContent: 'flex-end' },
  trashLid: { position: 'absolute', top: 3, width: 15, height: 2, borderRadius: 1, backgroundColor: '#BC443B' },
  trashHandle: { position: 'absolute', top: 0, width: 6, height: 2, borderTopLeftRadius: 2, borderTopRightRadius: 2, backgroundColor: '#BC443B' },
  trashBody: { width: 11, height: 13, flexDirection: 'row', justifyContent: 'center', gap: 3, paddingTop: 3, borderWidth: 1.5, borderTopWidth: 0, borderColor: '#BC443B', borderBottomLeftRadius: 3, borderBottomRightRadius: 3 },
  trashLine: { width: 1, height: 6, borderRadius: 1, backgroundColor: '#BC443B' },
});

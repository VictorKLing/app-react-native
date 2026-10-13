import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { listarPedidos, type Pedido } from './src/services/api';

export default function App() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function carregarPedidos() {
    setCarregando(true);
    setErro(null);
    try {
      setPedidos(await listarPedidos());
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Não foi possível acessar a API.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Victor App</Text>
      <Text style={styles.description}>Aplicativo React Native conectado à API de pedidos.</Text>
      <Pressable accessibilityRole="button" onPress={carregarPedidos} style={styles.button} disabled={carregando}>
        {carregando ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Carregar pedidos</Text>}
      </Pressable>
      {erro && <Text accessibilityRole="alert" style={styles.error}>{erro}</Text>}
      {!erro && <Text style={styles.result}>{pedidos.length} pedido(s) carregado(s)</Text>}
      {pedidos.map((pedido) => (
        <View key={pedido.id} style={styles.card}>
          <Text style={styles.cardTitle}>Pedido #{pedido.id}</Text>
          <Text>{pedido.itens?.length ?? 0} item(ns)</Text>
        </View>
      ))}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6fa',
    padding: 24,
    paddingTop: 72,
  },
  title: { color: '#172033', fontSize: 30, fontWeight: '700' },
  description: { color: '#5c667a', fontSize: 16, marginTop: 8, marginBottom: 28 },
  button: { alignItems: 'center', backgroundColor: '#3157d5', borderRadius: 10, padding: 15 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  result: { color: '#39445a', marginTop: 20 },
  error: { color: '#b42318', marginTop: 20 },
  card: { backgroundColor: '#fff', borderRadius: 10, marginTop: 12, padding: 16 },
  cardTitle: { color: '#172033', fontSize: 16, fontWeight: '600', marginBottom: 6 },
});

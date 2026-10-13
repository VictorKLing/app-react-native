import { Platform } from 'react-native';

const baseUrl = process.env.EXPO_PUBLIC_API_URL ?? (Platform.OS === 'android'
  ? 'http://10.0.2.2:8081'
  : 'http://localhost:8081');

export type ItemPedido = {
  id?: number;
  [campo: string]: unknown;
};

export type Pedido = {
  id: number;
  itens?: ItemPedido[];
  [campo: string]: unknown;
};

async function requisicao<T>(caminho: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${baseUrl}${caminho}`, {
    ...init,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json', ...init?.headers },
  });

  if (!response.ok) {
    throw new Error(`A API respondeu com HTTP ${response.status}.`);
  }

  return response.json() as Promise<T>;
}

export function listarPedidos(): Promise<Pedido[]> {
  return requisicao<Pedido[]>('/pedidos');
}

export function criarPedido(pedido: Omit<Pedido, 'id'>): Promise<Pedido> {
  return requisicao<Pedido>('/pedidos', { method: 'POST', body: JSON.stringify(pedido) });
}

export function adicionarItem(idPedido: number, item: ItemPedido): Promise<Pedido> {
  return requisicao<Pedido>(`/pedidos/${idPedido}/itens`, { method: 'POST', body: JSON.stringify(item) });
}

export function excluirItem(idPedido: number, idItem: number): Promise<Pedido> {
  return requisicao<Pedido>(`/pedidos/${idPedido}/itens/${idItem}`, { method: 'DELETE' });
}

export const API_URL = baseUrl;

import { Platform } from 'react-native';

const defaultUrl = Platform.OS === 'android'
  ? 'http://10.0.2.2:8080'
  : 'http://localhost:8080';

export const API_BASE_URL = (process.env.EXPO_PUBLIC_API_URL || defaultUrl).replace(/\/$/, '');

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        Accept: 'application/json',
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error(`Não foi possível conectar à API em ${API_BASE_URL}. Verifique se ela está rodando e se o endereço está correto.`);
  }

  const text = await response.text();

  if (!response.ok) {
    throw new ApiError(`A API respondeu com erro (HTTP ${response.status}).`, response.status);
  }

  if (!text.trim()) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error('A API retornou uma resposta que não pôde ser interpretada.');
  }
}

export function buscarProduto(id) {
  return request(`/produtos/${encodeURIComponent(id)}`);
}

export function cadastrarProduto(produto) {
  return request('/produtos', {
    method: 'POST',
    body: JSON.stringify(produto),
  });
}

export function atualizarEstoque(id, qtdDisponivel) {
  return request(`/produtos/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify({ qtdDisponivel }),
  });
}

export function consultarQuantidade(id) {
  return request(`/produtos/${encodeURIComponent(id)}/quantidade`);
}

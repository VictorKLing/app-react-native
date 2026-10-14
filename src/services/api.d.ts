export type Produto = {
  id: number;
  nome: string;
  qtdDisponivel: number;
};

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number);
}

export const API_BASE_URL: string;

export function buscarProduto(id: number): Promise<Produto | null>;
export function cadastrarProduto(produto: Omit<Produto, 'id'>): Promise<Produto>;
export function atualizarEstoque(id: number, qtdDisponivel: number): Promise<Produto | null>;
export function consultarQuantidade(id: number): Promise<number | null>;

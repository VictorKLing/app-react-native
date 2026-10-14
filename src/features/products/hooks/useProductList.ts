import { useCallback, useEffect, useState } from 'react';
import { ApiError, excluirProduto, listarProdutos, type Produto } from '@/services/api';

export type ProductListStatus = 'loading' | 'ready' | 'unavailable' | 'error';

export function useProductList() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [status, setStatus] = useState<ProductListStatus>('loading');
  const [mensagemErro, setMensagemErro] = useState('');

  const carregar = useCallback(async () => {
    setStatus('loading');
    setMensagemErro('');

    try {
      const resultado = await listarProdutos();
      if (!Array.isArray(resultado)) {
        throw new Error('A API não retornou uma lista de produtos válida.');
      }
      setProdutos(resultado);
      setStatus('ready');
    } catch (error) {
      setProdutos([]);
      if (error instanceof ApiError && (error.status === 404 || error.status === 405)) {
        setStatus('unavailable');
      } else {
        setMensagemErro(error instanceof Error ? error.message : 'Ocorreu um erro ao carregar os produtos.');
        setStatus('error');
      }
    }
  }, []);

  const excluir = useCallback(async (id: number) => {
    await excluirProduto(id);
    setProdutos((atuais) => atuais.filter((produto) => produto.id !== id));
  }, []);

  useEffect(() => {
    let ativo = true;
    void Promise.resolve().then(() => {
      if (ativo) return carregar();
      return undefined;
    });
    return () => {
      ativo = false;
    };
  }, [carregar]);

  return { produtos, status, mensagemErro, carregar, excluir };
}

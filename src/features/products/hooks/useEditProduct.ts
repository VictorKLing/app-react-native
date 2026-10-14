import { useCallback, useState } from 'react';
import { atualizarEstoque, buscarProduto, type Produto } from '@/services/api';

export type EditProductStatus = 'idle' | 'loadingProduct' | 'editing' | 'saving' | 'success' | 'notFound' | 'error';

export function useEditProduct() {
  const [produto, setProduto] = useState<Produto | null>(null);
  const [status, setStatus] = useState<EditProductStatus>('idle');
  const [mensagemErro, setMensagemErro] = useState('');

  const consultar = useCallback(async (id: number) => {
    setStatus('loadingProduct');
    setProduto(null);
    setMensagemErro('');

    try {
      const resultado = await buscarProduto(id);
      if (!resultado) {
        setStatus('notFound');
        return;
      }

      setProduto(resultado);
      setStatus('editing');
    } catch (error) {
      setMensagemErro(error instanceof Error ? error.message : 'Ocorreu um erro ao consultar o produto.');
      setStatus('error');
    }
  }, []);

  const salvar = useCallback(async (qtdDisponivel: number) => {
    if (!produto) return;

    setStatus('saving');
    setMensagemErro('');

    try {
      const resultado = await atualizarEstoque(produto.id, qtdDisponivel);
      const produtoAtualizado = resultado ?? await buscarProduto(produto.id);
      if (!produtoAtualizado) {
        throw new Error('A API não retornou o produto atualizado.');
      }

      setProduto(produtoAtualizado);
      setStatus('success');
    } catch (error) {
      setMensagemErro(error instanceof Error ? error.message : 'Ocorreu um erro ao atualizar o produto.');
      setStatus('error');
    }
  }, [produto]);

  const limparMensagem = useCallback(() => {
    if (status === 'success' || status === 'error') setStatus('editing');
    setMensagemErro('');
  }, [status]);

  const reiniciar = useCallback(() => {
    setProduto(null);
    setMensagemErro('');
    setStatus('idle');
  }, []);

  return { produto, status, mensagemErro, consultar, salvar, limparMensagem, reiniciar };
}

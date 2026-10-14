import { useCallback, useState } from 'react';
import { cadastrarProduto, type Produto } from '@/services/api';

export type CreateStatus = 'idle' | 'loading' | 'success' | 'error';

export function useCreateProduct() {
  const [produto, setProduto] = useState<Produto | null>(null);
  const [status, setStatus] = useState<CreateStatus>('idle');
  const [mensagemErro, setMensagemErro] = useState('');

  const cadastrar = useCallback(async (dados: Omit<Produto, 'id'>) => {
    setStatus('loading');
    setProduto(null);
    setMensagemErro('');

    try {
      const resultado = await cadastrarProduto(dados);
      if (!resultado) {
        throw new Error('A API não retornou os dados do produto cadastrado.');
      }

      setProduto(resultado);
      setStatus('success');
    } catch (error) {
      setMensagemErro(error instanceof Error ? error.message : 'Ocorreu um erro ao cadastrar o produto.');
      setStatus('error');
    }
  }, []);

  const limpar = useCallback(() => {
    setProduto(null);
    setMensagemErro('');
    setStatus('idle');
  }, []);

  return { produto, status, mensagemErro, cadastrar, limpar };
}

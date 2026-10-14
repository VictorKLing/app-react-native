import { useCallback, useState } from 'react';
import { buscarProduto, type Produto } from '@/services/api';

export type LookupStatus = 'idle' | 'loading' | 'found' | 'notFound' | 'error';

export function useProductLookup() {
  const [produto, setProduto] = useState<Produto | null>(null);
  const [status, setStatus] = useState<LookupStatus>('idle');
  const [mensagemErro, setMensagemErro] = useState('');

  const consultar = useCallback(async (id: number) => {
    setStatus('loading');
    setProduto(null);
    setMensagemErro('');

    try {
      const resultado = await buscarProduto(id);
      if (resultado === null) {
        setStatus('notFound');
        return;
      }

      setProduto(resultado);
      setStatus('found');
    } catch (error) {
      setMensagemErro(error instanceof Error ? error.message : 'Ocorreu um erro ao consultar o produto.');
      setStatus('error');
    }
  }, []);

  const limpar = useCallback(() => {
    setProduto(null);
    setMensagemErro('');
    setStatus('idle');
  }, []);

  return { produto, status, mensagemErro, consultar, limpar };
}

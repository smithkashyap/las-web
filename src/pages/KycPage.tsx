import { useEffect, useState } from 'react';
import { DynamicRenderer } from '../renderer/DynamicRenderer';
import localKycJson from '../json/kyc.json';
import { Spinner } from '../components/Spinner';
import type { UINode } from '../renderer/types';
import { useUIState } from '../state/uiState';
import { useKycSchema } from '../hooks/useKycSchema';
import { setHandleActionContext } from '../utils/handleAction';

export function KycPage() {
  const [loading, setLoading] = useState(false);
  const { state } = useUIState();
  const { data, isLoading, isError } = useKycSchema();

  useEffect(() => {
    setHandleActionContext({
      getFormData: () => ({
        fullName: typeof state.values.fullName === 'string' ? state.values.fullName : '',
        pan: typeof state.values.pan === 'string' ? state.values.pan : '',
        dob: typeof state.values.dob === 'string' ? state.values.dob : '',
        mobile: typeof state.values.mobile === 'string' ? state.values.mobile : '',
        email: typeof state.values.email === 'string' ? state.values.email : '',
      }),
      setLoading,
    });

    return () => {
      setHandleActionContext({});
    };
  }, []);

  const shouldUseFallback = isError || !data || typeof data !== 'object';

  useEffect(() => {
    if (shouldUseFallback && !isLoading) {
      console.warn('Using local KYC JSON fallback');
    }
  }, [isLoading, shouldUseFallback]);

  if (loading || isLoading) {
    return <Spinner />;
  }

  const schema = shouldUseFallback ? localKycJson : data;

  return <DynamicRenderer node={schema as UINode} />;
}

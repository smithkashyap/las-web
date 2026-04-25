import { useEffect, useState } from 'react';
import type { Portfolio } from 'las-core-sdk';
import { sdk } from '../sdk/initSDK';

export function usePortfolio() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    sdk
      .getPortfolio()
      .then((data) => {
        console.log('data', data)
        if (!cancelled) setPortfolio(data);
      })
      .catch((err) => {
        if (!cancelled) setError(String(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { portfolio, loading, error };
}

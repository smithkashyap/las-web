import { useQuery } from '@tanstack/react-query';
import { sdk } from '../sdk/initSDK';

export function useKycSchema() {
  return useQuery({
    queryKey: ['kyc-schema'],
    queryFn: () => sdk.getKycSchema(),
    retry: 1,
  });
}

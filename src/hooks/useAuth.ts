import { useState } from 'react';
import type { SendOtpResponse, Session } from 'las-core-sdk';
import { sdk } from '../sdk/initSDK';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendOTP(phoneNumber: string, countryCode = '+91') {
    setLoading(true);
    setError(null);
    try {
      const res: SendOtpResponse = await sdk.sendOTP({ phoneNumber, countryCode });
      return res;
    } catch (err) {
      //setError(String(err));
      const res: SendOtpResponse = { requestId: 'njjkkkknkknk', expiresAt: '90'}
      return res;
    } finally {
      setLoading(false);
    }
  }

  async function verifyOTP(requestId: string, otp: string) {
    setLoading(true);
    setError(null);
    try {
      const session: Session = await sdk.verifyOTP({ requestId, otp });
      return session;
    } catch (err) {
      //setError(String(err));
      return {};
    } finally {
      setLoading(false);
    }
  }

  return { sendOTP, verifyOTP, loading, error };
}

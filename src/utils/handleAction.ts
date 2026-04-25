import type { NavigateFunction } from 'react-router-dom';
import type { Action } from '../renderer/types';
import type { UIState } from '../state/uiState';
import { sdk } from '../sdk/initSDK';

export function handleAction(
  action: Action,
  navigate: NavigateFunction,
  setState: (key: string, value: boolean | string) => void,
  _state?: UIState,
): void {
  switch (action.type) {
    case 'navigate':
      navigate(action.payload.route);
      break;

    case 'goBack':
      navigate(-1);
      break;

    case 'setState':
      setState(action.payload.key, action.payload.value);
      break;

    case 'api': {
      const { api, onSuccess, onError } = action.payload;
      let promise: Promise<unknown> | undefined;

      if (api === 'sendOTP') promise = sdk.sendOTP({ phoneNumber: '', countryCode: '+91' });
      else if (api === 'verifyOTP') promise = sdk.verifyOTP({ requestId: '', otp: '' });
      else if (api === 'getPortfolio') promise = sdk.getPortfolio();
      else if (api === 'selfieCheck') promise = new Promise((resolve) => setTimeout(resolve, 1000));

      if (promise) {
        promise
          .then(() => { if (onSuccess) handleAction(onSuccess, navigate, setState, _state); })
          .catch(() => { if (onError) handleAction(onError, navigate, setState, _state); });
      }
      break;
    }
  }
}

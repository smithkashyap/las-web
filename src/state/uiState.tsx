import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

export interface UIState {
  selections: Record<string, string[]>;
  values: Record<string, boolean | string>;
  errors: Record<string, string>;
}

interface UIStateCtx {
  state: UIState;
  toggleSelection: (key: string, value: string) => void;
  getSelections: (key: string) => string[];
  isSelected: (key: string, value: string) => boolean;
  setValue: (key: string, value: boolean | string) => void;
  setSelections: (key: string, values: string[]) => void;
  getBoolean: (key: string) => boolean;
  getString: (key: string) => string;
  setError: (key: string, message: string) => void;
  hasErrors: () => boolean;
}

const Ctx = createContext<UIStateCtx | null>(null);

export function UIStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<UIState>({ selections: {}, values: {}, errors: {} });


  const setError = useCallback((key: string, message: string) => {
    setState((p) => ({
      ...p,
      errors: {
        ...p.errors,
        [key]: message,
      },
    }));
  }, []);

  const hasErrors = useCallback(() => {
    return Object.values(state.errors).some((e) => e !== '');
  }, [state.errors]);
  
  const toggleSelection = useCallback((key: string, val: string) => {
    setState((p) => {
      const cur = p.selections[key] ?? [];
      return {
        ...p,
        selections: {
          ...p.selections,
          [key]: cur.includes(val) ? cur.filter((v) => v !== val) : [...cur, val],
        },
      };
    });
  }, []);

  const getSelections = useCallback((key: string) => state.selections[key] ?? [], [state.selections]);
  const isSelected = useCallback((key: string, val: string) => (state.selections[key] ?? []).includes(val), [state.selections]);

  const setValueFn = useCallback((key: string, val: boolean | string) => {
    setState((p) => ({ ...p, values: { ...p.values, [key]: val } }));
  }, []);

  const setSelections = useCallback((key: string, vals: string[]) => {
    setState((p) => ({ ...p, selections: { ...p.selections, [key]: vals } }));
  }, []);

  const getBoolean = useCallback((key: string) => !!state.values[key], [state.values]);

  const getString = useCallback((key: string) => {
    const v = state.values[key];
    return typeof v === 'string' ? v : '';
  }, [state.values]);

  return (
    <Ctx.Provider value={{ state, toggleSelection, getSelections, isSelected, setValue: setValueFn, setSelections, getBoolean, getString, setError, hasErrors }}>
      {children}
    </Ctx.Provider>
  );
}

export function useUIState(): UIStateCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useUIState must be used within UIStateProvider');
  return ctx;
}

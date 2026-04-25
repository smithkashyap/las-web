import { AppRouter } from './router';
import { UIStateProvider } from './state/uiState';

export function App() {
  return (
    <UIStateProvider>
      <div style={{ minHeight: '100vh', backgroundColor: '#0a0e1a' }}>
        <AppRouter />
      </div>
    </UIStateProvider>
  );
}

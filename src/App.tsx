import { AppRouter } from './router';
import { UIStateProvider } from './state/uiState';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UIStateProvider>
        <div style={{ minHeight: '100vh', backgroundColor: '#0a0e1a' }}>
          <AppRouter />
        </div>
      </UIStateProvider>
    </QueryClientProvider>
  );
}
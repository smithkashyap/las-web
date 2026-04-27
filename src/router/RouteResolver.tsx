import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner } from '../components/Spinner';
import { apiClient } from '../sdk/initSDK';

const DEFAULT_ROUTE = '/kyc';

export const VALID_ROUTES = [
  '/kyc',
  '/otp',
  '/pledge',
  '/connect-portfolio',
  '/portfolio',
  '/eligible-pledge',
  '/kyc-verification',
] as const;

type ValidRoute = (typeof VALID_ROUTES)[number];

interface NavigationInitResponse {
  route?: string | null;
}

function isValidRoute(route: string | null | undefined): route is ValidRoute {
  return Boolean(route && VALID_ROUTES.includes(route as ValidRoute));
}

export function RouteResolver() {
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const fetchInitialRoute = async () => {
      try {
        const response = await apiClient.get<NavigationInitResponse>('/navigation/init');
        const targetRoute = isValidRoute(response.route) ? response.route : DEFAULT_ROUTE;

        if (!cancelled) {
          navigate(targetRoute, { replace: true });
        }
      } catch (error) {
        console.error('Route resolution failed:', error);

        if (!cancelled) {
          navigate(DEFAULT_ROUTE, { replace: true });
        }
      }
    };

    void fetchInitialRoute();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return <Spinner />;
}

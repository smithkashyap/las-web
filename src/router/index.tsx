import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { KycPage } from '../pages/KycPage';
import { OtpPage } from '../pages/OtpPage';
import { PledgePage } from '../pages/PledgePage';
import { ConnectPortfolioPage } from '../pages/ConnectPortfolioPage';
import { PortfolioPage } from '../pages/PortfolioPage';
import { EligiblePledgePage } from '../pages/EligiblePledgePage';
import { KycVerificationPage } from '../pages/KycVerificationPage';
import { RouteResolver } from './RouteResolver';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RouteResolver />} />
        <Route path="/kyc" element={<KycPage />} />
        <Route path="/otp" element={<OtpPage />} />
        <Route path="/pledge" element={<PledgePage />} />
        <Route path="/connect-portfolio" element={<ConnectPortfolioPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/eligible-pledge" element={<EligiblePledgePage />} />
        <Route path="/kyc-verification" element={<KycVerificationPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

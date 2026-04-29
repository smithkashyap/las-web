/**
 * Mock portfolio holdings data.
 * Used by PaginatedList when backend is not ready.
 * Mirrors the same data that was previously hardcoded in portfolio.json.
 */

export interface MockHolding {
  code: string;
  codeBg: string;
  codeColor: string;
  name: string;
  subtitle: string;
  value: string;
  change: string;
  changeColor: string;
}

export const portfolioHoldings: Record<string, MockHolding[]> = {
  shares: [
    { code: 'RIL', codeBg: '#312e81', codeColor: '#818cf8', name: 'Reliance Industries', subtitle: 'INE002A01018 · 45 sh', value: '₹1,14,750', change: '+2.4%', changeColor: '#28A745' },
    { code: 'INF', codeBg: '#7f1d1d', codeColor: '#fca5a5', name: 'Infosys Ltd', subtitle: 'INE009A01021 · 80 sh', value: '₹1,56,800', change: '-0.8%', changeColor: '#B93333' },
    { code: 'TCS', codeBg: '#1e3a5f', codeColor: '#7dd3fc', name: 'Tata Consultancy', subtitle: 'INE467B01029 · 30 sh', value: '₹1,08,000', change: '+1.2%', changeColor: '#28A745' },
    { code: 'HDB', codeBg: '#164e63', codeColor: '#67e8f9', name: 'HDFC Bank', subtitle: 'INE040A01034 · 50 sh', value: '₹82,500', change: '+0.9%', changeColor: '#28A745' },
    { code: 'ITC', codeBg: '#365314', codeColor: '#bef264', name: 'ITC Limited', subtitle: 'INE154A01025 · 200 sh', value: '₹90,000', change: '+0.3%', changeColor: '#28A745' },
    { code: 'SBI', codeBg: '#3b0764', codeColor: '#d8b4fe', name: 'State Bank of India', subtitle: 'INE062A01020 · 60 sh', value: '₹48,000', change: '-1.1%', changeColor: '#B93333' },
    { code: 'BAJ', codeBg: '#78350f', codeColor: '#fbbf24', name: 'Bajaj Finance', subtitle: 'INE296A01024 · 10 sh', value: '₹72,000', change: '+3.5%', changeColor: '#28A745' },
    { code: 'KOT', codeBg: '#7f1d1d', codeColor: '#fca5a5', name: 'Kotak Mahindra', subtitle: 'INE237A01028 · 25 sh', value: '₹45,000', change: '+0.6%', changeColor: '#28A745' },
    { code: 'LT', codeBg: '#1e3a5f', codeColor: '#7dd3fc', name: 'Larsen & Toubro', subtitle: 'INE018A01030 · 15 sh', value: '₹52,500', change: '-0.4%', changeColor: '#B93333' },
    { code: 'ASN', codeBg: '#312e81', codeColor: '#818cf8', name: 'Asian Paints', subtitle: 'INE021A01026 · 20 sh', value: '₹56,000', change: '+1.8%', changeColor: '#28A745' },
    { code: 'MRF', codeBg: '#78350f', codeColor: '#fbbf24', name: 'MRF Ltd', subtitle: 'INE883A01011 · 1 sh', value: '₹1,25,000', change: '+0.2%', changeColor: '#28A745' },
  ],
  mf: [
    { code: 'AXS', codeBg: '#164e63', codeColor: '#67e8f9', name: 'Axis Bluechip Fund', subtitle: '500 units · Growth', value: '₹85,000', change: '+3.1%', changeColor: '#28A745' },
    { code: 'SBI', codeBg: '#3b0764', codeColor: '#d8b4fe', name: 'SBI Small Cap Fund', subtitle: '300 units · Growth', value: '₹42,000', change: '+1.5%', changeColor: '#28A745' },
    { code: 'HDC', codeBg: '#1e3a5f', codeColor: '#7dd3fc', name: 'HDFC Mid-Cap Opp.', subtitle: '200 units · Growth', value: '₹38,000', change: '+2.2%', changeColor: '#28A745' },
    { code: 'MIR', codeBg: '#7f1d1d', codeColor: '#fca5a5', name: 'Mirae Asset Large Cap', subtitle: '150 units · Growth', value: '₹28,500', change: '-0.5%', changeColor: '#B93333' },
    { code: 'PPF', codeBg: '#365314', codeColor: '#bef264', name: 'Parag Parikh Flexi Cap', subtitle: '400 units · Growth', value: '₹62,000', change: '+4.1%', changeColor: '#28A745' },
    { code: 'NIP', codeBg: '#78350f', codeColor: '#fbbf24', name: 'Nippon India Growth', subtitle: '250 units · Growth', value: '₹31,200', change: '+0.8%', changeColor: '#28A745' },
    { code: 'KOT', codeBg: '#312e81', codeColor: '#818cf8', name: 'Kotak Emerging Equity', subtitle: '180 units · Growth', value: '₹24,800', change: '+1.9%', changeColor: '#28A745' },
    { code: 'ICR', codeBg: '#164e63', codeColor: '#67e8f9', name: 'ICICI Pru Balanced', subtitle: '350 units · Growth', value: '₹45,500', change: '+2.7%', changeColor: '#28A745' },
  ],
};

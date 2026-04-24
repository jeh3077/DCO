/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StockData, MarketIndex, StockDetail } from './types';

export const MARKET_INDICES: MarketIndex[] = [
  { name: 'KOSPI', value: 2628.52, change: -12.45, changePercent: -0.47 },
  { name: 'KOSDAQ', value: 852.45, change: 4.12, changePercent: 0.49 },
  { name: 'NASDAQ', value: 16175.09, change: 196.22, changePercent: 1.23 },
  { name: 'S&P 500', value: 5123.41, change: -5.12, changePercent: -0.10 },
  { name: 'USD/KRW', value: 1378.50, change: 4.20, changePercent: 0.31 },
];

export const STOCKS: StockData[] = [
  { id: '1', name: '삼성전자', symbol: '005930', price: 77500, change: 1200, changePercent: 1.57, market: 'Domestic' },
  { id: '2', name: 'SK하이닉스', symbol: '000660', price: 182400, change: 6200, changePercent: 3.52, market: 'Domestic' },
  { id: '3', name: 'NAVER', symbol: '035420', price: 186500, change: -1500, changePercent: -0.80, market: 'Domestic' },
  { id: '4', name: 'Apple Inc.', symbol: 'AAPL', price: 172.62, change: 4.12, changePercent: 2.45, market: 'Overseas' },
  { id: '5', name: 'NVIDIA', symbol: 'NVDA', price: 142.12, change: 12.30, changePercent: 9.47, market: 'Overseas' },
  { id: '6', name: 'KODEX 200', symbol: '069500', price: 35620, change: 450, changePercent: 1.28, market: 'ETF' },
  { id: '7', name: 'TIGER 미국나스닥100', symbol: '133690', price: 104500, change: 1200, changePercent: 1.16, market: 'ETF' },
];

export const TOP_MOVERS: StockData[] = [
  { id: '8', name: '에코프로비엠', symbol: '247540', price: 214500, change: 26500, changePercent: 14.1, market: 'Domestic' },
  { id: '9', name: 'HLB', symbol: '028300', price: 98200, change: 8700, changePercent: 9.7, market: 'Domestic' },
  { id: '10', name: '레인보우로보틱스', symbol: '277810', price: 182400, change: 14300, changePercent: 8.5, market: 'Domestic' },
  { id: '11', name: '셀트리온', symbol: '068270', price: 188000, change: -10300, changePercent: -5.2, market: 'Domestic' },
];

export const getStockDetail = (id: string): StockDetail => {
  const base = STOCKS.find(s => s.id === id) || STOCKS[0];
  return {
    ...base,
    open: base.price * 0.99,
    high: base.price * 1.02,
    low: base.price * 0.98,
    volume: '14.2M',
    avgVolume: '15.1M',
    mktCap: '₩438.18T',
    high52w: 79800,
    low52w: 54500,
    divYield: '1.96%',
    revenueTTM: '₩258.93T',
    growthYoY: '2.4%',
    operatingProfitTTM: '₩14.62T',
    operatingMargin: '5.64%',
    roe: '8.42%',
    peRatio: '15.8x',
    sectorAvgPE: '18.2x',
    history: Array.from({ length: 20 }, (_, i) => ({
      time: `${i}:00`,
      price: base.price * (0.95 + Math.random() * 0.1)
    })),
    financials: [
      { year: 2021, revenue: 279.6, operatingProfit: 51.6 },
      { year: 2022, revenue: 302.2, operatingProfit: 43.4 },
      { year: 2023, revenue: 258.9, operatingProfit: 6.6 },
    ]
  };
};

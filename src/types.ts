/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface StockData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  market: 'Domestic' | 'Overseas' | 'ETF';
  logo?: string;
}

export interface MarketIndex {
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

export interface FinancialMetric {
  year: number;
  revenue: number;
  operatingProfit: number;
}

export interface MarketData {
  indices: MarketIndex[];
  stocks: { symbol: string; price: number; change: number; changePercent: number }[];
  forex: MarketIndex[];
}

export interface StockDetail extends StockData {
  open: number;
  high: number;
  low: number;
  volume: string;
  avgVolume: string;
  mktCap: string;
  high52w: number;
  low52w: number;
  divYield: string;
  revenueTTM: string;
  growthYoY: string;
  operatingProfitTTM: string;
  operatingMargin: string;
  roe: string;
  peRatio: string;
  sectorAvgPE: string;
  history: { time: string; price: number }[];
  financials: FinancialMetric[];
}

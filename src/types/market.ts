export interface TickerItem {
  id: string;
  symbol: string;
  name: string;
  shortName?: string;
  exchange: string;
  price: number;
  change: number;
  changePercent: number;
  currency: string;
  trend: 'up' | 'down';
  volume: string;
  marketCap?: string;
  pe?: string;
  high52?: number;
  low52?: number;
  open: number;
  high: number;
  low: number;
  sparkline: number[];
  category: 'indices' | 'cn_stocks' | 'world_stocks' | 'crypto' | 'futures' | 'forex' | 'bonds' | 'etfs';
  subCategory?: string; // e.g., 'leaders', 'volume_leaders', 'top_gainers', 'commodities', 'currencies'
  badgeColor?: string;
  avatarText?: string;
}

export interface CalendarEvent {
  id: string;
  time: string;
  country: string;
  category: 'macro' | 'earnings';
  importance: number; // 1, 2, 3
  title: string;
  subtitle?: string;
  previous?: string;
  forecast?: string;
  actual?: string;
  tag: string;
  statusText: string;
  statusType: 'upcoming' | 'released' | 'after_market';
  period: 'today' | 'week';
}

export type Timeframe = '1D' | '5D' | '1M' | '3M' | '6M' | '1Y' | '5Y' | 'ALL';
export type ChartType = 'area' | 'candle' | 'line';

export interface ChartDataPoint {
  index: number;
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  vol: number;
  isUp: boolean;
  ma5?: number;
  ma20?: number;
}

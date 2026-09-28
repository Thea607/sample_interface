import { ChartDataPoint, Timeframe } from '../types/market';

export function generateChartPoints(basePrice: number, isTrendUp: boolean, timeframe: Timeframe): ChartDataPoint[] {
  const pointsCountMap: Record<Timeframe, { count: number; intervalLabel: string; volatility: number }> = {
    '1D': { count: 36, intervalLabel: '5分', volatility: 0.004 },
    '5D': { count: 45, intervalLabel: '30分', volatility: 0.008 },
    '1M': { count: 30, intervalLabel: '日K', volatility: 0.015 },
    '3M': { count: 45, intervalLabel: '日K', volatility: 0.022 },
    '6M': { count: 55, intervalLabel: '日K', volatility: 0.032 },
    '1Y': { count: 65, intervalLabel: '周K', volatility: 0.045 },
    '5Y': { count: 80, intervalLabel: '月K', volatility: 0.065 },
    'ALL': { count: 100, intervalLabel: '月K', volatility: 0.090 },
  };

  const config = pointsCountMap[timeframe] || pointsCountMap['1M'];
  const count = config.count;
  const drift = isTrendUp ? 0.004 : -0.003;
  const volRange = basePrice * config.volatility;

  // Generate backwards so final point ends up exactly at basePrice
  const closes: number[] = new Array(count);
  closes[count - 1] = basePrice;

  for (let i = count - 2; i >= 0; i--) {
    const shock = (Math.random() - 0.48 + drift) * volRange;
    closes[i] = Math.max(basePrice * 0.1, closes[i + 1] - shock);
  }

  const result: ChartDataPoint[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const close = closes[i];
    const prevClose = i > 0 ? closes[i - 1] : close * (1 - drift);
    const open = prevClose + (Math.random() - 0.5) * (volRange * 0.3);
    const high = Math.max(open, close) + Math.random() * (volRange * 0.4);
    const low = Math.min(open, close) - Math.random() * (volRange * 0.4);
    const vol = Math.floor(Math.random() * 9500) + 1200;

    // Date computation
    let dateStr = '';
    if (timeframe === '1D') {
      const minutesAgo = (count - 1 - i) * 6;
      const d = new Date(now.getTime() - minutesAgo * 60000);
      dateStr = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    } else if (timeframe === '5D') {
      const hoursAgo = (count - 1 - i) * 2;
      const d = new Date(now.getTime() - hoursAgo * 3600000);
      dateStr = `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:00`;
    } else {
      const daysAgo = (count - 1 - i) * (timeframe === '1M' ? 1 : timeframe === '3M' ? 2 : timeframe === '6M' ? 3 : 7);
      const d = new Date(now.getTime() - daysAgo * 86400000);
      dateStr = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
    }

    result.push({
      index: i,
      timestamp: dateStr,
      open,
      high,
      low,
      close,
      vol,
      isUp: close >= open,
    });
  }

  // Calculate Moving Averages (MA5, MA20)
  for (let i = 0; i < result.length; i++) {
    if (i >= 4) {
      let sum5 = 0;
      for (let j = i - 4; j <= i; j++) sum5 += result[j].close;
      result[i].ma5 = sum5 / 5;
    }
    if (i >= 19) {
      let sum20 = 0;
      for (let j = i - 19; j <= i; j++) sum20 += result[j].close;
      result[i].ma20 = sum20 / 20;
    }
  }

  return result;
}

export function formatPrice(val: number, currency: string = ''): string {
  if (val === undefined || isNaN(val)) return '--';
  const prefix = currency ? currency : '';
  if (val >= 1000) {
    return prefix + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  } else if (val >= 10) {
    return prefix + val.toFixed(2);
  } else if (val >= 1) {
    return prefix + val.toFixed(2);
  } else {
    return prefix + val.toFixed(4);
  }
}

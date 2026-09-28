import React, { useState, useEffect, useMemo, useRef } from 'react';
import { X, ExternalLink, Star, Layers, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { TickerItem, Timeframe, ChartType, ChartDataPoint } from '../types/market';
import { generateChartPoints, formatPrice } from '../utils/chartData';

interface InteractiveChartModalProps {
  ticker: TickerItem | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (tickerId: string) => void;
  onOpenTrade: (ticker: TickerItem) => void;
}

export const InteractiveChartModal: React.FC<InteractiveChartModalProps> = ({
  ticker,
  onClose,
  isFavorite,
  onToggleFavorite,
  onOpenTrade,
}) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('1M');
  const [chartType, setChartType] = useState<ChartType>('area');
  const [showIndicators, setShowIndicators] = useState(true);
  const [hoveredPoint, setHoveredPoint] = useState<ChartDataPoint | null>(null);
  const [crosshairPos, setCrosshairPos] = useState<{ x: number; y: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Generate chart points when ticker or timeframe changes
  const chartPoints = useMemo(() => {
    if (!ticker) return [];
    return generateChartPoints(ticker.price, ticker.trend === 'up', timeframe);
  }, [ticker, timeframe]);

  // Keep latest point as default tooltip when not hovering
  const activeTooltipPoint = hoveredPoint || (chartPoints.length > 0 ? chartPoints[chartPoints.length - 1] : null);

  // Keyboard escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!ticker) return null;

  const isUp = ticker.trend === 'up';
  const mainColor = isUp ? '#089981' : '#f23645';

  // SVG Geometry Dimensions
  const svgW = 860;
  const svgH = 320;
  const paddingRight = 65;
  const paddingBottom = 40;
  const paddingTop = 25;
  const chartWidth = svgW - paddingRight;
  const chartHeight = svgH - paddingBottom - paddingTop;

  // Min / Max computation
  let minP = Infinity;
  let maxP = -Infinity;
  let maxVol = 1;

  chartPoints.forEach((p) => {
    if (p.low < minP) minP = p.low;
    if (p.high > maxP) maxP = p.high;
    if (p.vol > maxVol) maxVol = p.vol;
  });

  const pRange = maxP - minP || 1;
  const getY = (val: number) => paddingTop + chartHeight - ((val - minP) / pRange) * chartHeight;
  const stepX = chartPoints.length > 1 ? chartWidth / (chartPoints.length - 1) : chartWidth;

  // Area & Line path calculation
  let linePathD = '';
  chartPoints.forEach((p, idx) => {
    const x = idx * stepX;
    const y = getY(p.close);
    if (idx === 0) linePathD += `M ${x} ${y}`;
    else linePathD += ` L ${x} ${y}`;
  });

  const areaPathD =
    chartPoints.length > 0
      ? `${linePathD} L ${(chartPoints.length - 1) * stepX} ${svgH - paddingBottom} L 0 ${svgH - paddingBottom} Z`
      : '';

  // MA5 and MA20 paths
  let ma5PathD = '';
  let ma20PathD = '';
  if (showIndicators) {
    chartPoints.forEach((p, idx) => {
      const x = idx * stepX;
      if (p.ma5 !== undefined) {
        const y5 = getY(p.ma5);
        if (!ma5PathD) ma5PathD += `M ${x} ${y5}`;
        else ma5PathD += ` L ${x} ${y5}`;
      }
      if (p.ma20 !== undefined) {
        const y20 = getY(p.ma20);
        if (!ma20PathD) ma20PathD += `M ${x} ${y20}`;
        else ma20PathD += ` L ${x} ${y20}`;
      }
    });
  }

  // Handle Mouse Move for Crosshair
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || chartPoints.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * svgW;
    const mouseY = ((e.clientY - rect.top) / rect.height) * svgH;

    if (mouseX < 0 || mouseX > chartWidth || mouseY < paddingTop || mouseY > svgH - paddingBottom) {
      setHoveredPoint(null);
      setCrosshairPos(null);
      return;
    }

    const nearestIdx = Math.max(0, Math.min(chartPoints.length - 1, Math.round(mouseX / stepX)));
    const p = chartPoints[nearestIdx];
    const snapX = nearestIdx * stepX;
    const snapY = getY(p.close);

    setHoveredPoint(p);
    setCrosshairPos({ x: snapX, y: snapY });
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
    setCrosshairPos(null);
  };

  // Y-axis label steps
  const yLabels = [0, 1, 2, 3, 4].map((i) => maxP - (pRange / 4) * i);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#131722]/60 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-[960px] bg-white rounded-2xl border border-[#e0e3eb] shadow-2xl flex flex-col overflow-hidden max-h-[92vh] z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#e0e3eb] flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white">
          <div className="flex items-center space-x-3.5">
            <div
              style={{ backgroundColor: ticker.badgeColor || '#131722' }}
              className="w-10 h-10 rounded-xl text-white font-bold flex items-center justify-center text-sm shadow-xs"
            >
              {ticker.avatarText || ticker.symbol.slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-[#131722]">{ticker.name}</h2>
                <span className="text-xs px-2 py-0.5 rounded bg-[#f8f9fd] text-[#787b86] border border-[#e0e3eb] font-medium">
                  {ticker.exchange}
                </span>
              </div>
              <div className="flex items-baseline space-x-2.5 mt-0.5">
                <span className="text-2xl font-extrabold tabular-nums text-[#131722]">
                  {formatPrice(ticker.price, ticker.currency)}
                </span>
                <span
                  className={`text-xs font-semibold tabular-nums flex items-center ${
                    isUp ? 'text-[#089981]' : 'text-[#f23645]'
                  }`}
                >
                  {isUp ? '+' : ''}
                  {ticker.change.toFixed(2)}
                </span>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                    isUp
                      ? 'bg-[rgba(8,153,129,0.08)] text-[#089981]'
                      : 'bg-[rgba(242,54,69,0.08)] text-[#f23645]'
                  }`}
                >
                  {isUp ? '+' : ''}
                  {ticker.changePercent.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3 self-end md:self-center">
            {/* Open Full Superchart */}
            <a
              href="#full-chart"
              onClick={(e) => {
                e.preventDefault();
                alert(`正在为您加载 ${ticker.name} (${ticker.symbol}) 完整超级图表工作台与全套专业技术指标...`);
              }}
              className="hidden sm:inline-flex items-center space-x-1.5 text-xs font-semibold text-[#2962ff] hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 transition-colors"
            >
              <span>打开完整超级图表</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {/* Watchlist toggle */}
            <button
              onClick={() => onToggleFavorite(ticker.id)}
              className={`flex items-center space-x-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                isFavorite
                  ? 'border-amber-300 bg-amber-50 text-amber-700'
                  : 'border-[#e0e3eb] hover:bg-[#f0f3fa] text-[#131722]'
              }`}
            >
              <Star
                className={`w-4 h-4 ${isFavorite ? 'text-amber-500 fill-amber-400' : 'text-[#787b86]'}`}
              />
              <span className="hidden sm:inline">{isFavorite ? '已自选' : '加自选'}</span>
            </button>

            {/* Quick Trade Button */}
            <button
              onClick={() => onOpenTrade(ticker)}
              className="flex items-center space-x-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#2962ff] hover:bg-blue-600 text-white transition-colors cursor-pointer"
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>交易</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label="关闭"
              className="p-1.5 rounded-lg text-[#787b86] hover:text-[#131722] hover:bg-[#f0f3fa] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar: Timeframe + Chart Type + Indicators */}
        <div className="px-5 py-2.5 bg-[#f8f9fd] border-b border-[#e0e3eb] flex items-center justify-between text-xs font-medium overflow-x-auto custom-scrollbar">
          {/* Timeframe Buttons */}
          <div className="flex items-center space-x-1 shrink-0">
            {(['1D', '5D', '1M', '3M', '6M', '1Y', '5Y', 'ALL'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  timeframe === tf
                    ? 'bg-white text-[#2962ff] font-bold shadow-2xs border border-[#e0e3eb]'
                    : 'text-[#787b86] hover:text-[#131722] hover:bg-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Chart Types & Indicator Toggles */}
          <div className="flex items-center space-x-1.5 ml-4 pl-3 border-l border-[#e0e3eb] shrink-0">
            {/* Area */}
            <button
              onClick={() => setChartType('area')}
              className={`p-1.5 rounded cursor-pointer border ${
                chartType === 'area'
                  ? 'bg-white text-[#2962ff] border-[#e0e3eb] shadow-2xs'
                  : 'text-[#787b86] hover:text-[#131722] hover:bg-white border-transparent'
              }`}
              title="面积图"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M3 20h18M3 16l4-6 4 3 6-9 4 5v7H3z" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Candle */}
            <button
              onClick={() => setChartType('candle')}
              className={`p-1.5 rounded cursor-pointer border ${
                chartType === 'candle'
                  ? 'bg-white text-[#2962ff] border-[#e0e3eb] shadow-2xs'
                  : 'text-[#787b86] hover:text-[#131722] hover:bg-white border-transparent'
              }`}
              title="蜡烛图 / K线"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect height="10" rx="0.5" width="4" x="5" y="6" />
                <line x1="7" x2="7" y1="2" y2="6" />
                <line x1="7" x2="7" y1="16" y2="22" />
                <rect height="7" rx="0.5" width="4" x="15" y="8" />
                <line x1="17" x2="17" y1="4" y2="8" />
                <line x1="17" x2="17" y1="15" y2="20" />
              </svg>
            </button>

            {/* Line */}
            <button
              onClick={() => setChartType('line')}
              className={`p-1.5 rounded cursor-pointer border ${
                chartType === 'line'
                  ? 'bg-white text-[#2962ff] border-[#e0e3eb] shadow-2xs'
                  : 'text-[#787b86] hover:text-[#131722] hover:bg-white border-transparent'
              }`}
              title="折线图"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M3 18l5-6 4 4 6-10 3 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Indicators Toggle */}
            <button
              onClick={() => setShowIndicators(!showIndicators)}
              className={`flex items-center space-x-1 px-2 py-1 rounded text-xs cursor-pointer border ml-2 ${
                showIndicators
                  ? 'bg-blue-50 text-[#2962ff] border-blue-200'
                  : 'text-[#787b86] hover:bg-white border-transparent'
              }`}
              title="均线技术指标 (MA5/MA20)"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">均线</span>
            </button>
          </div>
        </div>

        {/* Chart Viewport Canvas */}
        <div className="relative bg-white flex-1 p-4 pb-1 select-none overflow-hidden">
          {/* Live Floating Info Tooltip */}
          {activeTooltipPoint && (
            <div className="absolute top-2 left-6 z-20 bg-white/95 backdrop-blur-xs border border-[#e0e3eb] rounded-lg px-3 py-1.5 text-xs shadow-md flex items-center space-x-3 pointer-events-none tabular-nums text-[#131722]">
              <span className="text-[#787b86] font-medium">{activeTooltipPoint.timestamp}</span>
              <div>
                <span className="text-[#787b86]">开:</span>{' '}
                <span className="font-bold">{formatPrice(activeTooltipPoint.open, ticker.currency)}</span>
              </div>
              <div>
                <span className="text-[#787b86]">高:</span>{' '}
                <span className="font-bold text-[#089981]">
                  {formatPrice(activeTooltipPoint.high, ticker.currency)}
                </span>
              </div>
              <div>
                <span className="text-[#787b86]">低:</span>{' '}
                <span className="font-bold text-[#f23645]">
                  {formatPrice(activeTooltipPoint.low, ticker.currency)}
                </span>
              </div>
              <div>
                <span className="text-[#787b86]">收:</span>{' '}
                <span className="font-bold">{formatPrice(activeTooltipPoint.close, ticker.currency)}</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-[#787b86]">量:</span>{' '}
                <span className="font-semibold text-[#787b86]">
                  {activeTooltipPoint.vol.toLocaleString()}手
                </span>
              </div>
              {showIndicators && activeTooltipPoint.ma5 && (
                <div className="hidden md:flex items-center space-x-2 border-l border-gray-200 pl-2">
                  <span className="text-amber-500 font-semibold">
                    MA5: {formatPrice(activeTooltipPoint.ma5, ticker.currency)}
                  </span>
                  {activeTooltipPoint.ma20 && (
                    <span className="text-purple-600 font-semibold">
                      MA20: {formatPrice(activeTooltipPoint.ma20, ticker.currency)}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Main Chart SVG Canvas */}
          <div className="relative w-full h-[280px] sm:h-[320px]">
            <svg
              ref={svgRef}
              className="w-full h-full cursor-crosshair overflow-visible"
              viewBox={`0 0 ${svgW} ${svgH}`}
              preserveAspectRatio="none"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <defs>
                <linearGradient id="chart-area-grad-up" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#089981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#089981" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="chart-area-grad-down" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#f23645" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#f23645" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines */}
              {[0, 1, 2, 3, 4].map((i) => {
                const y = paddingTop + (chartHeight / 4) * i;
                return (
                  <line
                    key={i}
                    x1="0"
                    x2={chartWidth}
                    y1={y}
                    y2={y}
                    stroke="#f0f3fa"
                    strokeDasharray="3,3"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Volume Bars */}
              {chartPoints.map((p, idx) => {
                const barW = Math.max(2, (chartWidth / chartPoints.length) * 0.65);
                const x = idx * stepX - barW / 2;
                const vHeight = (p.vol / maxVol) * 45;
                const y = svgH - paddingBottom - vHeight;
                return (
                  <rect
                    key={`vol-${idx}`}
                    x={x}
                    y={y}
                    width={barW}
                    height={vHeight}
                    fill={p.isUp ? 'rgba(8, 153, 129, 0.3)' : 'rgba(242, 54, 69, 0.3)'}
                    rx="1"
                  />
                );
              })}

              {/* Series Render */}
              {chartType === 'candle' ? (
                // Candlestick
                chartPoints.map((p, idx) => {
                  const x = idx * stepX;
                  const yOpen = getY(p.open);
                  const yClose = getY(p.close);
                  const yHigh = getY(p.high);
                  const yLow = getY(p.low);
                  const top = Math.min(yOpen, yClose);
                  const bodyH = Math.max(2, Math.abs(yClose - yOpen));
                  const color = p.isUp ? '#089981' : '#f23645';
                  const barW = Math.max(2, (chartWidth / chartPoints.length) * 0.65);

                  return (
                    <g key={`candle-${idx}`}>
                      {/* Wick */}
                      <line
                        x1={x}
                        x2={x}
                        y1={yHigh}
                        y2={yLow}
                        stroke={color}
                        strokeWidth="1.5"
                      />
                      {/* Body */}
                      <rect
                        x={x - barW / 2}
                        y={top}
                        width={barW}
                        height={bodyH}
                        fill={color}
                        rx="0.5"
                      />
                    </g>
                  );
                })
              ) : (
                // Area or Line
                <>
                  {chartType === 'area' && (
                    <path
                      d={areaPathD}
                      fill={isUp ? 'url(#chart-area-grad-up)' : 'url(#chart-area-grad-down)'}
                    />
                  )}
                  <path
                    d={linePathD}
                    fill="none"
                    stroke={mainColor}
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </>
              )}

              {/* MA Indicator Overlays */}
              {showIndicators && ma5PathD && (
                <path
                  d={ma5PathD}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="1.5"
                  strokeDasharray="2,2"
                />
              )}
              {showIndicators && ma20PathD && (
                <path
                  d={ma20PathD}
                  fill="none"
                  stroke="#9333ea"
                  strokeWidth="1.5"
                />
              )}

              {/* Crosshair & Tracking Dot */}
              {crosshairPos && (
                <g>
                  {/* Horizontal Line */}
                  <line
                    x1="0"
                    x2={chartWidth}
                    y1={crosshairPos.y}
                    y2={crosshairPos.y}
                    stroke="#787b86"
                    strokeDasharray="3,3"
                    strokeWidth="1"
                  />
                  {/* Vertical Line */}
                  <line
                    x1={crosshairPos.x}
                    x2={crosshairPos.x}
                    y1={paddingTop}
                    y2={svgH - paddingBottom}
                    stroke="#787b86"
                    strokeDasharray="3,3"
                    strokeWidth="1"
                  />
                  {/* Intersect Dot */}
                  <circle
                    cx={crosshairPos.x}
                    cy={crosshairPos.y}
                    r="4"
                    fill="#2962ff"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />

                  {/* Y-axis Crosshair Badge */}
                  <rect
                    x={chartWidth + 4}
                    y={crosshairPos.y - 10}
                    width={56}
                    height={20}
                    rx="3"
                    fill="#131722"
                  />
                  <text
                    x={chartWidth + 32}
                    y={crosshairPos.y + 3}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="10"
                    fontFamily="monospace"
                  >
                    {activeTooltipPoint?.close.toFixed(2)}
                  </text>
                </g>
              )}
            </svg>

            {/* Y-Axis Static Price Labels */}
            <div className="absolute right-0 top-6 bottom-10 w-14 flex flex-col justify-between items-end pr-1 text-[10px] text-[#787b86] tabular-nums pointer-events-none">
              {yLabels.map((lbl, idx) => (
                <span key={idx}>{lbl > 1000 ? lbl.toFixed(1) : lbl.toFixed(2)}</span>
              ))}
            </div>
          </div>

          {/* X-Axis Timeline Labels */}
          <div className="flex justify-between items-center text-[10px] text-[#787b86] px-4 pt-1 border-t border-gray-100">
            <span>{chartPoints[0]?.timestamp || '09:30'}</span>
            <span>{chartPoints[Math.floor(chartPoints.length * 0.25)]?.timestamp || '10:30'}</span>
            <span>{chartPoints[Math.floor(chartPoints.length * 0.5)]?.timestamp || '11:30'}</span>
            <span>{chartPoints[Math.floor(chartPoints.length * 0.75)]?.timestamp || '14:00'}</span>
            <span>{chartPoints[chartPoints.length - 1]?.timestamp || '15:00'}</span>
          </div>
        </div>

        {/* Modal Footer: Key Statistics & Action Bar */}
        <div className="px-5 py-4 border-t border-[#e0e3eb] bg-[#fafbfd]">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3 text-xs mb-3">
            <div>
              <span className="text-[#787b86] block text-[11px]">今开</span>
              <span className="font-bold tabular-nums text-[#131722]">
                {formatPrice(ticker.open, ticker.currency)}
              </span>
            </div>
            <div>
              <span className="text-[#787b86] block text-[11px]">最高</span>
              <span className="font-bold tabular-nums text-[#089981]">
                {formatPrice(ticker.high, ticker.currency)}
              </span>
            </div>
            <div>
              <span className="text-[#787b86] block text-[11px]">最低</span>
              <span className="font-bold tabular-nums text-[#f23645]">
                {formatPrice(ticker.low, ticker.currency)}
              </span>
            </div>
            <div>
              <span className="text-[#787b86] block text-[11px]">成交量</span>
              <span className="font-bold tabular-nums text-[#131722]">{ticker.volume}</span>
            </div>
            <div>
              <span className="text-[#787b86] block text-[11px]">总市值</span>
              <span className="font-bold tabular-nums text-[#131722]">{ticker.marketCap || '--'}</span>
            </div>
            <div>
              <span className="text-[#787b86] block text-[11px]">市盈率(TTM)</span>
              <span className="font-bold tabular-nums text-[#131722]">{ticker.pe || '--'}</span>
            </div>
            <div>
              <span className="text-[#787b86] block text-[11px]">52周最高</span>
              <span className="font-bold tabular-nums text-[#131722]">
                {ticker.high52 ? formatPrice(ticker.high52, ticker.currency) : '--'}
              </span>
            </div>
            <div>
              <span className="text-[#787b86] block text-[11px]">52周最低</span>
              <span className="font-bold tabular-nums text-[#131722]">
                {ticker.low52 ? formatPrice(ticker.low52, ticker.currency) : '--'}
              </span>
            </div>
          </div>

          {/* Action Footer Links */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-200/60 text-xs">
            <div className="flex items-center space-x-3 text-[#787b86]">
              <span className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-[#089981] mr-1.5 animate-pulse"></span>
                行情实时连接
              </span>
              <span className="hidden sm:inline">· 交易时间 09:30 - 15:00 / 连续交易</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowIndicators(!showIndicators)}
                className="px-3 py-1 rounded bg-[#f0f3fa] hover:bg-[#e4e7ee] text-[#131722] font-medium transition-colors cursor-pointer"
              >
                {showIndicators ? '隐藏均线' : '显示均线'}
              </button>
              <button
                onClick={() => onOpenTrade(ticker)}
                className="px-3.5 py-1 rounded bg-[#2962ff] text-white font-medium hover:bg-blue-600 transition-colors shadow-2xs cursor-pointer"
              >
                立即交易
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

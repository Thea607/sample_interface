import React from 'react';
import { ChevronRight } from 'lucide-react';
import { TickerItem } from '../types/market';
import { formatPrice } from '../utils/chartData';

interface ChinaStocksSectionProps {
  stocks: TickerItem[];
  onSelectTicker: (ticker: TickerItem) => void;
  onViewAll?: () => void;
}

export const ChinaStocksSection: React.FC<ChinaStocksSectionProps> = ({
  stocks,
  onSelectTicker,
  onViewAll,
}) => {
  const leaders = stocks.filter((s) => s.subCategory === 'leaders');
  const volumeLeaders = stocks.filter((s) => s.subCategory === 'volume_leaders');
  const topGainers = stocks.filter((s) => s.subCategory === 'top_gainers');

  return (
    <section className="mb-10">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => leaders[0] && onSelectTicker(leaders[0])}
          className="inline-flex items-center group space-x-1.5 text-2xl font-bold text-[#131722] hover:text-[#2962ff] transition-colors cursor-pointer"
        >
          <span>中国股票</span>
          <ChevronRight className="w-5 h-5 text-[#787b86] group-hover:text-[#2962ff] group-hover:translate-x-0.5 transition-all mt-0.5" />
        </button>

        <div className="flex items-center space-x-2 text-sm text-[#787b86]">
          <button
            onClick={onViewAll}
            className="cursor-pointer hover:text-[#131722] font-medium transition-colors"
          >
            查看全部中国股票 (5,000+)
          </button>
        </div>
      </div>

      {/* Grid Layout: Left Big Movers, Right 2 Sub-panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Table: 市值龙头与核心标的 (7 cols) */}
        <div className="lg:col-span-7 border border-[#e0e3eb] rounded-xl p-5 bg-white shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#e0e3eb] mb-3">
            <h3 className="text-base font-bold text-[#131722]">市值龙头与核心标的</h3>
            <span className="text-xs text-[#787b86]">实时估价 · CNY</span>
          </div>

          <div className="divide-y divide-gray-100">
            {leaders.map((stock) => {
              const isUp = stock.trend === 'up';
              return (
                <div
                  key={stock.id}
                  onClick={() => onSelectTicker(stock)}
                  className="py-3 flex items-center justify-between hover:bg-[#f0f3fa] rounded-lg px-2 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      style={{ backgroundColor: stock.badgeColor || '#dc2626' }}
                      className="w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs"
                    >
                      {stock.avatarText || stock.name.slice(0, 1)}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-[#131722] group-hover:text-[#2962ff] transition-colors">
                        {stock.name}
                      </div>
                      <div className="text-xs text-[#787b86]">{stock.exchange}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-sm tabular-nums text-[#131722]">
                      {formatPrice(stock.price, stock.currency)}
                    </div>
                    <div
                      className={`text-xs font-semibold tabular-nums ${
                        isUp ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isUp ? '+' : ''}
                      {stock.changePercent.toFixed(2)}% ({isUp ? '+' : ''}
                      {stock.change.toFixed(2)})
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Two Sub-panels (5 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          {/* Sub-panel 1: 成交活跃榜 (Volume Leaders) */}
          <div className="border border-[#e0e3eb] rounded-xl p-5 bg-white shadow-2xs">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#e0e3eb]">
              <h4 className="text-sm font-bold text-[#131722] flex items-center">
                <span className="w-2 h-2 rounded-full bg-[#2962ff] mr-2"></span>
                成交活跃榜 (Volume Leaders)
              </h4>
              <button
                onClick={onViewAll}
                className="text-xs text-[#2962ff] font-medium hover:underline cursor-pointer"
              >
                查看列表
              </button>
            </div>

            <div className="space-y-3">
              {volumeLeaders.map((item) => {
                const isUp = item.trend === 'up';
                return (
                  <div
                    key={item.id}
                    onClick={() => onSelectTicker(item)}
                    className="flex items-center justify-between text-xs p-1.5 rounded hover:bg-[#f0f3fa] transition cursor-pointer group"
                  >
                    <div>
                      <span className="font-bold text-[#131722] group-hover:text-[#2962ff] text-sm block transition-colors">
                        {item.name}
                      </span>
                      <span className="text-[#787b86]">
                        {item.symbol} · {item.volume}
                      </span>
                    </div>
                    <div className="text-right">
                      <span
                        className={`font-bold tabular-nums text-sm block ${
                          isUp ? 'text-[#089981]' : 'text-[#f23645]'
                        }`}
                      >
                        {isUp ? '+' : ''}
                        {item.changePercent.toFixed(2)}%
                      </span>
                      <span className="text-[#787b86] tabular-nums">
                        {formatPrice(item.price, item.currency)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sub-panel 2: 今日强势涨幅榜 */}
          <div className="border border-[#e0e3eb] rounded-xl p-5 bg-white shadow-2xs">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#e0e3eb]">
              <h4 className="text-sm font-bold text-[#131722] flex items-center">
                <span className="w-2 h-2 rounded-full bg-[#089981] mr-2"></span>
                今日强势涨幅榜
              </h4>
              <button
                onClick={onViewAll}
                className="text-xs text-[#2962ff] font-medium hover:underline cursor-pointer"
              >
                全市场异动
              </button>
            </div>

            <div className="space-y-3">
              {topGainers.map((item) => {
                const isUp = item.trend === 'up';
                return (
                  <div
                    key={item.id}
                    onClick={() => onSelectTicker(item)}
                    className="flex items-center justify-between text-xs p-1.5 rounded hover:bg-[#f0f3fa] transition cursor-pointer group"
                  >
                    <div>
                      <span className="font-bold text-[#131722] group-hover:text-[#2962ff] text-sm block transition-colors">
                        {item.name}
                      </span>
                      <span className="text-[#787b86]">
                        {item.symbol} · {item.exchange.split('·')[1]?.trim() || '高成长'}
                      </span>
                    </div>
                    <div className="text-right">
                      <span
                        className={`font-bold tabular-nums text-sm block ${
                          isUp ? 'text-[#089981]' : 'text-[#f23645]'
                        }`}
                      >
                        +{item.changePercent.toFixed(2)}%
                      </span>
                      <span className="text-[#787b86] tabular-nums">
                        {formatPrice(item.price, item.currency)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

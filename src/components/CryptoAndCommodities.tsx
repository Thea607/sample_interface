import React from 'react';
import { ChevronRight } from 'lucide-react';
import { TickerItem } from '../types/market';
import { formatPrice } from '../utils/chartData';

interface CryptoAndCommoditiesProps {
  cryptoList: TickerItem[];
  futuresForexList: TickerItem[];
  onSelectTicker: (ticker: TickerItem) => void;
}

export const CryptoAndCommodities: React.FC<CryptoAndCommoditiesProps> = ({
  cryptoList,
  futuresForexList,
  onSelectTicker,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
      {/* Crypto Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => cryptoList[0] && onSelectTicker(cryptoList[0])}
            className="inline-flex items-center group space-x-1.5 text-2xl font-bold text-[#131722] hover:text-[#2962ff] transition-colors cursor-pointer"
          >
            <span>加密货币</span>
            <ChevronRight className="w-5 h-5 text-[#787b86] group-hover:text-[#2962ff] group-hover:translate-x-0.5 transition-all mt-0.5" />
          </button>
          <span className="text-xs text-[#787b86] font-medium">总市值 $2.38T (+2.6%)</span>
        </div>

        <div className="border border-[#e0e3eb] rounded-xl p-4 bg-white space-y-2.5 shadow-2xs">
          {cryptoList.map((item) => {
            const isUp = item.trend === 'up';
            return (
              <div
                key={item.id}
                onClick={() => onSelectTicker(item)}
                className="flex items-center justify-between p-2.5 hover:bg-[#f0f3fa] rounded-lg transition-colors cursor-pointer group"
              >
                <div className="flex items-center space-x-3">
                  <span
                    style={{ backgroundColor: item.badgeColor || '#f7931a' }}
                    className="w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs"
                  >
                    {item.avatarText || item.symbol.slice(0, 1)}
                  </span>
                  <div>
                    <span className="font-bold text-sm text-[#131722] group-hover:text-[#2962ff] block transition-colors">
                      {item.name}
                    </span>
                    <span className="text-xs text-[#787b86]">
                      {item.symbol} {item.marketCap ? `· 市值 ${item.marketCap}` : ''}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-bold tabular-nums text-sm block text-[#131722]">
                    {formatPrice(item.price, item.currency)}
                  </span>
                  <span
                    className={`text-xs font-semibold tabular-nums ${
                      isUp ? 'text-[#089981]' : 'text-[#f23645]'
                    }`}
                  >
                    {isUp ? '+' : ''}
                    {item.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Futures & Commodities Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => futuresForexList[0] && onSelectTicker(futuresForexList[0])}
            className="inline-flex items-center group space-x-1.5 text-2xl font-bold text-[#131722] hover:text-[#2962ff] transition-colors cursor-pointer"
          >
            <span>期货与外汇</span>
            <ChevronRight className="w-5 h-5 text-[#787b86] group-hover:text-[#2962ff] group-hover:translate-x-0.5 transition-all mt-0.5" />
          </button>
          <span className="text-xs text-[#787b86] font-medium">大宗商品及汇率</span>
        </div>

        <div className="border border-[#e0e3eb] rounded-xl p-4 bg-white space-y-2.5 shadow-2xs">
          {futuresForexList.map((item) => {
            const isUp = item.trend === 'up';
            return (
              <div
                key={item.id}
                onClick={() => onSelectTicker(item)}
                className="flex items-center justify-between p-2.5 hover:bg-[#f0f3fa] rounded-lg transition-colors cursor-pointer group"
              >
                <div className="flex items-center space-x-3">
                  <span
                    style={{ backgroundColor: item.badgeColor || '#059669' }}
                    className="w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs"
                  >
                    {item.avatarText || item.name.slice(0, 1)}
                  </span>
                  <div>
                    <span className="font-bold text-sm text-[#131722] group-hover:text-[#2962ff] block transition-colors">
                      {item.name}
                    </span>
                    <span className="text-xs text-[#787b86]">{item.exchange}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-bold tabular-nums text-sm block text-[#131722]">
                    {formatPrice(item.price, item.currency)}
                  </span>
                  <span
                    className={`text-xs font-semibold tabular-nums ${
                      isUp ? 'text-[#089981]' : 'text-[#f23645]'
                    }`}
                  >
                    {isUp ? '+' : ''}
                    {item.changePercent.toFixed(2)}% ({isUp ? '+' : ''}
                    {formatPrice(item.change, item.currency)})
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

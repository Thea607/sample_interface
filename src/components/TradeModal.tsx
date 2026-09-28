import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { TickerItem } from '../types/market';
import { formatPrice } from '../utils/chartData';

interface TradeModalProps {
  ticker: TickerItem | null;
  onClose: () => void;
}

export const TradeModal: React.FC<TradeModalProps> = ({ ticker, onClose }) => {
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [quantity, setQuantity] = useState<number>(100);
  const [limitPrice, setLimitPrice] = useState<number>(ticker?.price || 100);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderSummary, setOrderSummary] = useState<string>('');

  if (!ticker) return null;

  const effectivePrice = orderType === 'market' ? ticker.price : limitPrice;
  const estimatedTotal = effectivePrice * quantity;
  const simulatedBalance = 500000;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderSummary(
      `成功提交${side === 'buy' ? '买入' : '卖出'} ${ticker.name} (${ticker.symbol}) ${quantity} 单位，委托价 ${formatPrice(effectivePrice, ticker.currency)}，总金额约 ${formatPrice(estimatedTotal, ticker.currency)}`
    );
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0 bg-[#131722]/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-white rounded-2xl border border-[#e0e3eb] shadow-2xl p-6 z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#e0e3eb]">
          <div>
            <h3 className="text-lg font-bold text-[#131722] flex items-center space-x-2">
              <span>模拟交易下单</span>
              <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-[#2962ff] font-semibold">
                模拟实盘
              </span>
            </h3>
            <p className="text-xs text-[#787b86] mt-0.5">
              {ticker.name} ({ticker.symbol}) · 现价: {formatPrice(ticker.price, ticker.currency)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#787b86] hover:text-[#131722] hover:bg-[#f0f3fa]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-[#089981] mx-auto animate-bounce" />
            <h4 className="text-base font-bold text-[#131722]">订单委托成功！</h4>
            <p className="text-xs text-[#787b86] px-4">{orderSummary}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            {/* Buy / Sell Tabs */}
            <div className="grid grid-cols-2 gap-2 bg-[#f0f3fa] p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setSide('buy')}
                className={`py-2 text-xs font-bold rounded-md transition-colors ${
                  side === 'buy'
                    ? 'bg-[#089981] text-white shadow-xs'
                    : 'text-[#131722] hover:bg-white/50'
                }`}
              >
                买入 / 做多
              </button>
              <button
                type="button"
                onClick={() => setSide('sell')}
                className={`py-2 text-xs font-bold rounded-md transition-colors ${
                  side === 'sell'
                    ? 'bg-[#f23645] text-white shadow-xs'
                    : 'text-[#131722] hover:bg-white/50'
                }`}
              >
                卖出 / 做空
              </button>
            </div>

            {/* Order Type */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#787b86] font-medium">订单类型</span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setOrderType('market')}
                  className={`px-3 py-1 rounded border transition-colors ${
                    orderType === 'market'
                      ? 'border-[#2962ff] bg-blue-50 text-[#2962ff] font-bold'
                      : 'border-[#e0e3eb] text-[#787b86]'
                  }`}
                >
                  市价单
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('limit')}
                  className={`px-3 py-1 rounded border transition-colors ${
                    orderType === 'limit'
                      ? 'border-[#2962ff] bg-blue-50 text-[#2962ff] font-bold'
                      : 'border-[#e0e3eb] text-[#787b86]'
                  }`}
                >
                  限价单
                </button>
              </div>
            </div>

            {/* Limit Price Input */}
            {orderType === 'limit' && (
              <div>
                <label className="block text-xs font-semibold text-[#131722] mb-1">
                  委托限价 ({ticker.currency || 'CNY'})
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={limitPrice}
                  onChange={(e) => setLimitPrice(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm border border-[#e0e3eb] rounded-lg focus:outline-hidden focus:border-[#2962ff]"
                  required
                />
              </div>
            )}

            {/* Quantity Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-[#131722]">交易数量 (股/手/张)</label>
                <span className="text-[11px] text-[#787b86]">
                  可用模拟资金: ¥{simulatedBalance.toLocaleString()}
                </span>
              </div>
              <input
                type="number"
                min="1"
                step="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 text-sm border border-[#e0e3eb] rounded-lg focus:outline-hidden focus:border-[#2962ff]"
                required
              />
            </div>

            {/* Quick Quantity Buttons */}
            <div className="flex items-center space-x-2 text-xs">
              {[10, 50, 100, 500, 1000].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setQuantity(q)}
                  className="flex-1 py-1 rounded bg-[#f0f3fa] hover:bg-[#e4e7ee] text-[#131722] font-medium"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Calculation summary */}
            <div className="p-3 bg-[#fafbfd] border border-[#e0e3eb] rounded-lg space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-[#787b86]">
                <span>预估成交金额</span>
                <span className="font-bold tabular-nums text-[#131722]">
                  {formatPrice(estimatedTotal, ticker.currency)}
                </span>
              </div>
              <div className="flex items-center justify-between text-[#787b86]">
                <span>预估交易佣金</span>
                <span className="font-bold tabular-nums text-[#089981]">免佣金 (模拟)</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full py-2.5 rounded-lg text-white font-bold text-sm shadow-md transition-colors cursor-pointer ${
                side === 'buy'
                  ? 'bg-[#089981] hover:bg-emerald-600'
                  : 'bg-[#f23645] hover:bg-red-600'
              }`}
            >
              确认{side === 'buy' ? '买入' : '卖出'} ({formatPrice(estimatedTotal, ticker.currency)})
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

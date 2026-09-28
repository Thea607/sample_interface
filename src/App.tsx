/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroTabs, CategoryTab } from './components/HeroTabs';
import { IndicesCarousel } from './components/IndicesCarousel';
import { ChinaStocksSection } from './components/ChinaStocksSection';
import { WorldStocksSection } from './components/WorldStocksSection';
import { CryptoAndCommodities } from './components/CryptoAndCommodities';
import { CalendarSection } from './components/CalendarSection';
import { Footer } from './components/Footer';
import { InteractiveChartModal } from './components/InteractiveChartModal';
import { SearchModal } from './components/SearchModal';
import { TradeModal } from './components/TradeModal';
import { WatchlistDrawer } from './components/WatchlistDrawer';
import { AuthModal } from './components/AuthModal';

import {
  INITIAL_INDICES,
  INITIAL_CN_STOCKS,
  INITIAL_WORLD_STOCKS,
  INITIAL_CRYPTO,
  INITIAL_FUTURES_FOREX,
  INITIAL_BONDS_ETFS,
  CALENDAR_EVENTS,
  ALL_TICKERS,
} from './data/mockMarketData';
import { TickerItem } from './types/market';
import { formatPrice } from './utils/chartData';

export default function App() {
  const [indices, setIndices] = useState<TickerItem[]>(INITIAL_INDICES);
  const [cnStocks, setCnStocks] = useState<TickerItem[]>(INITIAL_CN_STOCKS);
  const [worldStocks, setWorldStocks] = useState<TickerItem[]>(INITIAL_WORLD_STOCKS);
  const [cryptoList, setCryptoList] = useState<TickerItem[]>(INITIAL_CRYPTO);
  const [futuresForexList, setFuturesForexList] = useState<TickerItem[]>(INITIAL_FUTURES_FOREX);
  const [bondsEtfsList, setBondsEtfsList] = useState<TickerItem[]>(INITIAL_BONDS_ETFS);

  const [activeTab, setActiveTab] = useState<CategoryTab>('all');
  const [selectedTicker, setSelectedTicker] = useState<TickerItem | null>(null);
  const [tradeTicker, setTradeTicker] = useState<TickerItem | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Watchlist persisted state
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('tv_watchlist');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return ['ws-1', 'cn-1', 'cr-1']; // NVDA, 茅台, BTC by default
  });

  // Simulation toggle
  const [isSimulating, setIsSimulating] = useState(true);

  // Sync watchlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tv_watchlist', JSON.stringify(watchlist));
    } catch {
      // ignore
    }
  }, [watchlist]);

  const toggleFavorite = (tickerId: string) => {
    setWatchlist((prev) =>
      prev.includes(tickerId) ? prev.filter((id) => id !== tickerId) : [...prev, tickerId]
    );
  };

  // Keyboard shortcut Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Real-time market tick simulator
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      // Helper to jitter a price
      const jitterTicker = (item: TickerItem): TickerItem => {
        const deltaPct = (Math.random() - 0.49) * 0.003;
        const newPrice = Number((item.price * (1 + deltaPct)).toFixed(item.price > 10 ? 2 : 4));
        const newChange = Number((item.change + (newPrice - item.price)).toFixed(item.price > 10 ? 2 : 4));
        const newChangePct = Number(((newChange / (newPrice - newChange)) * 100).toFixed(2));
        const newHigh = Math.max(item.high, newPrice);
        const newLow = Math.min(item.low, newPrice);
        const newSparkline = [...item.sparkline.slice(1), newPrice];

        return {
          ...item,
          price: newPrice,
          change: newChange,
          changePercent: newChangePct,
          trend: newChange >= 0 ? 'up' : 'down',
          high: newHigh,
          low: newLow,
          sparkline: newSparkline,
        };
      };

      // Randomly pick a category to update
      const targetCategory = Math.floor(Math.random() * 5);
      if (targetCategory === 0) {
        setIndices((prev) => {
          const idx = Math.floor(Math.random() * prev.length);
          return prev.map((item, i) => (i === idx ? jitterTicker(item) : item));
        });
      } else if (targetCategory === 1) {
        setCnStocks((prev) => {
          const idx = Math.floor(Math.random() * prev.length);
          return prev.map((item, i) => (i === idx ? jitterTicker(item) : item));
        });
      } else if (targetCategory === 2) {
        setWorldStocks((prev) => {
          const idx = Math.floor(Math.random() * prev.length);
          return prev.map((item, i) => (i === idx ? jitterTicker(item) : item));
        });
      } else if (targetCategory === 3) {
        setCryptoList((prev) => {
          const idx = Math.floor(Math.random() * prev.length);
          return prev.map((item, i) => (i === idx ? jitterTicker(item) : item));
        });
      } else {
        setFuturesForexList((prev) => {
          const idx = Math.floor(Math.random() * prev.length);
          return prev.map((item, i) => (i === idx ? jitterTicker(item) : item));
        });
      }
    }, 2800);

    return () => clearInterval(interval);
  }, [isSimulating]);

  // Consolidate all tickers for search & watchlist
  const allCurrentTickers = [
    ...indices,
    ...cnStocks,
    ...worldStocks,
    ...cryptoList,
    ...futuresForexList,
    ...bondsEtfsList,
  ];

  // If a ticker is selected, ensure it has latest live price
  const activeSelectedTicker = selectedTicker
    ? allCurrentTickers.find((t) => t.id === selectedTicker.id) || selectedTicker
    : null;

  return (
    <div className="min-h-screen bg-white text-[#131722] flex flex-col font-sans selection:bg-blue-100 selection:text-[#2962ff]">
      {/* Top Header */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenWatchlist={() => setIsWatchlistOpen(true)}
        watchlistCount={watchlist.length}
        isSimulating={isSimulating}
        onToggleSimulation={() => setIsSimulating(!isSimulating)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Main Title & Category Filter Tabs */}
      <HeroTabs
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        watchlistCount={watchlist.length}
      />

      {/* Main Content Area */}
      <main className="max-w-[1440px] mx-auto px-4 lg:px-6 w-full flex-1 pb-16">
        {/* Watchlist Filter View */}
        {activeTab === 'watchlist' && (
          <div className="mb-12 border border-[#e0e3eb] rounded-xl p-6 bg-white shadow-2xs">
            <h2 className="text-xl font-bold text-[#131722] mb-4 flex items-center justify-between">
              <span>⭐ 我的自选关注看板</span>
              <span className="text-xs text-[#787b86] font-normal">
                共 {watchlist.length} 个标的 · 点击卡片查看交互行情图表
              </span>
            </h2>

            {watchlist.length === 0 ? (
              <div className="py-16 text-center text-[#787b86]">
                <p className="text-sm">暂无自选标的。请点击行情卡片中的星标添加！</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {allCurrentTickers
                  .filter((t) => watchlist.includes(t.id))
                  .map((item) => {
                    const isUp = item.trend === 'up';
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedTicker(item)}
                        className="p-4 border border-[#e0e3eb] hover:border-[#2962ff] rounded-xl bg-white hover:shadow-md transition-all cursor-pointer group"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span
                            style={{ backgroundColor: item.badgeColor || '#2962ff' }}
                            className="w-7 h-7 rounded-lg text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs"
                          >
                            {item.avatarText || item.symbol.slice(0, 2)}
                          </span>
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded ${
                              isUp
                                ? 'bg-[rgba(8,153,129,0.08)] text-[#089981]'
                                : 'bg-[rgba(242,54,69,0.08)] text-[#f23645]'
                            }`}
                          >
                            {isUp ? '+' : ''}
                            {item.changePercent.toFixed(2)}%
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-[#131722] group-hover:text-[#2962ff] truncate">
                          {item.name}
                        </h4>
                        <span className="text-xs text-[#787b86] block truncate">{item.exchange}</span>
                        <div className="mt-3 flex items-baseline justify-between border-t border-gray-100 pt-2">
                          <span className="text-lg font-bold tabular-nums">
                            {formatPrice(item.price, item.currency)}
                          </span>
                          <span
                            className={`text-xs font-semibold tabular-nums ${
                              isUp ? 'text-[#089981]' : 'text-[#f23645]'
                            }`}
                          >
                            {isUp ? '+' : ''}
                            {formatPrice(item.change, item.currency)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}

        {/* Section 1: Indices Carousel */}
        {(activeTab === 'all' || activeTab === 'indices') && (
          <IndicesCarousel
            indices={indices}
            onSelectTicker={(ticker) => setSelectedTicker(ticker)}
          />
        )}

        {/* Section 2: China Stocks */}
        {(activeTab === 'all' || activeTab === 'cn_stocks') && (
          <ChinaStocksSection
            stocks={cnStocks}
            onSelectTicker={(ticker) => setSelectedTicker(ticker)}
            onViewAll={() => setActiveTab('cn_stocks')}
          />
        )}

        {/* Section 3: World Stocks */}
        {(activeTab === 'all' || activeTab === 'world_stocks') && (
          <WorldStocksSection
            stocks={worldStocks}
            onSelectTicker={(ticker) => setSelectedTicker(ticker)}
          />
        )}

        {/* Section 4: Crypto & Commodities / Forex */}
        {(activeTab === 'all' ||
          activeTab === 'crypto' ||
          activeTab === 'futures' ||
          activeTab === 'forex') && (
          <CryptoAndCommodities
            cryptoList={cryptoList}
            futuresForexList={futuresForexList}
            onSelectTicker={(ticker) => setSelectedTicker(ticker)}
          />
        )}

        {/* Section 5: Bonds & ETFs (when filtered) */}
        {(activeTab === 'bonds' || activeTab === 'etfs') && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-[#131722] mb-4">
              {activeTab === 'bonds' ? '全球主要债券与利率' : '热门交易型开放式指数基金 (ETFs)'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {bondsEtfsList
                .filter((i) => i.category === activeTab)
                .map((item) => {
                  const isUp = item.trend === 'up';
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedTicker(item)}
                      className="p-4 border border-[#e0e3eb] hover:border-[#2962ff] rounded-xl bg-white hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          style={{ backgroundColor: item.badgeColor || '#2962ff' }}
                          className="w-7 h-7 rounded-lg text-white font-bold text-xs flex items-center justify-center shrink-0"
                        >
                          {item.avatarText || item.symbol.slice(0, 2)}
                        </span>
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded ${
                            isUp
                              ? 'bg-[rgba(8,153,129,0.08)] text-[#089981]'
                              : 'bg-[rgba(242,54,69,0.08)] text-[#f23645]'
                          }`}
                        >
                          {isUp ? '+' : ''}
                          {item.changePercent.toFixed(2)}%
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-[#131722] group-hover:text-[#2962ff] truncate">
                        {item.name}
                      </h4>
                      <span className="text-xs text-[#787b86] block truncate">{item.exchange}</span>
                      <div className="mt-3 flex items-baseline justify-between border-t border-gray-100 pt-2">
                        <span className="text-lg font-bold tabular-nums">
                          {formatPrice(item.price, item.currency)}
                        </span>
                        <span
                          className={`text-xs font-semibold tabular-nums ${
                            isUp ? 'text-[#089981]' : 'text-[#f23645]'
                          }`}
                        >
                          {isUp ? '+' : ''}
                          {formatPrice(item.change, item.currency)}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Section 6: Economic Calendar */}
        {(activeTab === 'all' || activeTab === 'economy') && (
          <CalendarSection events={CALENDAR_EVENTS} />
        )}
      </main>

      {/* Main Footer */}
      <Footer />

      {/* Interactive Chart Modal */}
      {activeSelectedTicker && (
        <InteractiveChartModal
          ticker={activeSelectedTicker}
          onClose={() => setSelectedTicker(null)}
          isFavorite={watchlist.includes(activeSelectedTicker.id)}
          onToggleFavorite={toggleFavorite}
          onOpenTrade={(ticker) => {
            setTradeTicker(ticker);
          }}
        />
      )}

      {/* Global Search Modal (Ctrl+K) */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        tickers={allCurrentTickers}
        onSelectTicker={(ticker) => setSelectedTicker(ticker)}
        watchlist={watchlist}
        onToggleFavorite={toggleFavorite}
      />

      {/* Simulated Trade Order Modal */}
      <TradeModal
        ticker={tradeTicker}
        onClose={() => setTradeTicker(null)}
      />

      {/* Watchlist Slide-out Drawer */}
      <WatchlistDrawer
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        watchlistIds={watchlist}
        allTickers={allCurrentTickers}
        onSelectTicker={(ticker) => setSelectedTicker(ticker)}
        onRemoveFavorite={toggleFavorite}
      />

      {/* Auth / Pro Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </div>
  );
}

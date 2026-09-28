import React, { useState } from 'react';
import { ChevronDown, Check, Star } from 'lucide-react';

export type CategoryTab =
  | 'all'
  | 'indices'
  | 'cn_stocks'
  | 'world_stocks'
  | 'crypto'
  | 'futures'
  | 'forex'
  | 'bonds'
  | 'etfs'
  | 'economy'
  | 'watchlist';

interface HeroTabsProps {
  activeTab: CategoryTab;
  onSelectTab: (tab: CategoryTab) => void;
  watchlistCount: number;
}

const REGIONS = [
  '全球市场 (Global Markets)',
  '中国A股及港股市场 (China & HK)',
  '美股及主要股指 (US Markets)',
  '亚太与新兴市场 (Asia-Pacific)',
  '加密资产与大宗商品 (Crypto & Commodities)'
];

const TABS: { id: CategoryTab; label: string }[] = [
  { id: 'all', label: '全部' },
  { id: 'indices', label: '指数' },
  { id: 'cn_stocks', label: '中国股票' },
  { id: 'world_stocks', label: '世界股票' },
  { id: 'crypto', label: '加密货币' },
  { id: 'futures', label: '期货和商品' },
  { id: 'forex', label: '外汇和货币' },
  { id: 'bonds', label: '债券' },
  { id: 'etfs', label: 'ETFs' },
  { id: 'economy', label: '经济' },
];

export const HeroTabs: React.FC<HeroTabsProps> = ({
  activeTab,
  onSelectTab,
  watchlistCount,
}) => {
  const [selectedRegion, setSelectedRegion] = useState(REGIONS[0]);
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);

  return (
    <section className="max-w-[1440px] mx-auto px-4 lg:px-6 pt-8 pb-5">
      {/* Big Headline with Dropdown Caret */}
      <div className="relative inline-block mb-6">
        <button
          onClick={() => setShowRegionDropdown(!showRegionDropdown)}
          className="flex items-center space-x-3 group cursor-pointer focus:outline-hidden text-left"
        >
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#131722] group-hover:text-[#2962ff] transition-colors">
            市场 ，无处不在
          </h1>
          <ChevronDown
            className={`w-6 h-6 md:w-8 md:h-8 text-[#131722] group-hover:text-[#2962ff] transition-transform duration-200 mt-1 ${
              showRegionDropdown ? 'rotate-180 text-[#2962ff]' : ''
            }`}
          />
        </button>

        {showRegionDropdown && (
          <div className="absolute left-0 top-full mt-2 w-72 sm:w-80 bg-white border border-[#e0e3eb] rounded-xl shadow-xl py-2 z-30 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="px-3 py-1.5 text-[11px] font-bold text-[#787b86] uppercase tracking-wider">
              选择关注市场领域
            </div>
            {REGIONS.map((region) => (
              <button
                key={region}
                onClick={() => {
                  setSelectedRegion(region);
                  setShowRegionDropdown(false);
                }}
                className="w-full flex items-center justify-between px-3.5 py-2 text-xs sm:text-sm font-medium hover:bg-[#f0f3fa] text-left text-[#131722] transition-colors"
              >
                <span>{region}</span>
                {selectedRegion === region && (
                  <Check className="w-4 h-4 text-[#2962ff] shrink-0" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Category Filter Tabs Navigation */}
      <div className="flex items-center space-x-2 overflow-x-auto custom-scrollbar pb-2 text-[14px] font-medium">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors cursor-pointer text-sm ${
                isActive
                  ? 'bg-[#131722] text-white font-semibold shadow-xs'
                  : 'text-[#131722] hover:bg-[#f0f3fa] font-medium'
              }`}
            >
              {tab.label}
            </button>
          );
        })}

        {/* Watchlist Tab */}
        <button
          onClick={() => onSelectTab('watchlist')}
          className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors cursor-pointer text-sm flex items-center space-x-1.5 ${
            activeTab === 'watchlist'
              ? 'bg-[#2962ff] text-white font-semibold shadow-xs'
              : 'text-[#131722] hover:bg-[#f0f3fa] font-medium'
          }`}
        >
          <Star className={`w-3.5 h-3.5 ${activeTab === 'watchlist' ? 'text-white fill-white' : 'text-amber-500 fill-amber-400'}`} />
          <span>自选关注</span>
          {watchlistCount > 0 && (
            <span
              className={`ml-1 px-1.5 py-0.2 rounded-full text-xs font-bold ${
                activeTab === 'watchlist' ? 'bg-white text-[#2962ff]' : 'bg-[#2962ff] text-white'
              }`}
            >
              {watchlistCount}
            </span>
          )}
        </button>
      </div>
    </section>
  );
};

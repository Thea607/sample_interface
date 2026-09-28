import React, { useState } from 'react';
import { Search, Globe, User, Star, Activity, Play, Pause } from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenWatchlist: () => void;
  watchlistCount: number;
  isSimulating: boolean;
  onToggleSimulation: () => void;
  onOpenAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenWatchlist,
  watchlistCount,
  isSimulating,
  onToggleSimulation,
  onOpenAuth,
}) => {
  const [currentLang, setCurrentLang] = useState<'CN' | 'EN' | 'HK'>('CN');
  const [showLangMenu, setShowLangMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#e0e3eb] shadow-xs">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-6 h-[64px] flex items-center justify-between">
        {/* Left side: TV Monogram & Search Bar & Nav */}
        <div className="flex items-center space-x-6 flex-1 max-w-2xl">
          {/* TradingView Monogram Logo SVG */}
          <a
            href="#"
            className="flex items-center text-[#131722] hover:opacity-85 transition-opacity shrink-0"
            title="TradingView 市场总览"
          >
            <svg
              className="w-9 h-7 fill-current"
              viewBox="0 0 36 28"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M14 22H7V6h7v16zm8-22h-6v28h6V0zm8 14h-6v14h6V14z" />
            </svg>
          </a>

          {/* Global Search Bar with Hotkey Pill */}
          <div
            onClick={onOpenSearch}
            className="relative w-full max-w-[280px] cursor-pointer group"
          >
            <div className="flex items-center justify-between bg-[#f0f3fa] group-hover:bg-[#e4e7ee] rounded-full px-3.5 py-1.5 text-xs text-[#787b86] transition-colors">
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-[#787b86] group-hover:text-[#131722] transition-colors" />
                <span className="text-sm font-normal text-[#131722]">搜索标的与行情</span>
              </div>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-[#787b86] bg-white rounded border border-[#e0e3eb] shadow-2xs">
                Ctrl K
              </kbd>
            </div>
          </div>

          {/* Primary Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-6 text-[14px] font-medium text-[#131722]">
            <a href="#products" className="hover:text-[#2962ff] transition-colors">
              产品
            </a>
            <a href="#community" className="hover:text-[#2962ff] transition-colors">
              社区
            </a>
            <a
              href="#markets"
              className="text-[#2962ff] font-semibold flex items-center relative py-5 border-b-2 border-[#2962ff]"
            >
              市场
            </a>
            <a href="#brokers" className="hover:text-[#2962ff] transition-colors">
              经纪商
            </a>
            <a href="#more" className="hover:text-[#2962ff] transition-colors">
              更多
            </a>
          </nav>
        </div>

        {/* Right Action Items */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          {/* Live Simulation Pulse Toggle */}
          <button
            onClick={onToggleSimulation}
            className={`hidden md:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isSimulating
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
            title={isSimulating ? '行情实时跳动中 (点击暂停)' : '行情已暂停 (点击恢复实时模拟)'}
          >
            {isSimulating ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                </span>
                <span className="tabular-nums">实时行情</span>
                <Pause className="w-3 h-3 ml-0.5 opacity-60" />
              </>
            ) : (
              <>
                <span className="inline-block w-2 h-2 rounded-full bg-slate-400"></span>
                <span>已暂停</span>
                <Play className="w-3 h-3 ml-0.5 text-emerald-600" />
              </>
            )}
          </button>

          {/* Watchlist Quick Button */}
          <button
            onClick={onOpenWatchlist}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#131722] hover:bg-[#f0f3fa] transition-colors border border-transparent hover:border-[#e0e3eb]"
            title="我的自选股"
          >
            <Star className={`w-4 h-4 ${watchlistCount > 0 ? 'text-amber-500 fill-amber-400' : 'text-[#787b86]'}`} />
            <span className="hidden sm:inline font-semibold">自选</span>
            {watchlistCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#2962ff] text-white">
                {watchlistCount}
              </span>
            )}
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center space-x-1 text-[#131722] hover:bg-[#f0f3fa] px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors"
            >
              <Globe className="w-4 h-4 text-[#131722]" />
              <span>{currentLang}</span>
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-1 w-28 bg-white border border-[#e0e3eb] rounded-lg shadow-lg py-1 z-50 text-xs">
                {(['CN', 'EN', 'HK'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setCurrentLang(lang);
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-[#f0f3fa] font-medium ${
                      currentLang === lang ? 'text-[#2962ff] font-bold bg-blue-50/50' : 'text-[#131722]'
                    }`}
                  >
                    {lang === 'CN' ? '简体中文' : lang === 'EN' ? 'English' : '繁體中文'}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Profile Avatar Icon */}
          <button
            onClick={onOpenAuth}
            aria-label="用户中心"
            className="p-2 rounded-full hover:bg-[#f0f3fa] text-[#131722] transition-colors"
          >
            <User className="w-5 h-5" />
          </button>

          {/* Get Started / Start Button */}
          <button
            onClick={onOpenAuth}
            className="bg-gradient-to-r from-[#2962ff] to-[#7b1fa2] hover:opacity-90 text-white text-[14px] font-medium px-4 py-1.5 rounded-full transition shadow-xs cursor-pointer"
          >
            开始
          </button>
        </div>
      </div>
    </header>
  );
};

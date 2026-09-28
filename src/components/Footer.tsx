import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#e0e3eb] bg-white text-[#131722] pt-12 pb-16">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-6">
        {/* Footer Nav Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-[#e0e3eb]">
          <div>
            <h4 className="text-xs font-bold text-[#787b86] uppercase tracking-wider mb-4">
              产品
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a className="hover:text-[#2962ff] transition-colors" href="#charts">
                  超级图表
                </a>
              </li>
              <li>
                <a className="hover:text-[#2962ff] transition-colors" href="#pinescript">
                  Pine Script™
                </a>
              </li>
              <li>
                <a className="hover:text-[#2962ff] transition-colors" href="#screener">
                  股票筛选器
                </a>
              </li>
              <li>
                <a className="hover:text-[#2962ff] transition-colors" href="#crypto-screener">
                  加密货币筛选器
                </a>
              </li>
              <li>
                <a className="hover:text-[#2962ff] transition-colors" href="#calendar">
                  财经日历
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-[#787b86] uppercase tracking-wider mb-4">
              市场
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a className="hover:text-[#2962ff] transition-colors" href="#all-markets">
                  全部市场
                </a>
              </li>
              <li>
                <a className="hover:text-[#2962ff] transition-colors" href="#indices">
                  指数
                </a>
              </li>
              <li>
                <a className="hover:text-[#2962ff] transition-colors" href="#stocks">
                  股票
                </a>
              </li>
              <li>
                <a className="hover:text-[#2962ff] transition-colors" href="#futures">
                  期货
                </a>
              </li>
              <li>
                <a className="hover:text-[#2962ff] transition-colors" href="#crypto">
                  加密货币
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-[#787b86] uppercase tracking-wider mb-4">
              社区
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a className="hover:text-[#2962ff] transition-colors" href="#ideas">
                  精选观点
                </a>
              </li>
              <li>
                <a className="hover:text-[#2962ff] transition-colors" href="#scripts">
                  交易脚本库
                </a>
              </li>
              <li>
                <a className="hover:text-[#2962ff] transition-colors" href="#streams">
                  实时数据流
                </a>
              </li>
              <li>
                <a className="hover:text-[#2962ff] transition-colors" href="#chat">
                  交流室
                </a>
              </li>
              <li>
                <a className="hover:text-[#2962ff] transition-colors" href="#referrals">
                  推荐给好友
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-[#787b86] uppercase tracking-wider mb-4">
              公司
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a className="hover:text-[#2962ff] transition-colors" href="#about">
                  关于我们
                </a>
              </li>
              <li>
                <a className="hover:text-[#2962ff] transition-colors" href="#features">
                  功能特性
                </a>
              </li>
              <li>
                <a className="hover:text-[#2962ff] transition-colors" href="#pricing">
                  收费方案
                </a>
              </li>
              <li>
                <a className="hover:text-[#2962ff] transition-colors" href="#blog">
                  博客
                </a>
              </li>
              <li>
                <a className="hover:text-[#2962ff] transition-colors" href="#security">
                  安全声明
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-[#787b86] uppercase tracking-wider mb-4">
              商业合作
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a className="hover:text-[#2962ff] transition-colors" href="#widgets">
                  网站与图表插件
                </a>
              </li>
              <li>
                <a className="hover:text-[#2962ff] transition-colors" href="#brokers">
                  经纪商接入方案
                </a>
              </li>
              <li>
                <a className="hover:text-[#2962ff] transition-colors" href="#institutional">
                  机构版交易工具
                </a>
              </li>
              <li>
                <a className="hover:text-[#2962ff] transition-colors" href="#ads">
                  广告合作
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright & Disclaimer */}
        <div className="pt-8 flex flex-col md:flex-row md:items-center justify-between text-xs text-[#787b86] space-y-4 md:space-y-0">
          <div>
            <p>© 2024 TradingView, Inc. 市场数据由 ICE Data Services 及全球各官方交易所授权提供。</p>
            <p className="mt-1">行情仅供参考，不作为投资决策的直接依据。投资有风险，入市需谨慎。</p>
          </div>
          <div className="flex items-center space-x-4">
            <a className="hover:text-[#131722] transition-colors" href="#terms">
              服务条款
            </a>
            <a className="hover:text-[#131722] transition-colors" href="#privacy">
              隐私政策
            </a>
            <a className="hover:text-[#131722] transition-colors" href="#disclaimer">
              免责声明
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

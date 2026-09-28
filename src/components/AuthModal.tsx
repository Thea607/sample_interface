import React, { useState } from 'react';
import { X, Check, ShieldCheck, Zap, BarChart2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 2000);
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
        <div className="flex items-center justify-between pb-3 border-b border-[#e0e3eb]">
          <div className="flex items-center space-x-2">
            <svg
              className="w-7 h-5 fill-current text-[#131722]"
              viewBox="0 0 36 28"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M14 22H7V6h7v16zm8-22h-6v28h6V0zm8 14h-6v14h6V14z" />
            </svg>
            <h3 className="text-base font-bold text-[#131722]">开启专业交易与行情分析</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#787b86] hover:text-[#131722] hover:bg-[#f0f3fa]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#089981] flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-[#131722]">欢迎加入 TradingView！</h4>
            <p className="text-xs text-[#787b86]">已成功为您开启 30 天专业版全部图表与实时毫秒数据权益。</p>
          </div>
        ) : (
          <div className="pt-4 space-y-4">
            <div className="space-y-2 text-xs text-[#787b86]">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                <span>无限制多图表分屏布局与毫秒级实时数据推送</span>
              </div>
              <div className="flex items-center space-x-2">
                <BarChart2 className="w-4 h-4 text-[#2962ff] shrink-0" />
                <span>100+ 内置指标及数十万个社区 Pine Script™ 开源脚本</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-[#089981] shrink-0" />
                <span>连接全球合规顶级经纪商，支持模拟与实盘一键交易</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-[#131722] mb-1">
                  邮箱或手机号
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full px-3 py-2 text-sm border border-[#e0e3eb] rounded-lg focus:outline-hidden focus:border-[#2962ff]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#2962ff] to-[#7b1fa2] text-white font-bold text-sm shadow-md hover:opacity-95 transition-opacity cursor-pointer"
              >
                免费体验 30 天专业版
              </button>
            </form>

            <p className="text-[11px] text-center text-[#787b86]">
              注册即代表您同意我们的服务条款与隐私声明。无需即时信用卡验证。
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

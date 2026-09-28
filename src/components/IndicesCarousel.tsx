import React, { useRef } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { TickerItem } from '../types/market';
import { formatPrice } from '../utils/chartData';

interface IndicesCarouselProps {
  indices: TickerItem[];
  onSelectTicker: (ticker: TickerItem) => void;
}

export const IndicesCarousel: React.FC<IndicesCarouselProps> = ({
  indices,
  onSelectTicker,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="mb-10">
      {/* Section Title Link & Carousel Controls */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => onSelectTicker(indices[0])}
          className="inline-flex items-center group space-x-1.5 text-2xl font-bold text-[#131722] hover:text-[#2962ff] transition-colors cursor-pointer"
        >
          <span>指数</span>
          <ChevronRight className="w-5 h-5 text-[#787b86] group-hover:text-[#2962ff] group-hover:translate-x-0.5 transition-all mt-0.5" />
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => scroll('left')}
            aria-label="向前滑动"
            className="w-8 h-8 rounded-full border border-[#e0e3eb] flex items-center justify-center hover:bg-[#f0f3fa] transition text-[#787b86] hover:text-[#131722] cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            aria-label="向后滑动"
            className="w-8 h-8 rounded-full border border-[#e0e3eb] flex items-center justify-center hover:bg-[#f0f3fa] transition text-[#787b86] hover:text-[#131722] cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Index Cards Grid / Horizontal Scroll */}
      <div
        ref={scrollContainerRef}
        className="flex space-x-3.5 overflow-x-auto custom-scrollbar pb-3 snap-x"
      >
        {indices.map((item) => {
          const isUp = item.trend === 'up';
          const strokeColor = isUp ? '#089981' : '#f23645';

          // Generate sparkline path
          const minVal = Math.min(...item.sparkline);
          const maxVal = Math.max(...item.sparkline);
          const range = maxVal - minVal || 1;
          const svgW = 160;
          const svgH = 40;
          const stepX = svgW / (item.sparkline.length - 1);

          let pathD = '';
          item.sparkline.forEach((val, idx) => {
            const x = idx * stepX;
            const y = svgH - 4 - ((val - minVal) / range) * (svgH - 8);
            if (idx === 0) pathD += `M ${x},${y}`;
            else pathD += ` L ${x},${y}`;
          });

          return (
            <div
              key={item.id}
              onClick={() => onSelectTicker(item)}
              className="min-w-[240px] sm:min-w-[260px] flex-1 border border-[#e0e3eb] hover:border-blue-300 rounded-xl p-4 bg-white hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between group snap-start"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2.5">
                    <span
                      style={{ backgroundColor: item.badgeColor || '#003884' }}
                      className="w-7 h-7 rounded-full text-white flex items-center justify-center font-bold text-xs shrink-0"
                    >
                      {item.avatarText || item.name.slice(0, 1)}
                    </span>
                    <div className="overflow-hidden">
                      <h3 className="text-sm font-semibold text-[#131722] group-hover:text-[#2962ff] transition-colors truncate">
                        {item.name}
                      </h3>
                      <span className="text-xs text-[#787b86] block truncate">
                        {item.exchange}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded shrink-0 tabular-nums ${
                      isUp
                        ? 'bg-[rgba(8,153,129,0.08)] text-[#089981]'
                        : 'bg-[rgba(242,54,69,0.08)] text-[#f23645]'
                    }`}
                  >
                    {isUp ? '+' : ''}
                    {item.changePercent.toFixed(2)}%
                  </span>
                </div>

                <div className="flex items-baseline justify-between mt-1 mb-2">
                  <span className="text-xl font-bold tabular-nums text-[#131722]">
                    {formatPrice(item.price)}
                  </span>
                  <span
                    className={`text-xs font-semibold tabular-nums ${
                      isUp ? 'text-[#089981]' : 'text-[#f23645]'
                    }`}
                  >
                    {isUp ? '+' : ''}
                    {item.change.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Sparkline */}
              <div className="h-10 w-full pt-1">
                <svg
                  className="w-full h-full"
                  viewBox={`0 0 ${svgW} ${svgH}`}
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={pathD} stroke={strokeColor} />
                </svg>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

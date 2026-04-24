/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MarketIndex } from '../types';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../lib/utils';

interface Props {
  indices: MarketIndex[];
}

export const StockTicker = ({ indices }: Props) => {
  return (
    <div className="w-full bg-surface-container border-b border-outline-variant overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap py-2 no-scrollbar overflow-x-auto">
        <div className="flex gap-6 px-4">
          {indices.map((index) => (
            <div key={index.name} className="flex items-center gap-2 bg-surface-container-lowest px-4 py-1.5 rounded-full border border-outline-variant shadow-sm shrink-0">
              <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">{index.name}</span>
              <span className="text-sm font-bold text-on-surface">{index.value.toLocaleString()}</span>
              <span className={cn(
                "flex items-center text-xs font-medium",
                index.change >= 0 ? "text-rose-600" : "text-blue-600"
              )}>
                {index.change >= 0 ? <TrendingUp size={12} className="mr-1" /> : <TrendingDown size={12} className="mr-1" />}
                {Math.abs(index.change).toFixed(2)} ({index.changePercent}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

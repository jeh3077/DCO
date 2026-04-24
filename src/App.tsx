/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  Search, 
  Menu, 
  Star, 
  ArrowLeft, 
  Eye, 
  TrendingUp, 
  TrendingDown, 
  LayoutGrid, 
  Wallet, 
  ArrowRightLeft, 
  Settings,
  MoreHorizontal,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

import { STOCKS, TOP_MOVERS as MOCK_TOP_MOVERS, MARKET_INDICES as MOCK_INDICES, getStockDetail } from './mockData';
import { StockTicker } from './components/StockTicker';
import { HealthCheckSection } from './components/HealthCheckSection';
import { cn } from './lib/utils';
import { StockData, MarketIndex, MarketData } from './types';

export default function App() {
  const [selectedStockId, setSelectedStockId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'Domestic' | 'Overseas' | 'ETF'>('Domestic');
  const [indices, setIndices] = useState<MarketIndex[]>(MOCK_INDICES);
  const [stocks, setStocks] = useState<StockData[]>(STOCKS);
  const [topMovers, setTopMovers] = useState<StockData[]>(MOCK_TOP_MOVERS);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchLivePrices = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/stocks');
      if (!response.ok) throw new Error('Failed to fetch');
      const data: MarketData = await response.json();
      
      if (data.indices) setIndices(data.indices);
      
      if (data.stocks) {
        setStocks(prev => prev.map(s => {
          const match = data.stocks.find(ls => ls.symbol === s.symbol);
          return match ? { ...s, price: match.price, change: match.change, changePercent: match.changePercent } : s;
        }));

        setTopMovers(prev => prev.map(s => {
          const match = data.stocks.find(ls => ls.symbol === s.symbol);
          return match ? { ...s, price: match.price, change: match.change, changePercent: match.changePercent } : s;
        }));
      }
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Fetch error:', err);
      // Optional: Inform the user via UI state
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLivePrices();
    const interval = setInterval(fetchLivePrices, 60000); 
    return () => clearInterval(interval);
  }, [fetchLivePrices]);

  const selectedStock = useMemo(() => {
    if (!selectedStockId) return null;
    const currentStock = stocks.find(s => s.id === selectedStockId);
    const detail = getStockDetail(selectedStockId);
    if (currentStock) {
      return { ...detail, price: currentStock.price, change: currentStock.change, changePercent: currentStock.changePercent };
    }
    return detail;
  }, [selectedStockId, stocks]);

  const filteredStocks = useMemo(() => 
    stocks.filter(s => s.market === activeTab), 
  [activeTab, stocks]);

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Top App Bar */}
      <header className="sticky top-0 z-50 bg-surface-container-lowest/80 backdrop-blur-md border-b border-outline-variant px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-surface-container rounded-full transition-colors">
            <Menu size={20} className="text-on-surface-variant" />
          </button>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-on-surface">주식보드 (StockBoard)</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold">LIVE</span>
              {lastUpdated && (
                <span className="text-[10px] text-on-surface-variant font-medium">
                  Google Finance • {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" size={16} />
            <input 
              type="text" 
              placeholder="종목명, 심볼 검색..." 
              className="w-full bg-surface-container-low border border-outline-variant rounded-full py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={fetchLivePrices}
            disabled={isLoading}
            className="p-2 hover:bg-surface-container rounded-full transition-colors disabled:opacity-50"
          >
            <RefreshCw size={20} className={cn("text-on-surface-variant", isLoading && "animate-spin")} />
          </button>
          <button className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant bg-surface-container shadow-sm p-0.5 ml-2">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=StockUser" 
              alt="User" 
              className="w-full h-full rounded-full object-cover"
            />
          </button>
        </div>
      </header>

      <StockTicker indices={indices} />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8">
        <AnimatePresence mode="wait">
          {!selectedStock ? (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Left & Middle Column */}
              <div className="lg:col-span-2 flex flex-col gap-8">
                {/* Portfolio Summary */}
                <section className="bg-surface-container-lowest rounded-3xl border border-outline-variant p-8 shadow-sm overflow-hidden relative">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h2 className="text-lg font-semibold text-on-surface-variant mb-1">나의 추정 자산</h2>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-on-surface">₩124,592,500</span>
                        <div className="flex items-center gap-1 bg-rose-50 text-rose-700 px-2 py-0.5 rounded-md text-sm font-bold">
                          <TrendingUp size={14} /> +2.6%
                        </div>
                      </div>
                    </div>
                    <button className="p-2 text-primary hover:bg-primary/5 rounded-full transition-colors">
                      <Eye size={20} />
                    </button>
                  </div>

                  <div className="h-40 w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={Array.from({ length: 12 }, (_, i) => ({ val: 50 + Math.random() * 50 }))}>
                        <defs>
                          <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0040e0" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#0040e0" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="val" stroke="#0040e0" fillOpacity={1} fill="url(#colorVal)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </section>

                {/* Market Exploration */}
                <section className="flex flex-col gap-4">
                  <div className="flex border-b border-outline-variant">
                    {(['Domestic', 'Overseas', 'ETF'] as const).map(tab => (
                      <button 
                        key={tab}
                        onClick={() => {
                          setActiveTab(tab);
                        }}
                        className={cn(
                          "px-6 py-3 text-sm font-bold transition-all relative",
                          activeTab === tab ? "text-primary" : "text-on-surface-variant hover:text-on-surface"
                        )}
                      >
                        {tab === 'Domestic' ? '국내 주식' : tab === 'Overseas' ? '해외 주식' : 'ETF (KODEX/TIGER)'}
                        {activeTab === tab && (
                          <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
                    <div className="grid grid-cols-4 gap-4 p-4 border-b border-outline-variant bg-surface-container-low/50 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
                      <div className="col-span-2">자산명</div>
                      <div className="text-right">현재가</div>
                      <div className="text-right">대비</div>
                    </div>
                    <div className="divide-y divide-outline-variant">
                      {filteredStocks.map(stock => (
                        <button 
                          key={stock.id}
                          onClick={() => setSelectedStockId(stock.id)}
                          className="grid grid-cols-4 gap-4 p-4 items-center w-full text-left hover:bg-surface-container-low transition-colors group"
                        >
                          <div className="col-span-2 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center font-bold text-primary group-hover:scale-105 transition-transform">
                              {stock.name[0]}
                            </div>
                            <div>
                              <div className="text-sm font-bold text-on-surface leading-tight">{stock.name}</div>
                              <div className="text-xs text-on-surface-variant">{stock.symbol}</div>
                            </div>
                          </div>
                          <div className="text-right text-sm font-bold text-on-surface">
                            {stock.market === 'Overseas' ? '$' : '₩'}{stock.price.toLocaleString()}
                          </div>
                          <div className={cn(
                            "text-right text-xs font-bold flex justify-end items-center gap-1",
                            stock.change >= 0 ? "text-rose-600" : "text-blue-600"
                          )}>
                            {stock.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                            {stock.changePercent}%
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </section>
              </div>

              {/* Sidebar Column */}
              <div className="flex flex-col gap-8">
                <section className="bg-surface-container-lowest rounded-3xl border border-outline-variant p-6 shadow-sm flex flex-col gap-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-on-surface">급상승 종목</h3>
                    <MoreHorizontal className="text-on-surface-variant cursor-pointer hover:text-on-surface" size={20} />
                  </div>
                  <div className="flex flex-col gap-3">
                    {topMovers.map(mover => (
                      <div key={mover.id} className="flex justify-between items-center p-3 rounded-2xl border border-outline-variant hover:border-primary/20 hover:bg-surface-container-low transition-all cursor-pointer group">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shadow-sm group-hover:scale-110 transition-transform">
                            {mover.name[0]}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-on-surface">{mover.name}</div>
                            <div className="text-xs text-on-surface-variant uppercase tracking-wider">{mover.symbol}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-on-surface">₩{mover.price.toLocaleString()}</div>
                          <div className={cn(
                            "text-[10px] font-bold px-1.5 py-0.5 rounded inline-block mt-1",
                            mover.change >= 0 ? "bg-rose-50 text-rose-700" : "bg-blue-50 text-blue-700"
                          )}>
                            {mover.change >= 0 ? '+' : ''}{mover.changePercent}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="bg-primary p-6 rounded-3xl text-white shadow-xl shadow-primary/20 flex flex-col gap-4 relative overflow-hidden">
                  <div className="relative z-10">
                    <h4 className="text-lg font-bold mb-1">투자가 처음이신가요?</h4>
                    <p className="text-sm text-primary-fixed-dim leading-relaxed mb-4">주식 시장의 기초와 재무제표 읽는 법을 가이드로 배워보세요.</p>
                    <button className="bg-white text-primary px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary-fixed-dim transition-colors">학습 시작하기</button>
                  </div>
                  <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
                </section>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-8"
            >
              <nav className="flex items-center justify-between">
                <button 
                  onClick={() => setSelectedStockId(null)}
                  className="flex items-center gap-2 text-on-surface-variant hover:text-primary font-bold transition-colors"
                >
                  <ArrowLeft size={20} />
                  시장 현황으로 돌아가기
                </button>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-surface-container rounded-full"><Star size={20} /></button>
                  <button className="p-2 hover:bg-surface-container rounded-full"><Search size={20} /></button>
                </div>
              </nav>

              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">{selectedStock.market} Market • {selectedStock.symbol}</div>
                  <h1 className="text-4xl font-bold text-on-surface mb-2">{selectedStock.name}</h1>
                  <div className="flex items-center gap-3">
                    <span className="text-5xl font-bold text-on-surface">
                      {selectedStock.market === 'Overseas' ? '$' : '₩'}{selectedStock.price.toLocaleString()}
                    </span>
                    <span className={cn(
                      "flex items-center text-lg font-bold px-3 py-1 rounded-full",
                      selectedStock.change >= 0 ? "bg-rose-50 text-rose-700" : "bg-blue-50 text-blue-700"
                    )}>
                      {selectedStock.change >= 0 ? <TrendingUp size={20} className="mr-1" /> : <TrendingDown size={20} className="mr-1" />}
                      {selectedStock.change.toLocaleString()} ({selectedStock.changePercent}%)
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant text-sm bg-surface-container-low px-4 py-2 rounded-2xl border border-outline-variant/30">
                  <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  실시간 시장 데이터 반영됨
                </div>
              </div>

              {/* Main Chart Section */}
              <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant p-2 md:p-8 shadow-sm">
                <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar">
                  {['1일', '1주', '1달', '3달', '1년', '5년'].map(time => (
                    <button key={time} className={cn(
                      "px-4 py-1.5 rounded-xl text-xs font-bold transition-all",
                      time === '1일' ? "bg-primary text-white" : "hover:bg-surface-container-low text-on-surface-variant"
                    )}>
                      {time}
                    </button>
                  ))}
                </div>

                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={selectedStock.history}>
                      <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={selectedStock.change >= 0 ? '#e11d48' : '#2563eb'} stopOpacity={0.2}/>
                          <stop offset="95%" stopColor={selectedStock.change >= 0 ? '#e11d48' : '#2563eb'} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="time" hide />
                      <YAxis domain={['auto', 'auto']} hide />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="price" 
                        stroke={selectedStock.change >= 0 ? '#e11d48' : '#2563eb'} 
                        fillOpacity={1} 
                        fill="url(#colorPrice)" 
                        strokeWidth={3} 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: '시가', val: selectedStock.open },
                  { label: '고가', val: selectedStock.high },
                  { label: '저가', val: selectedStock.low },
                  { label: '거래량 (평균)', val: `${selectedStock.volume} (${selectedStock.avgVolume})` },
                  { label: '시가총액', val: selectedStock.mktCap },
                  { label: '52주 최고', val: selectedStock.high52w },
                  { label: '52주 최저', val: selectedStock.low52w },
                  { label: '배당수익률', val: selectedStock.divYield },
                ].map((stat, i) => (
                  <div key={i} className="bg-surface-container-lowest border border-outline-variant p-5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                    <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">{stat.label}</div>
                    <div className="text-lg font-bold text-on-surface">
                      {typeof stat.val === 'number' ? (selectedStock.market === 'Overseas' ? '$' : '₩') + stat.val.toLocaleString() : stat.val}
                    </div>
                  </div>
                ))}
              </div>

              <HealthCheckSection detail={selectedStock} />

              {/* Action FABs for mobile/tablet */}
              <div className="fixed bottom-0 left-0 right-0 bg-surface-container-lowest/80 backdrop-blur-md p-4 border-t border-outline-variant md:hidden">
                <div className="flex gap-4">
                  <button className="flex-1 bg-surface-container-low border border-outline-variant text-on-surface font-bold py-3 rounded-2xl hover:bg-surface-container transition-colors">매도</button>
                  <button className="flex-1 bg-primary text-white font-bold py-3 rounded-2xl hover:bg-primary-container shadow-lg shadow-primary/20 transition-all">즉시 매수</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer / Mobile Nav */}
      <nav className="md:hidden sticky bottom-0 w-full h-16 bg-surface-container-lowest border-t border-outline-variant flex items-center justify-around z-50">
        <button className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary">
          <LayoutGrid size={20} />
          <span className="text-[10px] font-bold">포트폴리오</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-primary">
          <TrendingUp size={20} />
          <span className="text-[10px] font-bold">시장현황</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-on-surface-variant">
          <ArrowRightLeft size={20} />
          <span className="text-[10px] font-bold">주식주문</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-on-surface-variant">
          <Settings size={20} />
          <span className="text-[10px] font-bold">설정</span>
        </button>
      </nav>
    </div>
  );
}

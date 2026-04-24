/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StockDetail } from '../types';
import { ShieldCheck, TrendingUp, Wallet, BarChart3, Scale } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  detail: StockDetail;
}

export const HealthCheckSection = ({ detail }: Props) => {
  return (
    <section className="flex flex-col gap-6 mt-8">
      <div className="flex items-center gap-2">
        <ShieldCheck className="text-primary" size={24} />
        <h2 className="text-xl font-bold text-on-surface">기업 건강검진 (상세 지표)</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Revenue Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden group hover:border-primary transition-colors shadow-sm"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">매출액 (TTM)</h3>
              <span className="text-2xl font-bold text-on-surface">{detail.revenueTTM}</span>
            </div>
            <BarChart3 className="text-outline-variant group-hover:text-primary transition-colors" size={20} />
          </div>
          <div className="flex items-center gap-2 text-primary mt-auto pt-4 border-t border-surface-container-low">
            <TrendingUp size={16} />
            <span className="text-sm font-medium">전년 대비 {detail.growthYoY} 성장</span>
          </div>
        </motion.div>

        {/* Operating Profit Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden group hover:border-primary transition-colors shadow-sm"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">영업이익</h3>
              <span className="text-2xl font-bold text-on-surface">{detail.operatingProfitTTM}</span>
            </div>
            <Wallet className="text-outline-variant group-hover:text-primary transition-colors" size={20} />
          </div>
          <div className="flex flex-col gap-2 mt-auto pt-4 border-t border-surface-container-low">
            <div className="flex justify-between items-center w-full">
              <span className="text-xs text-on-surface-variant font-medium">영업이익률</span>
              <span className="text-sm font-bold text-on-surface">{detail.operatingMargin}</span>
            </div>
            <div className="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
              <div className="bg-primary h-full rounded-full" style={{ width: '35%' }}></div>
            </div>
          </div>
        </motion.div>

        {/* ROE Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden group hover:border-primary transition-colors shadow-sm"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">자기자본이익률 (ROE)</h3>
              <span className="text-2xl font-bold text-on-surface">{detail.roe}</span>
            </div>
            <TrendingUp className="text-outline-variant group-hover:text-primary transition-colors" size={20} />
          </div>
          <p className="text-xs text-on-surface-variant mt-auto pt-4 border-t border-surface-container-low leading-relaxed">
            자본을 사용하여 얼마나 효율적으로 수익을 내고 있는지 나타냅니다. 높을수록 경영 효율이 좋음을 의미합니다.
          </p>
        </motion.div>

        {/* PER Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden group hover:border-primary transition-colors shadow-sm"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">주가수익비율 (PER / TTM)</h3>
              <span className="text-2xl font-bold text-on-surface">{detail.peRatio}</span>
            </div>
            <Scale className="text-outline-variant group-hover:text-primary transition-colors" size={20} />
          </div>
          <div className="flex flex-col gap-2 mt-auto pt-4 border-t border-surface-container-low">
            <div className="flex justify-between items-center w-full">
              <span className="text-xs text-on-surface-variant font-medium">업종 평균 PER</span>
              <span className="text-xs font-bold text-on-surface">{detail.sectorAvgPE}</span>
            </div>
            <p className="text-[10px] text-primary font-semibold">현재 동종 업종 대비 저평가(또는 고평가) 상태를 확인하세요.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

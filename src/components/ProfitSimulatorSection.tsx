import { useMemo, useState } from 'react';
import { ArrowDownRight } from 'lucide-react';

interface ProfitSimulatorSectionProps {
  onScrollToApply: () => void;
}

const PRICE_PER_SERVING = 14000; // 1인분 기준 판매가 14,000원
const FOOD_COST_RATE = 0.32; // 직공급 원물 및 비법소스 원가율 약 32%
const OPS_FEE_RATE = 0.24; // 배달·포장·가스 등 부대비용 약 24%
const NET_MARGIN_RATE = 1 - FOOD_COST_RATE - OPS_FEE_RATE; // 예상 순수익률 44%

const QUICK_SERVINGS = [10, 20, 30, 40, 50];

function formatKRW(amount: number): string {
  return `${Math.round(amount).toLocaleString('ko-KR')}원`;
}

export function ProfitSimulatorSection({ onScrollToApply }: ProfitSimulatorSectionProps) {
  const [dailyServings, setDailyServings] = useState(25);
  const [operatingDays, setOperatingDays] = useState<26 | 30>(30);

  const metrics = useMemo(() => {
    const monthlyServings = dailyServings * operatingDays;
    const monthlyRevenue = monthlyServings * PRICE_PER_SERVING;
    const foodCost = monthlyRevenue * FOOD_COST_RATE;
    const opsCost = monthlyRevenue * OPS_FEE_RATE;
    const monthlyProfit = monthlyRevenue * NET_MARGIN_RATE;

    return {
      monthlyServings,
      monthlyRevenue,
      foodCost,
      opsCost,
      monthlyProfit,
    };
  }, [dailyServings, operatingDays]);

  const sliderProgress = ((dailyServings - 10) / (50 - 10)) * 100;

  return (
    <section id="simulator" className="border-t border-white/10 bg-[#0e0f13] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-wider text-orange-400 sm:text-sm">
              숍인숍 추가 수익 시뮬레이터
            </p>
            <h2 className="mt-2.5 text-balance text-2xl font-bold tracking-tight text-stone-50 sm:text-4xl">
              하루 10~50인분 판매 시 예상 월 추가 매출을 직접 계산해 보세요
            </h2>
          </div>

          {/* Operating days segmented selector */}
          <div
            role="group"
            aria-label="월 영업일수 선택"
            className="inline-flex self-start rounded-xl border border-white/10 bg-[#15171e] p-1"
          >
            <button
              type="button"
              onClick={() => setOperatingDays(26)}
              aria-pressed={operatingDays === 26}
              className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 sm:text-sm ${
                operatingDays === 26
                  ? 'bg-orange-500 text-white'
                  : 'text-stone-400 hover:text-stone-100'
              }`}
            >
              월 26일 영업
            </button>
            <button
              type="button"
              onClick={() => setOperatingDays(30)}
              aria-pressed={operatingDays === 30}
              className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 sm:text-sm ${
                operatingDays === 30
                  ? 'bg-orange-500 text-white'
                  : 'text-stone-400 hover:text-stone-100'
              }`}
            >
              월 30일 영업
            </button>
          </div>
        </div>

        {/* Simulator Card */}
        <div className="mt-10 grid grid-cols-1 items-stretch gap-6 rounded-2xl border border-white/10 bg-[#121318] p-6 sm:p-8 lg:grid-cols-12 lg:gap-10">
          {/* Left: Interactive Slider Controls */}
          <div className="flex flex-col justify-between lg:col-span-6">
            <div>
              <div className="flex items-baseline justify-between gap-4">
                <label
                  htmlFor="daily-servings-slider"
                  className="text-sm font-semibold text-stone-200 sm:text-base"
                >
                  일일 목표 판매량
                </label>
                <div className="font-mono text-2xl font-extrabold tabular-nums text-orange-400 sm:text-3xl">
                  {dailyServings}인분{' '}
                  <span className="text-sm font-medium text-stone-400">/ 일</span>
                </div>
              </div>

              <div className="mt-6">
                <input
                  id="daily-servings-slider"
                  type="range"
                  min={10}
                  max={50}
                  step={1}
                  value={dailyServings}
                  onChange={(e) => setDailyServings(Number(e.target.value))}
                  style={{
                    background: `linear-gradient(to right, #ea580c 0%, #f97316 ${sliderProgress}%, rgba(255,255,255,0.12) ${sliderProgress}%, rgba(255,255,255,0.12) 100%)`,
                  }}
                  className="fire-slider w-full cursor-pointer"
                />
                <div className="mt-2.5 flex justify-between font-mono text-xs tabular-nums text-stone-400">
                  <span>10인분</span>
                  <span>20인분</span>
                  <span>30인분</span>
                  <span>40인분</span>
                  <span>50인분</span>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="mt-6 flex flex-wrap gap-2">
                {QUICK_SERVINGS.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setDailyServings(val)}
                    className={`rounded-lg border px-3 py-1.5 font-mono text-xs font-semibold tabular-nums transition-colors whitespace-nowrap shrink-0 ${
                      dailyServings === val
                        ? 'border-orange-400 bg-orange-500/20 text-orange-200'
                        : 'border-white/10 bg-white/5 text-stone-300 hover:border-white/25 hover:text-white'
                    }`}
                  >
                    일 {val}인분
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 border-t border-white/10 pt-5 text-xs leading-relaxed text-stone-400">
              <p>
                산출 기준: 1인분 판매가 {formatKRW(PRICE_PER_SERVING)} · 월{' '}
                {metrics.monthlyServings.toLocaleString('ko-KR')}인분 · 원물/소스 원가율 32% ·
                배달수수료/부대비 24% 가정 (기존 매장 인건비·임대료 고정 기준 추가 순수익)
              </p>
              <p className="mt-1.5 text-stone-300">
                가맹비 0원 · 로열티 0원으로 본사 수수료 차감 없이 계산됩니다.
              </p>
            </div>
          </div>

          {/* Right: Live Financial Output */}
          <div className="flex flex-col justify-between rounded-xl border border-white/10 bg-[#0b0c10] p-6 lg:col-span-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium text-stone-400">월 예상 추가 매출</p>
                <p className="mt-1.5 font-mono text-2xl font-extrabold tabular-nums text-stone-50 sm:text-3xl">
                  {formatKRW(metrics.monthlyRevenue)}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-orange-300">월 예상 순수익 (약 44%)</p>
                <p className="mt-1.5 font-mono text-2xl font-extrabold tabular-nums text-orange-400 sm:text-3xl">
                  {formatKRW(metrics.monthlyProfit)}
                </p>
              </div>
            </div>

            {/* Proportional Breakdown Bar */}
            <div className="mt-8">
              <div className="flex items-center justify-between text-xs text-stone-400">
                <span>매출 구성 비중</span>
                <span className="font-mono tabular-nums text-stone-300">
                  가맹 로열티 0원
                </span>
              </div>
              <div
                className="mt-2.5 flex h-3 w-full overflow-hidden rounded-full bg-white/5"
                role="img"
                aria-label="예상 순수익 44%, 직공급 원가 32%, 부대 운영비 24%"
              >
                <div
                  className="bg-orange-500 transition-all duration-200"
                  style={{ width: '44%' }}
                />
                <div
                  className="bg-stone-500 transition-all duration-200"
                  style={{ width: '32%' }}
                />
                <div
                  className="bg-stone-700 transition-all duration-200"
                  style={{ width: '24%' }}
                />
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="block text-stone-400">예상 순수익 (44%)</span>
                  <span className="mt-0.5 block font-mono font-semibold tabular-nums text-orange-300">
                    {formatKRW(metrics.monthlyProfit)}
                  </span>
                </div>
                <div>
                  <span className="block text-stone-400">원물/소스 (32%)</span>
                  <span className="mt-0.5 block font-mono font-semibold tabular-nums text-stone-200">
                    {formatKRW(metrics.foodCost)}
                  </span>
                </div>
                <div>
                  <span className="block text-stone-400">운영/수수료 (24%)</span>
                  <span className="mt-0.5 block font-mono font-semibold tabular-nums text-stone-400">
                    {formatKRW(metrics.opsCost)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-white/10 pt-5">
              <button
                type="button"
                onClick={onScrollToApply}
                className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 px-5 py-2.5 text-sm font-bold text-white transition-all duration-150 hover:brightness-110 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 whitespace-nowrap"
              >
                <span>내 매장 맞춤 원가표 &amp; 무료 샘플 받기</span>
                <ArrowDownRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { ArrowUpRight, Flame, PackageCheck, ShieldCheck, Store } from 'lucide-react';

interface AdvantagesSectionProps {
  onInspectRawPhoto: () => void;
  onInspectCookPhoto: () => void;
}

const ADVANTAGES = [
  {
    index: '01',
    title: '직수입 특A급 원물 직공급',
    summary: '물 빠짐 없는 탱글한 식감, 중간 유통 마진 제거',
    detail:
      '수분 손실과 원가 거품을 잡기 위해 선별된 특A급 원물을 직수입 후 매장으로 직접 공급합니다. 조리 후에도 알이 줄어들거나 물이 흥건해지지 않아 고객 만족도가 높습니다.',
    metric: '중간 유통 마진 0% · 직공급 체계',
    icon: PackageCheck,
    actionLabel: '실물 원물 사진 확인',
    actionKey: 'raw' as const,
  },
  {
    index: '02',
    title: '송도 맛집 비법 소스 & 5분 조리',
    summary: '주방장 없이 초보자도 1:1 전수로 동일 맛 구현',
    detail:
      '오랜 현장 검증을 거친 송도 맛집 비법 소스와 계량 표준화 레시피를 1:1로 전수합니다. 고액의 전문 주방장 인건비 없이 아르바이트생도 5분 만에 동일한 불맛을 냅니다.',
    metric: '표준 조리 시간 5분 · 1:1 레시피 전수',
    icon: Flame,
    actionLabel: '실물 불맛 조리 사진 보기',
    actionKey: 'cook' as const,
  },
  {
    index: '03',
    title: '가맹비 0원 · 로열티 0원',
    summary: '초기 창업 비용 부담 제로',
    detail:
      '본사 마진을 위한 가맹비, 교육비 부풀리기, 매달 빠져나가는 매출 연동 로열티를 받지 않습니다. 점주가 팔아서 남긴 순수익은 100% 매장의 몫으로 돌아갑니다.',
    metric: '가맹비 0원 · 로열티 0원 고정',
    icon: ShieldCheck,
    actionLabel: null,
    actionKey: null,
  },
  {
    index: '04',
    title: '기존 매장 숍인숍 즉시 도입',
    summary: '배달·홀 추가 매출 창출을 위한 빠른 세팅',
    detail:
      '호프집, 한식당, 고깃집, 배달 전문점 등 기존 주방의 화구와 조리 동선을 그대로 활용합니다. 대규모 인테리어 공사 없이 숍인숍 메뉴 추가로 비수기·공백 시간대 매출을 끌어올립니다.',
    metric: '기존 주방 설비 활용 · 빠른 숍인숍 세팅',
    icon: Store,
    actionLabel: null,
    actionKey: null,
  },
];

export function AdvantagesSection({
  onInspectRawPhoto,
  onInspectCookPhoto,
}: AdvantagesSectionProps) {
  return (
    <section id="advantages" className="border-t border-white/10 bg-[#0b0b0d] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-wider text-orange-400 sm:text-sm">
            호호C&amp;S 전수창업 핵심 경쟁력
          </p>
          <h2 className="mt-2.5 text-balance text-2xl font-bold tracking-tight text-stone-50 sm:text-4xl">
            인건비와 유통 거품을 걷어낸 실전형 쭈꾸미 숍인숍 모델
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-stone-400 sm:text-base">
            화려한 가맹 조건 대신 원물 품질, 5분 조리 시스템, 0원 가맹 정책으로 매장 순수익에 집중합니다.
          </p>
        </div>

        {/* 4 Core Competitive Advantage Cards */}
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:gap-6">
          {ADVANTAGES.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.index}
                className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#121318] p-6 transition-colors duration-200 hover:border-orange-500/40 sm:p-8"
              >
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-mono text-sm font-semibold tabular-nums text-orange-400">
                      {item.index}.
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-orange-400">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                  </div>

                  <h3 className="mt-5 text-xl font-bold tracking-tight text-stone-50 sm:text-2xl">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm font-semibold text-orange-300">{item.summary}</p>
                  <p className="mt-4 text-sm leading-relaxed text-stone-300/90 sm:text-[15px]">
                    {item.detail}
                  </p>
                </div>

                <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-white/8 pt-4">
                  <span className="text-xs font-medium text-stone-400">{item.metric}</span>

                  {item.actionLabel && (
                    <button
                      type="button"
                      onClick={item.actionKey === 'raw' ? onInspectRawPhoto : onInspectCookPhoto}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-orange-400 transition-colors hover:text-orange-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 whitespace-nowrap shrink-0"
                    >
                      <span>{item.actionLabel}</span>
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

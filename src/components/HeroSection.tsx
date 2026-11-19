import { ArrowDownRight, ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react';
import { SHOWCASE_PHOTOS, type ShowcasePhoto } from '../types/scene';

interface HeroSectionProps {
  activeIndex: number;
  audioEnabled: boolean;
  onSelectPhoto: (index: number) => void;
  onScrollToApply: () => void;
  onToggleAudio: () => void;
}

export function HeroSection({
  activeIndex,
  audioEnabled,
  onSelectPhoto,
  onScrollToApply,
  onToggleAudio,
}: HeroSectionProps) {
  const activePhoto: ShowcasePhoto = SHOWCASE_PHOTOS[activeIndex] ?? SHOWCASE_PHOTOS[0];

  const handlePrev = () => {
    onSelectPhoto((activeIndex - 1 + SHOWCASE_PHOTOS.length) % SHOWCASE_PHOTOS.length);
  };

  const handleNext = () => {
    onSelectPhoto((activeIndex + 1) % SHOWCASE_PHOTOS.length);
  };

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-[#0b0b0d] pt-24 pb-16 sm:pt-28 sm:pb-20 lg:min-h-[calc(100vh-1rem)] lg:flex lg:items-center"
    >
      {/* Subtle atmospheric dark ember backdrop derived from active photo */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <img
          src={activePhoto.src}
          alt=""
          referrerPolicy="no-referrer"
          className="h-full w-full scale-110 object-cover opacity-15 blur-3xl transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0b0d]/80 via-[#0b0b0d]/70 to-[#0b0b0d]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0b0d] via-[#0b0b0d]/85 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: High-Converting B2B Value Proposition */}
          <div className="lg:col-span-6">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold tracking-wide text-orange-400 sm:text-sm">
              <span>호호C&amp;S 쭈꾸미볶음 전수창업</span>
              <span aria-hidden="true" className="text-stone-600">
                ·
              </span>
              <span className="text-stone-300">송도 맛집 불맛 레시피</span>
            </div>

            <h1 className="mt-4 text-balance text-[clamp(2rem,3.6vw,3.35rem)] leading-[1.2] font-extrabold tracking-tight text-stone-50">
              아직도 비싼 주방장 쓰세요?{' '}
              <span className="text-orange-400">5분 조리</span>로 완성하는 송도 맛집 불맛 쭈꾸미
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-relaxed text-stone-300 sm:text-base sm:leading-relaxed">
              물 생기지 않는 직수입 특A급 주꾸미 중간 마진 없는 직공급 · 가맹비 0원 · 로열티 0원
            </p>

            {/* Primary CTA */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onScrollToApply}
                className="inline-flex min-h-[50px] items-center gap-2.5 rounded-xl bg-gradient-to-r from-red-600 via-orange-600 to-orange-500 px-6 py-3.5 text-sm font-bold text-white shadow-[0_10px_30px_rgba(234,88,12,0.4),inset_0_1px_0_rgba(255,255,255,0.22)] transition-all duration-150 hover:brightness-110 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 whitespace-nowrap shrink-0 sm:text-base"
              >
                <span>선착순 10곳 무료 샘플 신청하기</span>
                <ArrowDownRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              </button>
            </div>

            {/* Clean Editorial Key Facts Strip (No pills) */}
            <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-white/10 pt-6 sm:gap-6">
              <div>
                <dt className="text-xs text-stone-400">표준 조리 시간</dt>
                <dd className="mt-1 font-mono text-lg font-bold tabular-nums text-stone-50 sm:text-xl">
                  5분 완성
                </dd>
              </div>
              <div>
                <dt className="text-xs text-stone-400">가맹비 · 로열티</dt>
                <dd className="mt-1 font-mono text-lg font-bold tabular-nums text-orange-400 sm:text-xl">
                  0원 고정
                </dd>
              </div>
              <div>
                <dt className="text-xs text-stone-400">원물 공급 등급</dt>
                <dd className="mt-1 text-lg font-bold text-stone-50 sm:text-xl">직수입 특A급</dd>
              </div>
            </dl>
          </div>

          {/* Right Column: Interactive Real-Photo Showcase */}
          <div className="lg:col-span-6">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_104px] sm:items-stretch">
              {/* Main Featured Photo Stage */}
              <div className="relative aspect-[3/4] max-h-[620px] w-full overflow-hidden rounded-2xl border border-white/12 bg-[#121318]">
                <img
                  key={activePhoto.id}
                  src={activePhoto.src}
                  alt={activePhoto.alt}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover object-center transition-opacity duration-300"
                />

                {/* Bottom Contrast Scrim & Caption */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/55 to-transparent p-5 pt-16">
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium text-orange-300">
                        {activePhoto.category === 'cooked' ? '조리 완성 실물' : '직수입 원물 실물'}
                        <span className="mx-1.5 text-stone-500" aria-hidden="true">
                          ·
                        </span>
                        <span className="font-mono tabular-nums text-stone-300">
                          0{activeIndex + 1} / 0{SHOWCASE_PHOTOS.length}
                        </span>
                      </p>
                      <h2 className="mt-1 text-base font-bold text-stone-50 sm:text-lg">
                        {activePhoto.title}
                      </h2>
                      <p className="mt-0.5 text-xs text-stone-300 sm:text-sm">
                        {activePhoto.description}
                      </p>
                    </div>

                    {/* Optional Sizzle Sound Toggle + Prev/Next */}
                    <div className="flex shrink-0 items-center gap-1.5">
                      {activePhoto.category === 'cooked' && (
                        <button
                          type="button"
                          onClick={onToggleAudio}
                          aria-pressed={audioEnabled}
                          aria-label={audioEnabled ? '불판 사운드 끄기' : '불판 사운드 켜기'}
                          title={audioEnabled ? '불판 사운드 끄기' : '불판 사운드 켜기'}
                          className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 ${
                            audioEnabled
                              ? 'border-orange-400/70 bg-orange-500/25 text-orange-200'
                              : 'border-white/20 bg-black/55 text-stone-200 hover:border-white/40 hover:text-white'
                          }`}
                        >
                          {audioEnabled ? (
                            <Volume2 className="h-4 w-4" aria-hidden="true" />
                          ) : (
                            <VolumeX className="h-4 w-4" aria-hidden="true" />
                          )}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={handlePrev}
                        aria-label="이전 사진 보기"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-black/55 text-stone-200 transition-colors hover:border-white/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                      >
                        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={handleNext}
                        aria-label="다음 사진 보기"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-black/55 text-stone-200 transition-colors hover:border-white/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                      >
                        <ChevronRight className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4-Photo Interactive Thumbnail Selector */}
              <div
                role="tablist"
                aria-label="쭈꾸미 실물 사진 선택"
                className="grid grid-cols-4 gap-2.5 sm:flex sm:flex-col sm:justify-between"
              >
                {SHOWCASE_PHOTOS.map((photo, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <button
                      key={photo.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => onSelectPhoto(idx)}
                      className={`group relative aspect-[3/4] w-full overflow-hidden rounded-xl border text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 sm:flex-1 sm:aspect-auto ${
                        isActive
                          ? 'border-orange-400 ring-1 ring-orange-400/60'
                          : 'border-white/12 opacity-70 hover:border-white/30 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={photo.src}
                        alt={photo.shortLabel}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-2 py-1.5">
                        <span
                          className={`block truncate text-[11px] font-semibold ${
                            isActive ? 'text-orange-300' : 'text-stone-200'
                          }`}
                        >
                          {photo.shortLabel}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

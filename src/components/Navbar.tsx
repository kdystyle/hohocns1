interface NavbarProps {
  onScrollTo: (id: string) => void;
}

export function Navbar({ onScrollTo }: NavbarProps) {
  return (
    <header className="fixed top-0 right-0 left-0 z-30 border-b border-white/10 bg-[#0b0b0d]/88">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 py-3.5 sm:px-6">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            onScrollTo('hero');
          }}
          className="text-lg font-bold tracking-tight text-stone-50 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
        >
          호호C&amp;S
        </a>

        {/* Zone 2: 4 concise single-line navigation links */}
        <nav
          aria-label="주요 메뉴"
          className="hidden items-center gap-6 text-sm font-medium text-stone-300 md:flex"
        >
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              onScrollTo('hero');
            }}
            className="transition-colors hover:text-white whitespace-nowrap shrink-0"
          >
            실물 쇼케이스
          </a>
          <a
            href="#advantages"
            onClick={(e) => {
              e.preventDefault();
              onScrollTo('advantages');
            }}
            className="transition-colors hover:text-white whitespace-nowrap shrink-0"
          >
            핵심 경쟁력
          </a>
          <a
            href="#simulator"
            onClick={(e) => {
              e.preventDefault();
              onScrollTo('simulator');
            }}
            className="transition-colors hover:text-white whitespace-nowrap shrink-0"
          >
            수익 시뮬레이터
          </a>
          <a
            href="#apply"
            onClick={(e) => {
              e.preventDefault();
              onScrollTo('apply');
            }}
            className="transition-colors hover:text-white whitespace-nowrap shrink-0"
          >
            문의 및 상담
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={() => onScrollTo('apply')}
            className="rounded-lg bg-gradient-to-r from-red-600 to-orange-500 px-4 py-2 text-xs font-semibold text-white shadow-[0_4px_16px_rgba(234,88,12,0.35)] transition-transform duration-150 hover:brightness-110 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 whitespace-nowrap shrink-0 sm:text-sm"
          >
            무료 샘플 신청
          </button>
        </div>
      </div>
    </header>
  );
}

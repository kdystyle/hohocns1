interface FooterProps {
  onScrollTo: (id: string) => void;
}

export function Footer({ onScrollTo }: FooterProps) {
  return (
    <footer className="border-t border-white/10 bg-[#08090b] py-10">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-4 text-xs text-stone-400 sm:flex-row sm:items-center sm:px-6 sm:text-sm">
        <div className="space-y-1">
          <p className="text-sm font-bold text-stone-200">호호C&amp;S 쭈꾸미볶음 전수창업</p>
          <p className="flex flex-wrap items-center gap-2">
            <span>대표 고유권</span>
            <span aria-hidden="true">·</span>
            <a
              href="tel:010-9254-8401"
              className="font-mono tabular-nums text-stone-300 transition-colors hover:text-orange-400"
            >
              직통 문의 010-9254-8401
            </a>
            <span aria-hidden="true">·</span>
            <span>가맹비 0원 · 로열티 0원</span>
          </p>
        </div>

        <nav aria-label="푸터 바로가기" className="flex flex-wrap items-center gap-5">
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              onScrollTo('hero');
            }}
            className="transition-colors hover:text-stone-100 whitespace-nowrap"
          >
            실물 쇼케이스
          </a>
          <a
            href="#advantages"
            onClick={(e) => {
              e.preventDefault();
              onScrollTo('advantages');
            }}
            className="transition-colors hover:text-stone-100 whitespace-nowrap"
          >
            핵심 경쟁력
          </a>
          <a
            href="#simulator"
            onClick={(e) => {
              e.preventDefault();
              onScrollTo('simulator');
            }}
            className="transition-colors hover:text-stone-100 whitespace-nowrap"
          >
            수익 시뮬레이터
          </a>
          <a
            href="#apply"
            onClick={(e) => {
              e.preventDefault();
              onScrollTo('apply');
            }}
            className="transition-colors hover:text-stone-100 whitespace-nowrap"
          >
            무료 샘플 신청
          </a>
        </nav>
      </div>
    </footer>
  );
}

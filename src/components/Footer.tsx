import { ExternalLink } from 'lucide-react';

interface FooterProps {
  onScrollTo: (id: string) => void;
}

export function Footer({ onScrollTo }: FooterProps) {
  return (
    <footer className="border-t border-white/10 bg-[#08090b] py-12">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-4 text-xs text-stone-400 lg:flex-row lg:items-start sm:px-6 sm:text-sm">
        {/* Company Info & Store Link */}
        <div className="space-y-2">
          <p className="text-base font-bold text-stone-100">호호C&amp;S 쭈꾸미볶음 전수창업</p>
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-stone-300">
            <span>대표 고유권</span>
            <span aria-hidden="true" className="text-stone-600">
              ·
            </span>
            <a
              href="tel:010-9254-8401"
              className="font-mono tabular-nums text-stone-200 transition-colors hover:text-orange-400"
            >
              직통 문의 010-9254-8401
            </a>
            <span aria-hidden="true" className="text-stone-600">
              ·
            </span>
            <span>가맹비 0원 · 로열티 0원</span>
          </p>
          <p className="text-stone-400">주소: 인천시 서구 가정로 77번길 57, 1층</p>
          <div className="pt-1.5">
            <a
              href="https://hohocns.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-semibold text-orange-400 underline-offset-4 transition-colors hover:text-orange-300 hover:underline"
            >
              <span>송도 호호 화덕생선구이&amp;해물요리점</span>
              <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Footer Quick Links */}
        <nav aria-label="푸터 바로가기" className="flex flex-wrap items-center gap-5 lg:pt-1">
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

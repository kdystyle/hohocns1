import { type FormEvent, useEffect, useState } from 'react';
import {
  Check,
  CheckCircle2,
  Copy,
  Loader2,
  MessageSquareText,
  PhoneCall,
  Send,
  X,
} from 'lucide-react';

interface SubmittedRequest {
  storeInfo: string;
  phone: string;
  businessType: string;
  smsBody: string;
  smsHref: string;
  sheetSent: boolean;
}

const CONTACT_PHONE = '010-9254-8401';
const COMPANY_ADDRESS = '인천시 서구 가정로 77번길 57, 1층';

const BUSINESS_TYPES = [
  '호프 · 포차 · 주점',
  '한식당 · 백반 · 고깃집',
  '배달 전문 매장',
  '신규 창업 준비',
];

function formatKoreanPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

function buildSmsDetails(storeInfo: string, phone: string, businessType: string) {
  const smsBody = [
    '[호호C&S 쭈꾸미 무료 샘플 신청]',
    `매장명/지역: ${storeInfo}`,
    `연락처: ${phone}`,
    `현재 업종: ${businessType}`,
  ].join('\n');

  const isIOS =
    typeof navigator !== 'undefined' && /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const sep = isIOS ? '&' : '?';
  const smsHref = `sms:${CONTACT_PHONE}${sep}body=${encodeURIComponent(smsBody)}`;

  return { smsBody, smsHref };
}

function isMobileDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export function SampleInquirySection() {
  const [storeInfo, setStoreInfo] = useState('');
  const [phone, setPhone] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState<SubmittedRequest | null>(null);

  useEffect(() => {
    if (!submitted) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSubmitted(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [submitted]);

  const handleCopyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable in restricted context
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const trimmedStore = storeInfo.trim();
    const digits = phone.replace(/\D/g, '');
    const trimmedBiz = businessType.trim();

    if (!trimmedStore) {
      setFormError('매장명과 지역을 입력해 주세요.');
      return;
    }
    if (digits.length < 9 || digits.length > 11) {
      setFormError('올바른 연락처(휴대폰 또는 매장 전화번호)를 입력해 주세요.');
      return;
    }
    if (!trimmedBiz) {
      setFormError('현재 운영 중이거나 준비 중인 업종을 입력하거나 선택해 주세요.');
      return;
    }

    setFormError(null);
    setIsSubmitting(true);

    const formattedPhone = formatKoreanPhone(digits);
    const { smsBody, smsHref } = buildSmsDetails(trimmedStore, formattedPhone, trimmedBiz);

    // 1. Send to Google Sheets Apps Script Webhook if configured
    const webhookUrl = (import.meta.env.VITE_GOOGLE_SHEET_WEBHOOK_URL as string | undefined)?.trim();
    let sheetSent = false;

    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          },
          body: JSON.stringify({
            submittedAt: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
            storeInfo: trimmedStore,
            phone: formattedPhone,
            businessType: trimmedBiz,
            source: '호호C&S 쭈꾸미 전수창업 랜딩페이지',
          }),
        });
        sheetSent = true;
      } catch {
        sheetSent = false;
      }
    }

    setIsSubmitting(false);
    setCopied(false);
    setSubmitted({
      storeInfo: trimmedStore,
      phone: formattedPhone,
      businessType: trimmedBiz,
      smsBody,
      smsHref,
      sheetSent,
    });
    setStoreInfo('');
    setPhone('');
    setBusinessType('');

    // 2. On standalone mobile browsers, open pre-filled SMS composer directly
    if (isMobileDevice() && window.self === window.top) {
      window.location.href = smsHref;
    }
  };

  return (
    <section id="apply" className="border-t border-white/10 bg-[#0b0b0d] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Urgent Highlight Header */}
        <div className="max-w-3xl">
          <p className="text-xs font-semibold tracking-wider text-orange-400 sm:text-sm">
            선착순 10곳 한정 무료 샘플 프로모션
          </p>
          <h2 className="mt-2.5 text-balance text-2xl font-extrabold tracking-tight text-stone-50 sm:text-4xl">
            선착순 10곳 한정! 특A급 주꾸미 원물 + 송도 비법 소스 무료 샘플 발송
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-stone-400 sm:text-base">
            백 마디 설명보다 매장에서 직접 5분만 조리해 보시면 원물의 탱글함과 불맛의 차이를 바로 확인하실 수 있습니다.
          </p>
        </div>

        {/* 2-Column Balanced Split */}
        <div className="mt-12 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12 lg:gap-8">
          {/* Left: Direct Contact & Sample Kit Details */}
          <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#121318] p-6 sm:p-8 lg:col-span-5">
            <div>
              <h3 className="text-lg font-bold text-stone-50 sm:text-xl">
                직통 상담 및 원물 공급 안내
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-400">
                접수 즉시 담당자가 매장의 주방 환경과 상권을 확인한 뒤, 신선 아이스박스로 무료 샘플을 발송해 드립니다.
              </p>

              {/* Direct Contact Table */}
              <dl className="mt-7 divide-y divide-white/10 border-y border-white/10 text-sm">
                <div className="flex items-center justify-between gap-4 py-3.5">
                  <dt className="shrink-0 text-stone-400">업체명</dt>
                  <dd className="text-right font-semibold text-stone-100">호호C&amp;S</dd>
                </div>
                <div className="flex items-center justify-between gap-4 py-3.5">
                  <dt className="shrink-0 text-stone-400">담당자</dt>
                  <dd className="text-right font-semibold text-stone-100">대표 고유권</dd>
                </div>
                <div className="flex items-center justify-between gap-4 py-3.5">
                  <dt className="shrink-0 text-stone-400">직통 문의전화</dt>
                  <dd className="text-right">
                    <a
                      href={`tel:${CONTACT_PHONE}`}
                      className="font-mono text-base font-bold tabular-nums text-orange-400 underline-offset-4 hover:text-orange-300 hover:underline"
                    >
                      {CONTACT_PHONE}
                    </a>
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 py-3.5">
                  <dt className="shrink-0 text-stone-400">주소</dt>
                  <dd className="text-right font-medium text-stone-200">{COMPANY_ADDRESS}</dd>
                </div>
              </dl>

              <div className="mt-7 space-y-2.5 text-sm text-stone-300">
                <p className="font-semibold text-stone-100">무료 샘플 발송 구성</p>
                <p>01. 직수입 특A급 손질 주꾸미 테스트 원물</p>
                <p>02. 송도 맛집 비법 양념 소스 &amp; 불맛 베이스</p>
                <p>03. 주방장 없는 5분 표준 조리 매뉴얼</p>
              </div>
            </div>

            {/* One-Tap Mobile Direct Call CTA */}
            <div className="mt-8 pt-2">
              <a
                href={`tel:${CONTACT_PHONE}`}
                className="inline-flex min-h-[48px] w-full items-center justify-center gap-2.5 rounded-xl border border-orange-400/50 bg-orange-500/15 px-5 py-3 text-sm font-bold text-orange-200 transition-colors hover:border-orange-400 hover:bg-orange-500/25 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 whitespace-nowrap sm:text-base"
              >
                <PhoneCall className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="font-mono tabular-nums">{CONTACT_PHONE}</span>
                <span>바로 전화 상담</span>
              </a>
            </div>
          </div>

          {/* Right: Interactive Sample Application Form */}
          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#121318] p-6 sm:p-8 lg:col-span-7"
          >
            <div>
              <h3 className="text-lg font-bold text-stone-50 sm:text-xl">
                무료 샘플 신청서 작성
              </h3>
              <p className="mt-1.5 text-sm text-stone-400">
                신청 시 접수 내역이 자동 기록되며, 모바일에서는 대표님 직통 문자 전송으로 바로 이어집니다.
              </p>

              <div className="mt-7 space-y-5">
                <div>
                  <label
                    htmlFor="store-info-input"
                    className="block text-sm font-medium text-stone-200"
                  >
                    매장명 / 지역 <span className="text-orange-400">*</span>
                  </label>
                  <input
                    id="store-info-input"
                    type="text"
                    required
                    value={storeInfo}
                    onChange={(e) => setStoreInfo(e.target.value)}
                    placeholder="예: 송도 쭈꾸미 포차 / 인천 연수구"
                    className="mt-2 min-h-[46px] w-full rounded-xl border border-white/15 bg-[#0b0c10] px-4 py-2.5 text-sm text-stone-100 placeholder:text-stone-500 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone-input"
                    className="block text-sm font-medium text-stone-200"
                  >
                    연락처 <span className="text-orange-400">*</span>
                  </label>
                  <input
                    id="phone-input"
                    type="tel"
                    inputMode="numeric"
                    required
                    value={phone}
                    onChange={(e) => setPhone(formatKoreanPhone(e.target.value))}
                    placeholder="010-0000-0000"
                    className="mt-2 min-h-[46px] w-full rounded-xl border border-white/15 bg-[#0b0c10] px-4 py-2.5 font-mono text-sm tabular-nums text-stone-100 placeholder:text-stone-500 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30"
                  />
                </div>

                <div>
                  <label
                    htmlFor="business-type-input"
                    className="block text-sm font-medium text-stone-200"
                  >
                    현재 업종 <span className="text-orange-400">*</span>
                  </label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {BUSINESS_TYPES.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setBusinessType(type)}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                          businessType === type
                            ? 'border-orange-400 bg-orange-500/20 text-orange-100'
                            : 'border-white/12 bg-white/5 text-stone-300 hover:border-white/25 hover:text-white'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                  <input
                    id="business-type-input"
                    type="text"
                    required
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    placeholder="직접 입력하거나 위 업종을 선택하세요 (예: 호프집 숍인숍)"
                    className="mt-2.5 min-h-[46px] w-full rounded-xl border border-white/15 bg-[#0b0c10] px-4 py-2.5 text-sm text-stone-100 placeholder:text-stone-500 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30"
                  />
                </div>
              </div>

              {formError && (
                <p role="alert" className="mt-4 text-sm font-medium text-red-400">
                  {formError}
                </p>
              )}
            </div>

            <div className="mt-8 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 via-orange-600 to-orange-500 px-6 py-3 text-sm font-bold text-white shadow-[0_8px_28px_rgba(234,88,12,0.38)] transition-all duration-150 hover:brightness-110 active:scale-[0.99] disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 whitespace-nowrap sm:text-base"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden="true" />
                    <span>접수 처리 중...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>선착순 10곳 무료 샘플 신청하기</span>
                  </>
                )}
              </button>
              <p className="mt-3 text-center text-xs text-stone-500">
                가맹 강요 없이 샘플 시식 및 원물 단가 안내만 깔끔하게 진행됩니다.
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation Modal Popup with SMS Quick-Send & Copy */}
      {submitted && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="sample-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
        >
          <div className="relative w-full max-w-md rounded-2xl border border-white/15 bg-[#14151b] p-6 shadow-2xl sm:p-7">
            <button
              type="button"
              onClick={() => setSubmitted(null)}
              aria-label="팝업 닫기"
              className="absolute top-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-lg text-stone-400 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>

            <div className="flex items-center gap-3 text-orange-400">
              <CheckCircle2 className="h-7 w-7 shrink-0" aria-hidden="true" />
              <h3 id="sample-modal-title" className="text-xl font-bold text-stone-50">
                무료 샘플 신청이 접수되었습니다
              </h3>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-stone-300">
              호호C&amp;S <strong className="text-stone-100">대표 고유권</strong> 담당자가 접수 내용을 확인한 뒤 빠르게 안내드리겠습니다. 더 빠른 확인을 원하시면 아래 버튼으로 문자를 바로 보내주세요.
            </p>

            <dl className="mt-5 divide-y divide-white/10 rounded-xl border border-white/10 bg-[#0b0c10] px-4 text-sm">
              <div className="flex items-center justify-between gap-4 py-2.5">
                <dt className="shrink-0 text-stone-400">매장명 / 지역</dt>
                <dd className="text-right font-medium text-stone-100">{submitted.storeInfo}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-2.5">
                <dt className="shrink-0 text-stone-400">연락처</dt>
                <dd className="font-mono tabular-nums text-stone-100">{submitted.phone}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-2.5">
                <dt className="shrink-0 text-stone-400">현재 업종</dt>
                <dd className="text-right font-medium text-stone-100">{submitted.businessType}</dd>
              </div>
            </dl>

            <div className="mt-5 space-y-2.5">
              {/* Primary SMS Direct Action */}
              <a
                href={submitted.smsHref}
                className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 px-4 py-2.5 text-sm font-bold text-white transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 whitespace-nowrap"
              >
                <MessageSquareText className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>대표님께 문자로 바로 전송 ({CONTACT_PHONE})</span>
              </a>

              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => handleCopyText(submitted.smsBody)}
                  className="inline-flex min-h-[42px] flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-stone-200 transition-colors hover:border-white/30 hover:bg-white/10 hover:text-white whitespace-nowrap sm:text-sm"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-orange-400" aria-hidden="true" />
                      <span>내용 복사됨</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" aria-hidden="true" />
                      <span>신청 내용 복사</span>
                    </>
                  )}
                </button>

                <a
                  href={`tel:${CONTACT_PHONE}`}
                  className="inline-flex min-h-[42px] flex-1 items-center justify-center gap-1.5 rounded-xl border border-orange-400/40 bg-orange-500/15 px-3 py-2 text-xs font-semibold text-orange-200 transition-colors hover:bg-orange-500/25 hover:text-white whitespace-nowrap sm:text-sm"
                >
                  <PhoneCall className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>바로 전화하기</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

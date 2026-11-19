export type PhotoCategory = 'cooked' | 'raw';

export interface ShowcasePhoto {
  id: string;
  src: string;
  category: PhotoCategory;
  shortLabel: string;
  title: string;
  description: string;
  alt: string;
}

export const SHOWCASE_PHOTOS: ShowcasePhoto[] = [
  {
    id: 'fire-platter',
    src: '/assets/aistudio/44-1_b4f1a8fe.jpg',
    category: 'cooked',
    shortLabel: '직화 불맛',
    title: '송도 맛집 비법 소스 · 5분 직화 불맛 조리',
    description: '강한 불향과 윤기 흐르는 비법 양념이 배어든 철판 쭈꾸미볶음',
    alt: '활활 타오르는 불꽃 앞 뜨거운 철판에 담긴 윤기 나는 불맛 쭈꾸미볶음과 콩나물 곁들임',
  },
  {
    id: 'skillet-sprouts',
    src: '/assets/aistudio/33-1_4836e588.jpg',
    category: 'cooked',
    shortLabel: '콩나물 완성',
    title: '아삭한 콩나물과 즐기는 매콤 쭈꾸미볶음',
    description: '물 생기지 않고 탱글하게 볶아낸 특A급 주꾸미와 통깨·콩나물 토핑',
    alt: '김이 모락모락 나는 무쇠팬 위 매콤한 쭈꾸미볶음과 신선한 콩나물, 통깨, 청홍고추',
  },
  {
    id: 'raw-ice-pan',
    src: '/assets/aistudio/22_62d7afd5.jpg',
    category: 'raw',
    shortLabel: '특A급 원물',
    title: '직수입 특A급 주꾸미 원물 직공급',
    description: '중간 유통 마진 없이 공급하는 신선하고 탄력 있는 특A급 손질 원물',
    alt: '얼음 위 검은 팬에 담긴 신선하고 탱글한 직수입 특A급 생주꾸미 원물과 대파, 마늘, 고추',
  },
  {
    id: 'raw-closeup',
    src: '/assets/aistudio/11_6328a14a.png',
    category: 'raw',
    shortLabel: '원물 근접',
    title: '물 빠짐 없는 탱글한 특A급 주꾸미 근접 확인',
    description: '조리 후에도 사이즈와 식감이 살아있는 최상급 선도의 원물 퀄리티',
    alt: '얼음과 검은 현무암 위 검은 팬에 담긴 특A급 주꾸미 원물의 탱글한 빨판과 살결 클로즈업',
  },
];

/**
 * 한국관광공사 API 타입 정의
 * 
 * @description
 * 한국관광공사 KorService2 API의 응답 데이터 타입을 정의합니다.
 * 
 * @see https://www.data.go.kr/data/15101578/openapi.do
 * @see PRD.md - 5. 데이터 구조
 */

// =====================================================
// 관광지 목록 (areaBasedList2, searchKeyword2)
// =====================================================

/**
 * 관광지 목록 아이템
 * 
 * @description
 * 지역 기반 목록 조회 또는 키워드 검색 시 반환되는 관광지 정보
 * 
 * @example
 * ```typescript
 * const tourItem: TourItem = {
 *   contentid: '125266',
 *   contenttypeid: '12',
 *   title: '경복궁',
 *   addr1: '서울특별시 종로구 사직로 161',
 *   mapx: '1269125690',
 *   mapy: '374933742',
 *   firstimage: 'http://...',
 *   areacode: '1',
 *   modifiedtime: '20231201120000',
 * };
 * ```
 */
export interface TourItem {
  /** 콘텐츠 ID */
  contentid: string;
  
  /** 콘텐츠 타입 ID (12: 관광지, 14: 문화시설, 15: 축제/행사, 25: 여행코스, 28: 레포츠, 32: 숙박, 38: 쇼핑, 39: 음식점) */
  contenttypeid: string;
  
  /** 관광지명 */
  title: string;
  
  /** 주소 */
  addr1: string;
  
  /** 상세주소 (선택) */
  addr2?: string;
  
  /** 지역코드 */
  areacode: string;
  
  /** 경도 (KATEC 좌표계, 정수형 - WGS84 변환: mapx / 10000000) */
  mapx: string;
  
  /** 위도 (KATEC 좌표계, 정수형 - WGS84 변환: mapy / 10000000) */
  mapy: string;
  
  /** 대표 이미지 1 (선택) */
  firstimage?: string;
  
  /** 대표 이미지 2 (선택) */
  firstimage2?: string;
  
  /** 전화번호 (선택) */
  tel?: string;
  
  /** 대분류 (선택) */
  cat1?: string;
  
  /** 중분류 (선택) */
  cat2?: string;
  
  /** 소분류 (선택) */
  cat3?: string;
  
  /** 수정일 (YYYYMMDDHHMMSS) */
  modifiedtime: string;
  
  /** 생성일 (YYYYMMDDHHMMSS, 선택) */
  createdtime?: string;
  
  /** 북마크 수 (선택, 추가 기능) */
  bookmarkcount?: number;
}

// =====================================================
// 상세 정보 (detailCommon2)
// =====================================================

/**
 * 관광지 상세 정보 (공통)
 * 
 * @description
 * detailCommon2 API로 조회한 관광지 상세 정보
 * 
 * @example
 * ```typescript
 * const tourDetail: TourDetail = {
 *   contentid: '125266',
 *   contenttypeid: '12',
 *   title: '경복궁',
 *   addr1: '서울특별시 종로구 사직로 161',
 *   overview: '조선 왕조의 법궁...',
 *   homepage: '<a href="...">...',
 *   tel: '02-3700-3900',
 *   mapx: '1269125690',
 *   mapy: '374933742',
 * };
 * ```
 */
export interface TourDetail {
  /** 콘텐츠 ID */
  contentid: string;
  
  /** 콘텐츠 타입 ID */
  contenttypeid: string;
  
  /** 관광지명 */
  title: string;
  
  /** 주소 */
  addr1: string;
  
  /** 상세주소 (선택) */
  addr2?: string;
  
  /** 우편번호 (선택) */
  zipcode?: string;
  
  /** 전화번호 (선택) */
  tel?: string;
  
  /** 홈페이지 (HTML 형식, 선택) */
  homepage?: string;
  
  /** 개요 (긴 설명, 선택) */
  overview?: string;
  
  /** 대표 이미지 1 (선택) */
  firstimage?: string;
  
  /** 대표 이미지 2 (선택) */
  firstimage2?: string;
  
  /** 경도 (KATEC 좌표계) */
  mapx: string;
  
  /** 위도 (KATEC 좌표계) */
  mapy: string;
  
  /** 지역코드 (선택) */
  areacode?: string;
  
  /** 시군구코드 (선택) */
  sigungucode?: string;
  
  /** 대분류 (선택) */
  cat1?: string;
  
  /** 중분류 (선택) */
  cat2?: string;
  
  /** 소분류 (선택) */
  cat3?: string;
  
  /** 수정일 (선택) */
  modifiedtime?: string;
  
  /** 생성일 (선택) */
  createdtime?: string;
}

// =====================================================
// 소개 정보 (detailIntro2)
// =====================================================

/**
 * 관광지 소개 정보 (운영 정보)
 * 
 * @description
 * detailIntro2 API로 조회한 관광지 운영 정보
 * 타입별로 필드가 다르므로 모든 필드를 선택적으로 정의
 * 
 * @example
 * ```typescript
 * const tourIntro: TourIntro = {
 *   contentid: '125266',
 *   contenttypeid: '12',
 *   usetime: '09:00~18:00',
 *   restdate: '화요일',
 *   parking: '가능',
 *   chkpet: '불가',
 * };
 * ```
 */
export interface TourIntro {
  /** 콘텐츠 ID */
  contentid: string;
  
  /** 콘텐츠 타입 ID */
  contenttypeid: string;
  
  // 공통 필드
  /** 이용시간 (선택) */
  usetime?: string;
  
  /** 휴무일 (선택) */
  restdate?: string;
  
  /** 문의처 (선택) */
  infocenter?: string;
  
  /** 주차 가능 여부 (선택) */
  parking?: string;
  
  /** 반려동물 동반 가능 여부 (선택) */
  chkpet?: string;
  
  // 관광지 (12)
  /** 체험 가능 연령 (선택) */
  expagerange?: string;
  
  /** 체험 안내 (선택) */
  expguide?: string;
  
  /** 수용인원 (선택) */
  accomcount?: string;
  
  /** 유모차 대여 정보 (선택) */
  chkbabycarriage?: string;
  
  /** 신용카드 가능 정보 (선택) */
  chkcreditcard?: string;
  
  // 문화시설 (14)
  /** 관람 소요시간 (선택) */
  spendtime?: string;
  
  /** 할인 정보 (선택) */
  discountinfo?: string;
  
  // 축제/행사 (15)
  /** 행사 시작일 (선택) */
  eventstartdate?: string;
  
  /** 행사 종료일 (선택) */
  eventenddate?: string;
  
  /** 행사 장소 (선택) */
  eventplace?: string;
  
  /** 행사 홈페이지 (선택) */
  eventhomepage?: string;
  
  /** 주최자 정보 (선택) */
  sponsor1?: string;
  
  /** 주관사 정보 (선택) */
  sponsor2?: string;
  
  /** 행사 프로그램 (선택) */
  program?: string;
  
  // 숙박 (32)
  /** 객실 수 (선택) */
  roomcount?: string;
  
  /** 객실 타입 (선택) */
  roomtype?: string;
  
  /** 예약 안내 (선택) */
  reservationurl?: string;
  
  /** 입실 시간 (선택) */
  checkintime?: string;
  
  /** 퇴실 시간 (선택) */
  checkouttime?: string;
  
  // 음식점 (39)
  /** 대표 메뉴 (선택) */
  firstmenu?: string;
  
  /** 취급 메뉴 (선택) */
  treatmenu?: string;
  
  /** 금연/흡연 여부 (선택) */
  smoking?: string;
  
  /** 포장 가능 (선택) */
  packing?: string;
  
  /** 좌석 수 (선택) */
  seat?: string;
}

// =====================================================
// 이미지 정보 (detailImage2)
// =====================================================

/**
 * 관광지 이미지 정보
 * 
 * @description
 * detailImage2 API로 조회한 관광지 이미지 목록
 * 
 * @example
 * ```typescript
 * const tourImage: TourImage = {
 *   contentid: '125266',
 *   originimgurl: 'http://...original.jpg',
 *   smallimageurl: 'http://...small.jpg',
 *   serialnum: '1',
 * };
 * ```
 */
export interface TourImage {
  /** 콘텐츠 ID */
  contentid: string;
  
  /** 원본 이미지 URL */
  originimgurl: string;
  
  /** 썸네일 이미지 URL */
  smallimageurl: string;
  
  /** 이미지 일련번호 */
  serialnum?: string;
  
  /** 이미지 설명 (선택) */
  imgname?: string;
}

// =====================================================
// 반려동물 정보 (detailPetTour2)
// =====================================================

/**
 * 반려동물 동반 여행 정보
 * 
 * @description
 * detailPetTour2 API로 조회한 반려동물 동반 정보
 * 
 * @see PRD.md - 2.5 반려동물 동반 여행
 * 
 * @example
 * ```typescript
 * const petTourInfo: PetTourInfo = {
 *   contentid: '125266',
 *   contenttypeid: '12',
 *   chkpetleash: '가능',
 *   chkpetsize: '소형견',
 *   chkpetplace: '실외만',
 *   petinfo: '반려동물 동반 시 목줄 필수',
 * };
 * ```
 */
export interface PetTourInfo {
  /** 콘텐츠 ID */
  contentid: string;
  
  /** 콘텐츠 타입 ID */
  contenttypeid: string;
  
  /** 반려동물 동반 여부 (선택) */
  chkpetleash?: string;
  
  /** 반려동물 크기 제한 (선택) */
  chkpetsize?: string;
  
  /** 입장 가능 장소 (실내/실외, 선택) */
  chkpetplace?: string;
  
  /** 반려동물 동반 추가 요금 (선택) */
  chkpetfee?: string;
  
  /** 기타 반려동물 정보 (선택) */
  petinfo?: string;
  
  /** 주차장 정보 (선택) */
  parking?: string;
}

// =====================================================
// 지역코드 (areaCode2)
// =====================================================

/**
 * 지역코드 정보
 * 
 * @description
 * areaCode2 API로 조회한 지역코드 (시/도, 시/군/구)
 * 
 * @example
 * ```typescript
 * const areaCode: AreaCode = {
 *   code: '1',
 *   name: '서울',
 *   rnum: 1,
 * };
 * ```
 */
export interface AreaCode {
  /** 지역코드 */
  code: string;
  
  /** 지역명 */
  name: string;
  
  /** 순번 */
  rnum: number;
}

// =====================================================
// Content Type ID 상수
// =====================================================

/**
 * 관광 타입 ID
 * 
 * @description
 * 한국관광공사 API의 콘텐츠 타입 ID
 * 
 * @see PRD.md - 4.4 Content Type ID
 */
export const CONTENT_TYPE_ID = {
  /** 관광지 */
  TOURIST_SPOT: '12',
  
  /** 문화시설 */
  CULTURAL_FACILITY: '14',
  
  /** 축제/행사 */
  FESTIVAL: '15',
  
  /** 여행코스 */
  TRAVEL_COURSE: '25',
  
  /** 레포츠 */
  LEPORTS: '28',
  
  /** 숙박 */
  ACCOMMODATION: '32',
  
  /** 쇼핑 */
  SHOPPING: '38',
  
  /** 음식점 */
  RESTAURANT: '39',
} as const;

/**
 * 관광 타입 ID 타입
 */
export type ContentTypeId = typeof CONTENT_TYPE_ID[keyof typeof CONTENT_TYPE_ID];

/**
 * 관광 타입 이름 매핑
 */
export const CONTENT_TYPE_NAMES: Record<ContentTypeId, string> = {
  '12': '관광지',
  '14': '문화시설',
  '15': '축제/행사',
  '25': '여행코스',
  '28': '레포츠',
  '32': '숙박',
  '38': '쇼핑',
  '39': '음식점',
};

// =====================================================
// 유틸리티 타입
// =====================================================

/**
 * WGS84 좌표
 * 
 * @description
 * KATEC 좌표를 WGS84로 변환한 결과
 */
export interface Coordinates {
  /** 경도 (Longitude) */
  lng: number;
  
  /** 위도 (Latitude) */
  lat: number;
}

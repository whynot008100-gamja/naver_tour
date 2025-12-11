/**
 * 한국관광공사 KorService2 API 클라이언트
 *
 * @description
 * 한국관광공사 공공 API를 호출하는 함수들을 제공합니다.
 * - 지역코드 조회
 * - 관광지 목록 조회
 * - 키워드 검색
 * - 상세 정보 조회 (공통, 소개, 이미지, 반려동물)
 *
 * @see https://www.data.go.kr/data/15101578/openapi.do
 */

// =====================================================
// 상수 정의
// =====================================================

const BASE_URL = "https://apis.data.go.kr/B551011/KorService2";
const MOBILE_OS = "ETC";
const MOBILE_APP = "MyTrip";
const RESPONSE_TYPE = "json";
const DEFAULT_TIMEOUT = 10000; // 10초
const MAX_RETRIES = 3;

// =====================================================
// 타입 정의 (임시 - Phase 1-C에서 lib/types/tour.ts로 이동 예정)
// =====================================================

interface ApiResponse<T> {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items?: {
        item: T[];
      };
      totalCount?: number;
      numOfRows?: number;
      pageNo?: number;
    };
  };
}

export interface AreaCodeParams {
  areaCode?: string;
  numOfRows?: number;
  pageNo?: number;
}

export interface AreaBasedListParams {
  areaCode?: string;
  contentTypeId?: string;
  numOfRows?: number;
  pageNo?: number;
  arrange?: "A" | "B" | "C" | "D" | "E"; // A: 제목순, B: 조회순, C: 수정일순, D: 생성일순, E: 거리순
}

export interface SearchKeywordParams {
  keyword: string;
  areaCode?: string;
  contentTypeId?: string;
  numOfRows?: number;
  pageNo?: number;
}

// =====================================================
// 환경변수 로드 함수
// =====================================================

/**
 * API 키를 환경변수에서 로드합니다.
 *
 * @returns API 키
 * @throws {Error} API 키가 설정되지 않은 경우
 *
 * @description
 * 우선순위:
 * 1. TOUR_API_KEY (서버 사이드용)
 * 2. NEXT_PUBLIC_TOUR_API_KEY (클라이언트 사이드용)
 */
function getApiKey(): string {
  const apiKey =
    process.env.TOUR_API_KEY || process.env.NEXT_PUBLIC_TOUR_API_KEY;

  if (!apiKey) {
    throw new Error(
      "한국관광공사 API 키가 설정되지 않았습니다. " +
        ".env 파일에 TOUR_API_KEY 또는 NEXT_PUBLIC_TOUR_API_KEY를 설정하세요.",
    );
  }

  return apiKey;
}

// =====================================================
// 공통 파라미터 생성 함수
// =====================================================

/**
 * API 호출에 필요한 공통 파라미터를 생성합니다.
 *
 * @returns URLSearchParams 객체
 */
function buildCommonParams(): URLSearchParams {
  const params = new URLSearchParams();
  params.append("serviceKey", getApiKey());
  params.append("MobileOS", MOBILE_OS);
  params.append("MobileApp", MOBILE_APP);
  params.append("_type", RESPONSE_TYPE);
  return params;
}

// =====================================================
// 에러 처리 함수
// =====================================================

/**
 * API 에러를 처리하고 사용자 친화적인 에러 메시지를 생성합니다.
 *
 * @param error - 에러 객체
 * @throws {Error} 처리된 에러
 */
function handleApiError(error: any): never {
  if (error.response) {
    // HTTP 에러 응답
    const status = error.response.status;
    const statusText = error.response.statusText;

    if (status === 401) {
      throw new Error("API 인증 실패: API 키를 확인하세요.");
    } else if (status === 404) {
      throw new Error("요청한 데이터를 찾을 수 없습니다.");
    } else if (status === 429) {
      throw new Error("API 호출 제한을 초과했습니다. 잠시 후 다시 시도하세요.");
    } else if (status >= 500) {
      throw new Error(`서버 오류가 발생했습니다. (${status} ${statusText})`);
    } else {
      throw new Error(`API 호출 실패: ${status} ${statusText}`);
    }
  } else if (error.request) {
    // 네트워크 에러
    throw new Error("네트워크 오류: 인터넷 연결을 확인하세요.");
  } else {
    // 기타 에러
    throw new Error(`알 수 없는 오류: ${error.message}`);
  }
}

// =====================================================
// 재시도 로직
// =====================================================

/**
 * 함수를 재시도합니다. (지수 백오프)
 *
 * @param fn - 재시도할 함수
 * @param maxRetries - 최대 재시도 횟수 (기본값: 3)
 * @returns 함수 실행 결과
 */
async function retryFetch<T>(
  fn: () => Promise<T>,
  maxRetries: number = MAX_RETRIES,
): Promise<T> {
  let lastError: any;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // 마지막 시도가 아니면 대기 후 재시도
      if (attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 1000; // 1초, 2초, 4초
        console.warn(
          `API 호출 실패. ${delay}ms 후 재시도... (${
            attempt + 1
          }/${maxRetries})`,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  // 모든 재시도 실패
  throw lastError;
}

// =====================================================
// API 호출 헬퍼 함수
// =====================================================

/**
 * 한국관광공사 API를 호출합니다.
 *
 * @param endpoint - API 엔드포인트 (예: '/areaCode2')
 * @param params - 추가 파라미터
 * @returns API 응답 데이터
 */
async function fetchTourApi<T>(
  endpoint: string,
  params: Record<string, any> = {},
): Promise<T[]> {
  return retryFetch(async () => {
    // 공통 파라미터 생성
    const urlParams = buildCommonParams();

    // 추가 파라미터 추가
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        urlParams.append(key, String(value));
      }
    });

    // URL 생성
    const url = `${BASE_URL}${endpoint}?${urlParams.toString()}`;

    try {
      // API 호출
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

      const response = await fetch(url, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // HTTP 에러 체크
      if (!response.ok) {
        throw {
          response: {
            status: response.status,
            statusText: response.statusText,
          },
        };
      }

      // JSON 파싱
      const data: ApiResponse<T> = await response.json();

      // API 응답 헤더 체크
      const { resultCode, resultMsg } = data.response.header;
      if (resultCode !== "0000") {
        throw new Error(`API 오류: ${resultMsg} (코드: ${resultCode})`);
      }

      // 데이터 반환
      return data.response.body.items?.item || [];
    } catch (error: any) {
      if (error.name === "AbortError") {
        throw new Error(`API 호출 타임아웃: ${DEFAULT_TIMEOUT}ms 초과`);
      }
      handleApiError(error);
    }
  });
}

// =====================================================
// 개별 API 함수들
// =====================================================

/**
 * 지역코드를 조회합니다.
 *
 * @param params - 조회 파라미터
 * @returns 지역코드 목록
 *
 * @example
 * ```typescript
 * // 전체 시/도 조회
 * const areaCodes = await getAreaCode();
 *
 * // 특정 시/도의 시/군/구 조회
 * const subAreas = await getAreaCode({ areaCode: '1' }); // 서울의 구
 * ```
 */
export async function getAreaCode(params: AreaCodeParams = {}): Promise<any[]> {
  return fetchTourApi("/areaCode2", {
    areaCode: params.areaCode,
    numOfRows: params.numOfRows || 100,
    pageNo: params.pageNo || 1,
  });
}

/**
 * 지역 기반 관광지 목록을 조회합니다.
 *
 * @param params - 조회 파라미터
 * @returns 관광지 목록 및 총 개수
 *
 * @example
 * ```typescript
 * // 서울의 관광지 조회
 * const result = await getAreaBasedList({
 *   areaCode: '1',
 *   contentTypeId: '12',
 *   numOfRows: 10,
 *   pageNo: 1,
 * });
 * console.log(result.items); // 관광지 목록
 * console.log(result.totalCount); // 전체 개수
 * ```
 */
export async function getAreaBasedList(
  params: AreaBasedListParams,
): Promise<{ items: any[]; totalCount: number }> {
  const items = await fetchTourApi("/areaBasedList2", {
    areaCode: params.areaCode,
    contentTypeId: params.contentTypeId,
    numOfRows: params.numOfRows || 10,
    pageNo: params.pageNo || 1,
    arrange: params.arrange || "A",
  });
  
  return {
    items,
    totalCount: items.length, // API가 totalCount를 반환하지 않으므로 items 길이 사용
  };
}

/**
 * 키워드로 관광지를 검색합니다.
 *
 * @param params - 검색 파라미터
 * @returns 검색 결과 목록
 *
 * @example
 * ```typescript
 * // '서울'로 검색
 * const results = await searchKeyword({
 *   keyword: '서울',
 *   contentTypeId: '12',
 *   numOfRows: 10,
 * });
 * ```
 */
export async function searchKeyword(
  params: SearchKeywordParams,
): Promise<any[]> {
  if (!params.keyword || params.keyword.trim() === "") {
    throw new Error("검색 키워드를 입력하세요.");
  }

  return fetchTourApi("/searchKeyword2", {
    keyword: params.keyword,
    areaCode: params.areaCode,
    contentTypeId: params.contentTypeId,
    numOfRows: params.numOfRows || 10,
    pageNo: params.pageNo || 1,
  });
}

/**
 * 관광지 공통 정보를 조회합니다.
 *
 * @param contentId - 콘텐츠 ID
 * @returns 공통 정보
 *
 * @example
 * ```typescript
 * const detail = await getDetailCommon('125266');
 * ```
 */
export async function getDetailCommon(contentId: string): Promise<any[]> {
  if (!contentId) {
    throw new Error("콘텐츠 ID를 입력하세요.");
  }

  return fetchTourApi("/detailCommon2", {
    contentId,
    defaultYN: "Y",
    firstImageYN: "Y",
    areacodeYN: "Y",
    catcodeYN: "Y",
    addrinfoYN: "Y",
    mapinfoYN: "Y",
    overviewYN: "Y",
  });
}

/**
 * 관광지 소개 정보를 조회합니다.
 *
 * @param contentId - 콘텐츠 ID
 * @param contentTypeId - 콘텐츠 타입 ID
 * @returns 소개 정보
 *
 * @example
 * ```typescript
 * const intro = await getDetailIntro('125266', '12');
 * ```
 */
export async function getDetailIntro(
  contentId: string,
  contentTypeId: string,
): Promise<any[]> {
  if (!contentId) {
    throw new Error("콘텐츠 ID를 입력하세요.");
  }
  if (!contentTypeId) {
    throw new Error("콘텐츠 타입 ID를 입력하세요.");
  }

  return fetchTourApi("/detailIntro2", {
    contentId,
    contentTypeId,
  });
}

/**
 * 관광지 이미지 목록을 조회합니다.
 *
 * @param contentId - 콘텐츠 ID
 * @returns 이미지 목록
 *
 * @example
 * ```typescript
 * const images = await getDetailImage('125266');
 * ```
 */
export async function getDetailImage(contentId: string): Promise<any[]> {
  if (!contentId) {
    throw new Error("콘텐츠 ID를 입력하세요.");
  }

  return fetchTourApi("/detailImage2", {
    contentId,
    imageYN: "Y",
    subImageYN: "Y",
  });
}

/**
 * 반려동물 동반 여행 정보를 조회합니다.
 *
 * @param contentId - 콘텐츠 ID
 * @returns 반려동물 정보
 *
 * @example
 * ```typescript
 * const petInfo = await getDetailPetTour('125266');
 * ```
 */
export async function getDetailPetTour(contentId: string): Promise<any[]> {
  if (!contentId) {
    throw new Error("콘텐츠 ID를 입력하세요.");
  }

  return fetchTourApi("/detailPetTour2", {
    contentId,
  });
}

// =====================================================
// 유틸리티 함수
// =====================================================

/**
 * KATEC 좌표를 WGS84 좌표로 변환합니다.
 *
 * @param mapx - 경도 (KATEC, 정수형)
 * @param mapy - 위도 (KATEC, 정수형)
 * @returns WGS84 좌표 { lng, lat }
 *
 * @example
 * ```typescript
 * const coords = convertCoordinates('1269125690', '374933742');
 * // { lng: 126.9125690, lat: 37.4933742 }
 * ```
 */
export function convertCoordinates(
  mapx: string,
  mapy: string,
): { lng: number; lat: number } {
  return {
    lng: parseFloat(mapx) / 10000000,
    lat: parseFloat(mapy) / 10000000,
  };
}

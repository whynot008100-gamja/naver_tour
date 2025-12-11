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
    const errorMsg =
      "한국관광공사 API 키가 설정되지 않았습니다.\n" +
      ".env 파일에 다음 중 하나를 설정하세요:\n" +
      "  - TOUR_API_KEY (서버 사이드용, 권장)\n" +
      "  - NEXT_PUBLIC_TOUR_API_KEY (클라이언트 사이드용)\n\n" +
      "API 키 발급: https://www.data.go.kr/data/15101578/openapi.do";
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  // API 키가 비어있는 경우 체크
  if (apiKey.trim() === "") {
    throw new Error(
      "한국관광공사 API 키가 비어있습니다. .env 파일의 API 키 값을 확인하세요.",
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
  // 한국관광공사 API는 serviceKey를 URL 인코딩해야 합니다
  const apiKey = getApiKey();
  params.append("serviceKey", apiKey);
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
  // 이미 Error 객체인 경우 (우리가 던진 에러)
  if (error instanceof Error) {
    throw error;
  }

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
    // 기타 에러 - 메시지가 있으면 사용, 없으면 기본 메시지
    const errorMessage = error?.message || String(error) || "알 수 없는 오류";
    console.error("기타 에러 상세:", {
      error,
      message: errorMessage,
      stack: error?.stack,
    });
    throw new Error(`알 수 없는 오류: ${errorMessage}`);
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
    const apiKey = getApiKey();

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
        // 실제 응답 본문도 확인
        let errorBody = "";
        try {
          errorBody = await response.text();
        } catch {
          // 응답 본문 읽기 실패 시 무시
        }
        
        console.error("API HTTP 에러:", {
          status: response.status,
          statusText: response.statusText,
          url: url.replace(apiKey, "***"),
          body: errorBody.substring(0, 500), // 처음 500자만
        });
        
        throw {
          response: {
            status: response.status,
            statusText: response.statusText,
          },
        };
      }

      // JSON 파싱
      let data: any;
      try {
        const responseText = await response.text();
        console.log("[tour-api] ===== API 응답 원본 (전체) =====");
        console.log(responseText);
        console.log("[tour-api] ===== 응답 원본 끝 =====");
        
        try {
          data = JSON.parse(responseText);
        } catch (jsonError) {
          console.error("API 응답 JSON 파싱 실패:", {
            error: jsonError,
            responseText: responseText.substring(0, 500),
            url: url.replace(apiKey, "***"),
          });
          throw new Error("API 응답 형식이 올바르지 않습니다. JSON 파싱에 실패했습니다.");
        }
      } catch (parseError: any) {
        // 이미 JSON 파싱 에러인 경우
        if (parseError.message.includes("JSON 파싱")) {
          throw parseError;
        }
        console.error("API 응답 읽기 실패:", {
          error: parseError?.message,
          url: url.replace(apiKey, "***"),
        });
        throw new Error("API 응답을 읽을 수 없습니다.");
      }

      // API 응답 구조 검증 및 로깅
      console.log("[tour-api] ===== 파싱된 데이터 전체 구조 =====");
      console.log(JSON.stringify(data, null, 2));
      console.log("[tour-api] ===== 데이터 구조 분석 =====");
      console.log({
        hasData: !!data,
        dataType: typeof data,
        isArray: Array.isArray(data),
        dataKeys: data ? Object.keys(data) : [],
        hasResponse: !!(data && data.response),
        responseKeys: data?.response ? Object.keys(data.response) : [],
        hasBody: !!(data?.response?.body),
        bodyKeys: data?.response?.body ? Object.keys(data.response.body) : [],
        hasItems: !!(data?.response?.body?.items),
        itemsType: data?.response?.body?.items ? typeof data.response.body.items : null,
        isItemsArray: Array.isArray(data?.response?.body?.items),
        hasItem: !!(data?.response?.body?.items?.item),
        itemType: data?.response?.body?.items?.item ? typeof data.response.body.items.item : null,
        isItemArray: Array.isArray(data?.response?.body?.items?.item),
      });

      // 한국관광공사 API 응답 구조 확인 및 처리
      // 예상 구조: { response: { header: {...}, body: { items: { item: [...] } } } }
      if (!data) {
        console.error("API 응답이 null 또는 undefined입니다.");
        throw new Error("API 응답이 비어있습니다.");
      }

      // response가 없는 경우 (다른 구조일 수 있음)
      if (!data.response) {
        console.error("API 응답 구조 오류 - response가 없습니다:", {
          data: JSON.stringify(data).substring(0, 2000),
          dataType: typeof data,
          dataKeys: Object.keys(data),
          url: url.replace(apiKey, "***"),
        });
        throw new Error("API 응답 구조가 예상과 다릅니다. response 필드가 없습니다.");
      }

      if (!data.response.header) {
        console.error("API 응답 헤더 없음:", {
          response: JSON.stringify(data.response).substring(0, 500),
          url: url.replace(apiKey, "***"),
        });
        throw new Error("API 응답에 헤더 정보가 없습니다.");
      }

      // API 응답 헤더 체크
      const { resultCode, resultMsg } = data.response.header;
      
      // 한국관광공사 API는 HTTP 200을 반환하지만 resultCode로 에러를 표시합니다
      // 인증 실패는 보통 resultCode가 "SERVICE_KEY_NOT_REGISTERED_ERROR" 등
      if (resultCode !== "0000") {
        // 인증 관련 에러 코드 처리 (공공데이터포털 일반적인 에러 코드)
        const authErrorCodes = [
          "SERVICE_KEY_NOT_REGISTERED_ERROR",
          "SERVICE_KEY_IS_NOT_REGISTERED_ERROR",
          "SERVICE_KEY_IS_NULL",
          "SERVICE_KEY_IS_EMPTY",
          "INVALID_SERVICE_KEY",
          "AUTHENTICATION_FAILED",
        ];
        
        const isAuthError = authErrorCodes.some((code) =>
          resultCode.includes(code),
        ) || resultCode.includes("KEY") && resultCode.includes("ERROR");

        if (isAuthError) {
          console.error("API 인증 실패:", {
            resultCode,
            resultMsg,
            url: url.replace(apiKey, "***"),
            hint: "환경변수 TOUR_API_KEY 또는 NEXT_PUBLIC_TOUR_API_KEY를 확인하세요.",
          });
          throw new Error(`API 인증 실패: ${resultMsg} (코드: ${resultCode})`);
        }
        
        console.error("API 오류:", {
          resultCode,
          resultMsg,
          url: url.replace(apiKey, "***"),
        });
        throw new Error(`API 오류: ${resultMsg} (코드: ${resultCode})`);
      }

      // 데이터 반환
      console.log("[tour-api] ===== 데이터 추출 시도 =====");
      
      if (!data.response.body) {
        console.warn("API 응답에 body가 없습니다:", {
          response: JSON.stringify(data.response).substring(0, 500),
        });
        return [];
      }

      // 다양한 응답 구조 처리
      let items: T[] = [];
      
      // 구조 1: response.body.items.item (배열)
      if (data.response.body.items?.item) {
        items = Array.isArray(data.response.body.items.item) 
          ? data.response.body.items.item 
          : [data.response.body.items.item];
        console.log("[tour-api] 구조 1로 추출 성공:", items.length, "개");
      }
      // 구조 2: response.body.items (배열)
      else if (Array.isArray(data.response.body.items)) {
        items = data.response.body.items;
        console.log("[tour-api] 구조 2로 추출 성공:", items.length, "개");
      }
      // 구조 3: response.body.item (배열)
      else if (data.response.body.item) {
        items = Array.isArray(data.response.body.item) 
          ? data.response.body.item 
          : [data.response.body.item];
        console.log("[tour-api] 구조 3로 추출 성공:", items.length, "개");
      }
      // 구조 4: response.body (배열)
      else if (Array.isArray(data.response.body)) {
        items = data.response.body;
        console.log("[tour-api] 구조 4로 추출 성공:", items.length, "개");
      }
      else {
        console.warn("[tour-api] 알 수 없는 응답 구조:", {
          body: JSON.stringify(data.response.body).substring(0, 500),
        });
      }

      console.log("[tour-api] 최종 반환 데이터:", items.length, "개");
      return items;
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
 * @returns 검색 결과 목록 및 총 개수
 *
 * @example
 * ```typescript
 * // '서울'로 검색
 * const result = await searchKeyword({
 *   keyword: '서울',
 *   contentTypeId: '12',
 *   numOfRows: 10,
 * });
 * console.log(result.items); // 검색 결과
 * console.log(result.totalCount); // 전체 개수
 * ```
 */
export async function searchKeyword(
  params: SearchKeywordParams,
): Promise<{ items: any[]; totalCount: number }> {
  if (!params.keyword || params.keyword.trim() === "") {
    throw new Error("검색 키워드를 입력하세요.");
  }

  const items = await fetchTourApi("/searchKeyword2", {
    keyword: params.keyword,
    areaCode: params.areaCode,
    contentTypeId: params.contentTypeId,
    numOfRows: params.numOfRows || 10,
    pageNo: params.pageNo || 1,
  });
  
  return {
    items,
    totalCount: items.length,
  };
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

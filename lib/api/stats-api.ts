import { getAreaBasedList } from './tour-api';
import { CONTENT_TYPE_NAMES } from '@/lib/types/tour';

// 지역 코드 (한국관광공사 API 기준)
const AREA_CODES: Record<string, string> = {
  '1': '서울',
  '2': '인천',
  '3': '대전',
  '4': '대구',
  '5': '광주',
  '6': '부산',
  '7': '울산',
  '8': '세종',
  '31': '경기',
  '32': '강원',
  '33': '충북',
  '34': '충남',
  '35': '경북',
  '36': '경남',
  '37': '전북',
  '38': '전남',
  '39': '제주',
};

/**
 * 지역별 관광지 개수를 집계합니다.
 */
export async function getRegionStats() {
  const stats = [];

  // 각 지역별로 API 호출
  for (const [code, name] of Object.entries(AREA_CODES)) {
    try {
      const result = await getAreaBasedList({
        areaCode: code,
        numOfRows: 1, // 개수만 필요하므로 1개만
        pageNo: 1,
      });

      stats.push({
        code,
        name,
        count: result.totalCount || 0,
      });
    } catch (error) {
      console.error(`지역 ${name} 통계 조회 실패:`, error);
      stats.push({
        code,
        name,
        count: 0,
      });
    }
  }

  // 개수 기준 내림차순 정렬
  return stats.sort((a, b) => b.count - a.count);
}

/**
 * 타입별 관광지 개수를 집계합니다.
 */
export async function getTypeStats() {
  const stats = [];

  // 각 타입별로 API 호출
  for (const [code, name] of Object.entries(CONTENT_TYPE_NAMES)) {
    try {
      const result = await getAreaBasedList({
        contentTypeId: code,
        numOfRows: 1,
        pageNo: 1,
      });

      stats.push({
        code,
        name,
        count: result.totalCount || 0,
      });
    } catch (error) {
      console.error(`타입 ${name} 통계 조회 실패:`, error);
      stats.push({
        code,
        name,
        count: 0,
      });
    }
  }

  // 개수 기준 내림차순 정렬
  return stats.sort((a, b) => b.count - a.count);
}

/**
 * 전체 통계 요약을 조회합니다.
 */
export async function getStatsSummary() {
  try {
    // 전체 관광지 수
    const totalResult = await getAreaBasedList({
      numOfRows: 1,
      pageNo: 1,
    });

    const totalCount = totalResult.totalCount || 0;

    return {
      totalCount,
      regionCount: Object.keys(AREA_CODES).length,
      typeCount: Object.keys(CONTENT_TYPE_NAMES).length,
    };
  } catch (error) {
    console.error('전체 통계 조회 실패:', error);
    return {
      totalCount: 0,
      regionCount: 17,
      typeCount: 7,
    };
  }
}

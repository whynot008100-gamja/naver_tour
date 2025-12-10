/**
 * 통계 대시보드 타입 정의
 * 
 * @description
 * 통계 대시보드 페이지에서 사용하는 데이터 타입을 정의합니다.
 * 
 * @see PRD.md - 2.6 통계 대시보드
 */

// =====================================================
// 지역별 통계
// =====================================================

/**
 * 지역별 관광지 통계
 * 
 * @description
 * 각 시/도별 관광지 개수 및 비율
 * 
 * @example
 * ```typescript
 * const regionStats: RegionStats = {
 *   code: '1',
 *   name: '서울',
 *   count: 1234,
 *   percentage: 15.5,
 * };
 * ```
 */
export interface RegionStats {
  /** 지역코드 */
  code: string;
  
  /** 지역명 */
  name: string;
  
  /** 관광지 개수 */
  count: number;
  
  /** 전체 대비 비율 (%) */
  percentage: number;
}

// =====================================================
// 타입별 통계
// =====================================================

/**
 * 관광 타입별 통계
 * 
 * @description
 * 각 관광 타입별 관광지 개수 및 비율
 * 
 * @example
 * ```typescript
 * const typeStats: TypeStats = {
 *   typeId: '12',
 *   typeName: '관광지',
 *   count: 5678,
 *   percentage: 45.2,
 * };
 * ```
 */
export interface TypeStats {
  /** 콘텐츠 타입 ID */
  typeId: string;
  
  /** 타입명 */
  typeName: string;
  
  /** 관광지 개수 */
  count: number;
  
  /** 전체 대비 비율 (%) */
  percentage: number;
  
  /** 색상 (차트용, 선택) */
  color?: string;
}

// =====================================================
// 통계 요약
// =====================================================

/**
 * 통계 요약 정보
 * 
 * @description
 * 전체 통계 요약 (전체 개수, Top 3 지역/타입 등)
 * 
 * @example
 * ```typescript
 * const statsSummary: StatsSummary = {
 *   totalCount: 12345,
 *   topRegions: [...],
 *   topTypes: [...],
 *   lastUpdated: new Date(),
 * };
 * ```
 */
export interface StatsSummary {
  /** 전체 관광지 수 */
  totalCount: number;
  
  /** Top 3 지역 */
  topRegions: RegionStats[];
  
  /** Top 3 타입 */
  topTypes: TypeStats[];
  
  /** 마지막 업데이트 시간 */
  lastUpdated: Date;
}

// =====================================================
// 차트 데이터
// =====================================================

/**
 * Bar Chart 데이터 포인트
 * 
 * @description
 * recharts Bar Chart에서 사용하는 데이터 포인트
 */
export interface BarChartDataPoint {
  /** 라벨 (지역명 등) */
  label: string;
  
  /** 값 (개수) */
  value: number;
  
  /** 추가 정보 (선택) */
  [key: string]: any;
}

/**
 * Pie/Donut Chart 데이터 포인트
 * 
 * @description
 * recharts Pie/Donut Chart에서 사용하는 데이터 포인트
 */
export interface PieChartDataPoint {
  /** 이름 (타입명 등) */
  name: string;
  
  /** 값 (개수) */
  value: number;
  
  /** 색상 (선택) */
  fill?: string;
  
  /** 추가 정보 (선택) */
  [key: string]: any;
}

import { NextResponse } from 'next/server';
import {
  getAreaCode,
  getAreaBasedList,
  searchKeyword,
  getDetailCommon,
  getDetailIntro,
  getDetailImage,
  getDetailPetTour,
} from '@/lib/api/tour-api';

/**
 * 한국관광공사 API 테스트 엔드포인트
 * 
 * @description
 * API 클라이언트 함수들이 정상적으로 작동하는지 테스트합니다.
 * 
 * @route GET /api/test-tour
 * 
 * @example
 * ```
 * http://localhost:3000/api/test-tour
 * ```
 */
export async function GET() {
  try {
    console.log('🧪 한국관광공사 API 테스트 시작...');
    
    // 1. 지역코드 조회 테스트
    console.log('1️⃣ 지역코드 조회 테스트...');
    const areaCodes = await getAreaCode({ numOfRows: 5 });
    console.log(`✅ 지역코드 ${areaCodes.length}개 조회 성공`);
    
    // 2. 관광지 목록 조회 테스트 (서울의 관광지)
    console.log('2️⃣ 관광지 목록 조회 테스트 (서울)...');
    const tourListResult = await getAreaBasedList({
      areaCode: '1', // 서울
      contentTypeId: '12', // 관광지
      numOfRows: 5,
    });
    console.log(`✅ 관광지 ${tourListResult.items.length}개 조회 성공`);
    
    // 3. 키워드 검색 테스트
    console.log('3️⃣ 키워드 검색 테스트 (경복궁)...');
    const searchResults = await searchKeyword({
      keyword: '경복궁',
      numOfRows: 3,
    });
    console.log(`✅ 검색 결과 ${searchResults.items.length}개 조회 성공`);
    
    // 4. 상세 정보 조회 테스트 (첫 번째 관광지)
    if (tourListResult.items.length > 0) {
      const firstTour = tourListResult.items[0];
      const contentId = firstTour.contentid;
      const contentTypeId = firstTour.contenttypeid;
      
      console.log(`4️⃣ 상세 정보 조회 테스트 (contentId: ${contentId})...`);
      
      // 공통 정보
      const detailCommon = await getDetailCommon(contentId);
      console.log(`✅ 공통 정보 조회 성공`);
      
      // 소개 정보
      const detailIntro = await getDetailIntro(contentId, contentTypeId);
      console.log(`✅ 소개 정보 조회 성공`);
      
      // 이미지 목록
      const detailImage = await getDetailImage(contentId);
      console.log(`✅ 이미지 ${detailImage.length}개 조회 성공`);
      
      // 반려동물 정보 (있을 수도 있고 없을 수도 있음)
      try {
        const petTourInfo = await getDetailPetTour(contentId);
        console.log(`✅ 반려동물 정보 조회 성공 (${petTourInfo.length}개)`);
      } catch (error) {
        console.log(`⚠️ 반려동물 정보 없음 (정상)`);
      }
    }
    
    console.log('✅ 모든 API 테스트 성공!');
    
    // 테스트 결과 반환
    return NextResponse.json({
      success: true,
      message: '모든 API 테스트 성공',
      results: {
        areaCodes: {
          count: areaCodes.length,
          sample: areaCodes.slice(0, 2),
        },
        tourList: {
          count: tourListResult.items.length,
          sample: tourListResult.items.slice(0, 2),
        },
        searchResults: {
          count: searchResults.items.length,
          sample: searchResults.items.slice(0, 2),
        },
      },
    });
  } catch (error: any) {
    console.error('❌ API 테스트 실패:', error.message);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

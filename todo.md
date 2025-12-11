# My Trip - 개발 TODO 리스트

> PRD, Flowchart, Design 문서 기반 작업 항목 정리

## Phase 1: 기본 구조 & 공통 설정

- [ ] A. 프로젝트 셋업

  **구현할 주요 컴포넌트/기능:**

  - 환경변수 설정 및 검증
  - `.env.example` 템플릿 파일 생성
  - 프로젝트 구조 확인
  - 환경변수 문서화

  **특별히 주의할 요구사항:**

  - `NEXT_PUBLIC_` 접두사가 붙은 변수만 클라이언트에 노출됨
  - 서버 전용 키는 절대 클라이언트에 노출되지 않도록 주의
  - 네이버 지도 API: `ncpKeyId` 사용 (구 `ncpClientId` 아님)
  - Supabase RLS 비활성화 (개발 환경)

  - [ ] 환경변수 설정 (`.env`)
    - [ ] `NEXT_PUBLIC_TOUR_API_KEY` (한국관광공사 API - 클라이언트용)
    - [ ] `TOUR_API_KEY` (한국관광공사 API - 서버 사이드용)
    - [ ] `NEXT_PUBLIC_NAVER_MAP_CLIENT_ID` (네이버 지도 - ncpKeyId)
    - [ ] Clerk 인증 키 확인
      - [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
      - [ ] `CLERK_SECRET_KEY`
    - [ ] Supabase 키 확인
      - [ ] `NEXT_PUBLIC_SUPABASE_URL`
      - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
      - [ ] `SUPABASE_SERVICE_ROLE_KEY`
      - [ ] `NEXT_PUBLIC_STORAGE_BUCKET` (기본값: uploads)
  - [x] `.env.example` 파일 생성 (팀원 공유용 템플릿)
  - [x] 환경변수 문서화 (README.md 또는 별도 문서)
  - [ ] 환경변수 로드 테스트 (개발 서버 실행)
  - [ ] API 키 유효성 테스트
    - [ ] 한국관광공사 API 테스트 호출
    - [ ] 네이버 지도 API 초기화 테스트
    - [ ] Clerk 로그인 페이지 접근 테스트
    - [ ] Supabase 데이터베이스 연결 테스트

- [ ] B. API 클라이언트 구현

  **구현할 주요 컴포넌트/기능:**

  - `lib/api/tour-api.ts` 파일 생성
  - 한국관광공사 API 호출 함수 7개 구현
  - 공통 파라미터 처리 (serviceKey, MobileOS, MobileApp, \_type)
  - 에러 처리 및 재시도 로직 (최대 3회, 지수 백오프)
  - TypeScript 타입 안전성 보장

  **특별히 주의할 요구사항:**

  - 환경변수 우선순위: 서버(`TOUR_API_KEY`) > 클라이언트(`NEXT_PUBLIC_TOUR_API_KEY`)
  - API Rate Limit 고려 (공공 API 호출 제한)
  - 좌표 변환: KATEC → WGS84 (mapx/mapy / 10000000)
  - 데이터 품질: 일부 관광지는 이미지/정보 누락 가능
  - 타임아웃 설정 (응답 속도 고려)

  - [x] `lib/api/` 디렉토리 생성
  - [x] `lib/api/tour-api.ts` 생성
    - [x] 상수 정의 (BASE_URL, MOBILE_OS, MOBILE_APP, RESPONSE_TYPE)
    - [x] 환경변수 로드 함수 (`getApiKey()`)
    - [x] 공통 파라미터 생성 함수 (`buildCommonParams()`)
    - [x] API 호출 헬퍼 함수 (`fetchTourApi()`)
    - [x] 에러 처리 함수 (`handleApiError()`)
    - [x] 재시도 로직 (`retryFetch()`)
    - [x] `getAreaCode()` - 지역코드 조회 (`areaCode2`)
    - [x] `getAreaBasedList()` - 지역 기반 목록 (`areaBasedList2`)
    - [x] `searchKeyword()` - 키워드 검색 (`searchKeyword2`)
    - [x] `getDetailCommon()` - 공통 정보 (`detailCommon2`)
    - [x] `getDetailIntro()` - 소개 정보 (`detailIntro2`)
    - [x] `getDetailImage()` - 이미지 목록 (`detailImage2`)
    - [x] `getDetailPetTour()` - 반려동물 정보 (`detailPetTour2`)
    - [x] JSDoc 주석 추가 (각 함수 설명)
  - [x] 테스트 API Route 생성 (`app/api/test-tour/route.ts`)
  - [ ] 단위 테스트 (수동)
    - [ ] 환경변수 로드 테스트
    - [ ] 개별 API 함수 테스트
    - [ ] 에러 처리 테스트 (401, 404, 네트워크 에러)
  - [ ] 통합 테스트 (브라우저에서 `/api/test-tour` 확인)

- [x] C.타입 정의

  - [x] `lib/types/tour.ts` 생성
    - [x] `TourItem` 인터페이스 (목록)
    - [x] `TourDetail` 인터페이스 (상세)
    - [x] `TourIntro` 인터페이스 (운영정보)
    - [x] `TourImage` 인터페이스 (이미지)
    - [x] `PetTourInfo` 인터페이스 (반려동물)
    - [x] `AreaCode` 인터페이스 (지역코드)
    - [x] `CONTENT_TYPE_ID` 상수 (관광 타입 ID)
    - [x] `Coordinates` 인터페이스 (WGS84 좌표)
  - [x] `lib/types/stats.ts` 생성
    - [x] `RegionStats` 인터페이스
    - [x] `TypeStats` 인터페이스
    - [x] `StatsSummary` 인터페이스
    - [x] `BarChartDataPoint` 인터페이스
    - [x] `PieChartDataPoint` 인터페이스

- [x] D. 레이아웃 구조

  - [x] [app/layout.tsx](cci:7://file:///c:/Coding/naver_tour/app/layout.tsx:0:0-0:0) 업데이트
    - [x] 메타데이터 설정 (My Trip 프로젝트용)
  - [x] [components/Navbar.tsx](cci:7://file:///c:/Coding/naver_tour/components/Navbar.tsx:0:0-0:0) 업데이트
    - [x] 로고 ("My Trip")
    - [x] 검색창 (반응형: 모바일 하단, 데스크톱 상단)
    - [x] 네비게이션 링크 (홈, 통계, 북마크)
    - [x] Clerk 인증 연동 (SignInButton, UserButton)
  - [x] SaaS 템플릿 콘텐츠 제거 ([app/page.tsx](cci:7://file:///c:/Coding/naver_tour/app/page.tsx:0:0-0:0))

- [x] E. 공통 컴포넌트
  - [x] `components/ui/loading.tsx` - 로딩 스피너
  - [x] `components/ui/skeleton.tsx` - 스켈레톤 UI
  - [x] `components/ui/error.tsx` - 에러 메시지
  - [ ] `components/ui/toast.tsx` - 토스트 알림 (Phase 2에서 필요 시 추가)

## Phase 2: 홈페이지 (`/`) - 관광지 목록

- [x] A. 페이지 기본 구조

  **구현할 주요 컴포넌트/기능:**

  - `app/page.tsx` 업데이트 (반응형 레이아웃)
  - 메인 컨테이너 설정 (2열 그리드 - 데스크톱, 단일 컬럼 - 모바일)
  - 왼쪽 영역: 필터 + 관광지 목록 (스크롤 가능)
  - 오른쪽 영역: 네이버 지도 (데스크톱만, 고정)
  - 모바일 탭 전환 UI (목록/지도)
  - 상태 관리 (activeTab)

  **특별히 주의할 요구사항:**

  - 데스크톱 (≥1024px): 리스트(좌측 50%) + 지도(우측 50%) 분할, 양쪽 모두 표시
  - 모바일/태블릿 (<1024px): 탭 형태로 리스트/지도 전환, 탭 버튼 상단 고정
  - 반응형 그리드 레이아웃 (Tailwind `lg:` 브레이크포인트)
  - 메인 영역 높이: `calc(100vh - header-height)` 사용
  - 목록/지도 영역 모두 스크롤 가능하도록 설정
  - 모바일 초기 상태: "목록" 탭 선택
  - 접근성: 탭 버튼 ARIA 라벨, 키보드 네비게이션 지원
  - Client Component로 구현 (탭 전환 상태 필요)

  - [x] `app/page.tsx` 업데이트
    - [x] Client Component로 변경 (`'use client'`)
    - [x] 탭 상태 관리 (`useState<'list' | 'map'>`)
    - [x] 모바일 탭 버튼 UI 구현
      - [x] "목록" / "지도" 버튼
      - [x] 활성 탭 스타일링
      - [x] ARIA 라벨 추가
    - [x] 메인 컨테이너 레이아웃
      - [x] 높이 설정: `h-[calc(100vh-64px)]`
      - [x] 데스크톱: `lg:grid lg:grid-cols-2`
      - [x] 모바일: 조건부 표시 (탭 기반)
    - [x] 왼쪽 영역 (필터 + 목록)
      - [x] 플레이스홀더 콘텐츠
      - [x] 스크롤 설정 (`overflow-y-auto`)
      - [x] 모바일: `activeTab === 'list'`일 때만 표시
    - [x] 오른쪽 영역 (지도)
      - [x] 플레이스홀더 콘텐츠
      - [x] 데스크톱: 항상 표시
      - [x] 모바일: `activeTab === 'map'`일 때만 표시
    - [x] 반응형 테스트
      - [x] 데스크톱 (≥1024px) 양쪽 표시 확인
      - [x] 모바일 탭 전환 동작 확인
      - [x] 브레이크포인트 테스트

- [x] B. 관광지 목록 기능 (MVP 2.1)

  **구현할 주요 컴포넌트/기능:**

  - `components/tour-card.tsx` 생성 (관광지 카드 컴포넌트)
    - 썸네일 이미지 (firstimage 또는 기본 이미지)
    - 관광지명, 주소, 관광 타입 뱃지
    - 호버 효과 (scale, shadow)
    - 클릭 시 상세페이지 이동
  - `components/tour-list.tsx` 생성 (목록 컴포넌트)
    - 반응형 그리드 레이아웃 (모바일 1열, 태블릿 2열, 데스크톱 2-3열)
    - 로딩 상태 (Skeleton UI)
    - 빈 상태 처리
    - 에러 상태 처리
  - API 연동
    - `getAreaBasedList()` 호출 (페이지당 12개)
    - 에러 처리 및 재시도

  **특별히 주의할 요구사항:**

  - 이미지 처리: `firstimage` 없을 수 있음 → 기본 이미지 사용
  - `next.config.ts`에 외부 도메인 추가 (`tong.visitkorea.or.kr`)
  - 관광 타입 매핑 (12: 관광지, 14: 문화시설, 15: 축제/행사 등)
  - Next.js Image 컴포넌트 사용 (최적화)
  - 이미지 lazy loading
  - 주소 말줄임표 처리 (너무 긴 경우)
  - API Rate Limit 고려
  - 응답 시간 느릴 수 있음 → 타임아웃 설정

  - [x] `components/tour-card.tsx` 생성
    - [x] 썸네일 이미지 (기본 이미지 fallback)
    - [x] 관광지명
    - [x] 주소 표시
    - [x] 관광 타입 뱃지
    - [x] 호버 효과 (scale, shadow)
    - [x] 클릭 시 상세페이지 이동 (`/places/[contentId]`)
    - [x] Next.js Image 컴포넌트 사용
  - [x] `components/tour-list.tsx` 생성
    - [x] 그리드 레이아웃 (반응형)
      - [x] 모바일: 1열
      - [x] 태블릿: 2열
      - [x] 데스크톱: 2-3열
    - [x] 카드 목록 표시
    - [x] 로딩 상태 (Skeleton UI)
    - [x] 빈 상태 처리 ("관광지가 없습니다")
    - [x] 에러 상태 처리 (재시도 버튼)
  - [x] API 연동
    - [x] `getAreaBasedList()` 호출
    - [x] 초기 데이터: 전국 관광지 (areaCode 없음)
    - [x] 페이지당 12개 항목
    - [x] 데이터 파싱 및 표시
    - [x] 에러 처리
  - [x] 기본 이미지 준비
    - [x] `public/images/placeholder-tour.jpg` 생성
  - [x] `next.config.ts` 업데이트
    - [x] 외부 이미지 도메인 추가 (`tong.visitkorea.or.kr`, http/https)
  - [x] `app/page.tsx` 업데이트
    - [x] 플레이스홀더를 `TourList` 컴포넌트로 교체
  - [x] 테스트
    - [x] 브라우저에서 관광지 목록 표시 확인
    - [x] 로딩 상태 확인
    - [x] 에러 처리 확인
    - [x] 카드 호버 효과 확인
    - [x] 반응형 그리드 확인

- [x] C. 필터 기능
  - [x] `components/tour-filters.tsx` 생성
    - [x] 지역 필터 (시/도 선택)
      - [x] `getAreaCode()` API로 지역 목록 로드
      - [x] Select 컴포넌트 사용
      - [x] "전체" 옵션
    - [x] 관광 타입 필터
      - [x] 관광지(12), 문화시설(14), 축제/행사(15), 여행코스(25), 레포츠(28), 숙박(32), 쇼핑(38), 음식점(39)
      - [x] Select 컴포넌트 사용 (단일 선택)
      - [x] "전체" 옵션
    - [ ] 반려동물 동반 가능 필터 (MVP 2.5) - 선택 사항, 추후 구현
      - [ ] 토글 버튼
      - [ ] 크기별 필터 (소형, 중형, 대형)
    - [x] 정렬 옵션
      - [x] 최신순 (modifiedtime - C)
      - [x] 이름순 (가나다 - A)
    - [x] 필터 상태 관리 (URL 쿼리 파라미터)
  - [x] 필터 적용 로직
    - [x] 필터 변경 시 API 재호출
    - [x] 필터 조합 처리
- [x] D. 검색 기능 (MVP 2.3)
  - [x] `components/tour-search.tsx` 생성
    - [x] 검색창 UI (메인 영역)
    - [x] 검색 아이콘
    - [x] 엔터 또는 버튼 클릭으로 검색
    - [x] 검색어 초기화 버튼 (X 아이콘)
  - [x] 검색 API 연동
    - [x] `searchKeyword()` 호출
    - [x] 검색 결과 표시
    - [x] 검색 결과 개수 표시 (선택 사항)
    - [x] 결과 없음 메시지
  - [x] 검색 + 필터 조합
    - [x] 키워드 + 지역 필터
    - [x] 키워드 + 타입 필터
    - [x] 모든 필터 동시 적용
- [x] E. 네이버 지도 연동 (MVP 2.2)
  - [x] `components/naver-map.tsx` 생성
    - [x] Naver Maps API v3 초기화
    - [x] 지도 컨테이너 설정
    - [x] 초기 중심 좌표 설정
    - [x] 줌 레벨 설정
  - [x] 마커 표시
    - [x] 관광지 목록을 마커로 표시
    - [x] 좌표 변환 (KATEC → WGS84: mapx/mapy / 10000000)
    - [x] 마커 클릭 시 인포윈도우
      - [x] 관광지명
      - [x] 주소
      - [x] "상세보기" 버튼
    - [ ] 관광 타입별 마커 색상 구분 (선택 사항)
  - [ ] 지도-리스트 연동 (선택 사항)
    - [ ] 리스트 항목 클릭 → 지도 이동 및 마커 강조
    - [ ] 리스트 항목 호버 → 마커 강조 (선택 사항)
    - [ ] 마커 클릭 → 리스트 항목 강조
  - [x] 지도 컨트롤
    - [x] 줌 인/아웃 버튼 (기본 제공)
    - [ ] 지도 유형 선택 (일반/스카이뷰) (선택 사항)
    - [ ] 현재 위치 버튼 (선택 사항)
  - [x] 반응형 레이아웃
    - [x] 데스크톱: 리스트(좌측 50%) + 지도(우측 50%) 분할
    - [x] 모바일: 탭 형태로 리스트/지도 전환
- [x] F. 페이지네이션
  - [ ] 무한 스크롤 구현 (선택 사항)
    - [ ] Intersection Observer 사용
    - [ ] 하단 로딩 인디케이터
    - [ ] 페이지당 12개 항목
    - [ ] 데이터 누적 방식
    - [ ] 필터/검색 변경 시 초기화
  - [x] 페이지 번호 선택 방식
    - [x] shadcn/ui Pagination 컴포넌트
    - [x] URL 쿼리 파라미터에 page 저장
    - [x] Previous/Next 버튼
    - [x] 페이지 번호 클릭
    - [x] 페이지 변경 시 스크롤 맨 위로
    - [x] 총 페이지 수 계산
- [x] G.최종 통합 및 스타일링
  - [x] 모든 기능 통합 테스트
  - [x] 반응형 디자인 확인 (모바일/태블릿/데스크톱)
  - [x] 로딩 상태 개선
  - [x] 에러 처리 개선

## Phase 3: 상세페이지 (`/places/[contentId]`)

- [x] A.페이지 기본 구조
  - [x] `app/places/[contentId]/page.tsx` 생성
    - [x] 동적 라우팅 설정
    - [x] 뒤로가기 버튼 (헤더)
    - [x] 기본 레이아웃 구조
    - [x] 라우팅 테스트
- [x] B.기본 정보 섹션 (MVP 2.4.1)
  - [x] `components/tour-detail/detail-info.tsx` 생성
    - [x] `getDetailCommon()` API 연동
    - [x] 관광지명 (대제목)
    - [x] 대표 이미지 (크게 표시)
    - [x] 주소 표시 및 복사 기능
      - [x] 클립보드 API 사용
      - [x] 복사 완료 알림
    - [x] 전화번호 (클릭 시 전화 연결)
    - [x] 홈페이지 (링크)
    - [x] 개요 (긴 설명문)
    - [x] 관광 타입 및 카테고리 뱃지
    - [x] 정보 없는 항목 숨김 처리
- [x] C.운영 정보 섹션 (MVP 2.4.2)
  - [x] `components/tour-detail/detail-intro.tsx` 생성
    - [x] `getDetailIntro()` API 연동
    - [x] 운영시간/개장시간
    - [x] 휴무일
    - [x] 이용요금
    - [x] 주차 가능 여부
    - [x] 수용인원
    - [x] 체험 프로그램
    - [x] 유모차/반려동물 동반 가능 여부
    - [x] 정보 없는 항목 숨김 처리
- [x] D.이미지 갤러리 (MVP 2.4.3)
  - [x] `components/tour-detail/detail-gallery.tsx` 생성
    - [x] `getDetailImage()` API 연동
    - [x] 대표 이미지 + 서브 이미지들
    - [x] 이미지 슬라이드 기능 (Swiper 또는 캐러셀)
    - [x] 이미지 클릭 시 전체화면 모달
    - [x] 이미지 없으면 기본 이미지
    - [x] Next.js Image 컴포넌트 사용 (최적화)
- [x] E.지도 섹션 (MVP 2.4.4)
  - [x] `components/tour-detail/detail-map.tsx` 생성
    - [x] 해당 관광지 위치 표시
    - [x] 마커 1개 표시
    - [x] "길찾기" 버튼
      - [x] 네이버 지도 앱/웹 연동
      - [x] URL: `https://map.naver.com/v5/directions/{좌표}`
    - [x] 좌표 정보 표시 (선택 사항)
- [x] F.공유 기능 (MVP 2.4.5)
  - [x] `components/tour-detail/share-button.tsx` 생성
    - [x] URL 복사 기능
      - [x] `navigator.clipboard.writeText()` 사용
      - [x] HTTPS 환경 확인
    - [x] 복사 완료 토스트 메시지
    - [x] 공유 아이콘 버튼 (Share/Link 아이콘)
  - [x] Open Graph 메타태그
    - [x] `app/places/[contentId]/page.tsx`에 Metadata 생성
    - [x] `og:title` - 관광지명
    - [x] `og:description` - 관광지 설명 (100자 이내)
    - [x] `og:image` - 대표 이미지 (1200x630 권장)
    - [x] `og:url` - 상세페이지 URL
    - [x] `og:type` - "website"
- [x] G.북마크 기능 (MVP 2.4.5)
  - [x] `components/bookmarks/bookmark-button.tsx` 생성
    - [x] 별 아이콘 (채워짐/비어있음)
    - [x] 북마크 상태 확인 (Supabase 조회)
    - [x] 북마크 추가/제거 기능
    - [x] 인증된 사용자 확인 (Clerk)
    - [x] 로그인하지 않은 경우: 로그인 유도 또는 localStorage 임시 저장
  - [x] Supabase 연동
    - [x] `lib/api/supabase-api.ts` 생성
      - [x] `getBookmark()` - 북마크 조회
      - [x] `addBookmark()` - 북마크 추가
      - [x] `removeBookmark()` - 북마크 제거
      - [x] `getUserBookmarks()` - 사용자 북마크 목록
    - [x] `bookmarks` 테이블 사용 (db.sql 참고)
      - [x] `user_id` (users 테이블 참조)
      - [x] `content_id` (한국관광공사 API contentid)
      - [x] UNIQUE 제약 (user_id, content_id)
  - [x] 상세페이지에 북마크 버튼 추가
- [x] H.반려동물 정보 섹션 (MVP 2.5)
  - [x] `components/tour-detail/detail-pet-tour.tsx` 생성
    - [x] `getDetailPetTour()` API 연동
    - [x] 반려동물 동반 가능 여부 표시
    - [x] 반려동물 크기 제한 정보
    - [x] 반려동물 입장 가능 장소 (실내/실외)
    - [x] 반려동물 동반 추가 요금
    - [x] 반려동물 전용 시설 정보
    - [x] 아이콘 및 뱃지 디자인 (🐾)
    - [x] 주의사항 강조 표시
- [x] I.추천 관광지 섹션 (선택 사항)
  - [x] 같은 지역 또는 타입의 다른 관광지 추천
  - [x] 카드 형태로 표시
- [x] J.최종 통합 및 스타일링
  - [x] 모든 섹션 통합
  - [x] 반응형 디자인 확인
  - [x] 모바일 최적화
  - [x] 접근성 확인 (ARIA 라벨, 키보드 네비게이션)

## Phase 4: 통계 대시보드 페이지 (`/stats`)

- [x] A.페이지 기본 구조
  - [x] `app/stats/page.tsx` 생성
    - [x] 기본 레이아웃 구조
    - [x] 반응형 레이아웃 설정 (모바일 우선)
    - [x] Server Component로 구현
- [x] B.통계 데이터 수집
  - [x] `lib/api/stats-api.ts` 생성
    - [x] `getRegionStats()` - 지역별 관광지 개수 집계
      - [x] `areaBasedList2` API로 각 지역별 totalCount 조회
      - [x] 지역 코드별로 API 호출
    - [x] `getTypeStats()` - 타입별 관광지 개수 집계
      - [x] `areaBasedList2` API로 각 타입별 totalCount 조회
      - [x] contentTypeId별로 API 호출
    - [x] `getStatsSummary()` - 전체 통계 요약
      - [x] 전체 관광지 수
      - [x] Top 3 지역
      - [x] Top 3 타입
      - [x] 마지막 업데이트 시간
    - [x] 병렬 API 호출로 성능 최적화
    - [x] 에러 처리 및 재시도 로직
    - [x] 데이터 캐싱 (revalidate: 3600)
- [x] C.통계 요약 카드
  - [x] `components/stats/stats-summary.tsx` 생성
    - [x] 전체 관광지 수 표시
    - [x] Top 3 지역 표시 (카드 형태)
    - [x] Top 3 타입 표시 (카드 형태)
    - [x] 마지막 업데이트 시간 표시
    - [x] 로딩 상태 (Skeleton UI)
    - [x] 카드 레이아웃 디자인
- [x] D.지역별 분포 차트 (Bar Chart)
  - [x] `components/stats/region-chart.tsx` 생성
    - [x] shadcn/ui Chart 컴포넌트 설치 (Bar)
    - [x] recharts 기반 Bar Chart 구현
    - [x] X축: 지역명 (서울, 부산, 제주 등)
    - [x] Y축: 관광지 개수
    - [x] 상위 10개 지역 표시 (또는 전체)
    - [x] 바 클릭 시 해당 지역 목록 페이지로 이동
    - [x] 호버 시 정확한 개수 표시
    - [x] 다크/라이트 모드 지원
    - [x] 반응형 디자인
    - [x] 로딩 상태
    - [x] 접근성 (ARIA 라벨, 키보드 네비게이션)
- [x] E.타입별 분포 차트 (Donut Chart)
  - [x] `components/stats/type-chart.tsx` 생성
    - [x] shadcn/ui Chart 컴포넌트 설치 (Pie/Donut)
    - [x] recharts 기반 Donut Chart 구현
    - [x] 타입별 비율 (백분율)
    - [x] 타입별 개수 표시
    - [x] 섹션 클릭 시 해당 타입 목록 페이지로 이동
    - [x] 호버 시 타입명, 개수, 비율 표시
    - [x] 다크/라이트 모드 지원
    - [x] 반응형 디자인
    - [x] 로딩 상태
    - [x] 접근성 (ARIA 라벨)
- [ ] F.페이지 통합
  - [ ] `app/stats/page.tsx`에 모든 컴포넌트 통합
    - [ ] 통계 요약 카드 (상단)
    - [ ] 지역별 분포 차트 (중단)
    - [ ] 타입별 분포 차트 (하단)
  - [ ] 에러 처리 (에러 메시지 + 재시도 버튼)
  - [ ] 네비게이션에 통계 페이지 링크 추가
  - [ ] 최종 페이지 확인

## Phase 5: 북마크 페이지 (`/bookmarks`) - 선택 사항

- [ ] A.Supabase 설정 확인
  - [ ] `bookmarks` 테이블 확인 (db.sql 참고)
    - [ ] `users` 테이블과의 관계 확인
    - [ ] 인덱스 확인 (user_id, content_id, created_at)
    - [ ] RLS 비활성화 확인 (개발 환경)
- [ ] B북마크 목록 페이지
  - [ ] `app/bookmarks/page.tsx` 생성
    - [ ] 인증된 사용자만 접근 가능
    - [ ] 로그인하지 않은 경우 로그인 유도
  - [ ] `components/bookmarks/bookmark-list.tsx` 생성
    - [ ] 사용자 북마크 목록 조회 (`getUserBookmarks()`)
    - [ ] 카드 레이아웃 (홈페이지와 동일한 tour-card 사용)
    - [ ] 빈 상태 처리 (북마크 없을 때)
    - [ ] 로딩 상태 (Skeleton UI)
- [ ] C.북마크 관리 기능
  - [ ] 정렬 옵션
    - [ ] 최신순 (created_at DESC)
    - [ ] 이름순 (가나다순)
    - [ ] 지역별
  - [ ] 일괄 삭제 기능
    - [ ] 체크박스 선택
    - [ ] 선택 항목 삭제
    - [ ] 확인 다이얼로그
  - [ ] 개별 삭제 기능
    - [ ] 각 카드에 삭제 버튼
- [ ] D.페이지 통합 및 스타일링
  - [ ] 반응형 디자인 확인
  - [ ] 최종 페이지 확인

## Phase 6: 최적화 & 배포

- [ ] A.이미지 최적화
  - [ ] `next.config.ts` 외부 도메인 설정
    - [ ] 한국관광공사 이미지 도메인 추가
    - [ ] 네이버 지도 이미지 도메인 추가
  - [ ] Next.js Image 컴포넌트 사용 확인
    - [ ] priority 속성 (above-the-fold)
    - [ ] lazy loading (below-the-fold)
    - [ ] responsive sizes 설정
- [ ] B.전역 에러 핸들링
  - [ ] `app/error.tsx` 생성
  - [ ] `app/global-error.tsx` 생성
  - [ ] API 에러 처리 개선
- [ ] C.404 페이지
  - [ ] `app/not-found.tsx` 생성
    - [ ] 사용자 친화적인 메시지
    - [ ] 홈으로 돌아가기 버튼
- [ ] D.SEO 최적화
  - [ ] 메타태그 설정 (`app/layout.tsx`)
    - [ ] 기본 title, description
    - [ ] Open Graph 태그
    - [ ] Twitter Card 태그
  - [ ] `app/sitemap.ts` 생성
    - [ ] 동적 sitemap 생성 (관광지 상세페이지 포함)
  - [ ] `app/robots.ts` 생성
- [ ] E.성능 최적화
  - [ ] Lighthouse 점수 측정 (목표: > 80)
  - [ ] 코드 분할 확인
  - [ ] 불필요한 번들 제거
  - [ ] API 응답 캐싱 전략 확인
- [ ] F.환경변수 보안 검증
  - [ ] 모든 필수 환경변수 확인
  - [ ] `.env.example` 업데이트
  - [ ] 프로덕션 환경변수 설정 가이드 작성
- [ ] G.배포 준비
  - [ ] Vercel 배포 설정
  - [ ] 환경변수 설정 (Vercel 대시보드)
  - [ ] 빌드 테스트 (`pnpm build`)
  - [ ] 프로덕션 배포 및 테스트

## 추가 작업 (선택 사항)

- [ ] A.다크 모드 지원
  - [ ] 테마 전환 기능
  - [ ] 모든 컴포넌트 다크 모드 스타일 적용
- [ ] B.PWA 지원
  - [ ] `app/manifest.ts` 생성
  - [ ] Service Worker 설정
  - [ ] 오프라인 지원
- [ ] C.접근성 개선
  - [ ] ARIA 라벨 추가
  - [ ] 키보드 네비게이션 개선
  - [ ] 색상 대비 확인 (WCAG AA)
- [ ] D.성능 모니터링
  - [ ] Web Vitals 측정
  - [ ] 에러 로깅 (Sentry 등)
- [ ] E.사용자 피드백
  - [ ] 피드백 수집 기능
  - [ ] 버그 리포트 기능

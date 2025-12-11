- [x] C. 필터 기능

  **구현할 주요 컴포넌트/기능:**

  - `components/tour-filters.tsx` 생성 (필터 컴포넌트)
    - 지역 필터 (Select 컴포넌트)
    - 관광 타입 필터 (Select 컴포넌트)
    - 정렬 옵션 (Select 컴포넌트)
    - 초기화 버튼
  - URL 쿼리 파라미터 기반 상태 관리
    - `useSearchParams`, `useRouter` 사용
    - 뒤로가기/앞으로가기 지원
    - 페이지 새로고침 시 필터 상태 유지
  - 필터 적용 로직
    - 필터 변경 시 API 재호출
    - 여러 필터 조합 처리

  **특별히 주의할 요구사항:**

  - 지역 코드 로딩: `getAreaCode()` API 호출, 캐싱
  - URL 쿼리 파라미터: `areaCode`, `contentTypeId`, `sort`
  - 필터 초기화 기능 제공
  - 반응형 디자인 (모바일: 접을 수 있는 UI)
  - SelectItem 빈 값 에러 해결: "all" 값 사용
  - 지역 코드 데이터 정제 (빈 값 필터링)

  - [x] `components/tour-filters.tsx` 생성
    - [x] 지역 필터 (시/도 선택)
      - [x] `getAreaCode()` API로 지역 목록 로드
      - [x] Select 컴포넌트 사용
      - [x] "전체" 옵션
    - [x] 관광 타입 필터
      - [x] 관광지(12), 문화시설(14), 축제/행사(15), 여행코스(25), 레포츠(28), 숙박(32), 쇼핑(38), 음식점(39)
      - [x] Select 컴포넌트 사용
      - [x] "전체" 옵션
    - [x] 정렬 옵션
      - [x] 최신순 (modifiedtime - C)
      - [x] 이름순 (가나다 - A)
    - [x] 초기화 버튼
    - [x] 필터 상태 관리 (URL 쿼리 파라미터)
  - [x] Select 컴포넌트 추가 (shadcn/ui)
    - [x] @radix-ui/react-select 패키지 설치
  - [x] `app/page.tsx` 수정
    - [x] `TourFilters` 컴포넌트 추가
    - [x] URL 쿼리 파라미터를 `TourList`에 전달
  - [x] `TourList` 수정
    - [x] props로 필터 값 받기 (useSearchParams)
    - [x] useEffect에서 필터 변경 감지
    - [x] 필터에 따라 API 재호출
  - [x] 필터 적용 로직
    - [x] 필터 변경 시 API 재호출
    - [x] 필터 조합 처리
  - [x] 테스트
    - [x] 지역 필터 동작 확인
    - [x] 타입 필터 동작 확인
    - [x] 정렬 옵션 확인
    - [x] 필터 조합 테스트
    - [x] URL 쿼리 파라미터 확인
    - [x] 뒤로가기/앞으로가기 테스트

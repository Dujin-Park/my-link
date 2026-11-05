# 마이링크 (MyLink) — 제품 요구사항 정의서 (PRD)

- **문서 버전**: v1.1 (단계별 시연용 로드맵 반영)
- **작성일**: 2026-11-05
- **프로젝트명**: `mylink` (GitHub: `my-link`)
- **서비스 한 줄 요약**: 개인 크리에이터 및 일반 사용자를 위한 LocalStorage 기반 멀티링크 & 바이오 프로필 서비스

---

## 1. 제품 개요 (Product Overview)

### 1.1 배경 및 목적
소셜 미디어(Instagram, YouTube, GitHub 등) 프로필에 흩어진 여러 채널과 포트폴리오 링크를 한곳에 모아 보여줄 수 있는 **바이오 프로필 페이지(마이링크)**를 제작한다.
본 프로젝트는 **단계별 라이브 시연(Step-by-Step Demo)** 방식으로 진행되며, **Step 1에서는 대시보드나 통계 기능 없이 `Zustand` + `LocalStorage` 기반의 프로필 및 링크 페이지(`/`)만 먼저 완성**하고 이후 단계에서 편집/테마/통계 기능을 순차적으로 확장한다.

### 1.2 타겟 사용자
- **개인 크리에이터 & 개발자**: GitHub, 포트폴리오, 블로그, 이메일 등 자신의 핵심 채널을 깔끔한 토스(TDS) 스타일 모바일 프로필로 공유하고 싶은 사용자
- **일반 사용자**: 여러 소셜 링크를 한 페이지에 모아 바이오 링크로 활용하고 싶은 사용자

---

## 2. 사용자 시나리오 (User Scenarios)

### 시나리오 1: 방문자의 프로필 탐색 및 채널 이동 (Step 1 핵심 흐름)
- **페르소나**: 개발자 박두진의 GitHub 또는 SNS 바이오 링크를 클릭해 유입된 채용 담당자 / 동료 개발자
- **상황 및 흐름**:
  1. 방문자가 마이링크 URL(`/`)에 접속한다.
  2. 브라우저가 최초 접속임을 감지하고 기본 프로필 데이터(또는 `LocalStorage`에 저장된 데이터)를 즉시 불러와 토스(TDS) 스타일의 모바일 프로필 화면을 보여준다.
  3. 방문자는 상단의 **프로필 아바타, 이름(`박두진`), 직무 배지(`프론트엔드 개발자`), 한 줄 소개글, 기술 스택 칩(`Next.js`, `TypeScript` 등)**을 통해 어떤 개발자인지 한눈에 파악한다.
  4. 하단의 **'한번에 둘러보기' 링크 리스트**에서 `GitHub 저장소`, `만든 프로젝트`, `개발 노트` 등 원하는 항목을 클릭하여 새 탭으로 이동하거나, `이메일 보내기`를 눌러 즉시 연락을 취한다.

### 시나리오 2: 재방문 및 로컬 데이터 유지 확인 (Step 1 데이터 영속성 흐름)
- **페르소나**: 마이링크를 시연 중인 발표자 또는 재방문 사용자
- **상황 및 흐름**:
  1. 사용자가 브라우저의 개발자 도구(`Application > Local Storage`)에서 `mylink_profile_v1`에 저장된 JSON 데이터를 확인하거나 일부 텍스트(예: 소개글, 링크 제목)를 수정한 뒤 새로고침(`F5`)한다.
  2. 서버 통신 없이も `Zustand` 스토어가 `LocalStorage`의 변경된 데이터를 자동으로 읽어와 화면에 그대로 유지해 준다.
  3. 필요 시 초기화 기능을 통해 언제든 기본 데모 상태로 즉시 복원할 수 있다.

### 시나리오 3: 크리에이터의 프로필 편집 및 커스터마이징 *(Step 2 ~ Step 3 확장 흐름)*
- **페르소나**: 자신의 포트폴리오 링크를 직접 꾸미고 싶은 크리에이터
- **상황 및 흐름**:
  1. 사용자가 편집 모드로 진입하여 자신의 이름과 소개글을 수정하고 새로운 프로젝트 링크를 추가한다.
  2. 가장 강조하고 싶은 링크를 드래그 앤 드롭으로 맨 위에 배치하고, 아직 준비 중인 링크는 토글 스위치로 임시 비활성화(`enabled: false`)한다.
  3. 우측 실시간 라이브 프리뷰로 모바일 화면을 확인하며, 취향에 따라 프리셋 테마(토스 라이트/다크, 네오브루탈리즘 등)를 변경한다.

### 시나리오 4: 링크 성과 및 방문 통계 확인 *(Step 4 확장 흐름)*
- **페르소나**: 어떤 링크가 가장 반응이 좋은지 확인하고 싶은 크리에이터
- **상황 및 흐름**:
  1. 방문자들이 프로필 페이지를 조회하고 링크를 클릭할 때마다 누적 방문자 수와 링크별 클릭 수가 기록된다.
  2. 크리에이터는 통계 뷰에서 전체 방문자 수, 총 클릭 수, 평균 클릭률(CTR)과 인기 링크 순위를 한눈에 확인한다.

---

## 3. 핵심 아키텍처 및 기술 스택

| 구분 | 결정 사항 | 상세 내용 |
| :--- | :--- | :--- |
| **프레임워크** | Next.js 16 (App Router) + TypeScript | 컴포넌트 기반 설계 및 정적/클라이언트 렌더링 최적화 |
| **스타일링** | **Tailwind CSS v4 단일 통일** (CSS Module 미사용) + 토스 디자인 시스템(TDS) | 모듈 CSS(`.module.css`) 없이 모든 스타일을 Tailwind CSS 유틸리티 클래스로 통일하고, [DESIGN.md](file:///c:/Users/PDJ/Desktop/projects/my-link-hy/DESIGN.md) 기반 OKLCH 컬러 토큰, Pretendard 서체, 해요체 카피 적용 |
| **UI 컴포넌트** | **shadcn/ui 기반 재사용 컴포넌트 분리** | `Button` (`components/ui/button.tsx`), `Badge` (`components/ui/badge.tsx`), `Card` (`components/ui/card.tsx`), `LinkCardItem` (`components/link-card-item.tsx`)으로 분리하여 재사용성 확보 |
| **상태 관리 & 저장소** | **Zustand** (`persist` 미들웨어) + `LocalStorage` | 별도 백엔드 없이 브라우저 `LocalStorage`(`mylink_profile_v1`)에 프로필 및 링크 데이터를 저장·로드 (최초 접속 시 기본 Mock 데이터로 자동 초기화) |

---

## 4. 단계별 시연 로드맵 (Step-by-Step Milestones)

> **현재 진행 단계: Step 1 (LocalStorage 기반 프로필 페이지 구현)**  
> ※ 대시보드(에디터), 드래그 앤 드롭, 테마 변경, 방문/클릭 통계 기능은 **Step 2 이후 단계**에서 순차적으로 구현한다.

### ✅ Step 1: LocalStorage 기반 프로필 페이지 구현 (현재 목표)
- **대상 경로**: `/` ([app/page.tsx](file:///c:/Users/PDJ/Desktop/projects/my-link-hy/app/page.tsx))
- **핵심 범위**:
  1. **Zustand + LocalStorage 스토어 구축**:
     - 최초 접속 시 `LocalStorage`에 데이터가 없으면 기본 Mock 데이터(박두진 개발자 프로필 + 기본 링크 목록)를 자동으로 세팅
     - `LocalStorage`에 저장된 데이터가 있으면 해당 데이터를 불러와 화면에 렌더링
  2. **프로필 섹션 렌더링**:
     - 프로필 아바타 이미지 (`/profile-avatar.svg`), 역할 배지(`프론트엔드 개발자`), 이름(`박두진`), 한 줄 소개글, 기술 스택 칩(Chips) 표시
  3. **멀티링크 리스트 렌더링**:
     - 활성화된(`enabled: true`) 링크 목록을 순서대로 카드/리스트 행(`List-Row`) 형태로 렌더링
     - 각 링크 클릭 시 새 탭(또는 메일 클라이언트)으로 해당 URL 이동
  4. **하단 Primary CTA**:
     - 대표 액션 버튼(`GitHub 구경하기`) 및 보조 문의 버튼 배치
- **제외 범위 (Step 1에서는 구현하지 않음)**:
  - 관리자 대시보드(`/admin`), 인라인 편집 UI, 드래그 앤 드롭, 테마 스위치, 방문자 수/클릭 수 통계 집계 화면

---

### 🔜 Step 2: 프로필 & 링크 관리 (에디터 및 실시간 프리뷰) *(차기 단계)*
- 프로필 정보(이름, 소개글, 아바타) 수정 기능
- 링크 추가 / 수정 / 삭제 / 노출 On·Off 토글 기능
- 실시간 라이브 프리뷰 연동

### 🔜 Step 3: 드래그 앤 드롭 & 테마 프리셋 설정 *(차기 단계)*
- 드래그 앤 드롭(Drag & Drop)을 통한 링크 노출 순서 변경
- 프리셋 테마(토스 라이트/다크, 미니멀, 네오브루탈리즘 등) 및 버튼 모양 전환

### 🔜 Step 4: 기본 통계 기능 (Analytics) *(차기 단계)*
- 링크별 클릭 수(`clicks`) 및 페이지 누적 방문자 수(`pageViews`) 카운팅 및 통계 뷰 제공

---

## 5. Step 1 데이터 모델 설계 (`Zustand` + `LocalStorage`)

- **Storage Key**: `mylink_profile_v1`
- **초기 더미 데이터 명세 파일**:
  - 정적 JSON / Mock API 데이터: [`public/data/links.json`](../public/data/links.json) (클라이언트 fetch 경로: `/data/links.json`)
  - TypeScript 타입 및 초기값 상수: [`lib/dummy-data.ts`](../lib/dummy-data.ts) (`DEFAULT_PROFILE`, `DEFAULT_LINKS`)
- **초기화 규칙**:
  - 최초 접속 시 `LocalStorage`(`mylink_profile_v1`)에 저장된 데이터가 없으면 위 더미 데이터 명세(`public/data/links.json` 및 `lib/dummy-data.ts`)를 기본값으로 로드하여 스토어를 초기화한다.

```typescript
export type IconName =
  | "github"
  | "folder"
  | "book"
  | "mail"
  | "globe";

export interface LinkItem {
  id: string;
  title: string;
  subtitle: string;
  meta: string;
  url: string;
  icon: IconName;
  enabled: boolean;
  isHighlight?: boolean;
}

export interface ProfileData {
  name: string;
  badge: string;
  bio: string;
  avatarUrl: string;
  chips: { name: string; active: boolean }[];
}

export interface MyLinkStep1State {
  profile: ProfileData;
  links: LinkItem[];
  resetToDefault: () => void;
}
```

### 5.1 기본 더미 데이터 명세 (`public/data/links.json`)

| 구분 | 항목 (`id` / 필드) | 기본값 요약 |
| :--- | :--- | :--- |
| **프로필 (`profile`)** | `name` / `badge` | `박두진` / `프론트엔드 개발자` |
| | `bio` | `사용자의 시간을 아껴주는 깔끔한 웹을 만들어요.\nNext.js와 TypeScript로 복잡한 문제를 쉽게 풀고 있어요.` |
| | `avatarUrl` | `/profile-avatar.svg` |
| | `chips` | `Next.js`(active), `TypeScript`, `React`, `Tailwind CSS`, `Git · GitHub` |
| **링크 목록 (`links`)** | `link-github` | **GitHub 저장소** (`@Dujin-Park`, `icon: "github"`, `isHighlight: true`) |
| | `link-projects` | **만든 프로젝트** (`2개`, `icon: "folder"`) |
| | `link-blog` | **개발 노트** (`블로그`, `icon: "book"`) |
| | `link-portfolio` | **개인 웹사이트** (`웹사이트`, `icon: "globe"`) |
| | `link-email` | **이메일 보내기** (`문의`, `icon: "mail"`) |

---

## 6. UI/UX 및 구현 원칙 (Step 1 기준)

1. **Tailwind CSS 단일 스타일링 원칙 (CSS Module 미사용)**:
   - 페이지 및 모든 컴포넌트의 스타일은 모듈 CSS(`.module.css`)나 별도 스타일시트를 사용하지 않고 **Tailwind CSS 유틸리티 클래스(`cn` 유틸 조합)**로 통일한다.
2. **shadcn/ui 기반 컴포넌트 분리 및 재사용**:
   - UI 요소를 `shadcn/ui` 패턴(`cva`, `data-slot`)에 맞춰 독립 컴포넌트로 분리하여 재사용할 수 있도록 구성한다.
     - `Button` ([`components/ui/button.tsx`](../components/ui/button.tsx)): 상단 공유 아이콘 버튼, 하단 Primary CTA(`tdsPrimary`), 보조 문의 버튼(`tdsGhost`)
     - `Badge` ([`components/ui/badge.tsx`](../components/ui/badge.tsx)): 직무 배지(`role`), 기술 스택 칩(`chipActive`, `chipInactive`), 하단 안내 배지(`pillInfo`)
     - `Card` ([`components/ui/card.tsx`](../components/ui/card.tsx)): 프로필 Hero 카드, 멀티링크 리스트 섹션 카드, 하단 CTA 섹션 카드
     - `LinkCardItem` ([`components/link-card-item.tsx`](../components/link-card-item.tsx)): 개별 링크 항목 행(`List-Row`)을 렌더링하는 재사용 컴포넌트
3. **토스 디자인 시스템 ([DESIGN.md](file:///c:/Users/PDJ/Desktop/projects/my-link-hy/DESIGN.md)) 적용**:
   - 차분한 `grey-100` 바탕 위에 깔끔한 화이트 카드(`radius-3xl: 24px`)와 `1px grey-200` 헤어라인 보더를 사용한다.
   - 강조 색상은 토스 블루(`blue-500`) 하나로 통일하고, 대화형 존댓말인 **해요체** 카피를 유지한다.
4. **SSR 하이드레이션 안전성**:
   - Next.js 서버 렌더링 시에는 기본 Mock 데이터를 먼저 그려 화면 깜빡임을 막고, 클라이언트 마운트 후 `LocalStorage` 데이터와 자연스럽게 동기화한다.

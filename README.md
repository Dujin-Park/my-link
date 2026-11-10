# 마이링크 (MyLink)

> **내 모든 링크, 하나로.**  
> 흩어진 포트폴리오, GitHub, 블로그, SNS 채널을 단 하나의 프로필 페이지로 연결하고 실시간 클릭 통계까지 분석하는 멀티링크 프로필 웹 애플리케이션입니다.  
> **한양대학교 바이브 코딩 (Hanyang Univ. Vibe Coding)** 프로젝트

---

## 주요 기능

### 1. 키워드 중심 반응형 랜딩 페이지 (`/`)
- 서비스 핵심 가치(`#링크관리`, `#클릭통계`, `#개인URL`)를 한눈에 보여주는 미니멀 랜딩 페이지
- 모바일 · 데스크톱 반응형 레이아웃 및 실시간 프로필 목업 미리보기 제공
- 로그인 완료 시 즉시 내 프로필 편집 화면(마이페이지)으로 전환되며, 상단 스위처로 언제든 랜딩 화면 미리보기 가능

### 2. Google 소셜 로그인 & 크로스 브라우저 호환 인증
- **Firebase Authentication** 기반 Google 계정 원클릭 로그인/로그아웃
- `onAuthStateChanged`를 통한 세션 자동 유지
- Chrome, Microsoft Edge, Safari 등 다양한 브라우저 환경에서 팝업 차단(`auth/popup-blocked`)을 방지하는 동기 팝업 선점 및 리졸버 워밍업 적용

### 3. 인라인 프로필 & 멀티링크 관리 (CRUD)
- **프로필 인라인 편집**: 표시 이름(`displayName`)과 한 줄 소개(`bio`)를 클릭해 즉시 수정하고 낙관적 업데이트(Optimistic UI)로 실시간 반영
- **링크 추가 · 수정 · 삭제**: 제목, URL, 한 줄 설명, 배지 텍스트, 강조 여부 설정 및 입력값 유효성 검사(Zod)
- **사이트 메인 아이콘 자동 표시**: 등록된 각 링크의 도메인(`hostname`)을 추출해 해당 웹사이트의 공식 고해상도 아이콘/파비콘을 자동으로 렌더링

### 4. 아이디 기반 개인 공개 프로필 (`/[username]`)
- 이메일 아이디(`username`) 기반의 깔끔한 고유 프로필 URL 자동 생성 (예: `/dujin`)
- 방문자에게는 깔끔한 읽기 전용(Read-Only) 프로필과 멀티링크 목록 제공
- 페이지 소유자가 본인 공개 주소(`/[username]`)에 접속하면 **`여기서 바로 편집` / `공개 화면 보기`** 토글을 통해 주소를 이동하지 않고도 즉시 편집 가능
- 다른 사람의 프로필 페이지에서 내 계정으로 로그인하더라도 보고 있던 상대방 페이지에 그대로 머물도록 UX 최적화
- 존재하지 않는 사용자 접근 시 커스텀 404 Not Found 페이지 제공

### 5. 실시간 클릭 카운트 & 차트 통계 대시보드 (`/stats`)
- **원자적 클릭 카운트 증가**: 링크 클릭 시 새 탭(`target="_blank"`) 이동과 동시에 Firestore `increment(1)`을 호출해 동시 클릭(Race Condition) 시에도 정확한 클릭수 누적
- **마이페이지 실시간 클릭 요약**: 총 클릭수 합산(`총 N 클릭`) 및 인기순 링크 랭킹 리스트 제공
- **전용 통계 페이지 (`/stats`)**:
  - 비로그인 접근 시 자동 리다이렉트 보호
  - 총 클릭수 요약, 활성 링크 수, 최다 클릭 링크 하이라이트
  - **`shadcn/ui` Chart (`Recharts`)** 기반 링크별 클릭수 가로 막대 차트(Bar Chart) 및 전체 클릭 대비 비중(`%`) 분석

---

## 기술 스택

| 구분 | 기술 |
| :--- | :--- |
| **Framework** | Next.js 16.4 (App Router, Turbopack, Cache Components) |
| **Language** | TypeScript 5, React 19 |
| **Styling & UI** | Tailwind CSS v4, Toss Design System (TDS 토큰 기반), `shadcn/ui`, Lucide Icons |
| **Chart** | `shadcn/ui` Chart Component (`recharts`) |
| **Backend / Auth / DB** | Firebase Authentication (Google OAuth), Cloud Firestore |
| **Validation** | Zod |
| **Deployment** | Vercel |

---

## 페이지 라우트 구조

| 경로 | 설명 | 권한 |
| :--- | :--- | :--- |
| `/` | 비로그인 시 키워드 중심 랜딩 페이지 / 로그인 시 마이페이지(프로필·링크 편집 및 요약 통계) | 공개 / 로그인 시 편집 |
| `/[username]` | 사용자 아이디(`username`) 기반 개인 공개 프로필 페이지 (본인 접속 시 인라인 편집 모드 전환 지원) | 전체 공개 |
| `/stats` | 모든 링크 총 클릭수 합산 및 `shadcn` 막대 차트 기반 상세 클릭 통계 리포트 | 로그인 필수 (비로그인 시 `/` 리다이렉트) |

---

## 데이터베이스 구조 (Cloud Firestore)

- **`users/{userId}`**: 사용자 프로필 문서
  - `uid` (`string`): Firebase Auth UID
  - `username` (`string`): 이메일 아이디 기반 고유 사용자명
  - `displayName` (`string`): 프로필 표시 이름
  - `bio` (`string`): 한 줄 소개글
  - `avatarUrl` (`string`): 프로필 이미지 URL
  - `email` (`string`): 이메일 주소
  - `createdAt`, `updatedAt` (`timestamp`)
- **`users/{userId}/links/{linkId}`**: 사용자의 멀티링크 하위 컬렉션
  - `title` (`string`): 링크 제목
  - `url` (`string`): 이동할 외부 URL
  - `subtitle` (`string`): 부가 설명
  - `meta` (`string`): 우측 배지 텍스트
  - `icon` (`string`): 기본 폴백 아이콘 타입
  - `enabled` (`boolean`): 노출 여부
  - `isHighlight` (`boolean`): 강조 표시 여부
  - `clickCount` (`number`): 누적 클릭 카운트 (기본값 `0`, `increment(1)` 원자적 증가)
  - `createdAt`, `updatedAt` (`timestamp`)

---

## 시작하기 (Getting Started)

### 1. 패키지 설치

```bash
npm install
```

### 2. 환경 변수 설정 (`.env.local`)

프로젝트 루트에 `.env.local` 파일을 생성하고 Firebase 웹 앱 설정값을 입력합니다.

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인합니다.

---

## 라이선스 및 제작

- **제작**: 한양대학교 바이브 코딩 (Hanyang University Vibe Coding)
- **GitHub**: [https://github.com/Dujin-Park/my-link](https://github.com/Dujin-Park/my-link)

# Interohrigin I&C 어드민 패널 개편 개발 계획서

> 작성일: 2026-03-06
> 프로젝트: interohrigin-ir (React + Vite + Firebase + Tailwind CSS v4)

---

## 1. 개요

### 1.1 현재 상태
현재 어드민(`/admin`)은 3개 Firestore 컬렉션(inc_brands, agency_works, history_items)만 관리하는 최소 기능 대시보드이다. 랜딩 페이지의 대부분 콘텐츠(히어로, CEO 메시지, 서비스, 브랜드, 통계, 영상 등)는 **소스코드에 하드코딩**되어 있어 콘텐츠 수정 시 개발자 개입이 필수적이다.

### 1.2 목표
- 랜딩 페이지의 **모든 콘텐츠**를 어드민에서 CRUD 가능하게 전환
- **이미지 업로드** 기능 (Firebase Storage)
- **AI 보조 기능** (카피라이팅, 이미지 생성/편집)
- **인증/권한** 시스템으로 보안 강화
- 직관적이고 효율적인 **관리자 UX**

---

## 2. 기술 스택

| 영역 | 기술 | 비고 |
|------|------|------|
| Frontend | React 19 + TypeScript | 기존 유지 |
| Styling | Tailwind CSS v4 | 기존 유지 |
| Backend/DB | Firebase Firestore | 기존 유지, 컬렉션 확장 |
| Storage | Firebase Storage | 신규 — 이미지/미디어 업로드 |
| Auth | Firebase Authentication | 신규 — 관리자 로그인 |
| AI | Claude API (Anthropic) | 신규 — 콘텐츠 생성 보조 |
| 상태관리 | React Context + useReducer | 어드민 전역 상태 |
| Rich Editor | Tiptap 또는 Lexical | 신규 — 본문 편집기 |

---

## 3. Firestore 데이터 구조 설계

### 3.1 컬렉션 설계

```
firestore/
├── site_config/                    # 사이트 전역 설정 (단일 문서)
│   └── main
│       ├── companyName
│       ├── contactEmail
│       ├── contactPhone
│       ├── address
│       ├── businessHours
│       └── snsLinks: { instagram, youtube, naverBlog }
│
├── pages/                          # 페이지별 콘텐츠
│   ├── home
│   │   ├── hero: { images[], title, subtitle, ctas[] }
│   │   ├── stats: { items[] }
│   │   ├── marquee: { texts[] }
│   │   ├── flagship: { image, title, description, cta }
│   │   ├── ceoQuote: { message, image, name }
│   │   └── closingCta: { title, description, buttonText }
│   ├── about
│   │   ├── hero: { title, description, image }
│   │   ├── vision: { title, description }
│   │   ├── mission: { title, description }
│   │   ├── ceo: { name, title, image, message }
│   │   └── values: { items[] }
│   ├── brands
│   │   ├── hero: { title, description, image }
│   │   └── philosophy: { items[] }
│   ├── business
│   │   ├── hero: { title, description, image }
│   │   ├── areas: { items[] }
│   │   └── partnershipCta: { title, buttonText }
│   └── contact
│       ├── hero: { title, description, image }
│       └── inquiryTypes: { items[] }
│
├── brands/                         # 브랜드 (독립 컬렉션)
│   └── {brandId}
│       ├── name, category, description, detail
│       ├── logo, image
│       ├── links: { website, smartstore, instagram }
│       ├── order, visible
│       └── createdAt, updatedAt
│
├── videos/                         # PR 영상
│   └── {videoId}
│       ├── youtubeId, brandName, brandLogo
│       ├── order, visible
│       └── createdAt
│
├── services/                       # 서비스 항목
│   └── {serviceId}
│       ├── title, description, image, link
│       ├── order, visible
│       └── createdAt
│
├── process_steps/                  # 프로세스 단계
│   └── {stepId}
│       ├── number, title, description, image
│       ├── order
│       └── createdAt
│
├── world_cities/                   # 월드맵 도시
│   └── {cityId}
│       ├── label, sub, flag, isPrimary
│       ├── order
│       └── createdAt
│
├── history_items/                  # 연혁 (기존 유지)
│   └── {itemId}
│       ├── year, title, description, order
│       └── createdAt
│
└── contact_submissions/            # 문의 접수 내역 (신규)
    └── {submissionId}
        ├── name, email, company, type, message
        ├── status: "new" | "read" | "replied"
        ├── notes
        └── createdAt
```

---

## 4. 기능 상세

### Phase 1: 기반 구축 (핵심)

#### 4.1 인증 시스템
- Firebase Auth 이메일/비밀번호 로그인
- 어드민 라우트 보호 (ProtectedRoute 컴포넌트)
- 로그인/로그아웃 UI
- Firestore 보안 규칙 적용 (인증된 사용자만 쓰기 허용)

#### 4.2 어드민 레이아웃
```
/admin
├── /admin/login              # 로그인
├── /admin/dashboard          # 대시보드 (요약 현황)
├── /admin/pages/home         # 홈 페이지 콘텐츠 편집
├── /admin/pages/about        # About 페이지 편집
├── /admin/pages/brands       # Brands 페이지 편집
├── /admin/pages/business     # Business 페이지 편집
├── /admin/pages/contact      # Contact 페이지 편집
├── /admin/brands             # 브랜드 관리 (CRUD)
├── /admin/videos             # PR 영상 관리
├── /admin/services           # 서비스 관리
├── /admin/history            # 연혁 관리
├── /admin/inquiries          # 문의 내역 관리
└── /admin/settings           # 사이트 설정 (회사 정보, 연락처)
```

#### 4.3 페이지별 콘텐츠 편집기
- 각 페이지의 섹션을 시각적으로 구분하여 편집
- 실시간 미리보기 (사이드 패널 또는 새 탭)
- 텍스트: 인라인 편집 + Rich Text 에디터
- 배열 데이터: 드래그 앤 드롭 순서 변경
- 변경사항 자동 저장 또는 명시적 저장 버튼

#### 4.4 이미지 업로드
- Firebase Storage 연동
- 드래그 앤 드롭 업로드
- 이미지 미리보기 및 크롭 기능
- 자동 리사이즈 및 WebP 변환 (클라이언트 사이드)
- 업로드 경로: `uploads/{collection}/{timestamp}_{filename}`
- 기존 이미지 교체 시 이전 파일 자동 삭제

---

### Phase 2: 고급 기능

#### 4.5 AI 콘텐츠 보조 기능

**텍스트 생성/편집**
- 마케팅 카피 자동 생성 (브랜드 설명, 서비스 소개 등)
- 톤/스타일 선택: 전문적, 친근한, 고급스러운
- 한국어/영어 번역 및 다국어 카피 생성
- SEO 최적화 텍스트 제안
- 기존 텍스트 리라이팅/개선

**이미지 관련 AI**
- AI 이미지 생성 (배너, 배경 등)
- 업로드 이미지 alt 텍스트 자동 생성
- 이미지 배경 제거/교체 제안

**구현 방식**
- Claude API를 Firebase Cloud Function으로 프록시
- API 키는 서버 사이드에서만 관리
- 요청 제한(Rate Limit) 적용

#### 4.6 문의 관리 시스템
- Contact 폼 제출 내역을 Firestore에 저장
- 상태 관리: 신규 → 확인 → 답변완료
- 관리자 메모 추가 기능
- 신규 문의 알림 (대시보드 배지)
- EmailJS 연동 유지 (이메일 발송) + Firestore 백업 저장

#### 4.7 미디어 라이브러리
- 업로드된 모든 이미지를 한곳에서 관리
- 검색, 필터, 태그 기능
- 콘텐츠 편집 시 라이브러리에서 선택하여 삽입
- 사용/미사용 이미지 구분

---

### Phase 3: 운영 편의

#### 4.8 대시보드
- 사이트 콘텐츠 현황 요약 (페이지별 마지막 수정일)
- 신규 문의 건수
- 최근 변경 이력 (Activity Log)
- 빠른 링크 (자주 편집하는 섹션으로)

#### 4.9 변경 이력 및 복원
- 콘텐츠 수정 시 이전 버전 자동 저장 (최근 10건)
- 이전 버전으로 복원 기능
- 수정자/수정일시 기록

#### 4.10 콘텐츠 공개/비공개
- 각 항목(브랜드, 영상, 서비스 등)에 `visible` 플래그
- 비공개 설정 시 랜딩 페이지에서 즉시 숨김
- 삭제 전 비공개로 테스트 가능

---

## 5. 랜딩 페이지 연동 변경

### 5.1 데이터 로딩 전략
```
하드코딩 데이터 → Firestore 실시간 구독 (onSnapshot)
                → 로딩 중: 스켈레톤 UI 표시
                → 실패 시: 하드코딩 폴백 데이터 사용
```

### 5.2 커스텀 훅 설계
```typescript
// 예시: 페이지 콘텐츠 훅
usePageContent('home')       → { hero, stats, marquee, ... }
useCollection('brands')      → { items, loading, error }
useSiteConfig()              → { companyName, contactEmail, ... }
```

### 5.3 이미지 최적화
- Firebase Storage URL에 캐시 헤더 설정
- 썸네일 자동 생성 (리스트용 소형 이미지)
- lazy loading 유지

---

## 6. 어드민 UI/UX 설계

### 6.1 레이아웃
```
┌─────────────────────────────────────────────┐
│  Header (로고 + 사이트 보기 링크 + 로그아웃)    │
├──────────┬──────────────────────────────────┤
│          │                                  │
│ Sidebar  │       Main Content Area          │
│          │                                  │
│ - 대시보드 │  ┌─ Section Header ───────────┐  │
│ - 페이지   │  │  편집 영역                  │  │
│   - Home  │  │  (인라인 편집 + 미리보기)     │  │
│   - About │  │                             │  │
│   - ...   │  └─────────────────────────────┘  │
│ - 브랜드   │                                  │
│ - 영상     │  ┌─ AI 보조 패널 ──────────────┐  │
│ - 서비스   │  │  (접이식 사이드 패널)          │  │
│ - 연혁     │  └─────────────────────────────┘  │
│ - 문의     │                                  │
│ - 설정     │                                  │
├──────────┴──────────────────────────────────┤
│  Footer (버전 정보)                           │
└─────────────────────────────────────────────┘
```

### 6.2 디자인 원칙
- 깔끔한 화이트 기반 UI (랜딩 페이지와 분리된 어드민 톤)
- 섹션별 카드 레이아웃으로 콘텐츠 구분
- 저장 상태 표시 (저장 중, 저장 완료, 변경사항 있음)
- 모바일 반응형 (태블릿 이상 최적화)
- Toast 알림으로 작업 결과 피드백

---

## 7. 보안

- Firebase Auth 기반 로그인 필수
- Firestore Security Rules: 인증 사용자만 write 허용
- Storage Rules: 인증 사용자만 upload 허용
- AI API 호출: Cloud Function 프록시 (API 키 노출 방지)
- 관리자 계정 화이트리스트 (Firestore `admins` 컬렉션)
- XSS 방지: Rich Text 에디터 출력 시 sanitize

---

## 8. 개발 단계 및 우선순위

### Phase 1 — 핵심 기반 (1차 개발)
| 순서 | 작업 | 설명 |
|------|------|------|
| 1-1 | Firebase Auth + 로그인 UI | 어드민 접근 보안 |
| 1-2 | 어드민 레이아웃 + 라우팅 | 사이드바, 헤더, 페이지 구조 |
| 1-3 | Firestore 스키마 마이그레이션 | 하드코딩 → Firestore 이전 |
| 1-4 | 페이지 콘텐츠 편집기 (Home) | 가장 복잡한 페이지 먼저 |
| 1-5 | 페이지 콘텐츠 편집기 (나머지) | About, Brands, Business, Contact |
| 1-6 | 브랜드 CRUD 개편 | 기존 기능 확장 |
| 1-7 | 이미지 업로드 (Firebase Storage) | 드래그앤드롭 + 미리보기 |
| 1-8 | 랜딩 페이지 동적 데이터 연동 | usePageContent 훅 적용 |

### Phase 2 — 고급 기능 (2차 개발)
| 순서 | 작업 | 설명 |
|------|------|------|
| 2-1 | AI 텍스트 생성 기능 | Claude API 연동 |
| 2-2 | AI 이미지 보조 기능 | alt 텍스트, 이미지 생성 |
| 2-3 | 문의 관리 시스템 | 접수 내역 + 상태 관리 |
| 2-4 | 미디어 라이브러리 | 이미지 통합 관리 |
| 2-5 | 영상/서비스/연혁 관리 | 나머지 컬렉션 CRUD |

### Phase 3 — 운영 편의 (3차 개발)
| 순서 | 작업 | 설명 |
|------|------|------|
| 3-1 | 대시보드 현황판 | 요약 정보 + 빠른 링크 |
| 3-2 | 변경 이력 + 복원 | 버전 관리 |
| 3-3 | 콘텐츠 공개/비공개 | visible 토글 |
| 3-4 | 드래그앤드롭 순서 변경 | 배열 항목 정렬 |

---

## 9. 파일 구조 (예상)

```
src/
├── pages/
│   └── admin/
│       ├── AdminLogin.tsx
│       ├── AdminLayout.tsx
│       ├── Dashboard.tsx
│       ├── pages/
│       │   ├── HomeEditor.tsx
│       │   ├── AboutEditor.tsx
│       │   ├── BrandsEditor.tsx
│       │   ├── BusinessEditor.tsx
│       │   └── ContactEditor.tsx
│       ├── BrandManager.tsx
│       ├── VideoManager.tsx
│       ├── ServiceManager.tsx
│       ├── HistoryManager.tsx
│       ├── InquiryManager.tsx
│       └── SiteSettings.tsx
├── components/
│   └── admin/
│       ├── Sidebar.tsx
│       ├── ImageUploader.tsx
│       ├── RichTextEditor.tsx
│       ├── AiAssistPanel.tsx
│       ├── MediaLibrary.tsx
│       ├── SortableList.tsx
│       ├── ContentCard.tsx
│       ├── StatusBadge.tsx
│       └── Toast.tsx
├── hooks/
│   ├── usePageContent.ts
│   ├── useCollection.ts
│   ├── useSiteConfig.ts
│   ├── useImageUpload.ts
│   └── useAiAssist.ts
├── lib/
│   ├── firebase.ts          # 기존
│   ├── storage.ts           # 신규 — Storage 유틸
│   ├── ai.ts                # 신규 — AI API 클라이언트
│   └── emailjs.ts           # 기존
└── contexts/
    └── AuthContext.tsx       # 신규 — 인증 상태
```

---

## 10. 관리 대상 콘텐츠 전체 목록

| 페이지 | 섹션 | 관리 항목 | 현재 상태 |
|--------|------|----------|----------|
| Home | Hero | 배경 이미지 3장, 타이틀, 서브타이틀, CTA 2개 | 하드코딩 |
| Home | Stats | 4개 수치 (라벨, 값, 접미사) | 하드코딩 |
| Home | Marquee | 텍스트 배열 | 하드코딩 |
| Home | Brand Showcase | 7개 브랜드 카드 | 하드코딩 |
| Home | AZH Flagship | 이미지, 텍스트, CTA | 하드코딩 |
| Home | World Map | 9개 도시 | 하드코딩 |
| Home | Video Gallery | 10개 YouTube 영상 | 하드코딩 |
| Home | CEO Quote | 메시지, 이미지 | 하드코딩 |
| Home | Services | 5개 서비스 카드 | 하드코딩 |
| Home | Process | 4단계 프로세스 | 하드코딩 |
| Home | Closing CTA | 타이틀, 설명, 버튼 | 하드코딩 |
| About | Hero | 타이틀, 설명, 이미지 | 하드코딩 |
| About | Vision/Mission | 각 타이틀, 설명 | 하드코딩 |
| About | CEO | 이름, 직함, 이미지, 메시지 | 하드코딩 |
| About | Core Values | 4개 항목 | 하드코딩 |
| About | History | 연혁 타임라인 | Firestore |
| Brands | Hero | 타이틀, 설명, 이미지 | 하드코딩 |
| Brands | Brand List | 7개 브랜드 상세 | 하드코딩 |
| Brands | Philosophy | 3개 원칙 | 하드코딩 |
| Business | Hero | 타이틀, 설명, 이미지 | 하드코딩 |
| Business | Areas | 4개 사업 영역 | 하드코딩 |
| Contact | Hero | 타이틀, 설명, 이미지 | 하드코딩 |
| Contact | Info | 주소, 전화, 이메일, 영업시간 | 하드코딩 |
| 공통 | Site Config | 회사명, 연락처, SNS | 하드코딩 |

---

## 11. 추가 제안 사항

### 11.1 다국어 지원 준비
- 현재 한국어/영어 혼용 → 콘텐츠 필드에 `ko`, `en` 서브필드 구조 고려
- 향후 다국어 확장 시 스키마 변경 최소화

### 11.2 SEO 메타 관리
- 각 페이지별 meta title, description, OG image를 어드민에서 관리
- 검색 엔진 최적화 자동 점검 기능

### 11.3 콘텐츠 예약 게시
- 특정 날짜/시간에 콘텐츠 자동 공개
- 신규 브랜드 런칭, 이벤트 등에 활용

### 11.4 분석 연동
- Google Analytics 주요 지표를 대시보드에서 확인
- 페이지별 방문수, 문의 전환율 등

---

## 12. 참고

- 기존 어드민: `src/pages/admin/AdminDashboard.tsx`
- Firebase 설정: `src/lib/firebase.ts`
- 현재 Firestore 컬렉션: `history_items`, `inc_brands`, `agency_works`
- 랜딩 라우팅: `src/App.tsx`

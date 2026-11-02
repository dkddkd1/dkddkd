# 상품 관리 (로컬 전용)

Supabase 의 상품 테이블(`supabase_products.sql`)을 조회 · 검색 · 추가 · 삭제하는 React 앱.
내 PC(127.0.0.1)에서만 열리며, Supabase 키는 개발 서버에만 있고 브라우저로 전달되지 않는다.

## 처음 한 번

1. Node.js LTS 설치 — https://nodejs.org (설치 후 터미널을 새로 열기)
2. `.env.example` 을 복사해 `.env.local` 로 저장하고 두 값을 채우기
   - `SUPABASE_URL` — 대시보드 > Project Settings > API 의 Project URL
   - `SUPABASE_SECRET_KEY` — service_role 키 또는 secret 키(`sb_secret_...`)
3. 이 폴더에서 `npm install`

## 실행

```
npm run dev
```

브라우저에서 http://127.0.0.1:5173 접속. 종료는 터미널에서 Ctrl+C

## 기능

- 목록: 상품코드 순, 알레르기 · 교차오염 표시
- 검색: 상품명 · 코드 · 설명 · 원재료 · 원산지 · 보관 방법 · 주의사항 내용 (띄어쓰기로 여러 단어 AND 검색)
- 필터: 알레르기 유발물질 있음 / 교차오염 주의 있음 (`없음` · `글루텐 없음` · `미확인` 은 유발물질로 보지 않음)
- 추가: 상품 + 원재료 · 보관 · 주의사항 줄을 함께 입력. 하위 데이터 저장이 실패하면 상품도 지워 되돌림
- 삭제: 확인 후 삭제. 원재료 · 보관 · 주의사항도 함께 삭제됨(되돌릴 수 없음)

## 주의

- `.env.local` 의 키는 DB 전체 권한이 있으므로 공유 · 커밋하지 않기 (`.gitignore` 에 포함됨)
- `npm run dev` 로만 동작함 (빌드한 정적 파일에는 키를 붙여 주는 프록시가 없음)

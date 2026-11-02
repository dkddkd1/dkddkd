# 상품 관리

Supabase 의 상품 테이블(`supabase_products.sql`)을 조회 · 검색 · 추가 · 삭제하는 React 앱.
로컬(`npm run dev`)과 Vercel 배포 모두 같은 코드로 동작한다.

- 로그인 없이 바로 화면이 열린다
- 추가 · 삭제는 누구나 가능 (`../supabase_public_write.sql` 의 RLS 정책). 주소를 아는 사람은 누구나 데이터를 지울 수 있다
- 브라우저에는 공개용 anon 키만 들어간다. service_role 키는 RLS 를 무시하므로 쓰지 않는다

## 환경 변수

| 이름 | 값 |
|---|---|
| `VITE_SUPABASE_URL` | 프로젝트 URL (뒤에 `/rest/v1/` 이 붙어 있어도 됨) |
| `VITE_SUPABASE_ANON_KEY` | anon 키 (Legacy API Keys 탭의 anon public) |

로컬은 `.env.local`, Vercel 은 Project Settings > Environment Variables 에 입력.
값을 바꾸면 로컬은 개발 서버 재시작, Vercel 은 Redeploy 가 필요하다.

## 로컬 실행

```
npm install
npm run dev
```

PowerShell 에서 스크립트 실행 오류가 나면 `npm.cmd run dev`. 접속: http://127.0.0.1:5173

## Vercel

GitHub 저장소를 Vercel 프로젝트에 연결하면 push 할 때마다 자동 배포된다.
Framework 는 Vite 로 자동 인식 (Build `npm run build`, Output `dist`).

## 기능

- 목록: 상품코드 순, 알레르기 · 교차오염 표시
- 검색: 상품명 · 코드 · 설명 · 원재료 · 원산지 · 보관 방법 · 주의사항 내용 (띄어쓰기로 여러 단어 AND 검색)
- 필터: 알레르기 유발물질 있음 / 교차오염 주의 있음 (`없음` · `글루텐 없음` · `미확인` 은 유발물질로 보지 않음)
- 추가: 상품 + 원재료 · 보관 · 주의사항 줄을 함께 입력. 하위 데이터 저장이 실패하면 상품도 지워 되돌림
- 삭제: 확인 후 삭제. 원재료 · 보관 · 주의사항도 함께 삭제됨(되돌릴 수 없음)

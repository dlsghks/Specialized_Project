# SPECIALIZED PROJECT

스페셜라이즈드 자전거 쇼핑몰 UI/UX 리디자인 프로젝트

## 프로젝트 소개

4인 팀 프로젝트로, 3D 자전거 커스터마이징과 가상 결제 기능을 중심으로 온라인 쇼핑 경험을 개선한다.

## 기술 스택

- React / TypeScript / Vite
- React Router DOM
- SCSS
- Zustand
- Three.js / React Three Fiber / Drei
- Firebase Authentication / Firestore
- GitHub / Vercel

## 브랜치 관리

| 브랜치 | 용도 |
|---|---|
| main | 최종 배포 |
| develop | 개발 내용 통합 |
| inhwan | 개인 작업 |
| jujuling | 개인 작업 |
| sejin | 개인 작업 |
| seoyeon | 개인 작업 |

개인 브랜치에서 작업 후 develop 브랜치에 Pull Request를 요청한다. 통합 테스트 완료 후 main 브랜치로 병합한다.

## 프로젝트 실행

1. GitHub 저장소를 clone한다.
2. npm ci 명령어로 라이브러리를 설치한다.
3. .env.example을 참고하여 .env.local 파일을 생성한다.
4. Firebase 환경변수를 입력한다.
5. npm run dev 명령어로 개발 서버를 실행한다.

## 협업 규칙

- main, develop 직접 푸시 금지
- 작업 시작 전 develop 최신 코드 반영
- 공통 파일 수정 시 팀원에게 사전 공유
- 이미지 파일명은 영문 소문자 및 하이픈 사용
- 환경변수 파일 GitHub 업로드 금지
- package-lock.json 관리 필수
- 작업 완료 후 빌드 및 오류 확인

## 커밋 메시지

- feat: 기능 추가
- fix: 오류 수정
- style: 디자인 수정
- refactor: 코드 개선
- docs: 문서 수정
- chore: 기타 환경 설정

## 주요 개발 기능

- 상품 목록 및 상품 상세
- 3D 자전거 커스터마이징
- 상품 비교 및 사이즈 추천
- 장바구니 및 가상 결제
- 회원 인증 및 마이페이지
- 주문 내역 및 커스텀 구성 저장

본 프로젝트는 비상업적 교육 및 포트폴리오 목적으로 제작됩니다.
# 스타일 파일 구성

- SCSS 파일은 모두 `src/styles` 아래에 둔다.
- 전역 스타일은 `src/styles/global.scss`, 페이지 전용 스타일은 `src/styles/pages/`, 재사용 컴포넌트 스타일은 `src/styles/components/`에 둔다.
- 한 기능에 스타일 파일이 여러 개 필요하면 해당 분류 아래에 기능명 폴더를 만든다. 페이지와 컴포넌트는 필요한 SCSS만 직접 가져온다.

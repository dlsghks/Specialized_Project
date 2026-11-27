export type Athlete = { id: string; name: string; country: string; team: string };

export type AthleteGroup = {
    id: string;
    label: string;
    description: string;
    athletes: readonly Athlete[];
};

export const communityImages = `${import.meta.env.BASE_URL}images/community/`;
export const officialCommunity = "https://www.specialized.com/kr/ko/";
export const athleteImage = (id: string) => `${communityImages}athletes/${id}.webp`;

// Keep the order from the Specialized Korea athlete roster.
export const athleteGroups: readonly AthleteGroup[] = [
    {
        id: "women-road", label: "여자 로드", description: "Women's Road",
        athletes: [
            { id: "demi-vollering", name: "Demi Vollering", country: "Netherlands", team: "FDJ United – Suez" },
            { id: "lotte-kopecky", name: "Lotte Kopecky", country: "Belgium", team: "Team SD Worx – Protime" },
            { id: "lorena-wiebes", name: "Lorena Wiebes", country: "Netherlands", team: "Team SD Worx – Protime" },
            { id: "anna-van-der-breggen", name: "Anna van der Breggen", country: "Netherlands", team: "Team SD Worx – Protime" },
            { id: "mischa-bredewold", name: "Mischa Bredewold", country: "Netherlands", team: "Team SD Worx – Protime" },
            { id: "evita-muzic", name: "Évita Muzic", country: "France", team: "FDJ United – Suez" },
            { id: "juliette-labous", name: "Juliette Labous", country: "France", team: "FDJ United – Suez" },
            { id: "celia-gery", name: "Célia Gery", country: "France", team: "FDJ United – Suez" },
        ],
    },
    {
        id: "men-road", label: "남자 로드", description: "Men's Road",
        athletes: [
            { id: "remco-evenepoel", name: "Remco Evenepoel", country: "Belgium", team: "Red Bull – BORA – hansgrohe" },
            { id: "lorenzo-finn", name: "Lorenzo Finn", country: "Italy", team: "Red Bull – BORA – hansgrohe" },
            { id: "giulio-pellizzari", name: "Giulio Pellizzari", country: "Italy", team: "Red Bull – BORA – hansgrohe" },
            { id: "florian-lipowitz", name: "Florian Lipowitz", country: "Germany", team: "Red Bull – BORA – hansgrohe" },
        ],
    },
    {
        id: "xc", label: "XC", description: "Cross Country",
        athletes: [
            { id: "christopher-blevins", name: "Christopher Blevins", country: "USA", team: "Specialized Factory XC Team" },
            { id: "sina-frei", name: "Sina Frei", country: "Switzerland", team: "Specialized Factory XC Team" },
            { id: "martin-vidaurre", name: "Martin Vidaurre", country: "Chile", team: "Specialized Factory XC Team" },
            { id: "adrien-boichis", name: "Adrien Boichis", country: "France", team: "Specialized Factory XC Team" },
            { id: "haley-batten", name: "Haley Batten", country: "USA", team: "Specialized Factory XC Team" },
            { id: "victor-koretzky", name: "Victor Koretzky", country: "France", team: "Specialized XC Factory Team" },
        ],
    },
    {
        id: "gravity", label: "그래비티", description: "Gravity",
        athletes: [
            { id: "loic-bruni", name: "Loïc Bruni", country: "France", team: "Specialized Factory Gravity" },
            { id: "finn-iles", name: "Finn Iles", country: "Canada", team: "Specialized Factory Gravity" },
            { id: "jordan-williams", name: "Jordan Williams", country: "UK", team: "Specialized Factory Gravity" },
            { id: "rosa-marie-jensen", name: "Rosa Marie Jensen", country: "Denmark", team: "Specialized Factory Gravity" },
        ],
    },
    {
        id: "gravel", label: "그래블", description: "Gravel",
        athletes: [
            { id: "mads-wurtz-schmidt", name: "Mads Würtz Schmidt", country: "Denmark", team: "Specialized Off-Road Team" },
            { id: "keegan-swenson", name: "Keegan Swenson", country: "USA", team: "Specialized Off-Road Team" },
            { id: "sofia-gomez-villafane", name: "Sofia Gomez Villafane", country: "Argentina", team: "Specialized Off-Road Team" },
            { id: "matt-beers", name: "Matt Beers", country: "South Africa", team: "Specialized Off-Road Team" },
            { id: "annika-langvad", name: "Annika Langvad", country: "Denmark", team: "Specialized Off-Road Team" },
            { id: "geerike-schreurs", name: "Geerike Schreurs", country: "Netherlands", team: "Specialized Off-Road Team" },
        ],
    },
];

export const communityGuides = [
    {
        id: "specialized-radial-mtb-tires",
        category: "MTB 타이어",
        title: "MTB 타이어와 노면의 접지력",
        summary: "스페셜라이즈드가 래디얼 MTB 타이어를 설계하며 케이싱과 접지력을 어떻게 테스트했는지 살펴보세요.",
        image: "guides/mtb-tires.webp",
        date: "2026-09-23",
    },
    {
        id: "bike-maintenance-checklist",
        category: "라이딩 준비",
        title: "라이딩 전 자전거 점검 체크리스트",
        summary: "출발 전 자전거를 점검하는 순서와 스페셜라이즈드 정비팀의 관리 방법을 확인해 보세요.",
        image: "guides/bike-checklist.webp",
        date: "2025-10-08",
    },
    {
        id: "best-gravel-tires",
        category: "타이어 가이드",
        title: "그래블 입문자를 위한 타이어 고르기",
        summary: "타이어 폭과 트레드가 라이딩에 어떤 차이를 만드는지 알아보고, 자주 달리는 길에 맞는 타이어를 찾아보세요.",
        image: "guides/gravel-tires.webp",
        date: "2026-02-06",
    },
    {
        id: "suspension-basics",
        category: "세팅 가이드",
        title: "서스펜션 세팅의 기초",
        summary: "새그와 댐핑의 역할을 알아보고, 서스펜션 세팅을 시작할 때 살펴볼 항목을 확인해 보세요.",
        image: "guides/suspension.webp",
    },
] as const;

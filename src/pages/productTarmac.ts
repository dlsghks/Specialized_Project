import type { Product } from "../data/productTypes";
import type { PhotoFraming } from "../data/photoFraming";

const official = "https://www.specialized.com/kr/ko";
const assets = `${import.meta.env.BASE_URL}images/products/tarmac-sl9/`;

function photo(name: string) {
    return `${assets}${name}.webp`;
}

export const modelName = "S-Works Tarmac SL9";
export const listPrice = 20_900_000;
export const manualUrl = "https://media.specialized.com/support/collateral/TARMAC_SL9_USER_MANUAL_KOREAN.pdf";
export const officialProductUrl = `${official}/s-works-tarmac-sl9-스램-레드-axs/p/4293533`;
export const bannerImage = photo("race-hero");

const galleryAngles = [
    { label: "측면", file: "side" },
    { label: "앞 사선", file: "front-three-quarter" },
    { label: "뒤 사선", file: "rear-three-quarter" },
    { label: "콕핏", file: "cockpit" },
    { label: "헤드튜브", file: "head-tube" },
    { label: "시트튜브", file: "seat-tube" },
] as const;

export const tarmacRubyFrontFraming: PhotoFraming = { scale: 1.02, x: .2 };
const rubyFraming: Partial<Record<(typeof galleryAngles)[number]["file"], PhotoFraming>> = {
    "front-three-quarter": tarmacRubyFrontFraming,
    "rear-three-quarter": { scale: 1.008, x: .12, y: .3 },
    cockpit: { scale: 1.055, x: -1.8, y: 7.8 },
    "head-tube": { scale: 1.29, x: 6.5, y: 11.6 },
    "seat-tube": { scale: 1.061, x: -3.05 },
};

export const colors = [
    { key: "silver", name: "Satin Silver Dust", swatch: "#a8acac", purchaseUrl: officialProductUrl },
    { key: "ruby", name: "Gloss Ruby Metallic", swatch: "#a80629", purchaseUrl: `${officialProductUrl}?color=5473733-4293533` },
    { key: "white", name: "Gloss White Silver Metallic", swatch: "linear-gradient(#e5e4e3 50%, #a80629 50%)", purchaseUrl: `${officialProductUrl}?color=5470197-4293533` },
].map((color) => ({
    ...color,
    gallery: galleryAngles.map(({ label, file }) => ({
        label,
        image: photo(`${color.key}-${file}`),
        thumbnail: photo(`${color.key}-${file}-thumb`),
        framing: color.key === "ruby" ? rubyFraming[file] : undefined,
    })),
}));

export const sizes = [44, 49, 52, 54, 56, 58, 61];

export const geometry = [
    { label: "스택 (mm)", values: [501, 514, 527, 544, 565, 591, 612] },
    { label: "리치 (mm)", values: [366, 375, 380, 384, 395, 402, 408] },
    { label: "탑튜브 길이 (mm)", values: [496, 509, 531, 540, 563, 577, 595] },
    { label: "헤드튜브 각도 (°)", values: [70.5, 71.75, 72.5, 72.5, 73.5, 73.5, 74] },
    { label: "시트튜브 각도 (°)", values: [75.5, 75.5, 74, 74, 73.5, 73.5, 73] },
    { label: "휠베이스 (mm)", values: [970, 973, 975, 986, 991, 1006, 1013] },
];

export const highlights = [
    ["용도", "로드 · 레이스"],
    ["프레임", "S-Works Tarmac SL9 FACT 12r Carbon"],
    ["휠", "Roval Rapide CLX III"],
    ["콕핏", "Roval Rapide 일체형 바/스템"],
    ["구동계", "SRAM RED AXS E1 12단"],
    ["무게", "6.6 kg"],
] as const;

export const specifications = [
    ["프레임", "S-Works FACT 12r Carbon · 12×142mm 스루액슬"],
    ["포크", "S-Works FACT 12r Carbon · 12×100mm 스루액슬"],
    ["브레이크", "SRAM RED E1 유압식 디스크"],
    ["구동계", "SRAM RED AXS E1"],
    ["휠셋", "Roval Rapide CLX III 튜블리스 카본"],
    ["타이어", "Cotton TLR 700×30"],
    ["콕핏", "Roval Rapide Cockpit 일체형 바/스템"],
    ["안장", "S-Works Power with Mirror"],
    ["시트포스트", "S-Works Rapide FACT Carbon · 15mm 오프셋"],
] as const;

export const features = [
    { title: "스피드 스니퍼", text: "헤드튜브 폭을 줄여 바람을 받는 정면 면적을 줄였어요.", image: photo("speed-sniffer") },
    { title: "윈 핀", text: "프레임 뒤쪽으로 흐르는 공기를 정리해 항력을 줄여요.", image: photo("win-fin") },
    { title: "드롭 다운 튜브", text: "헤드튜브와 포크 주변의 기류를 이어 주도록 설계했어요.", image: photo("drop-down-tube") },
    { title: "플로우 포크", text: "비틀린 블레이드 형상으로 포크를 지나는 공기 흐름을 다듬었어요.", image: photo("flow-fork") },
];

export const gradeLabels = ["프레임 / 포크", "구동계", "휠셋", "콕핏", "헤드셋 베어링", "안장"];

export const grades = [
    {
        name: modelName,
        price: listPrice,
        image: photo("silver-side"),
        specs: ["FACT 12r / FACT 12r", "SRAM RED AXS", "Roval Rapide CLX III", "Roval Rapide 콕핏", "CeramicSpeed", "S-Works Power with Mirror"],
    },
    {
        name: "Tarmac SL9 S-Level",
        price: 13_500_000,
        image: photo("s-level"),
        url: `${official}/tarmac-sl9-s-level-sram-red-axs/p/4293534?color=5470185-4293534`,
        specs: ["FACT 10r / FACT 12r", "SRAM RED AXS", "Roval Rapide CL III", "Roval Rapide 콕핏", "스테인리스 스틸", "Power Pro with Mirror"],
    },
    {
        name: "Tarmac SL9 Comp",
        price: 5_900_000,
        image: photo("comp"),
        url: `${official}/tarmac-sl9-comp-sram-rival-axs/p/4293529?color=5470201-4293529`,
        specs: ["FACT 10r / FACT 12r", "SRAM Rival AXS", "DT R470", "알로이 핸들바 · Rapide 스템", "스테인리스 스틸", "Power Comp"],
    },
];

export const frames = [
    { name: "S-Works Tarmac SL9 프레임셋", detail: "FACT 12r 카본", price: 8_500_000, image: photo("s-works-frameset"), url: `${official}/s-works-tarmac-sl9-프레임셋-fact-12r-카본/p/4293537?color=5473792-4293537` },
    { name: "Tarmac SL9 프레임셋", detail: "FACT 10r 카본", price: 4_500_000, image: photo("tarmac-frameset"), url: `${official}/tarmac-sl9-프레임셋-fact-10r-카본/p/4295005` },
    { name: "S-Works Tarmac SL9 팀 레플리카", detail: "Soudal Quick-Step", price: 8_900_000, image: photo("quick-step-frameset"), url: `${official}/s-works-tarmac-sl9-팀-레플리카-프레임셋-soudal-quick-step/p/4295584?color=5472520-4295584` },
    { name: "S-Works Tarmac SL9 팀 레플리카", detail: "Red Bull – BORA – hansgrohe", price: 8_900_000, image: photo("red-bull-frameset"), url: `${official}/s-works-tarmac-sl9-팀-레플리카-프레임셋-red-bull-bora-hansgrohe/p/4295586` },
];

export const tarmacProduct: Product = {
    id: "4293533",
    name: modelName,
    category: "로드",
    price: listPrice,
    detail: "스램 레드 AXS",
    image: colors[0].gallery[0].image,
    filters: { 컬러: ["빨간색", "하얀색"], 소재: ["카본"], 브랜드: ["스램"], 구성: ["2x", "11 · 12 · 13-Speed"] },
    page: {
        badge: "S-Works",
        subtitle: "로드 레이스를 위한 한 대",
        colors,
        sizes: sizes.map((value) => ({ value, available: value !== 61 })),
        pickupOnly: true,
        purchaseUrl: officialProductUrl,
        story: {
            title: "중요한 순간을 위한 에어로",
            description: "Tarmac SL9은 바람을 가르는 프레임과 빠르게 반응하는 핸들링으로 레이스의 결정적인 순간을 돕습니다.",
            image: bannerImage,
        },
        features: { title: "타막 SL9의 주요 기술", items: features },
        highlights,
        specifications,
        geometry: { sizes, rows: geometry },
        manual: { label: "한국어 사용 설명서", url: manualUrl },
        grades: { title: "타막 SL9 완성차 등급 비교", labels: gradeLabels, items: grades },
        frames: { title: "타막 SL9 프레임셋", items: frames },
        reviews: { url: officialProductUrl, label: "스페셜라이즈드 공식몰" },
    },
};

const media = "https://resources.specialized.com";
const official = "https://www.specialized.com/kr/ko";

function photo(path: string, width: number) {
    return `${media}${path}?crop=focalpoint&fit=fill&h=${Math.round(width * 9 / 16)}&q=80&w=${width}`;
}

export const modelName = "S-Works Tarmac SL9";
export const listPrice = 20_900_000;
export const manualUrl = "https://media.specialized.com/support/collateral/TARMAC_SL9_USER_MANUAL_KOREAN.pdf";
export const officialProductUrl = `${official}/s-works-tarmac-sl9-스램-레드-axs/p/4293533`;
export const bannerImage = "https://resources.specialized.com/images/b451zfdu/production/09d5fa96ec01fe7a866a72dcb03edeb8afc11bae-3000x1267.webp?crop=focalpoint&fit=fill&h=1216&q=75&w=2880";

export const silverGallery = [
    { label: "측면", path: "/media-libraries/mleF1gIlpsGs/images/containers/3DKx3TbZ6NmHtFZVfadddsQ0S4Z/94927-00_TARMAC-SL9-SW-AXS-SILDST-SPCTFLR-CHRM_HERO-PDP_DARK.webp" },
    { label: "앞 사선", path: "/media-libraries/mleF1gIlpsGs/images/containers/3DKx3MjB2ZJoaIDZALh3vN8n35W/94927-00_TARMAC-SL9-SW-AXS-SILDST-SPCTFLR-CHRM_FDSQ_DARK.webp" },
    { label: "뒤 사선", path: "/media-libraries/mleF1gIlpsGs/images/containers/3DKx3eVm9czZkvjfhvrziMhlBzJ/94927-00_TARMAC-SL9-SW-AXS-SILDST-SPCTFLR-CHRM_RDSQ_DARK.webp" },
    { label: "콕핏", path: "/media-libraries/mleF1gIlpsGs/images/containers/3DKx37VJ44kD4brJqFq6lQTffZT/94927-00_TARMAC-SL9-SW-AXS-SILDST-SPCTFLR-CHRM_D1-POV_DARK.webp" },
    { label: "헤드튜브", path: "/media-libraries/mleF1gIlpsGs/images/containers/3DKx3C16QXGf4QEaJyps29VB4Cp/94927-00_TARMAC-SL9-SW-AXS-SILDST-SPCTFLR-CHRM_D3-HT_DARK.webp" },
    { label: "시트튜브", path: "/media-libraries/mleF1gIlpsGs/images/containers/3DKx3gMf86pRuG0ZwDXZrAvDrJa/94927-00_TARMAC-SL9-SW-AXS-SILDST-SPCTFLR-CHRM_D4-STTT_DARK.webp" },
].map(({ label, path }) => ({ label, image: photo(path, 1600), thumbnail: photo(path, 240) }));

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
    { title: "스피드 스니퍼", text: "헤드튜브 폭을 줄여 바람을 받는 정면 면적을 줄였어요.", image: silverGallery[4].image, position: "center" },
    { title: "윈 핀", text: "프레임 뒤쪽으로 흐르는 공기를 정리해 항력을 줄여요.", image: silverGallery[5].image, position: "center" },
    { title: "드롭 다운 튜브", text: "헤드튜브와 포크 주변의 기류를 이어 주도록 설계했어요.", image: silverGallery[1].image, position: "58% center" },
    { title: "플로우 포크", text: "비틀린 블레이드 형상으로 포크를 지나는 공기 흐름을 다듬었어요.", image: silverGallery[0].image, position: "72% center" },
];

export const gradeLabels = ["프레임 / 포크", "구동계", "휠셋", "콕핏", "헤드셋 베어링", "안장"];

export const grades = [
    {
        name: modelName,
        price: listPrice,
        image: photo("/media-libraries/mleF1gIlpsGs/images/containers/3DKx3TbZ6NmHtFZVfadddsQ0S4Z/94927-00_TARMAC-SL9-SW-AXS-SILDST-SPCTFLR-CHRM_HERO-PDP_DARK.webp", 800),
        specs: ["FACT 12r / FACT 12r", "SRAM RED AXS", "Roval Rapide CLX III", "Roval Rapide 콕핏", "CeramicSpeed", "S-Works Power with Mirror"],
    },
    {
        name: "Tarmac SL9 S-Level",
        price: 13_500_000,
        image: photo("/media-libraries/mleF1gIlpsGs/images/containers/3HEcA5JYV0u9qU4Wadv0RnwpEdp/94927-10_TARMAC-SL9-S-LEVEL-AXS-WHT-MAJBLUMET-METOBSD_HERO-PDP.webp", 800),
        url: `${official}/tarmac-sl9-s-level-sram-red-axs/p/4293534?color=5470185-4293534`,
        specs: ["FACT 10r / FACT 12r", "SRAM RED AXS", "Roval Rapide CL III", "Roval Rapide 콕핏", "스테인리스 스틸", "Power Pro with Mirror"],
    },
    {
        name: "Tarmac SL9 Comp",
        price: 5_900_000,
        image: photo("/media-libraries/mleF1gIlpsGs/images/containers/3HEc8q2QzF31t61yJ8coAgExubV/94927-50_TARMAC-SL9-COMP-AXS-VIVRED-WHT_HERO-PDP.webp", 800),
        url: `${official}/tarmac-sl9-comp-sram-rival-axs/p/4293529?color=5470201-4293529`,
        specs: ["FACT 10r / FACT 12r", "SRAM Rival AXS", "DT R470", "알로이 핸들바 · Rapide 스템", "스테인리스 스틸", "Power Comp"],
    },
];

export const frames = [
    { name: "S-Works Tarmac SL9 프레임셋", detail: "FACT 12r 카본", price: 8_500_000, image: photo("/image/74927-16_TARMAC-SL9-SW-FRMSET-CARB-SILHLG_HERO-PDP_DARK", 680), url: `${official}/s-works-tarmac-sl9-프레임셋-fact-12r-카본/p/4293537?color=5473792-4293537` },
    { name: "Tarmac SL9 프레임셋", detail: "FACT 10r 카본", price: 4_500_000, image: photo("/media-libraries/mleF1gIlpsGs/images/containers/3HEcECqZ5nJavMLIrrsIDRowRB8/74927-17_TARMAC-SL9-FRMSET-METWHTSIL-TARBLK_HERO-PDP.webp", 680), url: `${official}/tarmac-sl9-프레임셋-fact-10r-카본/p/4295005?color=5480070-4295005` },
    { name: "S-Works Tarmac SL9 팀 레플리카", detail: "Soudal Quick-Step", price: 8_900_000, image: photo("/media-libraries/mleF1gIlpsGs/images/containers/3HEaelXXmufvg4hMQYy8RHQ04hE/74927-10_TARMAC-SL9-SW-FRMSET-TEAM-REPLICA-QS-BLUONYX-CBLT-MORNMST_HERO-PDP_DARK.webp", 680), url: `${official}/s-works-tarmac-sl9-팀-레플리카-프레임셋-soudal-quick-step/p/4295584?color=5472520-4295584` },
    { name: "S-Works Tarmac SL9 팀 레플리카", detail: "Red Bull – BORA – hansgrohe", price: 8_900_000, image: photo("/media-libraries/mleF1gIlpsGs/images/containers/3HEac53surAsOQS99QI83X4sOP6/74927-11_TARMAC-SL9-SW-FRMSET-TEAM-REPLICA-RB-METWHTSIL-WHT-DPBLU_HERO-PDP_DARK.webp", 680), url: `${official}/s-works-tarmac-sl9-팀-레플리카-프레임셋-red-bull-bora-hansgrohe/p/4295586` },
];

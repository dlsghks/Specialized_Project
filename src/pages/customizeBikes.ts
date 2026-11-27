import type { PhotoFraming } from "../data/photoFraming";
import { customizeParts, type PartCatalog } from "./customizeParts";
import type { GearItem } from "./gearCart";
import { colors as tarmacColors } from "./productTarmac";

export const customizeCategories = {
    "demo-11": { label: "산악", image: "mountain.webp" },
    "crux-5": { label: "그래블", image: "gravel.webp" },
    "tarmac-sl9": { label: "로드", image: "road.webp" },
} as const;

export type FrameColor = { name: string; finish: string; image?: string; framing?: PhotoFraming };

export type CustomizeBike = {
    id: string;
    categoryId: keyof typeof customizeCategories;
    name: string;
    image: string;
    sizes: (number | string)[];
    colors: [FrameColor, ...FrameColor[]];
    price: number;
    parts: PartCatalog;
    gear?: GearItem[];
};

const specializedImages = "https://resources.specialized.com/media-libraries/mleF1gIlpsGs/images/containers/";
const gallerySize = "crop=focalpoint&fit=fill&h=1125&q=75&w=2000";

function sidePhoto(path: string) {
    return `${specializedImages}${path}?${gallerySize}`;
}

const [silver, ruby, white] = tarmacColors;

const roadColors: CustomizeBike["colors"] = [
    { name: "Satin Silver Dust", image: silver.gallery[0].image, finish: "linear-gradient(90deg, #c9cbce 40%, #7a7d7e)" },
    { name: "Gloss White Silver Metallic", image: white.gallery[0].image, finish: "linear-gradient(90deg, #efeff1 43%, #b60022)" },
    { name: "Gloss Ruby Metallic", image: ruby.gallery[0].image, finish: "linear-gradient(90deg, #d2d7d7 40%, #86262f)" },
];

export const customizeBikes: readonly CustomizeBike[] = [
    {
        id: "tarmac-sl9",
        categoryId: "tarmac-sl9",
        name: "S-Works Tarmac SL9",
        image: "tarmac-sl9-side.webp",
        sizes: [44, 49, 52, 54, 56, 58],
        colors: roadColors,
        price: 20900000,
        parts: customizeParts["tarmac-sl9"],
        gear: [
            { name: "S-Works Prevail 3", image: "S-Works_Prevail3.webp" },
            { name: "S-Works Ares 2", image: "S-Works_Ares2.webp" },
            { name: "S-Works Carbon Rib Cage 3", image: "S-Works_Carbon_Rib_Cage3.webp" },
            { name: "S-Works Torch", image: "S-Works_Torch.webp" },
            { name: "S-Works Evade 4", image: "S-Works_Evade4.webp" },
        ],
    },
    {
        id: "demo-11",
        categoryId: "demo-11",
        name: "S-Works Demo 11",
        image: "demo-11-side.webp",
        sizes: ["S3", "S4"],
        colors: [
            {
                name: "Satin Powder Indigo",
                image: sidePhoto("3DvEonZiHRGzB4FeCtIWrA9nCLk/94527-00_DEMO-11-SW-PDRNDGOTNT-BLKTNT-WHT_HERO-PDP_DARK.webp"),
                finish: `url("${import.meta.env.BASE_URL}images/customize/swatches/satin-powder-indigo.png") center / cover no-repeat`,
            },
            {
                name: "Gloss Charcoal",
                image: sidePhoto("3DvEpmXEz44ln9smdoRhp9VREa8/94527-01_DEMO-11-SW-CHAR-DLMMET-WHT_HERO-PDP_DARK.webp"),
                finish: `url("${import.meta.env.BASE_URL}images/customize/swatches/demo-gray-white.png") center / cover no-repeat`,
            },
        ],
        price: 14900000,
        parts: customizeParts["demo-11"],
    },
    {
        id: "crux-5",
        categoryId: "crux-5",
        name: "Crux 5 S-Level",
        image: "crux-5-side.webp",
        sizes: [49, 52, 54, 56, 58],
        colors: [
            {
                name: "Redwood Metallic",
                image: sidePhoto("3DvFfVEIaRm6bpaLKdhncivbv5T/91427-10_CRUX-5-S-LEVEL-AXS-REDPRL-REDWD-BRCH_HERO-PDP.webp") + "&bg=f1f1f1",
                finish: `url("${import.meta.env.BASE_URL}images/customize/swatches/redwood-metallic.png") center / cover no-repeat`,
            },
            {
                name: "Deep Marine Metallic",
                image: sidePhoto("3DvF0Cpp8EeoOoYPfSidkJqH4Dc/91427-11_CRUX-5-S-LEVEL-AXS-METDPMRNBLU-SHDWSIL-DLMMET_HERO-PDP.webp") + "&bg=f1f1f1",
                finish: `url("${import.meta.env.BASE_URL}images/customize/swatches/crux-gray-silver.png") center / cover no-repeat`,
            },
        ],
        price: 12500000,
        parts: customizeParts["crux-5"],
    },
];

export function bikePhoto(image: string) {
    return `${import.meta.env.BASE_URL}images/customize/${image}`;
}

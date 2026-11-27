import type { PhotoFraming } from "../data/photoFraming";
import { customizeParts, type PartCatalog } from "./customizeParts";
import type { GearItem } from "./gearCart";
import { tarmacRubyFrontFraming } from "./productTarmac";

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

const roadColors: CustomizeBike["colors"] = [
    { name: "Satin Silver Dust", image: "satin-silver-dust.webp", finish: "linear-gradient(90deg, #c9cbce 40%, #7a7d7e)" },
    { name: "Gloss White Silver Metallic", image: "gloss-white-silver-metallic.webp", finish: "linear-gradient(90deg, #efeff1 43%, #b60022)" },
    { name: "Gloss Ruby Metallic", image: "gloss-ruby-metallic.webp", finish: "linear-gradient(90deg, #d2d7d7 40%, #86262f)", framing: tarmacRubyFrontFraming },
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
            { name: "Satin Powder Indigo", finish: `url("${import.meta.env.BASE_URL}images/customize/swatches/satin-powder-indigo.png") center / cover no-repeat`, image: "demo-11-preview.webp" },
            { name: "Gloss Charcoal", image: "demo-gloss-charcoal.webp", finish: `url("${import.meta.env.BASE_URL}images/customize/swatches/demo-gray-white.png") center / cover no-repeat` },
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
            { name: "Redwood Metallic", finish: `url("${import.meta.env.BASE_URL}images/customize/swatches/redwood-metallic.png") center / cover no-repeat`, image: "crux-5-preview.webp" },
            {
                name: "Deep Marine Metallic", image: "crux-deep-marine-metallic.webp",
                finish: `url("${import.meta.env.BASE_URL}images/customize/swatches/crux-gray-silver.png") center / cover no-repeat`,
                framing: { scale: 1.087, y: -.3 },
            },
        ],
        price: 12500000,
        parts: customizeParts["crux-5"],
    },
];

export function bikePhoto(image: string) {
    return `${import.meta.env.BASE_URL}images/customize/${image}`;
}

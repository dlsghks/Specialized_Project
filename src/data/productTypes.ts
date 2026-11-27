import type { PhotoFraming } from "./photoFraming";

export type ProductPhoto = { label: string; image: string; thumbnail?: string; framing?: PhotoFraming };
export type ProductSize = number | string;
type Spec = readonly [label: string, value: string];
type ProductFeature = { title: string; text: string; image: string };
type ProductGrade = { name: string; price: number; image: string; specs: readonly string[]; url?: string };
type ProductFrame = { name: string; detail: string; price: number; image: string; url: string };

export type ProductDetailData = {
    badge?: string;
    subtitle?: string;
    gallery?: readonly ProductPhoto[];
    colors?: readonly { name: string; swatch: string; gallery?: readonly ProductPhoto[]; purchaseUrl?: string }[];
    sizes?: readonly { value: ProductSize; available?: boolean }[];
    pickupOnly?: boolean;
    purchaseUrl?: string;
    story?: { title: string; description: string; image: string };
    features?: { title: string; items: readonly ProductFeature[] };
    highlights?: readonly Spec[];
    specifications?: readonly Spec[];
    geometry?: {
        sizes: readonly ProductSize[];
        rows: readonly { label: string; values: readonly (number | string)[] }[];
    };
    manual?: { label: string; url: string };
    grades?: { title: string; labels: readonly string[]; items: readonly ProductGrade[] };
    frames?: { title: string; items: readonly ProductFrame[] };
    reviews?: { url: string; label: string };
};

export type Product = {
    id: string;
    name: string;
    category: string;
    price: number;
    detail?: string;
    image?: string;
    model?: string;
    group?: string;
    grade?: string;
    filters?: Record<string, readonly string[]>;
    page?: ProductDetailData;
};

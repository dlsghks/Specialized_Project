import type { CustomizeBike } from "./customizeBikes";

export const partSteps = [
    { key: "tire", label: "TIRES" },
    { key: "wheel", label: "WHEELS" },
    { key: "handlebar", label: "HANDLEBAR" },
    { key: "saddle", label: "SADDLES" },
] as const;

export type PartKind = (typeof partSteps)[number]["key"];
export type PartOption = { id: string; name: string; thumbnailScale?: number };
export type PartCatalog = Record<PartKind, PartOption[]>;

export const customizeParts: Record<CustomizeBike["id"], PartCatalog> = {
    "demo-11": {
        tire: [
            { id: "cannibal", name: "Cannibal Grid Gravity 2Bliss Ready T9", thumbnailScale: 1.06 },
            { id: "fast-trak", name: "Fast Trak Control 2Bliss Ready T5", thumbnailScale: 1.1 },
            { id: "butcher", name: "Butcher Grid Gravity 2Bliss Ready T9", thumbnailScale: 1.11 },
        ],
        wheel: [
            { id: "control-sl-v-370", name: "Roval Control SL V 370" },
            { id: "traverse-alloy-350", name: "Roval Traverse Alloy 350 6B", thumbnailScale: 0.87 },
        ],
        handlebar: [
            { id: "control-ii-cockpit", name: "Roval Control II Cockpit" },
            { id: "control-cockpit", name: "Roval Control Cockpit", thumbnailScale: 0.86 },
            { id: "control-sl-35", name: "Roval Control SL 35mm Handlebar", thumbnailScale: 0.79 },
        ],
        saddle: [
            { id: "power-evo-mirror", name: "S-Works Power EVO with Mirror", thumbnailScale: 0.94 },
            { id: "power-arc-expert", name: "Power Arc Expert", thumbnailScale: 1.42 },
            { id: "s-works-power", name: "S-Works Power", thumbnailScale: 0.82 },
        ],
    },
    "tarmac-sl9": {
        tire: [
            { id: "cotton-tlr", name: "Cotton TLR", thumbnailScale: 1.07 },
            { id: "rapidair-tlr", name: "RapidAir TLR Racing Only Tire", thumbnailScale: 1.07 },
            { id: "mondo", name: "S-Works Mondo 2Bliss Ready T2/T5" },
        ],
        wheel: [
            { id: "rapide-clx-iii", name: "Roval Rapide CLX III" },
            { id: "roval-321-disc", name: "Roval 321 Disc – Disc Brake", thumbnailScale: 0.78 },
            { id: "rapide-clx-ii", name: "Rapide CLX II", thumbnailScale: 0.83 },
        ],
        handlebar: [
            { id: "rapide-cockpit", name: "Roval Rapide Cockpit" },
            { id: "alpinist-handlebar", name: "Roval Alpinist Handlebar", thumbnailScale: 1.48 },
            { id: "shallow-bend", name: "S-Works Shallow Bend Carbon Handlebars", thumbnailScale: 0.9 },
        ],
        saddle: [
            { id: "romin-evo-mirror", name: "S-Works Romin EVO with Mirror", thumbnailScale: 0.77 },
            { id: "sitero", name: "Sitero", thumbnailScale: 1.08 },
            { id: "romin-evo-mimic", name: "Romin EVO Comp with MIMIC", thumbnailScale: 0.74 },
        ],
    },
    "crux-5": {
        tire: [
            { id: "s-works-terra", name: "S-Works Terra 2Bliss Ready", thumbnailScale: 1.06 },
            { id: "tracer-tlr", name: "Tracer TLR All Terrain Gravel Tire", thumbnailScale: 1.13 },
            { id: "pathfinder-tlr", name: "Pathfinder TLR Fast Gravel Tire", thumbnailScale: 1.07 },
        ],
        wheel: [
            { id: "terra-aero-clx", name: "Roval Terra Aero CLX" },
            { id: "terra-c-iii", name: "Roval Terra C III" },
            { id: "terra-aero-cl", name: "Roval Terra Aero CL" },
        ],
        handlebar: [
            { id: "terra-cockpit", name: "Roval Terra Cockpit" },
            { id: "short-reach-alloy-flare", name: "Short Reach Alloy Flare", thumbnailScale: 0.88 },
        ],
        saddle: [
            { id: "power-comp-mimic", name: "Power Comp with MIMIC" },
            { id: "power-mirror", name: "S-Works Power with Mirror", thumbnailScale: 0.87 },
            { id: "romin-evo-mimic", name: "Romin EVO Comp with MIMIC", thumbnailScale: 0.74 },
        ],
    },
};

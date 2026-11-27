import type { CustomizeBike } from "./customizeBikes";

export const partSteps = [
    { key: "tire", label: "TIRES" },
    { key: "wheel", label: "WHEELS" },
    { key: "handlebar", label: "HANDLEBAR" },
    { key: "saddle", label: "SADDLES" },
] as const;

export type PartKind = (typeof partSteps)[number]["key"];
export type PartOption = { id: string; name: string };
export type PartCatalog = Record<PartKind, PartOption[]>;

export const customizeParts: Record<CustomizeBike["id"], PartCatalog> = {
    "demo-11": {
        tire: [
            { id: "cannibal", name: "Cannibal Grid Gravity 2Bliss Ready T9" },
            { id: "fast-trak", name: "Fast Trak Control 2Bliss Ready T5" },
            { id: "butcher", name: "Butcher Grid Gravity 2Bliss Ready T9" },
        ],
        wheel: [
            { id: "control-sl-v-370", name: "Roval Control SL V 370" },
            { id: "traverse-alloy-350", name: "Roval Traverse Alloy 350 6B" },
        ],
        handlebar: [
            { id: "control-ii-cockpit", name: "Roval Control II Cockpit" },
            { id: "control-cockpit", name: "Roval Control Cockpit" },
            { id: "control-sl-35", name: "Roval Control SL 35mm Handlebar" },
        ],
        saddle: [
            { id: "power-evo-mirror", name: "S-Works Power EVO with Mirror" },
            { id: "power-arc-expert", name: "Power Arc Expert" },
            { id: "s-works-power", name: "S-Works Power" },
        ],
    },
    "tarmac-sl9": {
        tire: [
            { id: "cotton-tlr", name: "Cotton TLR" },
            { id: "rapidair-tlr", name: "RapidAir TLR Racing Only Tire" },
            { id: "mondo", name: "S-Works Mondo 2Bliss Ready T2/T5" },
        ],
        wheel: [
            { id: "rapide-clx-iii", name: "Roval Rapide CLX III" },
            { id: "roval-321-disc", name: "Roval 321 Disc – Disc Brake" },
            { id: "rapide-clx-ii", name: "Rapide CLX II" },
        ],
        handlebar: [
            { id: "rapide-cockpit", name: "Roval Rapide Cockpit" },
            { id: "alpinist-handlebar", name: "Roval Alpinist Handlebar" },
            { id: "shallow-bend", name: "S-Works Shallow Bend Carbon Handlebars" },
        ],
        saddle: [
            { id: "romin-evo-mirror", name: "S-Works Romin EVO with Mirror" },
            { id: "sitero", name: "Sitero" },
            { id: "romin-evo-mimic", name: "Romin EVO Comp with MIMIC" },
        ],
    },
    "crux-5": {
        tire: [
            { id: "s-works-terra", name: "S-Works Terra 2Bliss Ready" },
            { id: "tracer-tlr", name: "Tracer TLR All Terrain Gravel Tire" },
            { id: "pathfinder-tlr", name: "Pathfinder TLR Fast Gravel Tire" },
        ],
        wheel: [
            { id: "terra-aero-clx", name: "Roval Terra Aero CLX" },
            { id: "terra-c-iii", name: "Roval Terra C III" },
            { id: "terra-aero-cl", name: "Roval Terra Aero CL" },
        ],
        handlebar: [
            { id: "terra-cockpit", name: "Roval Terra Cockpit" },
            { id: "short-reach-alloy-flare", name: "Short Reach Alloy Flare" },
        ],
        saddle: [
            { id: "power-comp-mimic", name: "Power Comp with MIMIC" },
            { id: "power-mirror", name: "S-Works Power with Mirror" },
            { id: "romin-evo-mimic", name: "Romin EVO Comp with MIMIC" },
        ],
    },
};

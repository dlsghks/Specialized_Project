export const partSteps = [
    { key: "tire", label: "TIRES", category: "타이어" },
    { key: "wheel", label: "WHEELS", category: "휠" },
    { key: "handlebar", label: "HANDLEBAR", category: "핸들바" },
    { key: "saddle", label: "SADDLES", category: "안장" },
] as const;

export type PartKind = (typeof partSteps)[number]["key"];
export type PartOption = { id: string; name: string; productUrl: string; thumbnailScale?: number };
export type PartCatalog = Record<PartKind, PartOption[]>;

const officialStore = "https://www.specialized.com/kr/ko/";

const rominEvoMimic: PartOption = {
    id: "romin-evo-mimic", name: "Romin EVO Comp with MIMIC", thumbnailScale: 0.74,
    productUrl: officialStore + "romin-evo-comp-with-mimic/p/173741?color=273684-173741",
};

export const partImage = (id: string) => `${import.meta.env.BASE_URL}images/customize/parts/${id}.webp`;

export const customizeParts = {
    "demo-11": {
        tire: [
            {
                id: "cannibal", name: "Cannibal Grid Gravity 2Bliss Ready T9", thumbnailScale: 1.06,
                productUrl: officialStore + "cannibal-grid-gravity-2bliss-ready-t9/p/218873?color=356860-218873",
            },
            {
                id: "fast-trak", name: "Fast Trak Control 2Bliss Ready T5", thumbnailScale: 1.1,
                productUrl: officialStore + "fast-trak-control-2bliss-ready-t5/p/205256?color=330470-205256",
            },
            {
                id: "butcher", name: "Butcher Grid Gravity 2Bliss Ready T9", thumbnailScale: 1.11,
                productUrl: officialStore + "butcher-grid-gravity-2bliss-ready-t9/p/187348?color=300426-187348",
            },
        ],
        wheel: [
            {
                id: "control-sl-v-370", name: "Roval Control SL V 370",
                productUrl: officialStore + "roval-control-sl-v-370/p/1000241337?color=1000241364-1000241337",
            },
            {
                id: "traverse-alloy-350", name: "Roval Traverse Alloy 350 6B", thumbnailScale: 0.87,
                productUrl: officialStore + "roval-traverse-alloy-350-6b/p/218346?color=353103-218346",
            },
        ],
        handlebar: [
            {
                id: "control-ii-cockpit", name: "Roval Control II Cockpit",
                productUrl: officialStore + "roval-control-ii-콕핏/p/1000288194?color=1000288199-1000288194",
            },
            {
                id: "control-cockpit", name: "Roval Control Cockpit", thumbnailScale: 0.86,
                productUrl: officialStore + "roval-control-cockpit/p/218332?color=352982-218332",
            },
            {
                id: "control-sl-35", name: "Roval Control SL 35mm Handlebar", thumbnailScale: 0.79,
                productUrl: officialStore + "roval-control-sl-35mm-핸들바/p/218333?color=353002-218333",
            },
        ],
        saddle: [
            {
                id: "power-evo-mirror", name: "S-Works Power EVO with Mirror", thumbnailScale: 0.94,
                productUrl: officialStore + "s-works-power-evo-with-mirror/p/1000150989?color=1000150991-1000150989",
            },
            {
                id: "power-arc-expert", name: "Power Arc Expert", thumbnailScale: 1.42,
                productUrl: officialStore + "power-arc-expert/p/156800?color=233329-156800",
            },
            {
                id: "s-works-power", name: "S-Works Power", thumbnailScale: 0.82,
                productUrl: officialStore + "에스웍스-파워-s-works-power/p/156019?color=230742-156019",
            },
        ],
    },
    "tarmac-sl9": {
        tire: [
            {
                id: "cotton-tlr", name: "Cotton TLR", thumbnailScale: 1.07,
                productUrl: officialStore + "코튼-tlr-cotton-tlr/p/1000261337?color=1000261342-1000261337",
            },
            {
                id: "rapidair-tlr", name: "RapidAir TLR Racing Only Tire", thumbnailScale: 1.07,
                productUrl: officialStore + "rapidair-tlr-racing-only-tire/p/1000232648?color=1000232653-1000232648",
            },
            {
                id: "mondo", name: "S-Works Mondo 2Bliss Ready T2/T5",
                productUrl: officialStore + "s-works-mondo-2bliss-ready-t2t5/p/1000161296?color=1000161298-1000161296",
            },
        ],
        wheel: [
            {
                id: "rapide-clx-iii", name: "Roval Rapide CLX III",
                productUrl: officialStore + "roval-rapide-clx-iii/p/1000256237?color=1000256242-1000256237",
            },
            {
                id: "roval-321-disc", name: "Roval 321 Disc – Disc Brake", thumbnailScale: 0.78,
                productUrl: officialStore + "roval-321-disc-disc-brake/p/159168?color=319060-159168",
            },
            {
                id: "rapide-clx-ii", name: "Rapide CLX II", thumbnailScale: 0.83,
                productUrl: officialStore + "rapide-clx-ii/p/205440?color=329921-205440",
            },
        ],
        handlebar: [
            {
                id: "rapide-cockpit", name: "Roval Rapide Cockpit",
                productUrl: officialStore + "roval-rapide-콕핏/p/218323?color=352960-218323",
            },
            {
                id: "alpinist-handlebar", name: "Roval Alpinist Handlebar", thumbnailScale: 1.48,
                productUrl: officialStore + "roval-alpinist-handlebar/p/1000256469?color=1000256474-1000256469",
            },
            {
                id: "shallow-bend", name: "S-Works Shallow Bend Carbon Handlebars", thumbnailScale: 0.9,
                productUrl: officialStore + "s-works-shallow-bend-carbon-handlebars/p/155400?color=229213-155400",
            },
        ],
        saddle: [
            {
                id: "romin-evo-mirror", name: "S-Works Romin EVO with Mirror", thumbnailScale: 0.77,
                productUrl: officialStore + "에스웍스-로민-이보-미러-s-works-romin-evo-with-mirror/p/205228?color=330429-205228",
            },
            {
                id: "sitero", name: "Sitero", thumbnailScale: 1.08,
                productUrl: officialStore + "sitero/p/187378?color=300506-187378",
            },
            rominEvoMimic,
        ],
    },
    "crux-5": {
        tire: [
            {
                id: "s-works-terra", name: "S-Works Terra 2Bliss Ready", thumbnailScale: 1.06,
                productUrl: officialStore + "s-works-terra-2bliss-ready/p/205548?color=334784-205548",
            },
            {
                id: "tracer-tlr", name: "Tracer TLR All Terrain Gravel Tire", thumbnailScale: 1.13,
                productUrl: officialStore + "tracer-tlr-all-terrain-gravel-tire/p/1000233247?color=1000233252-1000233247",
            },
            {
                id: "pathfinder-tlr", name: "Pathfinder TLR Fast Gravel Tire", thumbnailScale: 1.07,
                productUrl: officialStore + "pathfinder-tlr-fast-gravel-tire/p/1000234189?color=1000234194-1000234189",
            },
        ],
        wheel: [
            {
                id: "terra-aero-clx", name: "Roval Terra Aero CLX",
                productUrl: officialStore + "로발-테라-에어로-clx-roval-terra-aero-clx/p/1000256274?color=1000256282-1000256274",
            },
            {
                id: "terra-c-iii", name: "Roval Terra C III",
                productUrl: officialStore + "roval-terra-c-iii/p/1000256380?color=1000256385-1000256380",
            },
            {
                id: "terra-aero-cl", name: "Roval Terra Aero CL",
                productUrl: officialStore + "roval-terra-에어로-cl/p/1000256302?color=1000256307-1000256302",
            },
        ],
        handlebar: [
            {
                id: "terra-cockpit", name: "Roval Terra Cockpit",
                productUrl: officialStore + "roval-terra-콕핏/p/1000282126?color=1000282131-1000282126",
            },
            {
                id: "short-reach-alloy-flare", name: "Short Reach Alloy Flare", thumbnailScale: 0.88,
                productUrl: officialStore + "short-reach-alloy-flare/p/218331?color=352981-218331",
            },
        ],
        saddle: [
            {
                id: "power-comp-mimic", name: "Power Comp with MIMIC",
                productUrl: officialStore + "power-comp-with-mimic/p/159199?color=239696-159199",
            },
            {
                id: "power-mirror", name: "S-Works Power with Mirror", thumbnailScale: 0.87,
                productUrl: officialStore + "에스웍스-파워-미러-s-works-power-with-mirror/p/184353?color=292920-184353",
            },
            rominEvoMimic,
        ],
    },
} satisfies Record<string, PartCatalog>;

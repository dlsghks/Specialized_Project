import { frames, gradeLabels, grades, tarmacProduct } from "../pages/productTarmac";
import type { Product } from "./productTypes";

const [sWorksFrame] = frames;
const [, sLevel, comp] = grades;
const sl9Filters = { 사이즈: ["49", "52", "54", "56", "58"], 소재: ["카본"], 브랜드: ["스램"], 구성: ["2x", "11 · 12 · 13-Speed"] };

export const bikes: readonly Product[] = [
    tarmacProduct,
    {
        id: "4293537", name: sWorksFrame.name, category: "로드", price: sWorksFrame.price, detail: sWorksFrame.detail,
        image: sWorksFrame.image, filters: { 사이즈: ["49", "52", "54", "56"], 컬러: ["검은색"], 소재: ["카본"] },
        page: {
            badge: "S-Works", purchaseUrl: sWorksFrame.url,
            highlights: [["프레임", sWorksFrame.detail]],
        },
    },
    {
        id: "4293534", name: sLevel.name, category: "로드", price: sLevel.price, image: sLevel.image,
        filters: { ...sl9Filters, 컬러: ["회색"] },
        page: {
            badge: "S-Level", subtitle: "SRAM RED AXS", purchaseUrl: sLevel.url,
            highlights: sLevel.specs.map((value, index) => [gradeLabels[index], value]),
        },
    },
    {
        id: "4293529", name: comp.name, category: "로드", price: comp.price, image: comp.image,
        filters: { ...sl9Filters, 컬러: ["파란색"] },
        page: {
            badge: "Comp", subtitle: "SRAM Rival AXS", purchaseUrl: comp.url,
            highlights: comp.specs.map((value, index) => [gradeLabels[index], value]),
        },
    },
    { id: "roubaix-sl8-comp", name: "Roubaix SL8 Comp", category: "로드", price: 5850000 },
    {
        id: "allez-sport", name: "Allez Sport", category: "로드", price: 2200000,
        filters: { 사이즈: ["49", "52", "54", "56"], 컬러: ["검은색"], 소재: ["알루미늄"], 브랜드: ["시마노"], 구성: ["2x"] },
    },
    {
        id: "chisel", name: "Chisel", category: "산악", price: 2800000,
        filters: { 사이즈: ["S", "M", "L", "XL"], 컬러: ["녹색"], 소재: ["알루미늄"], 브랜드: ["시마노"], 구성: ["1x", "11 · 12 · 13-Speed"] },
    },
    { id: "stumpjumper", name: "Stumpjumper", category: "산악", price: 4900000 },
    { id: "diverge-comp", name: "Diverge Comp", category: "그래블", price: 4100000 },
    { id: "crux-sport", name: "Crux Sport", category: "그래블", price: 4700000 },
    { id: "jett-20", name: "Jett 20", category: "아동용", price: 540000 },
    {
        id: "sirrus-x", name: "Sirrus X", category: "액티브", price: 1250000,
        filters: { 사이즈: ["XS", "S", "M", "L"], 컬러: ["회색"], 소재: ["알루미늄"], 브랜드: ["마이크로시프트"], 구성: ["1x"] },
    },
    { id: "hotwalk", name: "Hotwalk", category: "아동용", price: 320000 },
    { id: "turbo-vado", name: "Turbo Vado", category: "액티브", price: 5500000 },
];

export const equipment: readonly Product[] = [
    { id: "evade-4", name: "S-Works Evade 4 LTD", category: "헬멧", price: 450000 },
    { id: "ares-2", name: "S-Works Ares 2 LTD", category: "슈즈", price: 590000 },
    { id: "rapide", name: "S-Works Rapide", category: "부품", price: 420000 },
    { id: "terra-cl", name: "Roval Terra CL", category: "부품", price: 1900000 },
    { id: "terra-handlebar", name: "Roval Terra 핸들바", category: "부품", price: 380000 },
];

export const products = [...bikes, ...equipment];
export const won = new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" });

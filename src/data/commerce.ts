import { useMemo, useSyncExternalStore } from "react";
import { gearImage, readLegacyGearCart, type GearItem } from "../pages/gearCart";

export type CartItem = {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    options?: string[];
    pickupOnly?: boolean;
    productId?: string;
};

export const shippingMethods = { delivery: "택배 배송", pickup: "매장 픽업" } as const;
export type ShippingMethod = keyof typeof shippingMethods;
export const paymentMethods = ["신용카드", "무통장입금", "카카오페이", "네이버페이", "토스페이", "계좌이체"] as const;
export type PaymentMethod = typeof paymentMethods[number];
export const demoCoupon = 10_000;
export const demoPoints = 5_000;
export const maxQuantity = 99;

type Totals = { subtotal: number; discount: number; total: number };
export type Order = {
    id: string;
    date: string;
    items: CartItem[];
    shipping: ShippingMethod;
    pickupStore?: string;
    payment: PaymentMethod;
    totals: Totals;
};

type Shop = { cart: CartItem[]; orders: Order[] };
export type OrderRequest = {
    id: string;
    items: CartItem[];
    shipping: ShippingMethod;
    pickupStore?: string;
    payment: PaymentMethod;
    coupon: boolean;
    points: number;
};

const shopKey = "specialized-shop-v1";
const shopEvent = "specialized-shop-updated";
const gearDemoPrices: Record<string, number> = {
    "S-Works_Carbon_Rib_Cage3.webp": 99_000,
    "S-Works_Torch.webp": 599_000,
    "S-Works_Evade4.webp": 450_000,
    "S-Works_Prevail3.webp": 390_000,
    "S-Works_Ares2.webp": 590_000,
};

export const gearCartId = (image: string) => `gear:${image}`;

export function gearCartItem(gear: GearItem): CartItem {
    return {
        id: gearCartId(gear.image),
        name: gear.name,
        image: gearImage(gear.image),
        price: gearDemoPrices[gear.image] ?? 99_000,
        quantity: 1,
        options: ["테스트 가격"],
    };
}

export function calculateTotals(items: readonly CartItem[], coupon = false, points = 0): Totals {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = Math.min(subtotal, (coupon ? demoCoupon : 0) + Math.min(demoPoints, Math.max(0, points)));
    return { subtotal, discount, total: subtotal - discount };
}

export const amountInWon = (amount: number) => `${amount.toLocaleString("ko-KR")}원`;

function readStorage() {
    return localStorage.getItem(shopKey) ?? JSON.stringify({
        cart: [...new Map(readLegacyGearCart().map((gear) => [gearCartId(gear.image), gearCartItem(gear)])).values()],
        orders: [],
    });
}

function snapshot() {
    try {
        return readStorage();
    } catch {
        return "{}";
    }
}

function isCartItem(value: unknown): value is CartItem {
    const item = value as Partial<CartItem> | null;
    return typeof item?.id === "string" &&
        typeof item.name === "string" &&
        typeof item.price === "number" && Number.isSafeInteger(item.price) && item.price >= 0 &&
        typeof item.quantity === "number" && Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= maxQuantity &&
        (item.options === undefined || Array.isArray(item.options) && item.options.every((option) => typeof option === "string"));
}

function isOrder(value: unknown): value is Order {
    const order = value as Partial<Order> | null;
    return typeof order?.id === "string" && typeof order.date === "string" &&
        Array.isArray(order.items) && order.items.every(isCartItem) &&
        (order.shipping === "delivery" || order.shipping === "pickup") &&
        (order.pickupStore === undefined || typeof order.pickupStore === "string") &&
        order.payment !== undefined && paymentMethods.includes(order.payment) &&
        typeof order.totals?.subtotal === "number" && typeof order.totals.discount === "number" && typeof order.totals.total === "number";
}

function parseShop(raw: string): Shop {
    try {
        const state: Partial<Shop> | null = JSON.parse(raw);
        return {
            cart: Array.isArray(state?.cart) ? state.cart.filter(isCartItem) : [],
            orders: Array.isArray(state?.orders) ? state.orders.filter(isOrder) : [],
        };
    } catch {
        return { cart: [], orders: [] };
    }
}

function subscribe(onChange: () => void) {
    window.addEventListener("storage", onChange);
    window.addEventListener(shopEvent, onChange);
    return () => {
        window.removeEventListener("storage", onChange);
        window.removeEventListener(shopEvent, onChange);
    };
}

export function useShop() {
    const raw = useSyncExternalStore(subscribe, snapshot);
    return useMemo(() => parseShop(raw), [raw]);
}

function updateShop(update: (state: Shop) => Shop): Promise<Shop> {
    const save = () => {
        const state = parseShop(readStorage());
        const next = update(state);
        if (next !== state) {
            localStorage.setItem(shopKey, JSON.stringify(next));
            window.dispatchEvent(new Event(shopEvent));
        }
        return next;
    };
    return navigator.locks ? navigator.locks.request(shopKey, save) : Promise.resolve().then(save);
}

export function addCartItem(item: CartItem, once = false) {
    return updateShop((state) => {
        const existing = state.cart.find(({ id }) => id === item.id);
        if (once && existing) return state;
        const cart = existing
            ? state.cart.map((line) => line.id === item.id ? { ...line, quantity: Math.min(maxQuantity, line.quantity + item.quantity) } : line)
            : [...state.cart, item];
        return { ...state, cart };
    });
}

export function changeCartQuantity(id: string, delta: number) {
    return updateShop((state) => ({
        ...state,
        cart: state.cart.map((item) => item.id === id
            ? { ...item, quantity: Math.max(1, Math.min(maxQuantity, item.quantity + delta)) }
            : item),
    }));
}

export function removeCartItems(ids: readonly string[]) {
    return updateShop((state) => ({ ...state, cart: state.cart.filter(({ id }) => !ids.includes(id)) }));
}

export function createOrderId() {
    const day = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" }).replaceAll("-", "");
    return `SP-${day}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
}

export class CartChangedError extends Error {}

export async function confirmDemoOrder(request: OrderRequest): Promise<Order> {
    const state = await updateShop((current) => {
        if (current.orders.some(({ id }) => id === request.id)) return current;

        const ids = new Set(request.items.map(({ id }) => id));
        const items = current.cart.filter(({ id }) => ids.has(id));
        const reviewed = new Map(request.items.map((item) => [item.id, item]));
        if (!items.length || items.length !== request.items.length ||
            items.some(({ id, quantity, price }) => quantity !== reviewed.get(id)?.quantity || price !== reviewed.get(id)?.price) ||
            (request.shipping === "delivery" && items.some(({ pickupOnly }) => pickupOnly))) {
            throw new CartChangedError("장바구니 내용이 바뀌었어요. 주문 상품을 다시 확인해 주세요.");
        }

        const order: Order = {
            id: request.id,
            date: new Date().toISOString(),
            items,
            shipping: request.shipping,
            pickupStore: request.pickupStore,
            payment: request.payment,
            totals: calculateTotals(items, request.coupon, request.points),
        };
        return { cart: current.cart.filter(({ id }) => !ids.has(id)), orders: [order, ...current.orders] };
    });
    return state.orders.find(({ id }) => id === request.id)!;
}

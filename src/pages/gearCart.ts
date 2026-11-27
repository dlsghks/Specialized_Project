export type GearItem = { name: string; image: string };

const cartKey = "specialized-gear-cart";

export function gearImage(image: string) {
    return `${import.meta.env.BASE_URL}images/customize/gear/${image}`;
}

export function readLegacyGearCart(): GearItem[] {
    try {
        const items: unknown = JSON.parse(localStorage.getItem(cartKey) ?? "[]");
        return Array.isArray(items) ? items.filter((item) => typeof item?.name === "string" && typeof item?.image === "string") : [];
    } catch {
        return [];
    }
}

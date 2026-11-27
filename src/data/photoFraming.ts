// Offsets are percentages of the photo frame so alignment scales with the viewport.
export type PhotoFraming = { scale: number; x?: number; y?: number };

export function photoFramingStyle(framing?: PhotoFraming) {
    if (!framing) return undefined;

    return { transform: `translate(${framing.x ?? 0}%, ${framing.y ?? 0}%) scale(${framing.scale})` };
}

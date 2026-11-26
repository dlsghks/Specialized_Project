export const customizeBikes = [
    { id: "tarmac-sl9", category: "로드", name: "S-Works Tarmac SL9" },
    { id: "demo-11", category: "산악", name: "S-Works Demo 11" },
    { id: "crux-5", category: "그래블", name: "Crux 5 S-Level" },
];

export function bikePhoto(id: string) {
    return `${import.meta.env.BASE_URL}images/customize/${id}-side.webp`;
}

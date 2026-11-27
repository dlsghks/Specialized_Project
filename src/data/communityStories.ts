import stories from "./communityStories.json";

export type Story = {
    id: string;
    title: string;
    summary: string;
    date: string | null;
    tags: string[];
    image: string;
};

export const communityStories: readonly Story[] = stories;

export const storyTags = [
    { id: "athletes-pro-cycling", label: "Athletes-pro-cycling" },
    { id: "road", label: "Road" },
    { id: "how-to-articles", label: "사용 방법 문서" },
    { id: "innovation", label: "Innovation" },
    { id: "gravel", label: "Gravel" },
    { id: "cycling-gear", label: "사이클링 장비" },
    { id: "mountain", label: "Mountain" },
    { id: "active", label: "시티 자전거" },
    { id: "tips-advice", label: "팁 및 조언" },
];

export const storyTagLabel = (id: string) => storyTags.find((tag) => tag.id === id)?.label ?? id;

export function storySearch({ tag, oldestFirst = false, page = 1 }: { tag?: string; oldestFirst?: boolean; page?: number } = {}) {
    const params = new URLSearchParams({ tab: "stories" });
    if (tag) params.set("tag", tag);
    if (oldestFirst) params.set("sort", "oldest");
    if (page > 1) params.set("page", String(page));
    return `?${params.toString()}`;
}

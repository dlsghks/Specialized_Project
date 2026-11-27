import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { communityImages } from "../../data/community";
import { storyTags, storyTagLabel, storySearch, type Story } from "../../data/communityStories";

const pageSize = 8;
const visiblePageCount = 4;

type Props = {
    stories: readonly Story[];
    tag?: string;
    oldestFirst: boolean;
    requestedPage: number;
};

export function StoryListing({ stories, tag, oldestFirst, requestedPage }: Props) {
    const listing = useRef<HTMLElement>(null);
    const pageCount = Math.ceil(stories.length / pageSize);
    const page = Number.isInteger(requestedPage) ? Math.min(Math.max(requestedPage, 1), Math.max(pageCount, 1)) : 1;
    const firstPage = Math.min(Math.max(page - 1, 1), Math.max(pageCount - visiblePageCount + 1, 1));
    const pages = Array.from({ length: Math.min(visiblePageCount, pageCount) }, (_, index) => firstPage + index);
    const current = stories.slice((page - 1) * pageSize, page * pageSize);
    const goToPage = (number: number) => storySearch({ tag, oldestFirst, page: number });
    const scrollToListing = () => listing.current?.scrollIntoView({ block: "start" });

    return (
        <section className="community-stories" ref={listing} aria-label="스토리 · 가이드 목록">
            <nav className="community-disciplines community-stories__tags" aria-label="스토리 분류">
                <Link to={storySearch({ oldestFirst })} aria-current={!tag ? "page" : undefined}>전체</Link>
                {storyTags.map(({ id, label }) => (
                    <Link key={id} to={storySearch({ tag: id, oldestFirst })} aria-current={tag === id ? "page" : undefined}>{label}</Link>
                ))}
            </nav>
            <div className="community-guides__grid community-stories__grid">
                {current.map((story, index) => (
                    <Link className="community-guide" to={`/community/stories/${story.id}`} state={{ storyList: goToPage(page) }} key={story.id}>
                        <div className="community-guide__photo">
                            <img src={communityImages + story.image} alt="" loading={index < 4 ? "eager" : "lazy"} />
                        </div>
                        <div className="community-card-meta">
                            <span>{story.tags.map(storyTagLabel).join(", ") || "스토리"}</span>
                            <h2>{story.title}</h2>
                            {story.date && <time dateTime={story.date}>{story.date.replaceAll("-", ".")}</time>}
                        </div>
                    </Link>
                ))}
            </div>
            {!current.length && <p className="community-stories__empty">이 분류에 등록된 스토리가 없어요.</p>}
            {pageCount > 1 && (
                <nav className="community-stories__pages" aria-label="스토리 페이지">
                    {page > 1 ? (
                        <Link to={goToPage(page - 1)} onClick={scrollToListing} aria-label="이전 페이지"><ChevronLeft aria-hidden="true" /></Link>
                    ) : <span aria-hidden="true"><ChevronLeft /></span>}
                    {pages.map((number) => (
                        <Link key={number} to={goToPage(number)} onClick={scrollToListing}
                            aria-current={page === number ? "page" : undefined} aria-label={`${number} 페이지`}>{number}</Link>
                    ))}
                    {page < pageCount ? (
                        <Link to={goToPage(page + 1)} onClick={scrollToListing} aria-label="다음 페이지"><ChevronRight aria-hidden="true" /></Link>
                    ) : <span aria-hidden="true"><ChevronRight /></span>}
                </nav>
            )}
        </section>
    );
}

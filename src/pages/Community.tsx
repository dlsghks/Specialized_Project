import { useLayoutEffect, useRef } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { AthleteRow } from "../components/community/AthleteRow";
import { CommunityOverview, CommunityOverviewHero } from "../components/community/CommunityOverview";
import { StoryListing } from "../components/community/StoryListing";
import { athleteGroups, communityGuides, communityImages, officialCommunity } from "../data/community";
import { communityStories, storySearch, storyTags } from "../data/communityStories";
import "../styles/pages/Community.scss";

const athleteCount = athleteGroups.reduce((count, group) => count + group.athletes.length, 0);

function CommunityGuides() {
    return (
        <section className="community-guides" aria-labelledby="community-guides-title">
            <header className="community-row-heading">
                <h2 id="community-guides-title">다른 스토리 · 가이드</h2>
                <Link className="community-row-heading__link" to="?tab=stories"
                    onClick={() => document.getElementById("community-menu")?.scrollIntoView()}>전체 보기</Link>
            </header>
            <div className="community-guides__grid">
                {communityGuides.map((guide) => (
                    <Link className="community-guide" to={`/community/${guide.id}`} key={guide.id}>
                        <div className="community-guide__photo"><img src={communityImages + guide.image} alt="" loading="lazy" /></div>
                        <div className="community-card-meta">
                            <span>{guide.category}</span>
                            <h3>{guide.title}</h3>
                            {"date" in guide && <time dateTime={guide.date}>{guide.date.replaceAll("-", ".")}</time>}
                        </div>
                    </Link>
                ))}
            </div>
            <a className="community-guides__more" href={officialCommunity + "stories"}>스토리 더 보기</a>
        </section>
    );
}

export function Community() {
    const [params, setParams] = useSearchParams();
    const { hash } = useLocation();
    const requestedTab = params.get("tab");
    const tab = requestedTab === "athletes" || requestedTab === "stories" ? requestedTab : "all";
    const discipline = tab === "athletes" ? athleteGroups.find((group) => group.id === params.get("discipline")) : undefined;
    const visibleGroups = discipline ? [discipline] : athleteGroups;
    const storyTag = storyTags.find(({ id }) => id === params.get("tag"))?.id;
    const oldestFirst = params.get("sort") === "oldest";
    const stories = storyTag ? communityStories.filter(({ tags }) => tags.includes(storyTag)) : communityStories;
    const sortedStories = [...stories].sort((a, b) => {
        if (!a.date || !b.date) return Number(!a.date) - Number(!b.date);
        return oldestFirst ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date);
    });
    const menu = useRef<HTMLElement>(null);

    useLayoutEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useLayoutEffect(() => {
        if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
    }, [hash, tab]);

    useLayoutEffect(() => {
        const nav = menu.current;
        const current = nav?.querySelector("[aria-current='page']");
        if (!nav || !current) return;
        const box = nav.getBoundingClientRect();
        const item = current.getBoundingClientRect();
        nav.scrollLeft += item.left < box.left ? item.left - box.left : Math.max(0, item.right - box.right);
    }, [tab]);

    return (
        <div className="community-page">
            {tab === "all" ? <CommunityOverviewHero /> : (
                <header className="community-masthead community-width">
                    <div>
                        <h1>라이더 커뮤니티</h1>
                        <p>{tab === "stories" ? "선수들의 이야기와 라이딩에 필요한 가이드를 만나보세요." : "커뮤니티 홈 / 선수"}</p>
                    </div>
                    <img className="community-masthead__photo" src={communityImages + (tab === "stories" ? "stories-hero.webp" : "athletes-hero.webp")}
                        alt={tab === "stories" ? "설산을 배경으로 산악자전거를 타는 라이더" : "산과 숲을 따라 이어지는 흙길"} width={1840} height={759} fetchPriority="high" />
                </header>
            )}

            <div className="community-nav" data-overview={tab === "all" || undefined} id="community-menu">
                <div className="community-nav__inner community-width">
                    <nav aria-label="커뮤니티 메뉴" ref={menu}>
                        <Link to="?tab=all" aria-current={tab === "all" ? "page" : undefined}>전체</Link>
                        {tab === "all" ? (
                            <>
                                <a href="#community-purchase-reviews">구매자 사용 후기</a>
                                <a href="#community-store-reviews">매장 방문 후기</a>
                            </>
                        ) : (
                            <>
                                <span aria-disabled="true" title="준비 중">구매자 사용 후기</span>
                                <span aria-disabled="true" title="준비 중">매장 방문 후기</span>
                            </>
                        )}
                        <Link to="?tab=stories" aria-current={tab === "stories" ? "page" : undefined}>스토리 · 가이드</Link>
                        <Link to="?tab=athletes" aria-current={tab === "athletes" ? "page" : undefined}>선수</Link>
                        <a href={tab === "all" ? "#community-news" : officialCommunity + "stories"}>뉴스 · 이벤트</a>
                    </nav>
                    {tab === "athletes" && <p>선수 {discipline?.athletes.length ?? athleteCount}명</p>}
                    {tab === "stories" && (
                        <div className="community-story-tools">
                            <p aria-live="polite">스토리 · 가이드 {stories.length}개</p>
                            <select aria-label="스토리 정렬" value={oldestFirst ? "oldest" : "newest"}
                                onChange={(event) => setParams(storySearch({ tag: storyTag, oldestFirst: event.target.value === "oldest" }))}>
                                <option value="newest">최신순</option>
                                <option value="oldest">오래된순</option>
                            </select>
                        </div>
                    )}
                </div>
            </div>

            <div className="community-content community-width">
                {tab === "athletes" && (
                    <nav className="community-disciplines" aria-label="선수 종목">
                        <Link to="?tab=athletes" aria-current={!discipline ? "page" : undefined}>전체</Link>
                        {athleteGroups.map((group) => (
                            <Link key={group.id} to={`?tab=athletes&discipline=${group.id}`}
                                aria-current={discipline?.id === group.id ? "page" : undefined}>{group.label}</Link>
                        ))}
                    </nav>
                )}
                {tab === "all" && <CommunityOverview />}
                {tab === "athletes" && (
                    <div className="community-roster">
                        {visibleGroups.map((group) => <AthleteRow key={group.id} group={group} filtered={Boolean(discipline)} />)}
                    </div>
                )}
                {tab === "athletes" && <CommunityGuides />}
                {tab === "stories" && <StoryListing stories={sortedStories} tag={storyTag} oldestFirst={oldestFirst} requestedPage={Number(params.get("page") ?? 1)} />}
            </div>
        </div>
    );
}

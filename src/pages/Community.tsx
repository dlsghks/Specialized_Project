import { useLayoutEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AthleteRow } from "../components/community/AthleteRow";
import { athleteGroups, communityGuides, communityImages, officialCommunity } from "../data/community";
import "../styles/pages/Community.scss";

const athleteCount = athleteGroups.reduce((count, group) => count + group.athletes.length, 0);

function CommunityGuides({ isStoryTab }: { isStoryTab: boolean }) {
    return (
        <section className="community-guides" aria-labelledby="community-guides-title">
            <header className="community-row-heading">
                <h2 id="community-guides-title">{isStoryTab ? "스토리 · 가이드" : "다른 스토리 · 가이드"}</h2>
                {!isStoryTab && <Link className="community-row-heading__link" to="?tab=stories"
                    onClick={() => document.getElementById("community-menu")?.scrollIntoView()}>전체 보기</Link>}
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
    const [params] = useSearchParams();
    const requestedTab = params.get("tab");
    const tab = requestedTab === "all" || requestedTab === "stories" ? requestedTab : "athletes";
    const discipline = tab === "athletes" ? athleteGroups.find((group) => group.id === params.get("discipline")) : undefined;
    const visibleGroups = discipline ? [discipline] : athleteGroups;
    const menu = useRef<HTMLElement>(null);

    useLayoutEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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
            <header className="community-masthead community-width">
                <div>
                    <h1>라이더 커뮤니티</h1>
                    <p>커뮤니티 홈 / {tab === "stories" ? "스토리 · 가이드" : tab === "all" ? "전체" : "선수"}</p>
                </div>
                <img className="community-masthead__photo" src={communityImages + "athletes-hero.webp"}
                    alt="산과 숲을 따라 이어지는 흙길" width={1840} height={759} fetchPriority="high" />
            </header>

            <div className="community-nav" id="community-menu">
                <div className="community-nav__inner community-width">
                    <nav aria-label="커뮤니티 메뉴" ref={menu}>
                        <Link to="?tab=all" aria-current={tab === "all" ? "page" : undefined}>전체</Link>
                        <span aria-disabled="true" title="준비 중">구매자 사용 후기</span>
                        <span aria-disabled="true" title="준비 중">매장 방문 후기</span>
                        <Link to="?tab=stories" aria-current={tab === "stories" ? "page" : undefined}>스토리 · 가이드</Link>
                        <Link to="?tab=athletes" aria-current={tab === "athletes" ? "page" : undefined}>선수</Link>
                        <a href={officialCommunity + "stories"}>뉴스 · 이벤트</a>
                    </nav>
                    {tab === "athletes" && <p>선수 {discipline?.athletes.length ?? athleteCount}명</p>}
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
                {tab === "all" && <CommunityGuides isStoryTab={false} />}
                {tab !== "stories" && (
                    <div className="community-roster">
                        {visibleGroups.map((group) => <AthleteRow key={group.id} group={group} filtered={Boolean(discipline)} />)}
                    </div>
                )}
                {tab !== "all" && <CommunityGuides isStoryTab={tab === "stories"} />}
            </div>
        </div>
    );
}

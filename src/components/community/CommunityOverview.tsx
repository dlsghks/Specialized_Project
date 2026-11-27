import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { athleteGroups, athleteImage, communityGuides, communityImages, officialCommunity } from "../../data/community";
import { communityStories } from "../../data/communityStories";
import "../../styles/components/community/CommunityOverview.scss";

const imageRoot = `${import.meta.env.BASE_URL}images/`;
const featureStories = [
    { id: "best-road-bikes", label: "스토리 · 가이드" },
    { id: "demo-11-creator-story", label: "스토리 · 가이드" },
    { id: "remco-evenepoel-and-specialized-sign-lifetime-partnership", label: "뉴스 · 이벤트" },
].flatMap(({ id, label }) => communityStories.filter((story) => story.id === id).map((story) => ({ ...story, label })));

const newsStories = ["tarmac-sl9-bike-level-guide", "crux-5-s-level-gravel-bike-guide", "tarmac-sl8-artist-series-ltd"]
    .flatMap((id) => communityStories.filter((story) => story.id === id));

const athletes = athleteGroups.flatMap((group) => group.athletes);
const featuredAthletes = ["remco-evenepoel", "lorena-wiebes", "loic-bruni", "haley-batten"]
    .flatMap((id) => athletes.filter((athlete) => athlete.id === id));

const reviewGroups = [
    {
        id: "community-purchase-reviews",
        title: "구매자 사용 후기",
        cards: [
            { title: "S-Works Tarmac SL9 구매 후기", summary: "제품 상세에서 라이더 구매 후기를 확인해 보세요.", image: "products/tarmac-sl9/race-hero.webp", to: "/products/4293533#product-reviews" },
            { title: "그래블 자전거 고르기", summary: "라이딩 스타일에 맞는 그래블 자전거를 찾아보세요.", image: "community/stories/best-gravel-bikes.webp", to: "/community/stories/best-gravel-bikes" },
        ],
    },
    {
        id: "community-store-reviews",
        title: "매장 방문 후기",
        cards: [
            { title: "가까운 매장 찾기", summary: "지역이나 매장명으로 매장을 검색할 수 있어요.", image: "community/overview/dealer-interior.webp", to: "/dealers" },
            { title: "매장 방문 전 확인하기", summary: "지도에서 매장 위치와 연락처를 확인해 보세요.", image: "community/overview/dealer-exterior.webp", to: "/dealers" },
        ],
    },
];

type PreviewCard = { title: string; image: string; to: string; summary?: string; date?: string | null };

function OverviewCard({ title, image, to, summary, date }: PreviewCard) {
    return (
        <Link className="community-overview__card" to={to}>
            <div className="community-overview__photo"><img src={image} alt="" loading="lazy" /></div>
            <h3>{title}</h3>
            {summary && <p>{summary}</p>}
            {date && <time dateTime={date}>{date.replaceAll("-", ".")}</time>}
        </Link>
    );
}

function OverviewHeading({ id, title, to }: { id: string; title: string; to?: string }) {
    const label = `전체 보기: ${title}`;
    const arrow = <ArrowRight size={17} aria-hidden="true" />;
    return (
        <header className="community-overview__heading">
            <h2 id={id}>{title}</h2>
            {to && (to.startsWith("https://") ? (
                <a href={to} aria-label={label}>전체 보기 {arrow}</a>
            ) : (
                <Link to={`${to}#community-menu`} aria-label={label}>
                    전체 보기 {arrow}
                </Link>
            ))}
        </header>
    );
}

export function CommunityOverviewHero() {
    return (
        <header className="community-overview-hero">
            <img src={`${communityImages}overview/rider-community-hero.webp`} alt="" width={620} height={141} fetchPriority="high" />
            <div className="community-overview-hero__copy community-width">
                <span>RIDER COMMUNITY</span>
                <h1>라이더 커뮤니티</h1>
                <p>스페셜라이즈드와 함께하는 라이더들의 이야기</p>
            </div>
        </header>
    );
}

export function CommunityOverview() {
    return (
        <div className="community-overview">
            <section className="community-overview__features" aria-label="추천 콘텐츠">
                {featureStories.map((story, index) => (
                    <Link key={story.id} className="community-overview__feature" to={`/community/stories/${story.id}`}>
                        <img src={communityImages + story.image} alt="" loading={index === 0 ? "eager" : "lazy"} />
                        <div className="community-overview__feature-copy">
                            <span>{story.label}</span>
                            <h2>{story.title}</h2>
                            <p>{story.summary}</p>
                        </div>
                        <ArrowRight size={22} aria-hidden="true" />
                    </Link>
                ))}
            </section>

            <section aria-labelledby="overview-reviews-title">
                <OverviewHeading id="overview-reviews-title" title="라이더들의 이야기" />
                <div className="community-overview__review-groups">
                    {reviewGroups.map((group) => (
                        <section key={group.id} id={group.id} aria-labelledby={`${group.id}-title`}>
                            <div className="community-overview__review-heading">
                                <h3 id={`${group.id}-title`}>{group.title}</h3>
                                <span>후기 준비 중</span>
                            </div>
                            <div className="community-overview__review-cards">
                                {group.cards.map((card) => <OverviewCard key={card.title} {...card} image={imageRoot + card.image} />)}
                            </div>
                        </section>
                    ))}
                </div>
            </section>

            <section aria-labelledby="overview-guides-title">
                <OverviewHeading id="overview-guides-title" title="스토리 · 가이드" to="?tab=stories" />
                <div className="community-overview__cards">
                    {communityGuides.slice(0, 3).map((guide) => (
                        <OverviewCard key={guide.id} title={guide.title} summary={guide.summary}
                            image={communityImages + guide.image} to={`/community/stories/${guide.id}`} />
                    ))}
                </div>
            </section>

            <section aria-labelledby="overview-athletes-title">
                <OverviewHeading id="overview-athletes-title" title="스페셜라이즈드 선수" to="?tab=athletes" />
                <div className="community-overview__athletes">
                    {featuredAthletes.map((athlete) => (
                        <Link key={athlete.id} className="community-overview__athlete" to={`/community/${athlete.id}`}>
                            <img src={athleteImage(athlete.id)} alt="" loading="lazy" />
                            <div className="community-overview__athlete-copy">
                                <h3>{athlete.name}</h3>
                                <p>{athlete.team}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            <section id="community-news" aria-labelledby="overview-news-title">
                <OverviewHeading id="overview-news-title" title="뉴스 · 이벤트" to={`${officialCommunity}stories`} />
                <div className="community-overview__cards community-overview__news">
                    {newsStories.map((story) => (
                        <OverviewCard key={story.id} title={story.title} date={story.date}
                            image={communityImages + story.image} to={`/community/stories/${story.id}`} />
                    ))}
                </div>
            </section>
        </div>
    );
}

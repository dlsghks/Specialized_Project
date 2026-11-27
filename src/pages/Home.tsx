import { useRef, useState, type PointerEvent } from "react";
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { DealerFinder } from "./Dealers";
import { bikePhoto, customizeBikes } from "./customizeBikes";
import { colors, grades } from "./productTarmac";
import "../styles/pages/Home.scss";

const base = import.meta.env.BASE_URL + "images/";
const homeImages = base + "home/";
const productDetail = "/products/4293533";
const equipment = "/products?type=equipment";
const showcaseLinks: Record<string, { href: string; external?: boolean }> = {
    "tarmac-sl9": { href: productDetail },
    "demo-11": { href: "https://www.specialized.com/kr/ko/s-works-demo-11/p/4293955", external: true },
    "crux-5": { href: "https://www.specialized.com/kr/ko/crux-5-s-level-sram-red-xplr/p/4294829", external: true },
};
const showcaseBikes = customizeBikes.filter(({ id }) => Object.hasOwn(showcaseLinks, id)).map((bike) => ({
    id: bike.id,
    name: bike.name,
    link: showcaseLinks[bike.id],
    colors: bike.id === "tarmac-sl9"
        ? colors.map(({ name, swatch, gallery }) => ({ name, swatch, image: gallery[0].image }))
        : bike.colors.map(({ name, finish, image }) => ({ name, swatch: finish, image: bikePhoto(image ?? bike.image) })),
}));
const highlights = [
    {
        key: "customize", label: "S-LAB 3D CUSTOMIZATION", title: ["나만의 스페셜라이즈드,", "3D로 커스터마이징하세요"],
        action: "S-LAB 시작하기", to: "/customize", help: "커스터마이징 가이드",
        description: "프레임 컬러와 부품을 골라 나만의 자전거를 구성해 보세요.", image: homeImages + "hero-customization.webp",
    },
    {
        key: "advisor", label: "AI BIKE ADVISOR", title: ["몇 가지 질문으로 찾는", "나에게 맞는 스페셜라이즈드"],
        action: "AI 추천 시작하기", to: "/bike-finder", help: "추천 방식 알아보기",
        description: "라이딩 스타일과 주행 환경, 예산에 맞춰 자전거를 추천해 드려요.", image: homeImages + "hero-advisor.webp",
    },
    {
        key: "community", label: "RIDER COMMUNITY", title: ["함께 달리는 라이더들의", "진짜 라이딩 이야기"],
        action: "라이더 후기 보기", to: "/community", help: "커뮤니티 둘러보기", image: homeImages + "hero-community.webp",
    },
];
const parts = [
    { name: "TIRE", label: "타이어", image: base + "customize/parts/cannibal.webp" },
    { name: "HELMET", label: "헬멧", image: base + "customize/gear/S-Works_Evade4.webp" },
    { name: "CAGE", label: "물통 케이지", image: base + "customize/gear/S-Works_Carbon_Rib_Cage3.webp" },
    { name: "HANDLEBAR", label: "핸들바", image: base + "customize/parts/rapide-cockpit.webp" },
];
const stories = [
    {
        title: "오르막에서 다시 속도를 붙이기 편했어요.", text: "늘 타던 언덕에서 잠깐 속도를 줄였다가 다시 페달을 밟아 봤어요.",
        caption: "한강라이더 · 시승 후기 · 54 사이즈", bike: grades[0], image: homeImages + "rider-community-story.webp",
    },
    { title: "길이 달라지면 라이딩도 달라져요", text: "자주 달리는 길과 라이딩 스타일에 맞는 자전거를 찾아보세요.", bike: grades[1], image: base + "customize/categories/road.webp" },
    { title: "주말에 함께 달릴 코스를 찾아서", text: "라이더들과 함께 나누는 새로운 길과 주행 이야기를 둘러보세요.", bike: grades[2], image: homeImages + "hero-community.webp" },
];

const wrap = (index: number, count: number) => (index + count) % count;
const countText = (index: number, count: number) => String(index + 1).padStart(2, "0") + " / " + String(count).padStart(2, "0");

export const Home = () => {
    const [{ index: highlightIndex, direction }, setHighlight] = useState({ index: 0, direction: 0 });
    const swipe = useRef<{ id: number; x: number; y: number } | null>(null);
    const [bikeIndex, setBikeIndex] = useState(0);
    const [bikeColors, setBikeColors] = useState<Record<string, number>>({ "tarmac-sl9": 1 });
    const [storyIndex, setStoryIndex] = useState(0);
    const [heroPaused, setHeroPaused] = useState(false);
    const [showGuide, setShowGuide] = useState(false);
    const highlight = highlights[highlightIndex];
    const currentBike = showcaseBikes[bikeIndex];
    const previousBike = showcaseBikes[wrap(bikeIndex - 1, showcaseBikes.length)];
    const nextBike = showcaseBikes[wrap(bikeIndex + 1, showcaseBikes.length)];
    const currentColorIndex = bikeColors[currentBike.id] ?? 0;
    const currentColor = currentBike.colors[currentColorIndex];
    const story = stories[storyIndex];
    const storyLabel = `STORY ${String(storyIndex + 1).padStart(2, "0")}`;

    const changeHighlight = (offset: number) => {
        if (!offset) return;
        setShowGuide(false);
        setHighlight(({ index }) => ({ index: wrap(index + offset, highlights.length), direction: Math.sign(offset) }));
    };

    const startSwipe = (event: PointerEvent<HTMLDivElement>) => {
        if (!event.isPrimary || event.button !== 0 || (event.target as Element).closest("a, button")) return;
        swipe.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
        event.currentTarget.setPointerCapture(event.pointerId);
    };

    const finishSwipe = (event: PointerEvent<HTMLDivElement>) => {
        const start = swipe.current;
        if (!start || start.id !== event.pointerId) return;
        swipe.current = null;
        const x = event.clientX - start.x;
        const y = event.clientY - start.y;
        if (Math.abs(x) >= 45 && Math.abs(x) > Math.abs(y)) changeHighlight(x < 0 ? 1 : -1);
    };

    const showcaseImage = (bike: typeof currentBike) => bike.colors[bikeColors[bike.id] ?? 0].image;

    return (
        <div className="home">
            <section className="home-hero" aria-label="주요 서비스" data-hero={highlight.key}>
                <div className="home-hero__viewport" onPointerDown={startSwipe} onPointerUp={finishSwipe}
                    onPointerCancel={() => { swipe.current = null; }} onLostPointerCapture={() => { swipe.current = null; }}>
                    <img className="home-hero__image" key={highlight.image} src={highlight.image} alt="" fetchPriority="high" draggable={false} />
                    <div className="home-hero__content" key={highlight.key} data-direction={direction}>
                        <p className="home-eyebrow">
                            <img src={homeImages + "hero-specialized-mark.png"} alt="" width={30} height={30} />
                            {highlight.label}
                        </p>
                        <h1>{highlight.title[0]}<br />{highlight.title[1]}</h1>
                        <div className="home-hero__actions">
                            <Link className="home-link" to={highlight.to}>{highlight.action}<ChevronRight size={17} aria-hidden="true" /></Link>
                            {highlight.description ? (
                                <button className="home-link home-link--outline" type="button" aria-expanded={showGuide}
                                    onClick={() => setShowGuide((open) => !open)}>{highlight.help}<ChevronRight size={17} aria-hidden="true" /></button>
                            ) : <a className="home-link home-link--outline" href="#home-community">{highlight.help}<ChevronRight size={17} aria-hidden="true" /></a>}
                        </div>
                        {showGuide && <p className="home-hero__description">{highlight.description}</p>}
                    </div>
                </div>
                <div className="home-hero__controls">
                    <div className="home-hero__tabs" role="group" aria-label="히어로 슬라이드">
                        {highlights.map(({ label }, index) => (
                            <button key={label} type="button" aria-label={label} aria-pressed={index === highlightIndex}
                                onClick={() => changeHighlight(index - highlightIndex)}>
                                {index === highlightIndex && (
                                    <span className="home-hero__progress" data-paused={heroPaused} aria-hidden="true"
                                        onAnimationEnd={() => changeHighlight(1)} />
                                )}
                            </button>
                        ))}
                    </div>
                    <div className="home-hero__playback">
                        <span>{countText(highlightIndex, highlights.length)}</span>
                        <button type="button" aria-label={heroPaused ? "자동 재생" : "일시정지"} onClick={() => setHeroPaused((paused) => !paused)}>
                            {heroPaused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}
                        </button>
                    </div>
                </div>
            </section>

            <section className="home-showcase" aria-labelledby="featured-bikes">
                <h2 id="featured-bikes">BIKE SHOWCASE</h2>
                <div className="home-showcase__stage">
                    <img src={showcaseImage(previousBike)} alt="" className="home-showcase__side home-showcase__side--previous" loading="lazy" />
                    <img src={currentColor.image} alt={`${currentBike.name} · ${currentColor.name}`} className="home-showcase__bike" loading="lazy" />
                    <img src={showcaseImage(nextBike)} alt="" className="home-showcase__side home-showcase__side--next" loading="lazy" />
                    <button className="home-carousel-button home-carousel-button--previous" type="button" aria-label="이전 자전거"
                        onClick={() => setBikeIndex((index) => wrap(index - 1, showcaseBikes.length))}><ChevronLeft aria-hidden="true" /></button>
                    <button className="home-carousel-button home-carousel-button--next" type="button" aria-label="다음 자전거"
                        onClick={() => setBikeIndex((index) => wrap(index + 1, showcaseBikes.length))}><ChevronRight aria-hidden="true" /></button>
                </div>
                <p className="home-showcase__count">{bikeIndex + 1} / {showcaseBikes.length}</p>
                <div className="home-showcase__bar">
                    <strong aria-live="polite">{currentBike.name}</strong>
                    <div className="home-showcase__colors" role="group" aria-label={`${currentBike.name} 색상`}>
                        {currentBike.colors.map(({ name, swatch }, index) => (
                            <button type="button" key={name} aria-label={name} aria-pressed={currentColorIndex === index}
                                style={{ background: swatch }} onClick={() => setBikeColors((selected) => ({ ...selected, [currentBike.id]: index }))} />
                        ))}
                    </div>
                    {currentBike.link.external
                        ? <a href={currentBike.link.href}>자세히 보기 <ArrowRight size={15} aria-hidden="true" /></a>
                        : <Link to={currentBike.link.href}>자세히 보기 <ArrowRight size={15} aria-hidden="true" /></Link>}
                </div>
            </section>

            <section className="home-ride-finder" aria-labelledby="ride-title">
                <img src={homeImages + "find-your-ride.webp"} alt="" loading="lazy" />
                <div>
                    <h2 id="ride-title">FIND YOUR RIDE</h2>
                    <p>라이딩 스타일에 맞는 자전거를 찾아보세요.</p>
                    <Link className="home-link" to="/bike-finder">AI 자전거 추천 받기 <ChevronRight size={17} aria-hidden="true" /></Link>
                </div>
            </section>

            <div className="home-sections">
                <section aria-labelledby="bike-components">
                    <p className="home-eyebrow">제품 소개</p>
                    <div className="home-section-heading">
                        <div><h2 id="bike-components">PRODUCT LIST</h2><p>라이딩을 완성하는 장비를 둘러보세요.</p></div>
                        <Link className="home-link" to={equipment}>전체 제품 보기 <ArrowRight size={16} aria-hidden="true" /></Link>
                    </div>
                    <ul className="home-components">
                        {parts.map(({ name, label, image }) => (
                            <li key={name}>
                                <Link to={equipment} aria-label={label + " 장비 둘러보기"}>
                                    <img src={image} alt="" loading="lazy" />
                                    <div><span><strong>{name}</strong><span>{label}</span></span><ArrowRight size={19} aria-hidden="true" /></div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="home-community" id="home-community" aria-labelledby="community-title">
                    <p className="home-eyebrow">라이더 커뮤니티</p>
                    <div className="home-section-heading">
                        <div><h2 id="community-title">RIDER COMMUNITY</h2><p>라이더들의 시승 후기와 라이딩 이야기를 만나보세요.</p></div>
                    </div>
                    <div className="home-community__carousel">
                        <div className="home-community__aside home-community__aside--previous" aria-hidden="true">
                            <img src={stories[wrap(storyIndex - 1, stories.length)].image} alt="" loading="lazy" />
                        </div>
                        <article className="home-community__featured">
                            <div className="home-community__story">
                                <div className="home-community__story-media">
                                    <img src={story.image} alt="" loading="lazy" />
                                    <Link className="home-community__story-badge" to="/community" aria-label={`${storyLabel} 후기 읽기`}>
                                        {storyLabel}
                                    </Link>
                                </div>
                                {story.caption && <p className="home-community__caption">{story.caption}</p>}
                                <h3>{story.title}</h3>
                                <p>{story.text}</p>
                                <Link className="home-community__read" to="/community">후기 읽기 <ArrowUpRight size={15} aria-hidden="true" /></Link>
                            </div>
                            <div className="home-community__bike">
                                <div className="home-community__bike-heading">
                                    <div>
                                        <h3>{story.bike.name}</h3>
                                        <p>{story.bike.specs.slice(0, 3).join(" · ")}</p>
                                    </div>
                                    {story.bike.url
                                        ? <a className="home-community__detail" href={story.bike.url}>모델 자세히 보기 <ChevronRight size={16} aria-hidden="true" /></a>
                                        : <Link className="home-community__detail" to={productDetail}>모델 자세히 보기 <ChevronRight size={16} aria-hidden="true" /></Link>}
                                </div>
                                <img src={story.bike.image} alt={story.bike.name} loading="lazy" />
                            </div>
                        </article>
                        <div className="home-community__aside home-community__aside--next" aria-hidden="true">
                            <img src={stories[wrap(storyIndex + 1, stories.length)].image} alt="" loading="lazy" />
                        </div>
                        <button className="home-carousel-button home-carousel-button--previous" type="button" aria-label="이전 라이딩 이야기"
                            onClick={() => setStoryIndex((index) => wrap(index - 1, stories.length))}><ChevronLeft aria-hidden="true" /></button>
                        <button className="home-carousel-button home-carousel-button--next" type="button" aria-label="다음 라이딩 이야기"
                            onClick={() => setStoryIndex((index) => wrap(index + 1, stories.length))}><ChevronRight aria-hidden="true" /></button>
                    </div>
                    <div className="home-community__progress">
                        <span aria-live="polite">{countText(storyIndex, stories.length)}</span>
                        <span aria-hidden="true" style={{ width: ((storyIndex + 1) / stories.length) * 100 + "%" }} />
                    </div>
                </section>

                <DealerFinder home />
            </div>
        </div>
    );
};

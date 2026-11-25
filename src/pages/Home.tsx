import { useRef, useState, type PointerEvent } from "react";
import { Link } from "react-router-dom";
import "../styles/pages/Home.scss";

const highlights = [
    {
        label: "3D 바이크 빌드",
        title: ["나만의 스페셜라이즈드,", "3D로 커스터마이징하세요"],
        description: ["프레임 컬러부터 주요 부품까지", "실시간 3D로 확인하며 나만의 라이드를 완성해보세요."],
        action: "S-LAB 시작하기",
        to: "/customize",
    },
    {
        label: "AI 바이크 어드바이저",
        title: ["내게 맞는 자전거를", "찾아보세요"],
        description: ["라이딩 목적과 취향을 바탕으로", "나에게 맞는 자전거를 추천받아 보세요."],
    },
    {
        label: "라이더 커뮤니티",
        title: ["함께 달리는", "라이더 커뮤니티"],
        description: ["라이더들의 시승 후기와", "다양한 라이딩 이야기를 만나보세요."],
        action: "커뮤니티 둘러보기",
        to: "/community",
    },
];

const featuredBikes = ["S-Works Tarmac SL9", "Tarmac SL9 S-Level", "Tarmac SL9 Comp"];
const components = [
    { id: "evade-4", name: "S-Works Evade 4 LTD", price: 450000 },
    { id: "ares-2", name: "S-Works Ares 2 LTD", price: 590000 },
    { id: "rapide", name: "S-Works Rapide", price: 420000 },
    { id: "terra-cl", name: "Roval Terra CL", price: 1900000 },
    { id: "terra-handlebar", name: "Roval Terra 핸들바", price: 380000 },
];
const won = new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" });

export const Home = () => {
    const [{ index: highlightIndex, direction }, setHighlight] = useState({ index: 0, direction: 1 });
    const swipeStart = useRef<{ id: number; x: number; y: number } | null>(null);
    const [bikeIndex, setBikeIndex] = useState(0);
    const [heroPaused, setHeroPaused] = useState(false);
    const [showGuide, setShowGuide] = useState(false);
    const highlight = highlights[highlightIndex];
    const visibleBikes = [-1, 0, 1].map(
        (offset) => featuredBikes[(bikeIndex + offset + featuredBikes.length) % featuredBikes.length],
    );
    const changeHighlight = (offset: number) =>
        setHighlight(({ index }) => ({
            index: (index + offset + highlights.length) % highlights.length,
            direction: Math.sign(offset),
        }));

    const startSwipe = (event: PointerEvent<HTMLDivElement>) => {
        if (!event.isPrimary || event.button !== 0 || (event.target as Element).closest("a, button")) return;
        swipeStart.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
        event.currentTarget.setPointerCapture(event.pointerId);
    };

    const finishSwipe = (event: PointerEvent<HTMLDivElement>) => {
        const start = swipeStart.current;
        if (!start || start.id !== event.pointerId) return;
        swipeStart.current = null;
        const x = event.clientX - start.x;
        const y = event.clientY - start.y;
        if (Math.abs(x) >= 45 && Math.abs(x) > Math.abs(y)) changeHighlight(x < 0 ? 1 : -1);
    };
    const changeBike = (offset: number) =>
        setBikeIndex((index) => (index + offset + featuredBikes.length) % featuredBikes.length);

    return (
        <div className="home">
            <section className="home-hero" aria-label="주요 서비스">
                <div className="home-hero__viewport" onPointerDown={startSwipe} onPointerUp={finishSwipe}
                    onLostPointerCapture={() => { swipeStart.current = null; }}>
                    <div className={`home-hero__content${direction < 0 ? " home-hero__content--previous" : ""}`} key={highlightIndex}>
                        <p>{highlight.label}</p>
                        <h1>{highlight.title[0]}<br />{highlight.title[1]}</h1>
                        <p className="home-hero__description">{highlight.description[0]}<br />{highlight.description[1]}</p>
                        <div className="home-hero__actions">
                            {highlight.to ? (
                                <Link className="home-link" to={highlight.to}>{highlight.action}</Link>
                            ) : (
                                <Link className="home-link" to="/bike-finder">자전거 추천 받기</Link>
                            )}
                            {highlightIndex === 0 && (
                                <button className="home-link home-link--outline" type="button"
                                    aria-expanded={showGuide} onClick={() => setShowGuide((open) => !open)}>
                                    커스터마이징 가이드
                                </button>
                            )}
                        </div>
                        {highlightIndex === 0 && showGuide && (
                            <p className="home-hero__description">S-LAB에서 모델을 선택한 뒤 컬러와 부품을 조합해보세요.</p>
                        )}
                    </div>
                </div>
                <div className="home-controls home-hero__controls">
                    <div className="home-hero__tabs">
                        {highlights.map(({ label }, index) => (
                            <button key={label} type="button" aria-pressed={index === highlightIndex}
                                onClick={() => changeHighlight(index - highlightIndex)}>
                                {index === highlightIndex && (
                                    <span className={`home-hero__progress${heroPaused ? " is-paused" : ""}`}
                                        aria-hidden="true" onAnimationEnd={() => changeHighlight(1)} />
                                )}
                                {label}
                            </button>
                        ))}
                    </div>
                    <div className="home-hero__playback">
                        <span aria-label={`전체 ${highlights.length}개 중 ${highlightIndex + 1}번째`}>
                            {String(highlightIndex + 1).padStart(2, "0")} / {String(highlights.length).padStart(2, "0")}
                        </span>
                        <button className="home-hero__pause" type="button" aria-label={heroPaused ? "자동 재생" : "일시정지"}
                            onClick={() => setHeroPaused((paused) => !paused)}>
                            <img src={`${import.meta.env.BASE_URL}images/icons/${heroPaused ? "play" : "pause"}.png`}
                                alt="" width={24} height={24} />
                        </button>
                    </div>
                </div>
            </section>

            <div className="home-sections">
                <section aria-labelledby="featured-bikes">
                    <div className="home-section-heading">
                        <h2 id="featured-bikes">자전거 제품 소개</h2>
                        <Link to="/products">전체보기 →</Link>
                    </div>
                    <div className="home-bike-window" aria-hidden="true">
                        <div className="home-bike-track">
                            {visibleBikes.map((bike) => (
                                <div key={bike} className="home-bike-media home-media">{bike}</div>
                            ))}
                        </div>
                    </div>
                    <div className="home-section-heading">
                        <h3 aria-live="polite">{featuredBikes[bikeIndex]}</h3>
                        <div className="home-controls">
                            <button type="button" aria-label="이전 자전거" onClick={() => changeBike(-1)}>‹</button>
                            <button type="button" aria-label="다음 자전거" onClick={() => changeBike(1)}>›</button>
                        </div>
                    </div>
                </section>

                <section aria-labelledby="bike-components">
                    <div className="home-section-heading">
                        <h2 id="bike-components">Bike components</h2>
                    </div>
                    <ul className="home-components">
                        {components.map(({ id, name, price }) => (
                            <li key={id}>
                                <div className="home-media" aria-hidden="true" />
                                <h3>{name}</h3>
                                <p>{won.format(price)}</p>
                                <Link to={`/products/${id}`} aria-label={`${name} 보기`}>View →</Link>
                            </li>
                        ))}
                    </ul>
                    <div className="home-component-actions">
                        <Link className="home-link" to="/products">VIEW ALL →</Link>
                    </div>
                </section>

                <section className="home-ride-finder" id="ride-finder" aria-labelledby="ride-title">
                    <h2 id="ride-title">FIND YOUR RIDE</h2>
                    <p>AI를 통해 나에게 딱 맞는 자전거를 추천받아 보세요.</p>
                    <Link className="home-link" to="/bike-finder">AI 자전거 추천 받기</Link>
                </section>

                <section className="home-community" aria-labelledby="community-title">
                    <div>
                        <h2 id="community-title">라이더 커뮤니티</h2>
                        <p>라이더들의 시승 후기와 라이딩 이야기를 만나보세요.</p>
                        <Link className="home-link" to="/community">커뮤니티 둘러보기</Link>
                    </div>
                    <div className="home-media" aria-hidden="true" />
                </section>

                <section className="home-dealers" aria-labelledby="dealer-title">
                    <h2 id="dealer-title">대리점 찾기 · 시승 예약</h2>
                    <div className="home-dealer-actions">
                        <Link className="home-link" to="/dealers">대리점 찾기</Link>
                        <Link className="home-link" to="/dealers/reserve">시승 예약</Link>
                    </div>
                </section>
            </div>
        </div>
    );
};

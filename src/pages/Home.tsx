import { useState } from "react";
import { Link } from "react-router-dom";
import "./Home.scss";

const highlights = [
    {
        label: "3D 바이크 빌드",
        title: "나만의 스페셜라이즈드를 만들어 보세요",
        action: "S-LAB 시작하기",
        to: "/customize",
    },
    {
        label: "AI 바이크 어드바이저",
        title: "FIND YOUR RIDE",
    },
    {
        label: "라이더 커뮤니티",
        title: "함께 달리는 라이더 커뮤니티",
        action: "커뮤니티 둘러보기",
        to: "/community",
    },
];

const featuredBikes = ["S-Works Tarmac SL9", "Tarmac SL9 S-Level", "Tarmac SL9 Comp"];
const components = ["S-Works Evade 4 LTD", "S-Works Ares 2 LTD", "S-Works Rapide", "Roval Terra CL", "Roval Terra 핸들바"];

export const Home = () => {
    const [highlightIndex, setHighlightIndex] = useState(0);
    const [bikeIndex, setBikeIndex] = useState(0);
    const highlight = highlights[highlightIndex];
    const changeHighlight = (offset: number) =>
        setHighlightIndex((index) => (index + offset + highlights.length) % highlights.length);
    const changeBike = (offset: number) =>
        setBikeIndex((index) => (index + offset + featuredBikes.length) % featuredBikes.length);

    return (
        <div className="home">
            <section className="home-hero" aria-label="주요 서비스">
                <div className="home-hero__content" aria-live="polite">
                    <p>{highlight.label}</p>
                    <h1>{highlight.title}</h1>
                    {highlight.to ? (
                        <Link className="home-link" to={highlight.to}>{highlight.action}</Link>
                    ) : (
                        <a className="home-link" href="#ride-finder">추천 서비스 안내</a>
                    )}
                </div>
                <div className="home-controls">
                    {highlights.map(({ label }, index) => (
                        <button key={label} type="button" aria-pressed={index === highlightIndex}
                            onClick={() => setHighlightIndex(index)}>{label}</button>
                    ))}
                    <button type="button" aria-label="이전 히어로" onClick={() => changeHighlight(-1)}>‹</button>
                    <button type="button" aria-label="다음 히어로" onClick={() => changeHighlight(1)}>›</button>
                </div>
            </section>

            <div className="home-sections">
                <section aria-labelledby="featured-bikes">
                    <div className="home-section-heading">
                        <h2 id="featured-bikes">자전거 제품 소개</h2>
                        <Link to="/products">전체보기 →</Link>
                    </div>
                    <div className="home-bike-media home-media" aria-hidden="true" />
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
                        {components.map((name) => (
                            <li key={name}>
                                <div className="home-media" aria-hidden="true" />
                                <h3>{name}</h3>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="home-ride-finder" id="ride-finder" aria-labelledby="ride-title">
                    <h2 id="ride-title">FIND YOUR RIDE</h2>
                    <p>AI 자전거 추천 서비스 준비 중</p>
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

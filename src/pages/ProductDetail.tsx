import { useRef, useState, type PointerEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { Search, ShoppingCart, Store, Truck } from "lucide-react";
import "../styles/pages/ProductDetail.scss";

const views = ["측면", "정면", "후면", "구동계", "콕핏", "휠"];
const colors = ["Gloss Ruby Metallic / White Silver Metallic", "Gloss White / Black"];
const sizes = [44, 49, 52, 54, 56, 58, 61];
const specs = [
    ["용도", "로드 · 레이스"],
    ["프레임", "S-Works Tarmac SL9 FACT 12r Carbon"],
    ["휠", "Roval Rapide CLX III"],
    ["콕핏", "Roval Rapide Cockpit 일체형 바/스템"],
    ["구동계", "SRAM RED AXS E1 12단"],
    ["무게", "6.6 kg"],
];
const features = [
    ["구동계", "SRAM RED AXS E1 구동계"],
    ["콕핏", "Roval Rapide 콕핏 (일체형 바/스템)"],
    ["휠", "Roval Rapide CLX III 휠"],
];
const geometry = ["스택", "리치", "탑튜브 길이", "헤드튜브 각도", "시트튜브 각도", "스탠드오버"];

export const ProductDetail = () => {
    const { id } = useParams();
    if (id !== "4293533") return <div className="product-detail">상품 상세를 준비 중이에요.</div>;
    return <TarmacDetail />;
};

const TarmacDetail = () => {
    const [{ view, direction }, setGallery] = useState({ view: 0, direction: 0 });
    const [color, setColor] = useState(0);
    const [size, setSize] = useState(54);
    const [delivery, setDelivery] = useState("집으로 수령");
    const [status, setStatus] = useState("");
    const swipe = useRef<{ id: number; x: number; y: number } | null>(null);
    const zoom = useRef<HTMLDialogElement>(null);
    const specsPanel = useRef<HTMLDetailsElement>(null);
    const geometryPanel = useRef<HTMLDetailsElement>(null);

    const move = (offset: number) => setGallery(({ view: current }) => ({
        view: (current + offset + views.length) % views.length,
        direction: Math.sign(offset),
    }));
    const startSwipe = (event: PointerEvent<HTMLDivElement>) => {
        if (!event.isPrimary || event.button !== 0) return;
        swipe.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
        event.currentTarget.setPointerCapture(event.pointerId);
    };

    const finishSwipe = (event: PointerEvent<HTMLDivElement>) => {
        const start = swipe.current;
        if (!start || start.id !== event.pointerId) return;
        swipe.current = null;
        const x = event.clientX - start.x;
        const y = event.clientY - start.y;
        if (Math.abs(x) >= 40 && Math.abs(x) > Math.abs(y)) move(x < 0 ? 1 : -1);
    };

    const showGeometry = () => {
        if (geometryPanel.current) geometryPanel.current.open = true;
        geometryPanel.current?.scrollIntoView();
    };

    return (
        <article className="product-detail">
            <section className="product-gallery" aria-label="상품 이미지">
                <div className="product-gallery__image"
                    onPointerDown={startSwipe} onPointerUp={finishSwipe}
                    onLostPointerCapture={(event) => {
                        if (swipe.current?.id === event.pointerId) swipe.current = null;
                    }}>
                    <div className={`product-placeholder${direction ? " product-gallery__slide" : ""}${direction < 0 ? " product-gallery__slide--previous" : ""}`} key={view}>
                        <span aria-live="polite">S-Works Tarmac SL9 · {views[view]} · {colors[color]}</span>
                    </div>
                </div>
                <button className="product-gallery__zoom" type="button" aria-label="이미지 확대" onClick={() => zoom.current?.showModal()}>
                    <Search size={20} />
                </button>
                <button className="product-gallery__previous" type="button" aria-label="이전 이미지" onClick={() => move(-1)}>‹</button>
                <button className="product-gallery__next" type="button" aria-label="다음 이미지" onClick={() => move(1)}>›</button>
                <div className="product-gallery__controls">
                    <span>{String(view + 1).padStart(2, "0")} / 06</span>
                    <div aria-label="이미지 보기 선택">
                        {views.map((label, index) => (
                            <button key={label} type="button" aria-pressed={view === index} onClick={() => move(index - view)}>{label}</button>
                        ))}
                    </div>
                </div>
            </section>
            <dialog className="product-detail__dialog" ref={zoom} aria-label="확대 이미지">
                <form method="dialog"><button>닫기 ×</button></form>
                <div className="product-placeholder">{views[view]} 이미지 준비 중</div>
            </dialog>

            <section className="product-order" aria-labelledby="product-name">
                <div className="product-order__heading">
                    <div>
                        <span className="product-order__badge">S-Works</span>
                        <h1 id="product-name">S-Works Tarmac SL9</h1>
                        <p>스램 레드 AXS</p>
                    </div>
                    <div className="product-order__price"><strong>₩ 00,000,000</strong><small>가격 준비 중</small></div>
                </div>
                <div className="product-options">
                    <div>
                        <h3>컬러</h3>
                        <p>{colors[color]}</p>
                        <div className="product-options__choices">
                            {colors.map((label, index) => (
                                <button key={label} type="button" className="product-placeholder product-options__swatch"
                                    aria-label={label} aria-pressed={color === index} onClick={() => setColor(index)} />
                            ))}
                        </div>
                    </div>
                    <div>
                        <div className="product-options__heading">
                            <h3>사이즈</h3>
                            <button type="button" onClick={showGeometry}>사이즈 가이드</button>
                        </div>
                        <div className="product-options__choices product-options__sizes">
                            {sizes.map((value) => (
                                <button key={value} type="button" aria-pressed={value === size} onClick={() => setSize(value)}>{value}</button>
                            ))}
                        </div>
                        <button className="product-options__size-guide" type="button" onClick={showGeometry}>내 사이즈 찾아보기</button>
                    </div>
                    <fieldset>
                        <legend>배송 방법</legend>
                        {["집으로 수령", "매장 수령"].map((method, index) => {
                            const Icon = index === 0 ? Truck : Store;
                            return (
                                <label key={method}>
                                    <input type="radio" name="product-delivery" checked={delivery === method} onChange={() => setDelivery(method)} />
                                    <Icon size={19} /><span>{method}</span>
                                </label>
                            );
                        })}
                    </fieldset>
                    <div className="product-options__purchase">
                        <h3>선택 요약</h3>
                        <p>{color === 0 ? "Ruby / White" : "White / Black"} · {size} · {delivery}</p>
                        <button type="button" onClick={() => setStatus("장바구니 기능은 준비 중이에요.")}><ShoppingCart size={17} />장바구니 담기</button>
                        <button type="button" onClick={() => setStatus("구매 기능은 준비 중이에요.")}>바로 구매</button>
                        {status && <p role="status">{status}</p>}
                    </div>
                </div>
            </section>

            <section className="product-intro" aria-labelledby="product-intro-title">
                <p>제품 소개</p>
                <h2 id="product-intro-title">레이스를 위한 S-Works Tarmac SL9</h2>
                <p>경량 프레임과 레이스용 구동계, 휠, 콕핏 구성을 살펴보세요.</p>
                <div className="product-features">
                    {features.map(([label, title]) => (
                        <div key={label}>
                            <div className="product-placeholder">디테일 사진 · {label}</div>
                            <h3>{title}</h3>
                        </div>
                    ))}
                </div>
            </section>
            <section className="product-specs" aria-labelledby="product-specs-title">
                <div className="product-options__heading">
                    <h2 id="product-specs-title">한눈에 보는 주요 스펙</h2>
                    <button type="button" onClick={() => {
                        if (specsPanel.current) specsPanel.current.open = true;
                        specsPanel.current?.scrollIntoView();
                    }}>전체 스펙 보기 ↓</button>
                </div>
                <dl className="product-specs__grid">
                    {specs.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
                </dl>
                <p className="product-specs__note">스펙과 수치는 와이어프레임용 예시입니다.</p>
                <details ref={specsPanel}>
                    <summary>상세 스펙</summary>
                    <dl>{specs.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
                </details>
                <details ref={geometryPanel} open>
                    <summary>사이즈 · 지오메트리</summary>
                    <div className="product-specs__table">
                        <table aria-label="사이즈별 지오메트리">
                            <thead><tr><th scope="col">사이즈</th>{sizes.map((value) => <th scope="col" key={value} className={value === size ? "is-selected" : undefined}>{value}</th>)}</tr></thead>
                            <tbody>{geometry.map((label) => (
                                <tr key={label}><th scope="row">{label}</th>{sizes.map((value) => <td key={value} className={value === size ? "is-selected" : undefined}>—</td>)}</tr>
                            ))}</tbody>
                        </table>
                    </div>
                    <p className="product-specs__note">선택 사이즈 {size} · 상세 치수 준비 중</p>
                </details>
                <details>
                    <summary>라이더 지원 · 보증 · 안전 안내</summary>
                    <Link to="/support">고객센터에서 확인하기 →</Link>
                </details>
            </section>
        </article>
    );
};

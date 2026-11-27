import { useLayoutEffect, useRef, useState, type PointerEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowDownToLine, ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import {
    bannerImage, colors, features, frames, geometry, gradeLabels, grades, highlights, listPrice,
    manualUrl, modelName, officialProductUrl, sizes, specifications,
} from "./productTarmac";
import "../styles/pages/ProductDetail.scss";

const won = new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" });

export const ProductDetail = () => {
    const { id } = useParams();
    if (id !== "4293533") return <div className="product-detail product-detail__content">상품 상세를 준비 중이에요.</div>;
    return <TarmacDetail />;
};

function TarmacDetail() {
    const [{ color, view, direction, previousView }, setGallery] = useState({
        color: 0, view: 0, direction: 0, previousView: null as number | null,
    });
    const [size, setSize] = useState<number | null>(null);
    const [purchaseStatus, setPurchaseStatus] = useState("");
    const swipe = useRef<{ id: number; x: number; y: number } | null>(null);
    const zoom = useRef<HTMLDialogElement>(null);
    const specsPanel = useRef<HTMLDetailsElement>(null);
    const geometryPanel = useRef<HTMLDetailsElement>(null);
    const { name: colorName, gallery, purchaseUrl } = colors[color];
    const selected = gallery[view];
    const hasMultipleViews = gallery.length > 1;
    const selectedPhotoName = [modelName, colorName, selected.label].join(" · ");

    useLayoutEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const moveGallery = (offset: number) => {
        if (!offset || !hasMultipleViews) return;
        setGallery((current) => ({
            ...current,
            previousView: current.view,
            view: (current.view + offset + gallery.length) % gallery.length,
            direction: Math.sign(offset),
        }));
    };

    const startSwipe = (event: PointerEvent<HTMLDivElement>) => {
        if (!hasMultipleViews || !event.isPrimary || event.button !== 0) return;
        swipe.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
        event.currentTarget.setPointerCapture(event.pointerId);
    };

    const finishSwipe = (event: PointerEvent<HTMLDivElement>) => {
        const start = swipe.current;
        if (!start || start.id !== event.pointerId) return;
        swipe.current = null;
        const x = event.clientX - start.x;
        const y = event.clientY - start.y;
        if (Math.abs(x) >= 40 && Math.abs(x) > Math.abs(y)) moveGallery(x < 0 ? 1 : -1);
    };

    const showPanel = (panel: HTMLDetailsElement | null) => {
        if (!panel) return;
        panel.open = true;
        panel.scrollIntoView();
    };

    return (
        <article className="product-detail">
            <div className="product-detail__hero">
                <section className="product-gallery" aria-label="상품 이미지">
                    <header className="product-gallery__heading">
                        <span>S-Works</span>
                        <h1 id="product-name">{modelName}</h1>
                        <p>로드 레이스를 위한 한 대</p>
                    </header>

                    <div className="product-gallery__image" data-swipe={hasMultipleViews} data-direction={direction}
                        onPointerDown={startSwipe} onPointerUp={finishSwipe}
                        onPointerCancel={() => { swipe.current = null; }}
                        onLostPointerCapture={(event) => {
                            if (swipe.current?.id === event.pointerId) swipe.current = null;
                        }}>
                        {previousView !== null && (
                            <img className="product-gallery__outgoing" key={gallery[previousView].image + "-outgoing"}
                                src={gallery[previousView].image} alt="" aria-hidden="true" width={1440} height={810} draggable={false} />
                        )}
                        <img className={previousView === null ? undefined : "product-gallery__slide"}
                            onAnimationEnd={() => setGallery((current) =>
                                current.color === color && current.view === view ? { ...current, previousView: null } : current)}
                            key={selected.image} src={selected.image} alt={selectedPhotoName}
                            width={1440} height={810} fetchPriority="high" draggable={false} />
                    </div>

                    <button className="product-gallery__zoom" type="button" aria-label="이미지 확대" onClick={() => zoom.current?.showModal()}>
                        <Search size={20} aria-hidden="true" />
                    </button>
                    {hasMultipleViews && (
                        <>
                            <button className="product-gallery__previous" type="button" aria-label="이전 이미지" onClick={() => moveGallery(-1)}><ChevronLeft aria-hidden="true" /></button>
                            <button className="product-gallery__next" type="button" aria-label="다음 이미지" onClick={() => moveGallery(1)}><ChevronRight aria-hidden="true" /></button>
                        </>
                    )}
                    <div className="product-gallery__controls" role="group" aria-label="갤러리 사진 선택">
                        {gallery.map(({ label, thumbnail }, index) => (
                            <button key={label} type="button" aria-label={label} aria-pressed={view === index} onClick={() => moveGallery(index - view)}>
                                <img src={thumbnail} alt="" width={104} height={59} />
                            </button>
                        ))}
                    </div>
                </section>

                <dialog className="product-detail__dialog" ref={zoom} aria-label="확대 이미지">
                    <form method="dialog"><button aria-label="확대 이미지 닫기"><X size={22} aria-hidden="true" /></button></form>
                    <img src={selected.image} alt={selectedPhotoName} width={1440} height={810} />
                </dialog>

            </div>

            <section className="product-order product-detail__content" aria-labelledby="product-name">
                <div className="product-options">
                    <div>
                        <div className="product-options__heading"><h2>컬러</h2><p>{colorName}</p></div>
                        <div className="product-options__choices">
                            {colors.map(({ name, swatch }, index) => (
                                <button key={name} type="button" className="product-options__swatch"
                                    aria-label={name} aria-pressed={color === index} style={{ background: swatch }}
                                        onClick={() => { setGallery({ color: index, view: 0, direction: 0, previousView: null }); setPurchaseStatus(""); }} />
                            ))}
                        </div>
                    </div>
                    <div className="product-options__size">
                        <div className="product-options__heading">
                            <h2>사이즈</h2>
                            <button type="button" className="product-options__guide" onClick={() => showPanel(geometryPanel.current)}>사이즈 가이드</button>
                        </div>
                        <div className="product-options__choices product-options__sizes">
                            {sizes.map((value) => (
                                <button key={value} type="button" disabled={value === 61} aria-pressed={value === size}
                                    onClick={() => { setSize(value); setPurchaseStatus(""); }}>{value}</button>
                            ))}
                        </div>
                    </div>
                    <div className="product-order__price">
                        <strong>{won.format(listPrice)}</strong>
                        <a href="#product-reviews">라이더 구매 후기</a>
                    </div>
                </div>
                <div className="product-fulfillment">
                    <fieldset>
                        <legend>배송 방법</legend>
                        <div className="product-fulfillment__choices">
                            <button type="button" disabled>집으로 수령</button>
                            <button type="button" aria-pressed="true">매장 수령</button>
                        </div>
                    </fieldset>
                    <div className="product-fulfillment__store">
                        <div><strong>대리점에서 수령하기</strong><p>매장별 재고와 수령 가능 여부를 확인해 보세요.</p></div>
                        <Link to="/dealers">가까운 매장 찾기</Link>
                    </div>
                </div>
                <div className="product-purchase">
                    <div><h2>선택 요약</h2><p>{colorName} / {size ?? "사이즈 미선택"} / 매장 수령</p></div>
                    <div className="product-purchase__actions">
                        <button type="button" disabled={size === null}
                            onClick={() => setPurchaseStatus("이 상품의 장바구니 연동을 준비 중이에요.")}>장바구니 담기</button>
                        {size === null
                            ? <button type="button" disabled>바로 구매</button>
                            : <a href={purchaseUrl} target="_blank" rel="noreferrer">공식몰에서 구매</a>}
                    </div>
                    {purchaseStatus && <p className="product-purchase__status" role="status">{purchaseStatus}</p>}
                </div>
            </section>

            <div className="product-detail__content product-detail__sections">
                <section className="product-story" aria-labelledby="product-story-title">
                    <img src={bannerImage} alt="" loading="lazy" width={1500} height={844} />
                    <div>
                        <h2 id="product-story-title">중요한 순간을 위한 에어로</h2>
                        <p>Tarmac SL9은 바람을 가르는 프레임과 빠르게 반응하는 핸들링으로 레이스의 결정적인 순간을 돕습니다.</p>
                    </div>
                </section>

                <section aria-labelledby="product-features-title">
                    <h2 id="product-features-title">타막 SL9의 주요 기술</h2>
                    <div className="product-features">
                        {features.map(({ title, text, image }) => (
                            <article key={title}>
                                <img src={image} alt="" loading="lazy" />
                                <div><h3>{title}</h3><p>{text}</p></div>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="product-specs" aria-labelledby="product-specs-title">
                    <div className="product-specs__heading">
                        <h2 id="product-specs-title">한눈에 보는 주요 스펙</h2>
                        <button type="button" onClick={() => showPanel(specsPanel.current)}>전체 스펙 보기</button>
                    </div>
                    <dl className="product-specs__grid">
                        {highlights.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
                    </dl>
                    <details ref={specsPanel}>
                        <summary>상세 스펙</summary>
                        <dl>{specifications.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
                    </details>
                    <details ref={geometryPanel} open>
                        <summary>지오메트리</summary>
                        <div className="product-specs__table" tabIndex={0} role="region" aria-label="사이즈별 지오메트리">
                            <table>
                                <thead><tr><th scope="col">사이즈</th>{sizes.map((value) => <th scope="col" key={value} data-selected={value === size}>{value}</th>)}</tr></thead>
                                <tbody>{geometry.map(({ label, values }) => (
                                    <tr key={label}><th scope="row">{label}</th>{values.map((value, index) => <td key={sizes[index]} data-selected={sizes[index] === size}>{value}</td>)}</tr>
                                ))}</tbody>
                            </table>
                        </div>
                    </details>
                    <details>
                        <summary>기술적 특징</summary>
                        <dl>{features.map(({ title, text }) => <div key={title}><dt>{title}</dt><dd>{text}</dd></div>)}</dl>
                    </details>
                    <div className="product-specs__manual">
                        <strong>설명서 다운로드</strong>
                        <a href={manualUrl} target="_blank" rel="noreferrer">한국어 사용 설명서 <ArrowDownToLine size={15} aria-hidden="true" /></a>
                    </div>
                </section>

                <section aria-labelledby="product-grades-title">
                    <h2 id="product-grades-title">타막 SL9 완성차 등급 비교</h2>
                    <div className="product-grades">
                        {grades.map(({ name, price, image, specs, url }) => (
                            <article key={name} data-current={!url}>
                                <img src={image} alt="" loading="lazy" width={800} height={450} />
                                <div>
                                    {url ? <h3><a href={url} target="_blank" rel="noreferrer">{name}</a></h3> : <h3>{name} <small>보는 중</small></h3>}
                                    <p>{won.format(price)}</p>
                                    <dl>{gradeLabels.map((label, index) => <div key={label}><dt>{label}</dt><dd>{specs[index]}</dd></div>)}</dl>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                <section aria-labelledby="product-frames-title">
                    <h2 id="product-frames-title">타막 SL9 프레임셋</h2>
                    <div className="product-frames">
                        {frames.map(({ name, detail, price, image, url }) => (
                            <a key={url} href={url} target="_blank" rel="noreferrer">
                                <img src={image} alt="" loading="lazy" width={680} height={680} />
                                <h3>{name}</h3>
                                <p>{detail}</p>
                                <strong>{won.format(price)}</strong>
                            </a>
                        ))}
                    </div>
                </section>
                <section id="product-reviews" aria-labelledby="product-reviews-title">
                    <h2 id="product-reviews-title">라이더 구매 후기</h2>
                    <div className="product-reviews">
                        <p>스페셜라이즈드 공식몰에서 이 모델의 구매 후기를 확인할 수 있어요.</p>
                        <a href={officialProductUrl} target="_blank" rel="noreferrer">공식 구매 후기 보기</a>
                    </div>
                </section>
            </div>
        </article>
    );
}

import { useRef, type RefObject } from "react";
import { ArrowDownToLine } from "lucide-react";
import { won } from "../../data/products";
import type { ProductDetailData, ProductSize } from "../../data/productTypes";

type ProductDetailSectionsProps = {
    page: ProductDetailData;
    size: ProductSize | null;
    geometryPanel: RefObject<HTMLDetailsElement | null>;
};

export function ProductDetailSections({ page, size, geometryPanel }: ProductDetailSectionsProps) {
    const { story, features, highlights, specifications, geometry, manual, grades, frames, reviews } = page;
    const specsPanel = useRef<HTMLDetailsElement>(null);
    const hasSpecifications = specifications?.length || geometry?.rows.length || manual;
    if (!story && !features?.items.length && !highlights?.length && !hasSpecifications && !grades?.items.length && !frames?.items.length && !reviews) return null;

    const showSpecifications = () => {
        if (!specsPanel.current) return;
        specsPanel.current.open = true;
        specsPanel.current.scrollIntoView();
    };

    return (
        <div className="product-detail__content product-detail__sections">
            {story && (
                <section className="product-story" aria-labelledby="product-story-title">
                    <img src={story.image} alt="" loading="lazy" width={1500} height={844} />
                    <div><h2 id="product-story-title">{story.title}</h2><p>{story.description}</p></div>
                </section>
            )}

            {!!features?.items.length && (
                <section aria-labelledby="product-features-title">
                    <h2 id="product-features-title">{features.title}</h2>
                    <div className="product-features">
                        {features.items.map(({ title, text, image }) => (
                            <article key={title}>
                                <img src={image} alt="" loading="lazy" />
                                <div><h3>{title}</h3><p>{text}</p></div>
                            </article>
                        ))}
                    </div>
                </section>
            )}

            {(!!highlights?.length || hasSpecifications) && (
                <section className="product-specs" aria-labelledby="product-specs-title">
                    <div className="product-specs__heading">
                        <h2 id="product-specs-title">한눈에 보는 주요 스펙</h2>
                        {!!specifications?.length && <button type="button" onClick={showSpecifications}>전체 스펙 보기</button>}
                    </div>
                    {!!highlights?.length && (
                        <dl className="product-specs__grid">
                            {highlights.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
                        </dl>
                    )}
                    {!!specifications?.length && (
                        <details ref={specsPanel}>
                            <summary>상세 스펙</summary>
                            <dl>{specifications.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
                        </details>
                    )}
                    {!!geometry?.rows.length && (
                        <details ref={geometryPanel} open>
                            <summary>지오메트리</summary>
                            <div className="product-specs__table" tabIndex={0} role="region" aria-label="사이즈별 지오메트리">
                                <table>
                                    <thead><tr><th scope="col">사이즈</th>{geometry.sizes.map((value) => <th scope="col" key={value} data-selected={value === size}>{value}</th>)}</tr></thead>
                                    <tbody>{geometry.rows.map(({ label, values }) => (
                                        <tr key={label}>
                                            <th scope="row">{label}</th>
                                            {geometry.sizes.map((value, index) => <td key={value} data-selected={value === size}>{values[index] ?? "—"}</td>)}
                                        </tr>
                                    ))}</tbody>
                                </table>
                            </div>
                        </details>
                    )}
                    {!!features?.items.length && (
                        <details>
                            <summary>기술적 특징</summary>
                            <dl>{features.items.map(({ title, text }) => <div key={title}><dt>{title}</dt><dd>{text}</dd></div>)}</dl>
                        </details>
                    )}
                    {manual && (
                        <div className="product-specs__manual">
                            <strong>설명서 다운로드</strong>
                            <a href={manual.url} target="_blank" rel="noreferrer">{manual.label} <ArrowDownToLine size={15} aria-hidden="true" /></a>
                        </div>
                    )}
                </section>
            )}

            {!!grades?.items.length && (
                <section aria-labelledby="product-grades-title">
                    <h2 id="product-grades-title">{grades.title}</h2>
                    <div className="product-grades">
                        {grades.items.map(({ name, price, image, specs, url }) => (
                            <article key={name} data-current={!url}>
                                <img src={image} alt="" loading="lazy" width={800} height={450} />
                                <div>
                                    {url ? <h3><a href={url} target="_blank" rel="noreferrer">{name}</a></h3> : <h3>{name} <small>보는 중</small></h3>}
                                    <p>{won.format(price)}</p>
                                    <dl>{grades.labels.map((label, index) => <div key={label}><dt>{label}</dt><dd>{specs[index] ?? "—"}</dd></div>)}</dl>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            )}

            {!!frames?.items.length && (
                <section aria-labelledby="product-frames-title">
                    <h2 id="product-frames-title">{frames.title}</h2>
                    <div className="product-frames">
                        {frames.items.map(({ name, detail, price, image, url }) => (
                            <a key={url} href={url} target="_blank" rel="noreferrer">
                                <img src={image} alt="" loading="lazy" width={680} height={680} />
                                <h3>{name}</h3>
                                <p>{detail}</p>
                                <strong>{won.format(price)}</strong>
                            </a>
                        ))}
                    </div>
                </section>
            )}
            {reviews && (
                <section id="product-reviews" aria-labelledby="product-reviews-title">
                    <h2 id="product-reviews-title">라이더 구매 후기</h2>
                    <div className="product-reviews">
                        <p>{reviews.label}에서 이 모델의 구매 후기를 확인할 수 있어요.</p>
                        <a href={reviews.url} target="_blank" rel="noreferrer">공식 구매 후기 보기</a>
                    </div>
                </section>
            )}
        </div>
    );
}

import { useLayoutEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ProductGallery } from "../components/products/ProductGallery";
import { ProductDetailSections } from "../components/products/ProductDetailSections";
import { products, won } from "../data/products";
import type { Product, ProductSize } from "../data/productTypes";
import { NotFound } from "./NotFound";
import "../styles/pages/ProductDetail.scss";

export function ProductDetail() {
    const { id } = useParams();
    const product = products.find((entry) => entry.id === id);

    return product ? <ProductDetailView key={product.id} product={product} /> : <NotFound />;
}

function ProductDetailView({ product }: { product: Product }) {
    const page = product.page;
    const colors = page?.colors ?? [];
    const sizes = page?.sizes ?? [];
    const [colorIndex, setColorIndex] = useState(0);
    const [galleryVersion, setGalleryVersion] = useState(0);
    const [size, setSize] = useState<ProductSize | null>(null);
    const [purchaseStatus, setPurchaseStatus] = useState("");
    const geometryPanel = useRef<HTMLDetailsElement>(null);
    const color = colors[colorIndex];
    const gallery = color?.gallery ?? page?.gallery ?? (product.image ? [{ label: "제품 사진", image: product.image }] : []);
    const purchaseUrl = color?.purchaseUrl ?? page?.purchaseUrl;
    const needsSize = sizes.length > 0 && size === null;
    const summary = [color?.name, sizes.length ? size ?? "사이즈 미선택" : null, page?.pickupOnly ? "매장 수령" : null]
        .filter((value) => value != null).join(" / ");

    useLayoutEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const showGeometry = () => {
        if (!geometryPanel.current) return;
        geometryPanel.current.open = true;
        geometryPanel.current.scrollIntoView();
    };

    return (
        <article className="product-detail">
            <ProductGallery key={galleryVersion} name={product.name} subtitle={page?.subtitle ?? product.detail ?? product.category}
                badge={page?.badge} colorName={color?.name} gallery={gallery} />

            <section className="product-order product-detail__content" aria-labelledby="product-name">
                <div className="product-options">
                    {color && (
                        <div>
                            <div className="product-options__heading"><h2>컬러</h2><p>{color.name}</p></div>
                            <div className="product-options__choices">
                                {colors.map(({ name, swatch }, index) => (
                                    <button key={name} type="button" className="product-options__swatch"
                                        aria-label={name} aria-pressed={colorIndex === index} style={{ background: swatch }}
                                        onClick={() => {
                                            setColorIndex(index);
                                            setGalleryVersion((current) => current + 1);
                                            setPurchaseStatus("");
                                        }} />
                                ))}
                            </div>
                        </div>
                    )}
                    {sizes.length > 0 && (
                        <div className="product-options__size">
                            <div className="product-options__heading">
                                <h2>사이즈</h2>
                                {!!page?.geometry?.rows.length && <button type="button" className="product-options__guide" onClick={showGeometry}>사이즈 가이드</button>}
                            </div>
                            <div className="product-options__choices product-options__sizes">
                                {sizes.map(({ value, available }) => (
                                    <button key={value} type="button" disabled={available === false} aria-pressed={value === size}
                                        onClick={() => { setSize(value); setPurchaseStatus(""); }}>{value}</button>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="product-order__price">
                        <strong>{won.format(product.price)}</strong>
                        {page?.reviews && <a href="#product-reviews">라이더 구매 후기</a>}
                    </div>
                </div>
                {page?.pickupOnly && (
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
                )}
                {(summary || purchaseUrl) && (
                    <div className="product-purchase">
                        {summary ? <div><h2>선택 요약</h2><p>{summary}</p></div> : <div><h2>구매 안내</h2></div>}
                        <div className="product-purchase__actions">
                            {page?.pickupOnly && (
                                <button type="button" disabled={needsSize}
                                    onClick={() => setPurchaseStatus("이 상품의 장바구니 연동을 준비 중이에요.")}>장바구니 담기</button>
                            )}
                            {purchaseUrl && (needsSize
                                ? <button type="button" disabled>바로 구매</button>
                                : <a href={purchaseUrl} target="_blank" rel="noreferrer">공식몰에서 구매</a>)}
                        </div>
                        {purchaseStatus && <p className="product-purchase__status" role="status">{purchaseStatus}</p>}
                    </div>
                )}
            </section>

            {page && <ProductDetailSections page={page} size={size} geometryPanel={geometryPanel} />}
        </article>
    );
}

import { useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Check, SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "../components/products/ProductCard";
import { bikes, equipment, formatProductPrice } from "../data/products";
import type { Product } from "../data/productTypes";
import "../styles/pages/catalog/Products.scss";

const sorts = ["추천순", "인기순", "가격 낮은 순", "가격 높은 순", "최신순"] as const;
type Sort = typeof sorts[number];
const pageSize = 12;
const comparisonLimit = 3;

const filterGroups = [
    { label: "그룹", options: ["자전거", "E-Bikes", "프레임셋"] },
    { label: "모델", options: ["Aethos", "Allez", "Crux", "Diverge", "Tarmac", "Roubaix", "Chisel", "Stumpjumper", "Jett", "Sirrus", "Hotwalk", "Turbo Vado"], limit: 5 },
    { label: "자전거 연식", options: ["S-Works", "S-Level", "Pro", "Expert", "Elite", "Comp", "Sport"], limit: 5 },
    { label: "사이즈", options: ["XS", "S", "M", "L", "XL", "44", "49", "52", "54", "56", "58", "61"], limit: 8, style: "size" },
    { label: "컬러", options: ["검은색", "파란색", "갈색", "녹색", "회색", "주황색", "보라", "빨간색", "하얀색", "노란색", "중립적"], style: "color" },
    { label: "소재", options: ["카본", "알루미늄"] },
    { label: "구동계", options: ["스램", "시마노", "마이크로시프트"], key: "브랜드" },
    { label: "가격", options: ["₩200,000–499,999", "₩500,000–999,999", "₩1,000,000–2,499,999", "₩2,500,000–4,999,999", "₩5,000,000–9,999,999", "₩10,000,000 이상"], limit: 5 },
];

const swatches = ["#222", "#28558c", "#795747", "#46604e", "#808080", "#d47642", "#705580", "#a80000", "#fff", "#dbb647", "#d4d4d4"];
const priceLimits = [499999, 999999, 2499999, 4999999, 9999999, Infinity];
const categoryDetails: Record<string, string> = { 로드: "로드 레이스 · 로드 엔듀런스", 산악: "트레일", 그래블: "그래블 레이스" };

function filterValues(product: Product, key: string): readonly string[] {
    if (key === "그룹" && product.group) return [product.group];
    if (key === "모델" && product.model) return [product.model];
    if (key === "자전거 연식" && product.grade) return [product.grade];
    return product.filters?.[key] ?? (key === "사이즈" ? product.page?.sizes?.map(({ value }) => String(value)) ?? [] : []);
}

function matchesFilter(product: Product, key: string, option: string) {
    if (key === "카테고리") return product.category === option;
    if (key === "그룹") return option === (product.group ?? (product.name.includes("프레임셋") ? "프레임셋" : product.name.startsWith("Turbo") ? "E-Bikes" : "자전거"));
    if (key === "모델") return product.model ? product.model === option : product.name.includes(option);
    if (key === "자전거 연식") return product.grade ? product.grade === option : product.name.split(" ").includes(option);
    if (key === "가격") {
        const index = filterGroups.find((group) => group.label === "가격")!.options.indexOf(option);
        return product.price !== null && product.price > (priceLimits[index - 1] ?? 199999) && product.price <= priceLimits[index];
    }
    return filterValues(product, key).includes(option);
}

export const Products = () => {
    const [params] = useSearchParams();
    const isEquipment = params.get("type") === "equipment";
    return <Catalog key={String(isEquipment)} isEquipment={isEquipment} />;
};

function Catalog({ isEquipment }: { isEquipment: boolean }) {
    const products = isEquipment ? equipment : bikes;
    const title = isEquipment ? "장비" : "자전거";
    const [filterOpen, setFilterOpen] = useState(false);
    const [sort, setSort] = useState<Sort>("추천순");
    const [sortOpen, setSortOpen] = useState(false);
    const [filters, setFilters] = useState<Record<string, string[]>>({});
    const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
    const [page, setPage] = useState(1);
    const [comparison, setComparison] = useState<string[]>([]);
    const [comparisonCollapsed, setComparisonCollapsed] = useState(false);
    const comparisonDialog = useRef<HTMLDialogElement>(null);
    const comparedProducts = comparison.flatMap((id) => products.filter((product) => product.id === id));
    const removeComparison = (id: string) => {
        setComparison((current) => current.filter((entry) => entry !== id));
    };
    const toggleComparison = (id: string, checked: boolean) => {
        if (!checked) {
            removeComparison(id);
            return;
        }
        setComparison((current) => current.length < comparisonLimit ? [...current, id] : current);
        setComparisonCollapsed(false);
    };
    const categoryOptions = [...new Set(products.map(({ category }) => category))];
    const filtered = products.filter((product) => Object.entries(filters).every(
        ([key, options]) => options.length === 0 || options.some((option) => matchesFilter(product, key, option)),
    ));
    const toggleFilter = (key: string, option: string) => {
        setFilters((current) => {
            const options = current[key] ?? [];
            return { ...current, [key]: options.includes(option) ? options.filter((value) => value !== option) : [...options, option] };
        });
        setPage(1);
    };

    const renderOptions = (key: string, options: string[], style?: string) => (
        <div className={`catalog__filter-options${style ? ` catalog__filter-options--${style}` : ""}`}>
            {options.map((option, index) => {
                const selected = filters[key]?.includes(option) ?? false;
                if (style) return (
                    <button key={option} type="button" aria-pressed={selected} onClick={() => toggleFilter(key, option)}>
                        {style === "color" && <span className="catalog__swatch" style={{ backgroundColor: swatches[index] }} />}
                        {option}
                    </button>
                );
                const count = products.filter((product) => matchesFilter(product, key, option)).length;
                return (
                    <label key={option}>
                        <input type="checkbox" checked={selected} onChange={() => toggleFilter(key, option)} />
                        <span>{option}{key !== "구성" && ` (${count})`}
                            {key === "카테고리" && categoryDetails[option] && <small>{categoryDetails[option]}</small>}
                        </span>
                    </label>
                );
            })}
        </div>
    );
    const sorted = [...filtered];
    if (sort === "가격 낮은 순" || sort === "가격 높은 순") {
        const direction = sort === "가격 낮은 순" ? 1 : -1;
        sorted.sort((a, b) => {
            if (a.price === b.price) return 0;
            if (a.price === null) return 1;
            if (b.price === null) return -1;
            return (a.price - b.price) * direction;
        });
    }
    if (sort === "최신순") sorted.reverse();
    if (sort === "인기순") sorted.sort((a, b) => (products.indexOf(a) + 3) % products.length - (products.indexOf(b) + 3) % products.length);
    const pages = Math.ceil(sorted.length / pageSize);

    return (
        <section className="catalog" data-comparing={comparison.length > 0 && !comparisonCollapsed} aria-labelledby="catalog-title">
            <header className="catalog__heading">
                <p><Link to="/">홈</Link> / {title}</p>
                <h1 id="catalog-title">{title} <small>({filtered.length})</small></h1>
                <p>{isEquipment ? "라이딩에 필요한 장비를 둘러보세요." : "라이딩 스타일에 맞는 자전거를 찾아보세요."}</p>
            </header>
            <div className="catalog__toolbar">
                <button type="button" className="catalog__filter-toggle" aria-expanded={filterOpen} aria-controls="catalog-filters" onClick={() => setFilterOpen(!filterOpen)}>
                    <span><SlidersHorizontal size={17} /></span>{filterOpen ? "필터 닫기" : "필터"}
                </button>
                <span className="catalog__count" role="status">{filtered.length}개 상품</span>
                <div className="catalog__sort" onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget)) setSortOpen(false);
                }} onKeyDown={(event) => {
                    if (event.key === "Escape" && sortOpen) {
                        event.currentTarget.querySelector("button")?.focus();
                        setSortOpen(false);
                    }
                }}>
                    <button type="button" aria-expanded={sortOpen} aria-controls="catalog-sort-options" onClick={() => setSortOpen(!sortOpen)}>정렬: {sort} <span className="catalog-arrow catalog-arrow--down" aria-hidden="true" /></button>
                    <ul id="catalog-sort-options" hidden={!sortOpen}>
                        {sorts.map((option) => (
                            <li key={option}><button type="button" aria-pressed={sort === option} onClick={(event) => {
                                setSort(option);
                                setPage(1);
                                event.currentTarget.closest(".catalog__sort")?.querySelector("button")?.focus();
                                setSortOpen(false);
                            }}>{option}{sort === option && <Check size={16} />}</button></li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="catalog__layout" data-filter-open={filterOpen}>
                <aside id="catalog-filters" className="catalog__filter" inert={!filterOpen} aria-label="상품 필터">
                    <div className="catalog__filter-content">
                        <div className="catalog__filter-title"><h2>Filters</h2><button type="button" aria-label="필터 닫기" onClick={() => setFilterOpen(false)}><X size={18} /></button></div>
                        <details open>
                            <summary>카테고리</summary>
                            {renderOptions("카테고리", categoryOptions)}
                        </details>
                        {!isEquipment && filterGroups.map(({ label, key = label, options, limit, style }) => {
                            const expanded = expandedGroups.includes(label);
                            const choices = [...new Set([...options, ...products.flatMap((product) => filterValues(product, key))])];
                            return (
                                <details key={label}>
                                    <summary>{label}</summary>
                                    {key === "브랜드" && <p>브랜드</p>}
                                    {renderOptions(key, expanded ? choices : choices.slice(0, limit ?? choices.length), style)}
                                    {key === "브랜드" && <><p>구성</p>{renderOptions("구성", [...new Set(["1x", "2x", "11 · 12 · 13-Speed", ...products.flatMap((product) => filterValues(product, "구성"))])])}</>}
                                    {limit && <button className="catalog__filter-more" type="button" aria-expanded={expanded} onClick={() => {
                                        setExpandedGroups((current) => expanded ? current.filter((group) => group !== label) : [...current, label]);
                                    }}>{expanded ? "접기" : "더 보기"}</button>}
                                </details>
                            );
                        })}
                        {!isEquipment && <details><summary>구분</summary><p>세부 옵션 준비 중</p></details>}
                        <button className="catalog__filter-apply" type="button" onClick={() => setFilterOpen(false)}>상품 {filtered.length}개 보기</button>
                    </div>
                </aside>
                <div className="catalog__results">
                    {sorted.length === 0 && <p role="status">선택한 조건에 맞는 상품이 없어요.</p>}
                    <ul className="catalog__grid">
                        {sorted.slice((page - 1) * pageSize, page * pageSize).map((product) => (
                            <ProductCard key={product.id} product={product}
                                compared={comparison.includes(product.id)}
                                compareDisabled={comparison.length >= comparisonLimit && !comparison.includes(product.id)}
                                onCompare={toggleComparison} />
                        ))}
                    </ul>
                    {pages > 1 && (
                        <nav className="catalog__pagination" aria-label="상품 목록 페이지">
                            {Array.from({ length: pages }, (_, index) => (
                                <button key={index} type="button" aria-current={page === index + 1 ? "page" : undefined} onClick={() => setPage(index + 1)}>{index + 1}</button>
                            ))}
                            <button type="button" disabled={page === pages} onClick={() => setPage(page + 1)}>다음 <span className="catalog-arrow" aria-hidden="true" /></button>
                        </nav>
                    )}
                </div>
            </div>
            {comparison.length > 0 && (
                <aside className="catalog-compare" aria-label="제품 비교" data-collapsed={comparisonCollapsed}>
                    <div className="catalog-compare__summary">
                        <strong>제품 비교</strong>
                        <div className="catalog-compare__count"><span aria-live="polite">{comparison.length} / {comparisonLimit}</span>
                            {!comparisonCollapsed && <button type="button" onClick={() => setComparison([])}>초기화</button>}
                        </div>
                        {comparisonCollapsed && (
                            <div className="catalog-compare__mini-slots" aria-hidden="true">
                                {Array.from({ length: comparisonLimit }, (_, index) => (
                                    <span key={index} data-filled={index < comparison.length} />
                                ))}
                            </div>
                        )}
                        <button type="button" aria-label={comparisonCollapsed ? "비교 영역 펼치기" : "비교 영역 접기"}
                            aria-expanded={!comparisonCollapsed} aria-controls="catalog-compare-slots"
                            onClick={() => setComparisonCollapsed((current) => !current)}>
                            {!comparisonCollapsed && "접기 "}
                            <span className={`catalog-arrow catalog-arrow--${comparisonCollapsed ? "up" : "down"}`} aria-hidden="true" />
                        </button>
                    </div>
                    <ul id="catalog-compare-slots" className="catalog-compare__slots" hidden={comparisonCollapsed}>
                        {comparedProducts.map(({ id, name, price, image }) => (
                            <li key={id} className="catalog-compare__product">
                                <div className="catalog-compare__thumbnail" aria-hidden="true">{image && <img src={image} alt="" />}</div>
                                <div><strong title={name}>{name}</strong><p>{formatProductPrice(price)}</p></div>
                                <button type="button" aria-label={`${name} 비교에서 제거`} onClick={() => removeComparison(id)}><X size={16} /></button>
                            </li>
                        ))}
                        {Array.from({ length: comparisonLimit - comparison.length }, (_, index) => (
                            <li className="catalog-compare__empty" key={index}>＋ 비교할 제품 추가</li>
                        ))}
                    </ul>
                    <button className="catalog-compare__submit" type="button" hidden={comparisonCollapsed} disabled={comparison.length < 2}
                        onClick={() => comparisonDialog.current?.showModal()}>
                        비교하기 ({comparison.length})
                        {comparison.length < 2 && <small>2개 이상 선택 시 활성</small>}
                    </button>
                </aside>
            )}
            <dialog ref={comparisonDialog} className="catalog-compare-dialog" aria-labelledby="catalog-compare-title">
                <div className="catalog-compare-dialog__heading">
                    <h2 id="catalog-compare-title">제품 비교</h2>
                    <form method="dialog"><button aria-label="제품 비교 닫기"><X size={20} /></button></form>
                </div>
                <div className="catalog-compare-dialog__table">
                    <table>
                        <thead><tr><th scope="col">항목</th>{comparedProducts.map(({ id, name }) => <th scope="col" key={id}>{name}</th>)}</tr></thead>
                        <tbody>
                            <tr><th scope="row">카테고리</th>{comparedProducts.map(({ id, category }) => <td key={id}>{category}</td>)}</tr>
                            <tr><th scope="row">가격</th>{comparedProducts.map(({ id, price }) => <td key={id}>{formatProductPrice(price)}</td>)}</tr>
                            <tr><th scope="row">구성</th>{comparedProducts.map(({ id, detail }) => <td key={id}>{detail ?? "—"}</td>)}</tr>
                        </tbody>
                    </table>
                </div>
            </dialog>
        </section>
    );
}

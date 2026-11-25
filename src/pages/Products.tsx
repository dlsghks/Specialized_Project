import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Check, ChevronDown, SlidersHorizontal, X } from "lucide-react";
import "../styles/pages/catalog/Products.scss";

const sorts = ["추천순", "인기순", "가격 낮은 순", "가격 높은 순", "최신순"] as const;
type Sort = typeof sorts[number];
type Product = { name: string; category: string; price: number; detail?: string; id?: string };
const bikes: Product[] = [
    { name: "S-Works Tarmac SL9", category: "로드", price: 20900000, detail: "스램 레드 AXS", id: "4293533" },
    { name: "S-Works Tarmac SL9 프레임셋", category: "로드", price: 8500000, detail: "FACT 12r 카본" },
    { name: "Tarmac SL9 S-Level", category: "로드", price: 12500000 },
    { name: "Tarmac SL9 Comp", category: "로드", price: 5900000 },
    { name: "Roubaix SL8 Comp", category: "로드", price: 5850000 },
    { name: "Allez Sport", category: "로드", price: 2200000 },
    { name: "Chisel", category: "산악", price: 2800000 },
    { name: "Stumpjumper", category: "산악", price: 4900000 },
    { name: "Diverge Comp", category: "그래블", price: 4100000 },
    { name: "Crux Sport", category: "그래블", price: 4700000 },
    { name: "Jett 20", category: "아동용", price: 540000 },
    { name: "Sirrus X", category: "액티브", price: 1250000 },
    { name: "Hotwalk", category: "아동용", price: 320000 },
    { name: "Turbo Vado", category: "액티브", price: 5500000 },
];
const equipment: Product[] = [
    { name: "S-Works Evade 4 LTD", category: "헬멧", price: 450000 },
    { name: "S-Works Ares 2 LTD", category: "슈즈", price: 590000 },
    { name: "S-Works Rapide", category: "부품", price: 420000 },
    { name: "Roval Terra CL", category: "부품", price: 1900000 },
    { name: "Roval Terra 핸들바", category: "부품", price: 380000 },
];
const won = new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" });
const pageSize = 12;

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
    const [categories, setCategories] = useState<string[]>([]);
    const [page, setPage] = useState(1);
    const [comparison, setComparison] = useState<string[]>([]);
    const categoryOptions = [...new Set(products.map(({ category }) => category))];
    const filtered = products.filter(({ category }) => !categories.length || categories.includes(category));
    const sorted = [...filtered];
    if (sort === "가격 낮은 순") sorted.sort((a, b) => a.price - b.price);
    if (sort === "가격 높은 순") sorted.sort((a, b) => b.price - a.price);
    if (sort === "최신순") sorted.reverse();
    if (sort === "인기순") sorted.sort((a, b) => (products.indexOf(a) + 3) % products.length - (products.indexOf(b) + 3) % products.length);
    const pages = Math.ceil(sorted.length / pageSize);

    return (
        <section className="catalog" aria-labelledby="catalog-title">
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
                    <button type="button" aria-expanded={sortOpen} aria-controls="catalog-sort-options" onClick={() => setSortOpen(!sortOpen)}>정렬: {sort} <ChevronDown size={16} /></button>
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
                            {categoryOptions.map((category) => (
                                <label key={category}><input type="checkbox" checked={categories.includes(category)} onChange={(event) => {
                                    const checked = event.target.checked;
                                    setCategories((current) => checked ? [...current, category] : current.filter((value) => value !== category));
                                    setPage(1);
                                }} />{category} ({products.filter((product) => product.category === category).length})</label>
                            ))}
                        </details>
                        {["그룹", "모델", "자전거 연식", "사이즈", "컬러", "소재"].map((group) => (
                            <details key={group}><summary>{group}</summary><p>필터 옵션 준비 중</p></details>
                        ))}
                        <button className="catalog__filter-apply" type="button" onClick={() => setFilterOpen(false)}>상품 {filtered.length}개 보기</button>
                    </div>
                </aside>
                <div className="catalog__results">
                    <ul className="catalog__grid">
                        {sorted.slice((page - 1) * pageSize, page * pageSize).map(({ name, detail, category, price, id }) => (
                            <li key={name}>
                                <div className="catalog__photo" aria-hidden="true">제품 이미지<span>● ● ●</span></div>
                                <div className="catalog__card-heading">
                                    <h2>{id ? <Link to={`/products/${id}`}>{name}</Link> : name}</h2>
                                    <label>비교 <input type="checkbox" aria-label={`${name} 비교 선택`} checked={comparison.includes(name)} onChange={(event) => {
                                        const checked = event.target.checked;
                                        setComparison((current) => checked ? [...current, name] : current.filter((entry) => entry !== name));
                                    }} /></label>
                                </div>
                                <p>{detail ?? category} · {won.format(price)}</p>
                            </li>
                        ))}
                    </ul>
                    {pages > 1 && (
                        <nav className="catalog__pagination" aria-label="상품 목록 페이지">
                            {Array.from({ length: pages }, (_, index) => (
                                <button key={index} type="button" aria-current={page === index + 1 ? "page" : undefined} onClick={() => setPage(index + 1)}>{index + 1}</button>
                            ))}
                            <button type="button" disabled={page === pages} onClick={() => setPage(page + 1)}>다음 ›</button>
                        </nav>
                    )}
                </div>
            </div>
        </section>
    );
}

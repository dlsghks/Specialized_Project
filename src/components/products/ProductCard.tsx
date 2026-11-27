import { Link } from "react-router-dom";
import { formatProductPrice } from "../../data/products";
import type { Product } from "../../data/productTypes";

type ProductCardProps = {
    product: Product;
    compared: boolean;
    compareDisabled: boolean;
    onCompare: (id: string, checked: boolean) => void;
};

export function ProductCard({ product, compared, compareDisabled, onCompare }: ProductCardProps) {
    const { id, name, detail, category, price, image } = product;
    const url = `/products/${id}`;

    return (
        <li>
            <Link to={url} className="catalog__photo" aria-label={`${name} 이미지로 상세 보기`} tabIndex={-1} data-image={!!image}>
                {image ? <img src={image} alt="" loading="lazy" /> : <>제품 이미지<span aria-hidden="true">● ● ●</span></>}
            </Link>
            <div className="catalog__card-heading">
                <h2><Link to={url}>{name}</Link></h2>
                <label className="catalog__compare-choice" data-selected={compared}>
                    {compared ? "비교 중" : "비교"}
                    <input type="checkbox" aria-label={`${name} 비교 선택`} checked={compared} disabled={compareDisabled}
                        onChange={(event) => onCompare(id, event.target.checked)} />
                </label>
            </div>
            <p>{detail ?? category} · {formatProductPrice(price)}</p>
        </li>
    );
}

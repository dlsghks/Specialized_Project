import { useState } from "react";
import { gearImage, readGearCart, writeGearCart } from "./gearCart";
import "../styles/pages/Cart.scss";

export const Cart = () => {
    const [items, setItems] = useState(readGearCart);
    const [error, setError] = useState(false);

    const remove = (image: string) => {
        const updated = readGearCart().filter((item) => item.image !== image);
        try {
            writeGearCart(updated);
            setItems(updated);
            setError(false);
        } catch {
            setError(true);
        }
    };

    return (
        <section className="gear-cart">
            <h1>장바구니</h1>
            {error && <p role="alert">장비를 삭제하지 못했어요.</p>}
            {items.length === 0 ? <p>장바구니가 비어 있어요.</p> : (
                <ul>
                    {items.map(({ name, image }) => (
                        <li key={image}>
                            <img src={gearImage(image)} alt="" width={120} height={68} />
                            <strong>{name}</strong>
                            <button type="button" onClick={() => remove(image)} aria-label={`${name} 삭제`}>삭제</button>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
};

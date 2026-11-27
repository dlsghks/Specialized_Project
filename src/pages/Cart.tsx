import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { OrderItems, OrderPage, OrderTotals } from "../components/commerce/OrderFlow";
import { calculateTotals, changeCartQuantity, maxQuantity, removeCartItems, useShop } from "../data/commerce";

export function Cart() {
    const navigate = useNavigate();
    const { cart } = useShop();
    const [excluded, setExcluded] = useState<string[]>([]);
    const [pending, setPending] = useState(false);
    const [error, setError] = useState("");
    const selected = cart.filter(({ id }) => !excluded.includes(id));
    const selectedIds = selected.map(({ id }) => id);
    const allSelected = cart.length > 0 && selected.length === cart.length;

    const update = async (action: () => Promise<unknown>) => {
        setPending(true);
        setError("");
        try {
            await action();
        } catch {
            setError("장바구니를 변경하지 못했어요. 다시 시도해 주세요.");
        } finally {
            setPending(false);
        }
    };

    return (
        <OrderPage step={0}>
            <div className="order-flow__columns">
                <div>
                    <section className="order-block">
                        <h2>장바구니 ({cart.length})</h2>
                        {cart.length ? (
                            <>
                                <div className="order-cart__selection">
                                    <label>
                                        <input type="checkbox" checked={allSelected} disabled={pending}
                                            ref={(node) => { if (node) node.indeterminate = selected.length > 0 && !allSelected; }}
                                            onChange={(event) => setExcluded(event.target.checked ? [] : cart.map(({ id }) => id))} />
                                        전체 선택 ({selected.length}/{cart.length})
                                    </label>
                                    <button type="button" disabled={!selected.length || pending}
                                        onClick={() => { void update(() => removeCartItems(selectedIds)); }}>선택 삭제</button>
                                </div>
                                <OrderItems items={cart}
                                    selection={(item) => (
                                        <input type="checkbox" aria-label={`${item.name} 선택`} disabled={pending}
                                            checked={!excluded.includes(item.id)}
                                            onChange={(event) => setExcluded((ids) => event.target.checked
                                                ? ids.filter((id) => id !== item.id) : [...ids, item.id])} />
                                    )}
                                    actions={(item) => (
                                        <div className="order-item__actions">
                                            <div className="order-item__quantity">
                                                <button type="button" aria-label={`${item.name} 수량 줄이기`} disabled={pending || item.quantity <= 1}
                                                    onClick={() => { void update(() => changeCartQuantity(item.id, -1)); }}>−</button>
                                                <span aria-live="polite">{item.quantity}</span>
                                                <button type="button" aria-label={`${item.name} 수량 늘리기`} disabled={pending || item.quantity >= maxQuantity}
                                                    onClick={() => { void update(() => changeCartQuantity(item.id, 1)); }}>+</button>
                                            </div>
                                            <button className="order-button" type="button" disabled={pending} aria-label={`${item.name} 삭제`}
                                                onClick={() => { void update(() => removeCartItems([item.id])); }}>삭제</button>
                                        </div>
                                    )} />
                            </>
                        ) : <p className="order-empty">장바구니가 비어 있어요.</p>}
                        {error && <p className="order-error" role="alert">{error}</p>}
                    </section>
                    {cart.length > 0 && (
                        <section className="order-cart__delivery">
                            <h2>배송 안내</h2>
                            <p>가상 주문에 사용할 배송 및 수령 방법은 결제 화면에서 선택할 수 있어요.</p>
                        </section>
                    )}
                    <Link className="order-button order-shop-link" to="/products">쇼핑 계속하기</Link>
                </div>
                <aside aria-label="장바구니 결제 요약">
                    <OrderTotals totals={calculateTotals(selected)}>
                        <button className="order-button order-button--primary" type="button" disabled={!selected.length || pending}
                            onClick={() => navigate("/checkout", { state: { selectedIds } })}>주문하기</button>
                    </OrderTotals>
                </aside>
            </div>
        </OrderPage>
    );
}

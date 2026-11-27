import { Check } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { OrderPage, OrderReceipt } from "../components/commerce/OrderFlow";
import { useShop } from "../data/commerce";

export function OrderComplete() {
    const [search] = useSearchParams();
    const { orders } = useShop();
    const id = search.get("order");
    const order = id ? orders.find((entry) => entry.id === id) : orders[0];

    return (
        <OrderPage step={2}>
            {order ? (
                <>
                    <div className="order-complete">
                        <span><Check size={36} aria-hidden="true" /></span>
                        <h2>주문이 정상적으로 완료되었습니다.</h2>
                        <p>주문번호 {order.id}</p>
                    </div>
                    <div className="order-flow__receipt">
                        <OrderReceipt order={order} />
                        <div className="order-flow__actions">
                            <Link className="order-button" to={`/mypage/orders/${order.id}`}>주문 상세 보기</Link>
                            <Link className="order-button order-button--primary" to="/products">쇼핑 계속하기</Link>
                        </div>
                    </div>
                </>
            ) : (
                <div className="order-empty">
                    <p>완료된 주문을 찾을 수 없어요.</p>
                    <Link className="order-button order-shop-link" to="/cart">장바구니로</Link>
                </div>
            )}
        </OrderPage>
    );
}

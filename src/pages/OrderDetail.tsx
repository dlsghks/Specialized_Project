import { Link, useParams } from "react-router-dom";
import { OrderPage, OrderReceipt, OrderTotals } from "../components/commerce/OrderFlow";
import { useShop } from "../data/commerce";

export function OrderDetail() {
    const { id } = useParams();
    const { orders } = useShop();
    const order = orders.find((entry) => entry.id === id);

    return (
        <OrderPage step={2} title="주문 상세">
            {order ? (
                <div className="order-flow__columns">
                    <div>
                        <p className="order-detail__number">주문번호 {order.id} · {new Date(order.date).toLocaleDateString("ko-KR")}</p>
                        <OrderReceipt order={order} />
                        <Link className="order-button order-shop-link" to={`/order-complete?order=${order.id}`}>결제 완료 화면</Link>
                    </div>
                    <aside aria-label="주문 결제 요약"><OrderTotals totals={order.totals} /></aside>
                </div>
            ) : <p className="order-empty">주문을 찾을 수 없어요.</p>}
        </OrderPage>
    );
}

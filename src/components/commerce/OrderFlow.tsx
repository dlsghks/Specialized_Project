import { useLayoutEffect, type ReactNode } from "react";
import { Bike } from "lucide-react";
import { Link } from "react-router-dom";
import { amountInWon, calculateTotals, shippingMethods, type CartItem, type Order } from "../../data/commerce";
import { won } from "../../data/products";
import "../../styles/pages/Cart.scss";

const steps = [
    { label: "01 장바구니", title: "장바구니" },
    { label: "02 주문 / 결제", title: "주문 / 결제" },
    { label: "03 결제 완료", title: "결제 완료" },
] as const;

export function OrderPage({ step, title, children }: { step: 0 | 1 | 2; title?: string; children: ReactNode }) {
    useLayoutEffect(() => {
        window.scrollTo(0, 0);
    }, [step]);

    return (
        <section className="order-flow" aria-labelledby="order-page-title">
            <div className="order-flow__container">
                <ol className="order-flow__steps" aria-label="주문 진행 단계">
                    {steps.map(({ label }, index) => (
                        <li key={label} aria-current={index === step ? "step" : undefined}>
                            {step === 1 && index === 0 ? <Link to="/cart">{label}</Link> : label}
                        </li>
                    ))}
                </ol>
                <h1 id="order-page-title">{title ?? steps[step].title}</h1>
                {children}
            </div>
        </section>
    );
}

type ItemControls = {
    selection?: (item: CartItem) => ReactNode;
    actions?: (item: CartItem) => ReactNode;
};

export function OrderItems({ items, selection, actions }: { items: readonly CartItem[] } & ItemControls) {
    return (
        <ul className="order-items">
            {items.map((item) => (
                <li className="order-item" key={item.id}>
                    <div className="order-item__media">
                        {selection?.(item)}
                        {item.image ? <img src={item.image} alt="" /> : <Bike size={64} strokeWidth={1.25} aria-hidden="true" />}
                    </div>
                    <div className="order-item__info">
                        <h3>{item.productId ? <Link to={`/products/${item.productId}`}>{item.name}</Link> : item.name}</h3>
                        {!!item.options?.length && <p className="order-item__options">{item.options.join(" / ")}</p>}
                        <p>수량 {item.quantity}개</p>
                        {actions?.(item)}
                    </div>
                    <strong className="order-item__amount">{won.format(item.price * item.quantity)}</strong>
                </li>
            ))}
        </ul>
    );
}

export function OrderTotals({ totals, children }: { totals: ReturnType<typeof calculateTotals>; children?: ReactNode }) {
    return (
        <section className="order-summary">
            <h2>결제 금액</h2>
            <dl>
                <div><dt>총 상품 금액</dt><dd>{amountInWon(totals.subtotal)}</dd></div>
                <div><dt>배송비</dt><dd>무료</dd></div>
                <div><dt>쿠폰 / 포인트</dt><dd>{totals.discount > 0 && "−"}{amountInWon(totals.discount)}</dd></div>
                <div className="order-summary__total"><dt>최종 결제 금액</dt><dd>{amountInWon(totals.total)}</dd></div>
            </dl>
            {children}
        </section>
    );
}

export function OrderReceipt({ order }: { order: Order }) {
    return (
        <>
            <section className="order-block">
                <h2>주문 상품</h2>
                <OrderItems items={order.items} />
            </section>
            <section className="order-block">
                <h2>배송 및 결제 정보</h2>
                <dl className="order-receipt">
                    <div><dt>수령 방법</dt><dd>{shippingMethods[order.shipping]}</dd></div>
                    {order.pickupStore && <div><dt>픽업 매장</dt><dd>{order.pickupStore}</dd></div>}
                    <div><dt>결제 수단</dt><dd>{order.payment} · 가상 결제</dd></div>
                    <div className="order-receipt__amount"><dt>결제 금액</dt><dd>{amountInWon(order.totals.total)}</dd></div>
                </dl>
            </section>
        </>
    );
}

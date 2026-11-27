import { useRef, useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { OrderItems, OrderPage, OrderTotals } from "../components/commerce/OrderFlow";
import {
    amountInWon, calculateTotals, CartChangedError, confirmDemoOrder, createOrderId, demoCoupon, demoPoints,
    paymentMethods, shippingMethods, useShop, type OrderRequest, type PaymentMethod, type ShippingMethod,
} from "../data/commerce";

const sampleAddress = { postcode: "04524", address: "서울특별시 중구 테스트로 1, 101호" };
const emptyContact = { recipient: "", phone: "", postcode: "", address: "", name: "", email: "" };
const sampleContact = {
    recipient: "테스트 라이더", phone: "01000000000", name: "테스트 라이더", email: "rider@example.com", ...sampleAddress,
};
const pickupStores = ["서울 데모 매장", "성남 데모 매장"];

export function Checkout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { cart } = useShop();
    const selectedIds: unknown = location.state?.selectedIds;
    const items = Array.isArray(selectedIds) ? cart.filter(({ id }) => selectedIds.includes(id)) : cart;
    const pickupOnly = items.some((item) => item.pickupOnly);
    const [shipping, setShipping] = useState<ShippingMethod>(pickupOnly ? "pickup" : "delivery");
    const fulfillment = pickupOnly ? "pickup" : shipping;
    const [payment, setPayment] = useState<PaymentMethod>("신용카드");
    const [contact, setContact] = useState(emptyContact);
    const [store, setStore] = useState("");
    const [couponOption, setCouponOption] = useState("");
    const [couponApplied, setCouponApplied] = useState(false);
    const [points, setPoints] = useState(0);
    const [privacy, setPrivacy] = useState(false);
    const [terms, setTerms] = useState(false);
    const [review, setReview] = useState<OrderRequest | null>(null);
    const [paymentError, setPaymentError] = useState("");
    const [cartChanged, setCartChanged] = useState(false);
    const [pending, setPending] = useState(false);
    const submitting = useRef(false);
    const paymentDialog = useRef<HTMLDialogElement>(null);
    const addressDialog = useRef<HTMLDialogElement>(null);
    const totals = calculateTotals(items, couponApplied, points);
    const paymentTotal = review ? calculateTotals(review.items, review.coupon, review.points).total : totals.total;

    const requestPayment = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!items.length || !privacy || !terms || paymentDialog.current?.open) return;
        setPaymentError("");
        setCartChanged(false);
        setReview({
            id: createOrderId(), items, shipping: fulfillment, pickupStore: fulfillment === "pickup" ? store : undefined,
            payment, coupon: couponApplied, points,
        });
        paymentDialog.current?.showModal();
    };

    const pay = async () => {
        if (!review || submitting.current || cartChanged) return;
        submitting.current = true;
        setPending(true);
        setPaymentError("");
        try {
            const order = await confirmDemoOrder(review);
            paymentDialog.current?.close();
            navigate(`/order-complete?order=${order.id}`, { replace: true });
        } catch (error) {
            setCartChanged(error instanceof CartChangedError);
            setPaymentError(error instanceof CartChangedError ? error.message : "가상 주문을 저장하지 못했어요. 다시 시도해 주세요.");
        } finally {
            submitting.current = false;
            setPending(false);
        }
    };

    return (
        <OrderPage step={1}>
            {items.length === 0 ? (
                <div className="order-empty">
                    <p>주문할 상품이 없어요.</p>
                    <Link className="order-button order-shop-link" to="/cart">장바구니로</Link>
                </div>
            ) : (
                <form className="order-flow__columns order-checkout" onSubmit={requestPayment}>
                    <div className="order-checkout__fields">
                        <section className="order-block">
                            <h2>01 배송지 정보</h2>
                            <div className="order-choices" role="group" aria-label="수령 방법">
                                {Object.entries(shippingMethods).map(([method, label]) => (
                                    <button key={method} className="order-button" type="button" aria-pressed={fulfillment === method}
                                        disabled={pickupOnly && method === "delivery"} onClick={() => setShipping(method as ShippingMethod)}>{label}</button>
                                ))}
                            </div>
                            {pickupOnly && <p className="order-hint">매장 수령 전용 상품이 포함되어 있어요.</p>}
                            <div className="order-form-row">
                                <label className="order-field">받는 분
                                    <input required placeholder="이름 입력" value={contact.recipient}
                                        onChange={(event) => setContact({ ...contact, recipient: event.target.value })} />
                                </label>
                                <label className="order-field">연락처
                                    <input required type="tel" inputMode="numeric" pattern="[0-9]{9,11}" placeholder="휴대폰 번호 (숫자만)"
                                        value={contact.phone} onChange={(event) => setContact({ ...contact, phone: event.target.value })} />
                                </label>
                            </div>
                            {fulfillment === "delivery" ? (
                                <>
                                    <div className="order-form-action">
                                        <label className="order-field">우편번호
                                            <input required inputMode="numeric" pattern="[0-9]{5}" placeholder="우편번호" value={contact.postcode}
                                                onChange={(event) => setContact({ ...contact, postcode: event.target.value })} />
                                        </label>
                                        <button className="order-button" type="button" aria-haspopup="dialog"
                                            onClick={() => addressDialog.current?.showModal()}>주소 검색</button>
                                    </div>
                                    <label className="order-field">주소
                                        <input required placeholder="기본 주소 및 상세 주소" value={contact.address}
                                            onChange={(event) => setContact({ ...contact, address: event.target.value })} />
                                    </label>
                                    <div className="order-field">
                                        <label htmlFor="delivery-request">배송 요청사항</label>
                                        <select id="delivery-request" defaultValue="">
                                            <option value="">배송 요청사항을 선택해 주세요</option>
                                            <option>문 앞에 놓아 주세요</option>
                                            <option>배송 전에 연락해 주세요</option>
                                            <option>경비실에 맡겨 주세요</option>
                                        </select>
                                    </div>
                                </>
                            ) : (
                                <div className="order-field">
                                    <label htmlFor="pickup-store">픽업 매장</label>
                                    <select id="pickup-store" value={store} required onChange={(event) => setStore(event.target.value)}>
                                        <option value="">테스트 픽업 매장을 선택해 주세요</option>
                                        {pickupStores.map((name) => <option key={name}>{name}</option>)}
                                    </select>
                                </div>
                            )}
                        </section>
                        <section className="order-block">
                            <h2>02 주문자 정보</h2>
                            <div className="order-form-row">
                                <label className="order-field">이름
                                    <input required placeholder="주문자 이름" value={contact.name}
                                        onChange={(event) => setContact({ ...contact, name: event.target.value })} />
                                </label>
                                <label className="order-field">이메일
                                    <input required type="email" placeholder="이메일 주소" value={contact.email}
                                        onChange={(event) => setContact({ ...contact, email: event.target.value })} />
                                </label>
                            </div>
                        </section>
                        <section className="order-block">
                            <h2>03 주문 상품</h2>
                            <OrderItems items={items} />
                        </section>
                        <section className="order-block">
                            <h2>04 쿠폰 / 포인트</h2>
                            <div className="order-form-action">
                                <div className="order-field">
                                    <label htmlFor="demo-coupon">쿠폰</label>
                                    <select id="demo-coupon" value={couponOption} onChange={(event) => setCouponOption(event.target.value)}>
                                        <option value="">사용 가능한 쿠폰 선택</option>
                                        <option value="demo">테스트 쿠폰 {amountInWon(demoCoupon)}</option>
                                    </select>
                                </div>
                                <button className="order-button" type="button" onClick={() => setCouponApplied(couponOption === "demo")}>쿠폰 적용</button>
                            </div>
                            <div className="order-form-action">
                                <label className="order-field">포인트
                                    <input type="number" min={0} max={demoPoints} step={1} value={points}
                                        onChange={(event) => setPoints(Number(event.target.value))} />
                                </label>
                                <button className="order-button" type="button" onClick={() => setPoints(demoPoints)}>전액 사용</button>
                            </div>
                            <p className="order-hint" aria-live="polite">{couponApplied && "테스트 쿠폰 적용 · "}사용 가능한 테스트 포인트 {demoPoints.toLocaleString("ko-KR")}P</p>
                        </section>
                        <section className="order-block">
                            <h2>05 결제수단 선택</h2>
                            <div className="order-choices order-choices--payment" role="group" aria-label="결제 수단">
                                {paymentMethods.map((method) => (
                                    <button key={method} className="order-button" type="button" aria-pressed={payment === method}
                                        onClick={() => setPayment(method)}>{method}</button>
                                ))}
                            </div>
                            <p className="order-hint">결제 전 주문 정보와 수령 방법을 확인해 주세요.</p>
                        </section>
                    </div>
                    <aside className="order-checkout__summary" aria-label="주문 결제 요약">
                        <OrderTotals totals={totals} />
                        <section className="order-agreements">
                            <h2>구매 약관 동의</h2>
                            <label><input type="checkbox" checked={privacy && terms}
                                ref={(node) => { if (node) node.indeterminate = privacy !== terms; }}
                                onChange={(event) => { setPrivacy(event.target.checked); setTerms(event.target.checked); }} /> 전체 동의 (필수)</label>
                            <label><input type="checkbox" required checked={privacy} onChange={(event) => setPrivacy(event.target.checked)} /> 개인정보 수집 및 이용 동의</label>
                            <label><input type="checkbox" required checked={terms} onChange={(event) => setTerms(event.target.checked)} /> 주문 내용 및 구매 조건 확인</label>
                        </section>
                        <div className="order-checkout__pay">
                            <button className="order-button order-button--primary" type="submit">{amountInWon(totals.total)} 결제하기</button>
                            <p className="order-hint">가상 결제예요. 실제로 청구되지 않아요.</p>
                            <button className="order-text-button" type="button" onClick={() => { setContact(sampleContact); setStore(pickupStores[0]); }}>테스트 정보 채우기</button>
                        </div>
                    </aside>
                </form>
            )}
            <dialog className="order-dialog" ref={addressDialog} aria-labelledby="delivery-search-title">
                <h2 id="delivery-search-title">테스트 주소 검색</h2>
                <p>가상 배송에 사용할 예시 주소를 선택하세요.</p>
                <button type="button" className="order-button order-address-option" onClick={() => {
                    setContact((fields) => ({ ...fields, ...sampleAddress }));
                    addressDialog.current?.close();
                }}>{sampleAddress.postcode} · {sampleAddress.address}</button>
                <form method="dialog" className="order-dialog__actions"><button className="order-button">닫기</button></form>
            </dialog>
            <dialog className="order-dialog" ref={paymentDialog} aria-labelledby="demo-payment-title"
                onCancel={(event) => { if (submitting.current) event.preventDefault(); }}>
                <h2 id="demo-payment-title">가상 결제 승인</h2>
                {review && <p className="order-dialog__total">{review.payment} <strong>{amountInWon(paymentTotal)}</strong></p>}
                <p>결제를 승인하면 테스트 주문이 생성됩니다.</p>
                {paymentError && <p className="order-error" role="alert">{paymentError}</p>}
                <div className="order-dialog__actions">
                    <button className="order-button" type="button" disabled={pending} onClick={() => paymentDialog.current?.close()}>취소</button>
                    <button className="order-button order-button--primary" type="button" disabled={pending || cartChanged}
                        onClick={() => { void pay(); }}>{pending ? "처리 중" : "가상 결제 승인"}</button>
                </div>
            </dialog>
        </OrderPage>
    );
}

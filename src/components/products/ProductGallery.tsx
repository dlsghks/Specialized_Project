import { useRef, useState, type PointerEvent } from "react";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { photoFramingStyle } from "../../data/photoFraming";
import type { ProductPhoto } from "../../data/productTypes";

type ProductGalleryProps = {
    name: string;
    subtitle: string;
    badge?: string;
    colorName?: string;
    gallery: readonly ProductPhoto[];
};

export function ProductGallery({ name, subtitle, badge, colorName, gallery }: ProductGalleryProps) {
    const [{ view, direction, previousView }, setGallery] = useState({
        view: 0, direction: 0, previousView: null as number | null,
    });
    const swipe = useRef<{ id: number; x: number; y: number } | null>(null);
    const zoom = useRef<HTMLDialogElement>(null);
    const selected = gallery[view];
    const outgoing = previousView === null ? undefined : gallery[previousView];
    const hasMultipleViews = gallery.length > 1;
    const selectedPhotoName = [name, colorName, selected?.label].filter(Boolean).join(" · ");

    const moveGallery = (offset: number) => {
        if (!offset || !hasMultipleViews) return;
        setGallery((current) => ({
            ...current,
            previousView: current.view,
            view: (current.view + offset + gallery.length) % gallery.length,
            direction: Math.sign(offset),
        }));
    };

    const startSwipe = (event: PointerEvent<HTMLDivElement>) => {
        if (!hasMultipleViews || !event.isPrimary || event.button !== 0) return;
        swipe.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
        event.currentTarget.setPointerCapture(event.pointerId);
    };

    const finishSwipe = (event: PointerEvent<HTMLDivElement>) => {
        const start = swipe.current;
        if (!start || start.id !== event.pointerId) return;
        swipe.current = null;
        const x = event.clientX - start.x;
        const y = event.clientY - start.y;
        if (Math.abs(x) >= 40 && Math.abs(x) > Math.abs(y)) moveGallery(x < 0 ? 1 : -1);
    };

    return (
        <div className="product-detail__hero">
            <section className="product-gallery" aria-label="상품 이미지">
                <header className="product-gallery__heading">
                    {badge && <span>{badge}</span>}
                    <h1 id="product-name">{name}</h1>
                    <p>{subtitle}</p>
                </header>

                {selected && <>
                    <div className="product-gallery__image" data-swipe={hasMultipleViews} data-direction={direction}
                        onPointerDown={startSwipe} onPointerUp={finishSwipe}
                        onPointerCancel={() => { swipe.current = null; }}
                        onLostPointerCapture={(event) => {
                            if (swipe.current?.id === event.pointerId) swipe.current = null;
                        }}>
                        {outgoing && (
                            <div className="product-gallery__outgoing" key={outgoing.image + "-outgoing"} aria-hidden="true">
                                <img src={outgoing.image} alt="" width={1440} height={810} draggable={false}
                                    style={photoFramingStyle(outgoing.framing)} />
                            </div>
                        )}
                        <div className={outgoing ? "product-gallery__slide" : undefined}
                            onAnimationEnd={() => setGallery((current) =>
                                current.view === view ? { ...current, previousView: null } : current)}
                            key={selected.image}>
                            <img src={selected.image} alt={selectedPhotoName} width={1440} height={810} fetchPriority="high" draggable={false}
                                style={photoFramingStyle(selected.framing)} />
                        </div>
                    </div>

                    <button className="product-gallery__zoom" type="button" aria-label="이미지 확대" onClick={() => zoom.current?.showModal()}>
                        <Search size={20} aria-hidden="true" />
                    </button>
                    {hasMultipleViews && (
                        <>
                            <button className="product-gallery__previous" type="button" aria-label="이전 이미지" onClick={() => moveGallery(-1)}><ChevronLeft aria-hidden="true" /></button>
                            <button className="product-gallery__next" type="button" aria-label="다음 이미지" onClick={() => moveGallery(1)}><ChevronRight aria-hidden="true" /></button>
                            <div className="product-gallery__controls" role="group" aria-label="갤러리 사진 선택">
                                {gallery.map(({ label, image, thumbnail, framing }, index) => (
                                    <button key={label} type="button" aria-label={label} aria-pressed={view === index} onClick={() => moveGallery(index - view)}>
                                        <img src={thumbnail ?? image} alt="" width={104} height={59} style={photoFramingStyle(framing)} />
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </>}
            </section>

            {selected && <dialog className="product-detail__dialog" ref={zoom} aria-label="확대 이미지">
                <form method="dialog"><button aria-label="확대 이미지 닫기"><X size={22} aria-hidden="true" /></button></form>
                <div className="product-detail__dialog-photo">
                    <img src={selected.image} alt={selectedPhotoName} width={1440} height={810} style={photoFramingStyle(selected.framing)} />
                </div>
            </dialog>}
        </div>
    );
}

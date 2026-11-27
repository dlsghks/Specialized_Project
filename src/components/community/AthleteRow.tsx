import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide, type SwiperClass } from "swiper/react";
import "swiper/css";
import { athleteImage, type AthleteGroup } from "../../data/community";

const breakpoints = {
    640: { slidesPerView: 3 },
    980: { slidesPerView: 4 },
};

export function AthleteRow({ group, filtered }: { group: AthleteGroup; filtered: boolean }) {
    const slider = useRef<SwiperClass | null>(null);
    const [view, setView] = useState({ index: 0, visible: 4 });
    const total = group.athletes.length;
    const first = Math.min(view.index, Math.max(0, total - view.visible));
    const last = Math.min(total, first + view.visible);
    const overflowing = view.visible < total;
    const headingId = `community-group-${group.id}`;

    const updateView = (swiper: SwiperClass) => {
        const visible = typeof swiper.params.slidesPerView === "number" ? swiper.params.slidesPerView : 4;
        setView({ index: swiper.activeIndex, visible });
    };

    const move = (direction: -1 | 1) => {
        const limit = total - view.visible;
        const requested = Math.max(0, Math.min(limit, first + direction * view.visible));
        slider.current?.slideTo(requested);
    };

    return (
        <section className="community-athletes" aria-labelledby={headingId}>
            <header className="community-row-heading">
                <div>
                    <h2 id={headingId}>{group.label} <strong>{total}</strong></h2>
                    <p>{group.description}</p>
                </div>
                {overflowing ? (
                    <div className="community-athletes__arrows">
                        <button type="button" disabled={first === 0} onClick={() => move(-1)} aria-label={`${group.label} 이전 선수`}>
                            <ChevronLeft aria-hidden="true" />
                        </button>
                        <button type="button" disabled={last === total} onClick={() => move(1)} aria-label={`${group.label} 다음 선수`}>
                            <ChevronRight aria-hidden="true" />
                        </button>
                    </div>
                ) : !filtered && (
                    <Link className="community-row-heading__link" to={`?tab=athletes&discipline=${group.id}`} aria-label={`${group.label} 선수 전체 보기`}>전체 보기</Link>
                )}
            </header>
            <Swiper className="community-athletes__slider" slidesPerView={2} breakpoints={breakpoints} spaceBetween={14} grabCursor watchSlidesProgress
                speed={window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 360}
                onSwiper={(swiper) => { slider.current = swiper; updateView(swiper); }}
                onBreakpoint={updateView} onSlideChange={updateView}>
                {group.athletes.map((athlete) => (
                    <SwiperSlide key={athlete.id}>
                        {({ isVisible }) => <Link className="community-athlete" to={`/community/${athlete.id}`}
                            aria-label={`${athlete.name} 프로필 보기`} tabIndex={isVisible ? undefined : -1}>
                            <div className="community-athlete__photo">
                                <img src={athleteImage(athlete.id)} alt="" loading="lazy" draggable={false} />
                                <div className="community-athlete__overlay" aria-hidden="true">
                                    <span>{athlete.team}</span>
                                    <strong>{athlete.name}</strong>
                                    <span className="community-athlete__cta">프로필 보기</span>
                                </div>
                            </div>
                            <div className="community-card-meta">
                                <span>{athlete.country}</span>
                                <h3>{athlete.name}</h3>
                                <span>{athlete.team}</span>
                            </div>
                        </Link>}
                    </SwiperSlide>
                ))}
            </Swiper>
            {overflowing && (
                <div className="community-athletes__progress">
                    <p aria-live="polite">{group.label} 선수 {first + 1}–{last} / {total}</p>
                    <span aria-hidden="true">
                        <i style={{ width: `${(last - first) / total * 100}%`, left: `${first / total * 100}%` }} />
                    </span>
                </div>
            )}
        </section>
    );
}

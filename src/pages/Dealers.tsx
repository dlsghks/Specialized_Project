import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, LocateFixed, MapPin, Minus, Plus, Search, Store } from "lucide-react";
import { Link } from "react-router-dom";
import "../styles/pages/Dealers.scss";

const images = import.meta.env.BASE_URL + "images/home/";
const dealers = [
    { id: "seocho", district: "서초", name: "스페셜라이즈드 서초점", distance: "0.8", pin: [70.3, 39] },
    { id: "gangnam", district: "강남", name: "스페셜라이즈드 강남점", distance: "1.2", pin: [48, 69] },
    { id: "banpo", district: "반포", name: "스페셜라이즈드 반포점", distance: "1.9", pin: [85.7, 23.5] },
    { id: "bangbae", district: "방배", name: "스페셜라이즈드 방배점", distance: "2.4", pin: [32.5, 26.5] },
    { id: "yangjae", district: "양재", name: "스페셜라이즈드 양재점", distance: "3.1", pin: [91, 74] },
];
type Dealer = (typeof dealers)[number];
type SearchStage = "idle" | "locating" | "results" | "empty" | "nearby" | "store";

export function DealerFinder({ home = false }: { home?: boolean }) {
    const [query, setQuery] = useState("");
    const [submittedQuery, setSubmittedQuery] = useState("");
    const [stage, setStage] = useState<SearchStage>("idle");
    const [selected, setSelected] = useState<Dealer | null>(null);
    const [returnStage, setReturnStage] = useState<SearchStage>("results");
    const [mapZoom, setMapZoom] = useState(1);
    const headingId = home ? "home-dealers-heading" : "dealers-heading";
    const matches = dealers.filter(({ name }) => name.includes(submittedQuery));
    const visible = stage === "results" ? matches : dealers;
    const mapImage = stage === "idle" || (stage === "store" && selected !== dealers[0]) ? "results" : stage;
    const Heading = home ? "h2" : "h1";
    const PanelHeading = home ? "h3" : "h2";

    useEffect(() => {
        if (stage !== "locating") return;
        const timer = window.setTimeout(() => setStage("nearby"), 700);
        return () => window.clearTimeout(timer);
    }, [stage]);

    const findNearby = () => {
        setQuery("");
        setSubmittedQuery("");
        setSelected(null);
        setMapZoom(1);
        setStage("locating");
    };

    const search = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const term = query.trim();
        if (!term) {
            findNearby();
            return;
        }
        setSubmittedQuery(term);
        setSelected(null);
        setMapZoom(1);
        setStage(dealers.some(({ name }) => name.includes(term)) ? "results" : "empty");
    };

    const choose = (dealer: Dealer) => {
        setReturnStage(stage === "idle" ? "nearby" : stage);
        setSelected(dealer);
        setStage("store");
    };

    return (
        <section className={home ? "dealer-finder" : "dealer-finder dealer-finder--page"} aria-labelledby={headingId}>
            <header>
                <Heading id={headingId}>FIND A STORE &amp; TEST RIDE</Heading>
                <p>가까운 매장에서 직접 타 보고 결정하세요.</p>
            </header>
            <div className="dealer-finder__layout">
                <div className="dealer-finder__panel">
                    <PanelHeading>대리점 찾기</PanelHeading>
                    <form className="dealer-finder__search" onSubmit={search}>
                        <Search size={17} aria-hidden="true" />
                        <input aria-label="지역 또는 매장명" placeholder="지역 · 매장명 검색"
                            value={query} onChange={(event) => setQuery(event.target.value)} />
                        <button type="submit" aria-label="매장 검색"><ArrowRight size={18} aria-hidden="true" /></button>
                    </form>

                    {stage === "idle" && <button className="dealer-finder__location" type="button" onClick={findNearby}><LocateFixed size={17} aria-hidden="true" /> 내 주변 매장 보기</button>}
                    {stage === "locating" && <p className="dealer-finder__message" role="status">현재 위치 기준으로 가까운 매장을 찾고 있어요.</p>}
                    {stage === "empty" && (
                        <div className="dealer-finder__message" role="status">
                            <p>‘{submittedQuery}’ 검색 결과가 없어요.</p>
                            <p>가까운 매장을 대신 보여드릴게요.</p>
                        </div>
                    )}
                    {(stage === "results" || stage === "nearby" || stage === "empty") && (
                        <div className="dealer-finder__results">
                            <h3>{stage === "results" ? "검색 결과 " + visible.length + "곳" : "가까운 매장 추천"}</h3>
                            <ul>
                                {visible.map((dealer, index) => (
                                    <li key={dealer.id}>
                                        <button type="button" onClick={() => choose(dealer)}>
                                            <span className="dealer-finder__pin-number" aria-hidden="true">{dealers.indexOf(dealer) + 1}</span>
                                            <span>{dealer.name}{index === 0 && stage !== "results" && <small>가장 가까운 매장</small>}</span>
                                            <span>{dealer.distance} km</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {stage === "store" && selected && (
                        <div className="dealer-finder__detail">
                            <button type="button" onClick={() => { setSelected(null); setStage(returnStage); }}>
                                <ArrowLeft size={15} aria-hidden="true" /> 매장 목록
                            </button>
                            <h3>{selected.name}</h3>
                            <dl>
                                <div><dt>거리</dt><dd>{selected.distance} km</dd></div>
                                <div><dt>지역</dt><dd>서울 {selected.district}</dd></div>
                            </dl>
                            <Link className="dealer-finder__action dealer-finder__action--red" to={"/dealers/reserve?store=" + selected.id}>시승 예약 <ArrowRight size={16} aria-hidden="true" /></Link>
                        </div>
                    )}
                    {stage === "idle" && <button className="dealer-finder__action" type="button" onClick={findNearby}><Store size={16} aria-hidden="true" /> 대리점 찾기 <ArrowRight size={16} aria-hidden="true" /></button>}
                    <p className="dealer-finder__note">예시 매장과 거리로 검색 흐름을 확인할 수 있어요.</p>
                </div>

                <div className="dealer-finder__map" role="group" aria-label="예시 매장 지도">
                    <div className="dealer-finder__map-image" style={{ transform: "scale(" + mapZoom + ")" }}>
                        <img src={images + "dealer-" + mapImage + ".webp"} alt="" width={1166} height={638} loading="lazy" />
                        {stage !== "locating" && stage !== "store" && (
                            <div className="dealer-finder__pins">
                                {visible.map((dealer) => (
                                    <button key={dealer.id} type="button" title={dealer.name} aria-label={dealer.name + " 지도에서 선택"}
                                        style={{ left: dealer.pin[0] + "%", top: dealer.pin[1] + "%" }}
                                        onClick={() => choose(dealer)} />
                                ))}
                            </div>
                        )}
                        {selected && (
                            <span className="dealer-finder__active-pin" style={{ left: selected.pin[0] + "%", top: selected.pin[1] + "%" }}>
                                <MapPin size={18} aria-hidden="true" />
                            </span>
                        )}
                    </div>
                    <div className="dealer-finder__zoom" role="group" aria-label="지도 확대 및 축소">
                        <button type="button" aria-label="지도 확대" disabled={mapZoom >= 1.5} onClick={() => setMapZoom((zoom) => zoom + 0.25)}><Plus size={17} aria-hidden="true" /></button>
                        <button type="button" aria-label="지도 축소" disabled={mapZoom <= 1} onClick={() => setMapZoom((zoom) => zoom - 0.25)}><Minus size={17} aria-hidden="true" /></button>
                    </div>
                    <button className="dealer-finder__map-location" type="button" aria-label="내 주변 매장 찾기" onClick={findNearby}><LocateFixed size={21} aria-hidden="true" /></button>
                </div>
            </div>
        </section>
    );
}

export const Dealers = () => <DealerFinder />;

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, LocateFixed, Minus, Plus, Search, Store } from "lucide-react";
import "../styles/pages/Dealers.scss";

type Place = { id: string; place_name: string; address_name: string; road_address_name: string; phone: string; x: string; y: string; distance: string; place_url: string };
type Point = object;
type MapInstance = { setCenter(p: Point): void; panTo(p: Point): void; getLevel(): number; setLevel(n: number): void; setBounds(b: object): void; relayout(): void };
type Overlay = { setMap(m: MapInstance | null): void };
type Maps = {
    load(cb: () => void): void;
    LatLng: new (lat: number, lng: number) => Point;
    LatLngBounds: new () => { extend(p: Point): void };
    Map: new (el: HTMLElement, options: { center: Point; level: number }) => MapInstance;
    CustomOverlay: new (options: { position: Point; content: HTMLElement; yAnchor: number }) => Overlay;
    services: { Places: new () => { keywordSearch(q: string, cb: (data: Place[], status: string) => void, options?: { location: Point; sort: string }): void }; Status: { OK: string; ZERO_RESULT: string }; SortBy: { DISTANCE: string } };
};
let sdkPromise: Promise<Maps> | undefined;
function loadMaps(): Promise<Maps> {
    if (sdkPromise) return sdkPromise;
    sdkPromise = new Promise<Maps>((resolve, reject) => {
        const key = import.meta.env.VITE_KAKAO_MAP_KEY;
        if (!key) { reject(new Error("카카오맵 키가 설정되지 않았어요.")); return; }
        const getMaps = () => (window as unknown as { kakao?: { maps?: Maps } }).kakao?.maps;
        const ready = () => {
            const maps = getMaps();
            if (!maps) { reject(new Error("카카오맵 SDK를 불러오지 못했어요.")); return; }
            maps.load(() => resolve(maps));
        };
        if (getMaps()) { ready(); return; }
        const script = document.createElement("script");
        script.src = "https://dapi.kakao.com/v2/maps/sdk.js?appkey=" + encodeURIComponent(key) + "&autoload=false&libraries=services";
        script.async = true;
        script.onload = ready;
        script.onerror = () => { script.remove(); reject(new Error("카카오맵 연결에 실패했어요.")); };
        document.head.appendChild(script);
    }).catch((error: unknown) => { sdkPromise = undefined; throw error; });
    return sdkPromise;
}

export function DealerFinder({ home = false }: { home?: boolean }) {
    const [query, setQuery] = useState("");
    const [places, setPlaces] = useState<Place[]>([]);
    const [selected, setSelected] = useState<Place | null>(null);
    const [message, setMessage] = useState("지도를 불러오는 중이에요.");
    const [ready, setReady] = useState(false);
    const [nearby, setNearby] = useState(false);
    const container = useRef<HTMLDivElement>(null);
    const map = useRef<MapInstance | null>(null);
    const sdk = useRef<Maps | null>(null);
    const overlays = useRef<Overlay[]>([]);
    const request = useRef(0);
    const headingId = home ? "home-dealers-heading" : "dealers-heading";
    const Heading = home ? "h2" : "h1";
    const PanelHeading = home ? "h3" : "h2";

    useEffect(() => {
        let active = true;
        let observer: ResizeObserver | undefined;
        loadMaps().then((maps) => {
            if (!active || !container.current) return;
            sdk.current = maps;
            const instance = new maps.Map(container.current, { center: new maps.LatLng(37.4979, 127.0276), level: 7 });
            map.current = instance;
            observer = new ResizeObserver(() => instance.relayout());
            observer.observe(container.current);
            setReady(true);
            setMessage("지역 또는 매장명을 검색해 주세요.");
        }).catch((error: Error) => { if (active) setMessage(error.message); });
        return () => {
            active = false;
            request.current++;
            observer?.disconnect();
            overlays.current.forEach((overlay) => overlay.setMap(null));
            overlays.current = [];
            map.current = null;
            sdk.current = null;
        };
    }, []);

    useEffect(() => {
        const maps = sdk.current;
        const instance = map.current;
        if (!maps || !instance) return;
        overlays.current.forEach((overlay) => overlay.setMap(null));
        const bounds = new maps.LatLngBounds();
        overlays.current = places.map((place, index) => {
            const position = new maps.LatLng(Number(place.y), Number(place.x));
            bounds.extend(position);
            const button = document.createElement("button");
            button.type = "button";
            button.textContent = String(index + 1);
            button.title = place.place_name;
            button.setAttribute("aria-label", place.place_name);
            button.style.cssText = "width:30px;height:30px;border:2px solid white;border-radius:50%;background:#a80000;color:white;font-weight:700;cursor:pointer;box-shadow:0 2px 5px #0004";
            button.onclick = () => { setSelected(place); instance.panTo(position); };
            const overlay = new maps.CustomOverlay({ position, content: button, yAnchor: 1 });
            overlay.setMap(instance);
            return overlay;
        });
        if (places.length > 1) instance.setBounds(bounds);
        else if (places.length === 1) instance.panTo(new maps.LatLng(Number(places[0].y), Number(places[0].x)));
        return () => { overlays.current.forEach((overlay) => overlay.setMap(null)); overlays.current = []; };
    }, [places]);

    const lookup = (term: string, location?: Point) => {
        const maps = sdk.current;
        if (!maps) return;
        const token = ++request.current;
        setSelected(null);
        setNearby(Boolean(location));
        setPlaces([]);
        setMessage("매장을 검색하고 있어요.");
        new maps.services.Places().keywordSearch(term ? "스페셜라이즈드 " + term : "스페셜라이즈드", (data, status) => {
            if (token !== request.current) return;
            if (status === maps.services.Status.OK) {
                setPlaces(data);
                setMessage("");
            } else {
                setMessage(status === maps.services.Status.ZERO_RESULT ? "검색 결과가 없어요. 다른 지역이나 매장명으로 검색해 주세요." : "매장 검색에 실패했어요. 잠시 후 다시 시도해 주세요.");
            }
        }, location ? { location, sort: maps.services.SortBy.DISTANCE } : undefined);
    };
    const findNearby = () => {
        if (!ready || !sdk.current) return;
        if (!navigator.geolocation) { setMessage("이 브라우저는 위치 정보를 지원하지 않아요."); return; }
        const token = ++request.current;
        setMessage("현재 위치를 확인하고 있어요.");
        navigator.geolocation.getCurrentPosition(({ coords }) => {
            if (token !== request.current || !sdk.current) return;
            const point = new sdk.current.LatLng(coords.latitude, coords.longitude);
            map.current?.panTo(point);
            lookup("", point);
        }, () => { if (token === request.current) setMessage("위치 권한을 확인하거나 지역명으로 검색해 주세요."); }, { timeout: 10000 });
    };
    const search = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); lookup(query.trim()); };
    const choose = (place: Place) => {
        setSelected(place);
        if (sdk.current) map.current?.panTo(new sdk.current.LatLng(Number(place.y), Number(place.x)));
    };

    return (
        <section className={home ? "dealer-finder" : "dealer-finder dealer-finder--page"} aria-labelledby={headingId}>
            <header><Heading id={headingId}>FIND A STORE &amp; TEST RIDE</Heading><p>가까운 매장에서 직접 타 보고 결정하세요.</p></header>
            <div className="dealer-finder__layout">
                <div className="dealer-finder__panel">
                    <PanelHeading>대리점 찾기</PanelHeading>
                    <form className="dealer-finder__search" onSubmit={search}>
                        <Search size={17} aria-hidden="true" />
                        <input aria-label="지역 또는 매장명" placeholder="지역 · 매장명 검색" value={query} onChange={(event) => setQuery(event.target.value)} />
                        <button type="submit" disabled={!ready} aria-label="매장 검색"><ArrowRight size={18} /></button>
                    </form>
                    <button className="dealer-finder__location" type="button" disabled={!ready} onClick={findNearby}><LocateFixed size={17} /> 내 주변 매장 보기</button>
                    {message && <p className="dealer-finder__message" role="status">{message}</p>}
                    {!selected && places.length > 0 && <div className="dealer-finder__results"><h3>검색 결과 {places.length}곳</h3><ul>{places.map((place, index) => <li key={place.id}><button type="button" onClick={() => choose(place)}><span className="dealer-finder__pin-number">{index + 1}</span><span>{place.place_name}<small>{place.road_address_name || place.address_name}</small></span><span>{nearby && place.distance ? (Number(place.distance) / 1000).toFixed(1) + " km" : ""}</span></button></li>)}</ul></div>}
                    {selected && <div className="dealer-finder__detail">
                        <button type="button" onClick={() => setSelected(null)}><ArrowLeft size={15} /> 매장 목록</button>
                        <h3>{selected.place_name}</h3>
                        <dl><div><dt>주소</dt><dd>{selected.road_address_name || selected.address_name}</dd></div>{selected.phone && <div><dt>전화</dt><dd>{selected.phone}</dd></div>}</dl>
                        <a className="dealer-finder__action dealer-finder__action--red" href={"https://map.kakao.com/link/to/" + encodeURIComponent(selected.place_name) + "," + selected.y + "," + selected.x} target="_blank" rel="noreferrer">길 찾기 <ArrowRight size={16} /></a>
                        <a href={selected.place_url} target="_blank" rel="noreferrer">카카오맵 상세보기</a>
                    </div>}
                    {!selected && places.length === 0 && <button className="dealer-finder__action" type="button" disabled={!ready} onClick={() => lookup("")}><Store size={16} /> 대리점 찾기 <ArrowRight size={16} /></button>}
                    <p className="dealer-finder__note">카카오맵 장소 검색 결과이며 공식 대리점 여부는 방문 전 확인해 주세요.</p>
                </div>
                <div className="dealer-finder__map" role="group" aria-label="카카오맵 매장 지도">
                    <div ref={container} style={{ width: "100%", height: "100%", minHeight: 240 }} />
                    <div className="dealer-finder__zoom" style={{ zIndex: 5 }} role="group" aria-label="지도 확대 및 축소">
                        <button type="button" disabled={!ready} aria-label="지도 확대" onClick={() => { const m = map.current; if (m) m.setLevel(Math.max(1, m.getLevel() - 1)); }}><Plus size={17} /></button>
                        <button type="button" disabled={!ready} aria-label="지도 축소" onClick={() => { const m = map.current; if (m) m.setLevel(Math.min(14, m.getLevel() + 1)); }}><Minus size={17} /></button>
                    </div>
                    <button className="dealer-finder__map-location" style={{ zIndex: 5 }} type="button" disabled={!ready} aria-label="내 주변 매장 찾기" onClick={findNearby}><LocateFixed size={21} /></button>
                </div>
            </div>
        </section>
    );
}
export const Dealers = () => <DealerFinder />;

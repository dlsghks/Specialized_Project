import { useRef, useState } from "react";
import { ArrowRight, Bookmark, Check, ChevronDown, ChevronRight, CircleHelp, Eye, List, MessageCircle, RotateCcw, X, ZoomIn, ZoomOut } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import "../styles/pages/Customize.scss";

import { gearImage, readGearCart, writeGearCart, type GearItem } from "./gearCart";
import { bikePhoto, customizeBikes } from "./customizeBikes";
const roadColors = [
    { name: "Satin Silver Dust", image: "satin-silver-dust.webp", finish: "linear-gradient(90deg, #c9cbce 40%, #7a7d7e)" },
    { name: "Gloss White Silver Metallic", image: "gloss-white-silver-metallic.webp", finish: "linear-gradient(90deg, #efeff1 43%, #b60022)" },
    { name: "Gloss Ruby Metallic", image: "gloss-ruby-metallic.webp", finish: "linear-gradient(90deg, #d2d7d7 40%, #86262f)" },
];
const categoryCards = [
    { id: "demo-11", label: "산악", image: "mountain.webp" },
    { id: "crux-5", label: "그래블", image: "gravel.webp" },
    { id: "tarmac-sl9", label: "로드", image: "road.webp" },
];
const steps = ["CATEGORY", "MODEL", "SIZE", "COLOR", "TIRES", "WHEELS", "HANDLEBAR", "SADDLES", "추천 장비"];
const gearStep = steps.length - 1;

const recommendedGear: Record<string, GearItem[]> = {
    "tarmac-sl9": [
        { name: "S-Works Prevail 3", image: "S-Works_Prevail3.webp" },
        { name: "S-Works Ares 2", image: "S-Works_Ares2.webp" },
        { name: "S-Works Carbon Rib Cage 3", image: "S-Works_Carbon_Rib_Cage3.webp" },
        { name: "S-Works Torch", image: "S-Works_Torch.webp" },
        { name: "S-Works Evade 4", image: "S-Works_Evade4.webp" },
    ],
};
type FrameColor = { name: string; finish: string; image?: string };

const modelOptions: Record<string, { sizes: (number | string)[]; colors: FrameColor[]; price: number }> = {
    "tarmac-sl9": { sizes: [44, 49, 52, 54, 56, 58], colors: roadColors, price: 20900000 },
    "demo-11": {
        sizes: ["S3", "S4"],
        colors: [
            { name: "Satin Powder Indigo", finish: `url("${import.meta.env.BASE_URL}images/customize/swatches/satin-powder-indigo.png") center / cover no-repeat`, image: "demo-11-preview.webp" },
            { name: "Gloss Charcoal", image: "demo-gloss-charcoal.webp", finish: `url("${import.meta.env.BASE_URL}images/customize/swatches/demo-gray-white.png") center / cover no-repeat` },
        ],
        price: 14900000,
    },
    "crux-5": {
        sizes: [49, 52, 54, 56, 58],
        colors: [
            { name: "Redwood Metallic", finish: `url("${import.meta.env.BASE_URL}images/customize/swatches/redwood-metallic.png") center / cover no-repeat`, image: "crux-5-preview.webp" },
            { name: "Deep Marine Metallic", image: "crux-deep-marine-metallic.webp", finish: `url("${import.meta.env.BASE_URL}images/customize/swatches/crux-gray-silver.png") center / cover no-repeat` },
        ],
        price: 12500000,
    },
};

function readBuild(storageKey: string, sizes: (number | string)[], colors: FrameColor[]): { size: number | string | null; color: number | null } {
    try {
        const saved = JSON.parse(localStorage.getItem(storageKey) ?? "null");
        return {
            size: sizes.includes(saved?.size) ? saved.size : null,
            color: Number.isInteger(saved?.color) && colors[saved.color] ? saved.color : null,
        };
    } catch {
        return { size: null, color: null };
    }
}

export function Customize() {
    const { id } = useParams();
    const { state } = useLocation();
    const bike = customizeBikes.find((item) => item.id === id);
    return bike ? <BikeCustomizer key={bike.id} bike={bike} initialStep={state?.modelSelected ? 2 : 0} /> : <Link to="/customize">모델 선택으로 돌아가기</Link>;
}

function BikeCustomizer({ bike, initialStep }: { bike: (typeof customizeBikes)[number]; initialStep: number }) {
    const { name: model, category } = bike;
    const { sizes, colors, price } = modelOptions[bike.id];
    const storageKey = `specialized-${bike.id}-build`;
    const [categoryId, setCategoryId] = useState(bike.id);
    const [build, setBuild] = useState(() => readBuild(storageKey, sizes, colors));
    const previewColor = colors[build.color ?? 0];
    const [step, setStep] = useState(initialStep);
    const [furthestStep, setFurthestStep] = useState(initialStep);
    const [confirmedParts, setConfirmedParts] = useState(0);
    const gear = recommendedGear[bike.id] ?? [];
    const advance = () => {
        const nextStep = step + 1;
        setFurthestStep((furthest) => Math.max(furthest, nextStep));
        setStep(nextStep);
    };
    const [summaryOpen, setSummaryOpen] = useState(true);
    const [helpOpen, setHelpOpen] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [notice, setNotice] = useState("");
    const [cartItems, setCartItems] = useState(readGearCart);
    const [gearDetail, setGearDetail] = useState<GearItem | null>(null);
    const [gearNotice, setGearNotice] = useState("");
    const gearDialog = useRef<HTMLDialogElement>(null);

    const addGear = (item: GearItem) => {
        const current = readGearCart();
        const next = current.some(({ image }) => image === item.image) ? current : [...current, item];
        try {
            writeGearCart(next);
            setCartItems(next);
            setGearNotice(`${item.name}을(를) 장바구니에 담았어요.`);
        } catch {
            setGearNotice("장비를 장바구니에 담지 못했어요.");
        }
    };

    const helpToggle = useRef<HTMLButtonElement>(null);
    const closeHelp = () => {
        setHelpOpen(false);
        helpToggle.current?.focus();
    };
    const values = [category, model.toUpperCase(), build.size?.toString(), build.color === null ? undefined : colors[build.color].name, ...Array.from({ length: confirmedParts }, () => "기본 구성")];

    const save = () => {
        try {
            localStorage.setItem(storageKey, JSON.stringify(build));
            setNotice("이 브라우저에 구성을 저장했어요.");
        } catch {
            setNotice("구성을 저장하지 못했어요.");
        }
    };

    return (
        <article className="bike-build">
            <div className="bike-build__workspace" data-summary={summaryOpen}>
                <section className="bike-build__preview" aria-label="자전거 미리보기">
                    <header><p>CONFIGURE</p><h1>{model}</h1></header>
                    <button ref={helpToggle} type="button" className="bike-build__help" aria-controls="bike-build-help" aria-label="커스터마이징 도움말" aria-expanded={helpOpen} onClick={() => setHelpOpen(!helpOpen)}>
                        <CircleHelp size={30} aria-hidden="true" />
                    </button>
                    <section id="bike-build-help" className="bike-build__help-panel" aria-labelledby="bike-build-help-title" hidden={!helpOpen}
                        onKeyDown={(event) => { if (event.key === "Escape") closeHelp(); }}>
                        <div className="bike-build__help-heading">
                            <CircleHelp size={20} aria-hidden="true" />
                            <h2 id="bike-build-help-title">3D 커스터마이징 도움말</h2>
                            <button type="button" aria-label="도움말 닫기" onClick={closeHelp}><X size={20} aria-hidden="true" /></button>
                        </div>
                        <ul>
                            <li><span><List size={20} aria-hidden="true" /></span><div><strong>옵션 선택</strong><p>아래 메뉴에서 항목을 고르고 원하는 옵션을 선택하세요.</p></div></li>
                            <li><span><RotateCcw size={20} aria-hidden="true" /></span><div><strong>3D 화면 조작</strong><p>버튼으로 제품 이미지를 확대하거나 축소하세요.</p></div></li>
                            <li><span><Eye size={20} aria-hidden="true" /></span><div><strong>선택 결과 확인</strong><p>선택한 옵션은 오른쪽 SUMMARY에 반영돼요. 사진이 준비된 컬러는 미리보기에서도 확인할 수 있어요.</p></div></li>
                        </ul>
                        <Link to="/support"><MessageCircle size={19} aria-hidden="true" /> 고객 지원 연결 <ChevronRight size={19} aria-hidden="true" /></Link>
                    </section>
                    <div className="bike-build__stage">
                        <img src={`${import.meta.env.BASE_URL}images/customize/${previewColor.image ?? colors[0].image}`} width={900} height={506} alt={`${model} · ${previewColor.image ? previewColor.name : colors[0].name}`} style={{ scale: zoom }} />
                    </div>
                    {!previewColor.image && <p role="status">선택한 컬러의 사진은 준비 중이에요. 기본 컬러를 표시하고 있어요.</p>}
                    <div className="bike-build__controls" aria-label="미리보기 조작">
                        <button type="button" disabled aria-label="3D 회전 준비 중" title="3D 회전 준비 중"><RotateCcw /></button>
                        <button type="button" aria-label="확대" disabled={zoom >= 1.6} onClick={() => setZoom(Math.min(1.6, zoom + .15))}><ZoomIn /></button>
                        <button type="button" aria-label="축소" disabled={zoom <= .7} onClick={() => setZoom(Math.max(.7, zoom - .15))}><ZoomOut /></button>
                        <button type="button" aria-label="미리보기 초기화" onClick={() => setZoom(1)}><RotateCcw /></button>
                    </div>
                </section>
                <div className="bike-build__summary-slot">
                    <div className="bike-build__summary-clip">
                        <aside className="bike-build__summary" aria-label="선택 요약">
                            <div className="bike-build__summary-top">
                                <button className="bike-build__summary-save" type="button" onClick={save} inert={!summaryOpen}><Bookmark size={17} /> 저장</button>
                                <button className="bike-build__summary-toggle" type="button" aria-expanded={summaryOpen}
                                    aria-controls="bike-build-summary-content" aria-label={summaryOpen ? "선택 요약 접기" : "선택 요약 펼치기"}
                                    onClick={() => setSummaryOpen((open) => !open)}>
                                    {!summaryOpen && <span>선택 요약</span>}
                                    <ChevronDown size={22} aria-hidden="true" />
                                </button>
                            </div>
                            <div id="bike-build-summary-content" className="bike-build__summary-content" inert={!summaryOpen}>
                                <h2>SUMMARY</h2>
                                <p className="bike-build__model">{model}</p>
                                <dl>
                                    {steps.slice(0, gearStep).map((label, index) => (
                                        <div key={label} className="bike-build__summary-row" data-current={step === index} data-pending={index > furthestStep}>
                                            <dt>{label}</dt>
                                            <dd>{values[index] ?? (step === index ? "선택 중" : "—")}{values[index] && <Check size={13} aria-hidden="true" />}</dd>
                                            {values[index] && index <= furthestStep && <button type="button" aria-label={`${label} 변경`} onClick={() => setStep(index)}>변경</button>}
                                        </div>
                                    ))}
                                    <div className="bike-build__summary-row" data-current={step === gearStep} data-pending={gearStep > furthestStep}>
                                        <dt>{steps[gearStep]}</dt>
                                        <dd>{gear.length ? `추천 제품 ${gear.length}개` : "준비 중"}</dd>
                                        {gearStep <= furthestStep && <button type="button" aria-label="추천 장비 변경" onClick={() => setStep(gearStep)}>변경</button>}
                                    </div>
                                </dl>
                                <div className="bike-build__total"><span>합산 가격</span><strong>₩ {build.size && build.color !== null ? price.toLocaleString("ko-KR") : "00,000,000"}</strong></div>
                                <button className="bike-build__cart" type="button" disabled title="장바구니 연결 준비 중">장바구니 담기</button>
                                {notice && <p role="status" className="bike-build__notice">{notice}</p>}
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
            <nav className="bike-build__steps" aria-label="커스터마이징 단계">
                {steps.map((label, index) => (
                    <button key={label} type="button" aria-current={step === index ? "step" : undefined} disabled={index > furthestStep} onClick={() => setStep(index)}>
                        <span>{index + 1}</span><span>{label}{step === index && index === 3 && <small>컬러를 선택하세요</small>}</span>
                    </button>
                ))}
            </nav>
            {step < steps.length && <section className="bike-build__options" aria-label={`${steps[step]} 옵션`}>
                {step === 3 && colors.map(({ name, finish }, index) => (
                    <button className="bike-build__color" key={name} type="button" aria-pressed={build.color === index} onClick={() => { setBuild({ ...build, color: index }); advance(); }}>
                        <span className="bike-build__swatch" style={{ background: finish }} />
                        <span>
                            <strong>프레임 컬러 {index + 1}</strong>
                            <small>{name}</small>
                            {build.color === index && <span className="bike-build__color-selected" aria-hidden="true">선택됨</span>}
                        </span>
                        {build.color === index && (
                            <span className="bike-build__color-check" aria-hidden="true"><Check size={13} strokeWidth={3} /></span>
                        )}
                    </button>
                ))}
                {step === 2 && sizes.map((size) => <button className="bike-build__option" key={size} type="button" aria-pressed={build.size === size} onClick={() => { setBuild({ ...build, size }); advance(); }}>{size}</button>)}
                {step === 1 && customizeBikes.filter((item) => item.id === categoryId).map(({ id, name }) => (
                    <Link className="bike-build__option bike-build__bike-card" key={id}
                        to={`/customize/${id}`} state={{ modelSelected: true }} onClick={() => { if (id === bike.id) advance(); }}>
                        <img src={bikePhoto(id)} alt="" width={800} height={475} style={{ height: 100, objectFit: "contain" }} />
                        <strong>{name}</strong>
                    </Link>
                ))}
                {step === 0 && categoryCards.map(({ id, label, image }) => (
                    <button key={id} type="button" className="bike-build__option bike-build__bike-card bike-build__category-card" aria-pressed={categoryId === id}
                        onClick={() => {
                            setCategoryId(id);
                            if (id !== bike.id) setFurthestStep(1);
                            advance();
                        }}>
                        <img src={`${import.meta.env.BASE_URL}images/customize/categories/${image}`} alt="" width={272} height={100} />
                        <strong>{label}</strong>
                    </button>
                ))}
                {step >= 4 && step < gearStep && (
                    <button className="bike-build__option" type="button" onClick={() => {
                        setConfirmedParts((count) => Math.max(count, step - 3));
                        advance();
                    }}>기본 구성 유지</button>
                )}
                {step === gearStep && (
                    <div className="bike-build__gear">
                        <div className="bike-build__gear-heading">
                            <h2>추천 장비</h2>
                            <button className="bike-build__finish" type="button" onClick={() => { setSummaryOpen(true); setNotice("구성이 완료됐어요."); advance(); }}><Check size={18} aria-hidden="true" /> 구성 완료</button>
                        </div>
                        {gear.length ? (
                            <ul>
                                {gear.map(({ name, image }) => (
                                    <li key={image}>
                                        <div className="bike-build__gear-media">
                                            <img src={gearImage(image)} alt="" width={240} height={135} />
                                            <button className="bike-build__gear-detail" type="button" aria-label={`${name} 상세보기`} onClick={() => {
                                                setGearDetail({ name, image });
                                                gearDialog.current?.showModal();
                                            }}>상세보기 <ArrowRight size={16} aria-hidden="true" /></button>
                                        </div>
                                        <div className="bike-build__gear-body">
                                            <strong>{name}</strong>
                                            {cartItems.some((item) => item.image === image) ? (
                                                <Link className="bike-build__gear-add" to="/cart" aria-label={`${name} 담김, 장바구니 보기`}>담김 <ArrowRight size={14} aria-hidden="true" /></Link>
                                            ) : <button className="bike-build__gear-add" type="button" aria-label={`${name} 담기`} onClick={() => addGear({ name, image })}>담기</button>}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : <p>이 모델의 추천 장비는 준비 중이에요.</p>}
                        {gearNotice && <p role="status">{gearNotice}</p>}
                    </div>
                )}
            </section>}
            <dialog className="bike-build__gear-dialog" ref={gearDialog} aria-label={gearDetail?.name ?? "추천 장비 상세"}>
                <form method="dialog"><button aria-label="상세보기 닫기"><X size={20} aria-hidden="true" /></button></form>
                {gearDetail && <>
                    <h2>{gearDetail.name}</h2>
                    <img src={gearImage(gearDetail.image)} alt={gearDetail.name} />
                </>}
            </dialog>
        </article>
    );
}

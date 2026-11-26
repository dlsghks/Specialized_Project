import { useRef, useState } from "react";
import { Bookmark, Check, ChevronDown, ChevronRight, CircleHelp, Eye, List, MessageCircle, RotateCcw, X, ZoomIn, ZoomOut } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import "../styles/pages/Customize.scss";

import { bikePhoto, customizeBikes } from "./customizeBikes";
const sizes = [44, 49, 52, 54, 56, 58, 61];
const colors = [
    { name: "Satin Silver Dust", image: "satin-silver-dust.webp", finish: "linear-gradient(90deg, #c9cbce 40%, #7a7d7e)" },
    { name: "Gloss White Silver Metallic", image: "gloss-white-silver-metallic.webp", finish: "linear-gradient(90deg, #efeff1 43%, #b60022)" },
    { name: "Gloss Ruby Metallic", image: "gloss-ruby-metallic.webp", finish: "linear-gradient(90deg, #d2d7d7 40%, #86262f)" },
];
const steps = ["CATEGORY", "MODEL", "SIZE", "COLOR", "TIRES", "WHEELS", "HANDLEBAR", "SADDLES"];
const storageKey = "specialized-tarmac-sl9-build";

function readBuild(): { size: number | null; color: number | null } {
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
    const bike = customizeBikes.find((item) => item.id === id);
    return bike ? <BikeCustomizer key={bike.id} bike={bike} /> : <Link to="/customize">모델 선택으로 돌아가기</Link>;
}

function BikeCustomizer({ bike }: { bike: (typeof customizeBikes)[number] }) {
    const { name: model, category } = bike;
    const isRoad = bike.id === "tarmac-sl9";
    const [categoryId, setCategoryId] = useState(bike.id);
    const [build, setBuild] = useState(() => isRoad ? readBuild() : { size: null, color: null });
    const previewColor = colors[build.color ?? 0];
    const [step, setStep] = useState(isRoad ? 3 : 1);
    const [summaryOpen, setSummaryOpen] = useState(true);
    const [helpOpen, setHelpOpen] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [notice, setNotice] = useState("");
    const helpToggle = useRef<HTMLButtonElement>(null);
    const closeHelp = () => {
        setHelpOpen(false);
        helpToggle.current?.focus();
    };
    const values = [category, model.toUpperCase(), build.size?.toString(), build.color === null ? undefined : colors[build.color].name];

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
                            <li><span><Eye size={20} aria-hidden="true" /></span><div><strong>선택 결과 확인</strong><p>선택한 컬러는 미리보기와 오른쪽 SUMMARY에 바로 반영됩니다.</p></div></li>
                        </ul>
                        <Link to="/support"><MessageCircle size={19} aria-hidden="true" /> 고객 지원 연결 <ChevronRight size={19} aria-hidden="true" /></Link>
                    </section>
                    <div className="bike-build__stage">
                        <img src={isRoad ? `${import.meta.env.BASE_URL}images/customize/${previewColor.image}` : `${import.meta.env.BASE_URL}images/customize/${bike.id}-preview.webp`} width={900} height={506} alt={isRoad ? `${model} · ${previewColor.name}` : model} style={{ scale: zoom }} />
                    </div>
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
                                <button className="bike-build__summary-save" type="button" onClick={save} disabled={!isRoad} inert={!summaryOpen}><Bookmark size={17} /> 저장</button>
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
                                    {steps.map((label, index) => (
                                        <div key={label} className="bike-build__summary-row" data-current={step === index} data-pending={index >= 4}>
                                            <dt>{label}</dt>
                                            <dd>{values[index] ?? (step === index ? "선택 중" : "—")}{values[index] && <Check size={13} aria-hidden="true" />}</dd>
                                            {values[index] && index < 4 && <button type="button" aria-label={`${label} 변경`} onClick={() => setStep(index)}>변경</button>}
                                        </div>
                                    ))}
                                </dl>
                                <div className="bike-build__total"><span>합산 가격</span><strong>₩ {build.size && build.color !== null ? "20,900,000" : isRoad ? "00,000,000" : "—"}</strong></div>
                                <button className="bike-build__cart" type="button" disabled title="장바구니 연결 준비 중">장바구니 담기</button>
                                {notice && <p role="status" className="bike-build__notice">{notice}</p>}
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
            <nav className="bike-build__steps" aria-label="커스터마이징 단계">
                {steps.map((label, index) => (
                    <button key={label} type="button" aria-current={step === index ? "step" : undefined} disabled={index >= (isRoad ? 4 : 2)} onClick={() => setStep(index)}>
                        <span>{index + 1}</span><span>{label}{step === index && index === 3 && <small>컬러를 선택하세요</small>}</span>
                    </button>
                ))}
            </nav>
            <section className="bike-build__options" aria-label={`${steps[step]} 옵션`}>
                {step === 3 && colors.map(({ name, finish }, index) => (
                    <button className="bike-build__color" key={name} type="button" aria-pressed={build.color === index} onClick={() => setBuild({ ...build, color: index })}>
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
                {step === 2 && sizes.map((size) => <button className="bike-build__option" key={size} type="button" aria-pressed={build.size === size} onClick={() => setBuild({ ...build, size })}>{size}</button>)}
                {step === 1 && customizeBikes.filter((item) => item.id === categoryId).map(({ id, name }) => (
                    <Link className="bike-build__option bike-build__bike-card" key={id}
                        to={`/customize/${id}`} onClick={() => { if (id === bike.id && isRoad) setStep(3); }}>
                        <img src={bikePhoto(id)} alt="" width={800} height={475} />
                        <strong>{name}</strong>
                    </Link>
                ))}
                {step === 0 && customizeBikes.map(({ id, category }) => (
                    <button key={id} type="button" className="bike-build__option" aria-pressed={categoryId === id}
                        onClick={() => { setCategoryId(id); setStep(1); }}>{category}</button>
                ))}
            </section>
        </article>
    );
}

import { useRef, useState } from "react";
import { Bookmark, Check, CircleHelp, RotateCcw, X, ZoomIn, ZoomOut } from "lucide-react";
import { Link } from "react-router-dom";
import "../styles/pages/Customize.scss";

const model = "S-Works Tarmac SL9";
const sizes = [44, 49, 52, 54, 56, 58, 61];
const colors = [
    { name: "Satin Silver Dust", image: "satin-silver-dust.webp", finish: "linear-gradient(90deg, #c9cbce 40%, #7a7d7e)" },
    { name: "Gloss White Silver Metallic", image: "gloss-white-silver-metallic.webp", finish: "linear-gradient(90deg, #efeff1 43%, #b60022)" },
    { name: "Gloss Ruby Metallic", image: "gloss-ruby-metallic.webp", finish: "linear-gradient(90deg, #d2d7d7 40%, #86262f)" },
];
const steps = ["CATEGORY", "MODEL", "TYPE", "SIZE", "COLOR", "GROUPSET", "CRANKSET", "WHEELS & TUBES", "TIRES", "HANDLEBAR", "SADDLES", "SEATPOST"];
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
    const [build, setBuild] = useState(readBuild);
    const previewColor = colors[build.color ?? 0];
    const [step, setStep] = useState(4);
    const [summaryOpen, setSummaryOpen] = useState(true);
    const [helpOpen, setHelpOpen] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [notice, setNotice] = useState("");
    const summaryToggle = useRef<HTMLButtonElement>(null);
    const summaryClose = useRef<HTMLButtonElement>(null);
    const values = ["ROAD", model.toUpperCase(), "BIKE", build.size?.toString(), build.color === null ? undefined : colors[build.color].name];

    const toggleSummary = (open: boolean) => {
        setSummaryOpen(open);
        requestAnimationFrame(() => (open ? summaryClose : summaryToggle).current?.focus());
    };

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
                    <button type="button" className="bike-build__help" aria-label="커스터마이징 도움말" aria-expanded={helpOpen} onClick={() => setHelpOpen(!helpOpen)}>
                        <CircleHelp size={30} aria-hidden="true" />
                    </button>
                    {helpOpen && (
                        <div className="bike-build__help-panel">
                            <strong>커스터마이징 도움말</strong>
                            <p>아래 단계에서 사이즈와 컬러를 고르고, 요약에서 선택한 옵션을 확인할 수 있어요.</p>
                            <p>현재 미리보기는 제품 이미지예요. 확대와 축소를 사용할 수 있어요.</p>
                            <Link to="/support">고객 지원</Link>
                        </div>
                    )}
                    <div className="bike-build__stage">
                        <img src={`${import.meta.env.BASE_URL}images/customize/${previewColor.image}`} width={900} height={506} alt={`${model} · ${previewColor.name}`} style={{ scale: zoom }} />
                    </div>
                    <div className="bike-build__controls" aria-label="미리보기 조작">
                        <button type="button" disabled aria-label="3D 회전 준비 중" title="3D 회전 준비 중"><RotateCcw /></button>
                        <button type="button" aria-label="확대" disabled={zoom >= 1.6} onClick={() => setZoom(Math.min(1.6, zoom + .15))}><ZoomIn /></button>
                        <button type="button" aria-label="축소" disabled={zoom <= .7} onClick={() => setZoom(Math.max(.7, zoom - .15))}><ZoomOut /></button>
                        <button type="button" aria-label="미리보기 초기화" onClick={() => setZoom(1)}><RotateCcw /></button>
                    </div>
                    {!summaryOpen && <button ref={summaryToggle} className="bike-build__show-summary" type="button" onClick={() => toggleSummary(true)}>선택 요약 ↑</button>}
                </section>
                {summaryOpen && (
                    <aside className="bike-build__summary" aria-label="선택 요약">
                        <div className="bike-build__summary-top">
                            <button type="button" onClick={save}><Bookmark size={17} /> 저장</button>
                            <button ref={summaryClose} type="button" aria-label="선택 요약 접기" onClick={() => toggleSummary(false)}><X size={20} /></button>
                        </div>
                        <h2>SUMMARY</h2>
                        <p className="bike-build__model">{model}</p>
                        <dl>
                            {steps.map((label, index) => (
                                <div key={label} className="bike-build__summary-row" data-current={step === index} data-pending={index >= 5}>
                                    <dt>{label}</dt>
                                    <dd>{values[index] ?? (step === index ? "선택 중" : "—")}{values[index] && <Check size={13} aria-hidden="true" />}</dd>
                                    {values[index] && index < 5 && <button type="button" aria-label={`${label} 변경`} onClick={() => setStep(index)}>변경</button>}
                                </div>
                            ))}
                        </dl>
                        <div className="bike-build__total"><span>합산 가격</span><strong>₩ {build.size && build.color !== null ? "20,900,000" : "00,000,000"}</strong></div>
                        <button className="bike-build__cart" type="button" disabled title="장바구니 연결 준비 중">장바구니 담기</button>
                        {notice && <p role="status" className="bike-build__notice">{notice}</p>}
                    </aside>
                )}
            </div>
            <nav className="bike-build__steps" aria-label="커스터마이징 단계">
                {steps.map((label, index) => (
                    <button key={label} type="button" aria-current={step === index ? "step" : undefined} disabled={index >= 5} onClick={() => setStep(index)}>
                        <span>{index + 1}</span><span>{label}{step === index && index === 4 && <small>컬러를 선택하세요</small>}</span>
                    </button>
                ))}
            </nav>
            <section className="bike-build__options" aria-label={`${steps[step]} 옵션`}>
                {step === 4 && colors.map(({ name, finish }, index) => (
                    <button className="bike-build__color" key={name} type="button" aria-pressed={build.color === index} onClick={() => setBuild({ ...build, color: index })}>
                        <span className="bike-build__swatch" style={{ background: finish }} />
                        <span><strong>프레임 컬러 {index + 1}</strong><small>{name}</small></span>
                    </button>
                ))}
                {step === 3 && sizes.map((size) => <button className="bike-build__option" key={size} type="button" aria-pressed={build.size === size} onClick={() => setBuild({ ...build, size })}>{size}</button>)}
                {step === 1 && <Link className="bike-build__option" to="/customize">{model} · 모델 선택</Link>}
                {(step === 0 || step === 2) && <button type="button" className="bike-build__option" aria-pressed="true" onClick={() => setStep(step + 1)}>{values[step]} <Check size={16} aria-hidden="true" /></button>}
            </section>
        </article>
    );
}

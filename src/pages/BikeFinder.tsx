import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "../components/Header";
import "../styles/pages/BikeFinder.scss";

type Option = { label: string; detail?: string; photo?: number };
type Question = { title: string; detail: string; options: Option[] };
type Screen = "questions" | "result" | "size" | "compare" | "ride";

const questions = {
    rider: {
        title: "누구를 위한 자전거인가요?",
        detail: "자전거를 탈 라이더를 선택해 주세요.",
        options: [
            { label: "나를 위한 자전거", detail: "라이딩 스타일에 맞는 자전거를 찾고 있어요.", photo: 0 },
            { label: "아이를 위한 자전거", detail: "아이의 첫 라이딩을 준비하고 있어요.", photo: 1 },
        ],
    },
    terrain: {
        title: "주로 어디를 달리나요?",
        detail: "가장 자주 달릴 곳을 선택해 주세요.",
        options: [
            { label: "포장도로", photo: 0 }, { label: "그래블 · 비포장", photo: 2 },
            { label: "산 · 트레일", photo: 3 }, { label: "도심 · 출퇴근", photo: 4 },
        ],
    },
    road: {
        title: "포장도로에서 어떻게 타고 싶나요?",
        detail: "가장 가까운 라이딩 스타일을 골라 주세요.",
        options: [{ label: "빠르게", photo: 5 }, { label: "오래 편하게", photo: 0 }, { label: "입문 운동", photo: 4 }],
    },
    gravel: {
        title: "비포장길에서 어떻게 타고 싶나요?",
        detail: "평소 즐기는 주행 방식을 선택해 주세요.",
        options: [{ label: "그래블 레이스", photo: 2 }, { label: "모험 · 바이크패킹", photo: 4 }],
    },
    trail: {
        title: "산길에서 어떤 코스를 즐기나요?",
        detail: "가장 자주 타는 코스 유형을 골라 주세요.",
        options: [{ label: "크로스컨트리", photo: 3 }, { label: "트레일", photo: 2 }, { label: "다운힐", photo: 3 }],
    },
    city: {
        title: "도심에서 자전거를 어떻게 쓰나요?",
        detail: "가장 자주 이용할 상황을 선택해 주세요.",
        options: [{ label: "출퇴근 · 통학", photo: 6 }, { label: "동네 이동 · 가벼운 운동", photo: 4 }],
    },
    assist: {
        title: "전기 어시스트가 필요한가요?",
        detail: "오르막과 긴 거리에서 페달링을 도와줄 수 있어요.",
        options: [{ label: "필요해요", photo: 6 }, { label: "필요 없어요", photo: 0 }, { label: "아직 모르겠어요", photo: 4 }],
    },
    age: {
        title: "라이더는 몇 살인가요?",
        detail: "아이의 연령대를 골라 주세요.",
        options: [{ label: "2–5세", photo: 7 }, { label: "6–9세", photo: 1 }, { label: "10세 이상", photo: 3 }],
    },
    budget: {
        title: "어느 정도 예산을 생각하고 있나요?",
        detail: "자전거 구매에 생각하고 있는 가격대를 골라 주세요.",
        options: ["20만–49만 원", "50만–99만 원", "100만–249만 원", "250만–499만 원", "500만–999만 원", "1,000만 원 이상"].map((label) => ({ label })),
    },
} satisfies Record<string, Question>;

type QuestionId = keyof typeof questions;
type Answers = Partial<Record<QuestionId, number>>;
const terrainQuestions = ["road", "gravel", "trail", "city"] as const;

function getRecommendation(answers: Answers): { name: string; reason: string; photo?: number } {
    if (answers.rider === 1) return [
        { name: "Hotwalk", reason: "가볍게 균형 잡기를 연습하는 아이를 위한 예시예요." },
        { name: "Jett 20", reason: "페달링을 익히고 동네에서 타기 시작하는 아이를 위한 예시예요.", photo: 9 },
        { name: "Jett 24", reason: "더 큰 휠이 필요한 어린이 라이더를 위한 예시예요." },
    ][answers.age ?? 1];

    if (answers.assist === 0) return { name: "Turbo Vado", reason: "전기 어시스트를 원하는 라이더를 위한 예시예요." };
    if (answers.terrain === 1) return { name: "Diverge", reason: "그래블과 비포장을 오가는 라이딩을 위한 예시예요." };
    if (answers.terrain === 2) return { name: answers.trail === 2 ? "Demo" : "Chisel", reason: "산길과 트레일 주행을 위한 예시예요." };
    if (answers.terrain === 3) return { name: "Sirrus", reason: "출퇴근과 일상 주행을 위한 예시예요." };
    if (answers.road === 0) return { name: "Tarmac SL9", reason: "속도와 반응성을 중시하는 포장도로 라이더를 위한 예시예요." };
    return { name: "Roubaix SL8 Comp", reason: "포장도로에서 오래 편하게 타고 싶은 라이더를 위한 예시예요.", photo: 8 };
}

function FinderPhoto({ photo, label }: { photo?: number; label?: string }) {
    return <div className="bike-finder__photo" aria-hidden="true"
        style={photo === undefined ? undefined : {
            backgroundImage: `url("${import.meta.env.BASE_URL}images/bike-finder/wireframe-photos.webp")`,
            backgroundPosition: `center ${photo * 100 / 9}%`,
        }}>{photo === undefined ? label : null}</div>;
}

export const BikeFinder = () => {
    const [answers, setAnswers] = useState<Answers>({});
    const [index, setIndex] = useState(0);
    const [screen, setScreen] = useState<Screen>("questions");
    const [height, setHeight] = useState("");
    const [inseam, setInseam] = useState("");
    const heading = useRef<HTMLHeadingElement>(null);
    const kids = answers.rider === 1;
    const steps: QuestionId[] = kids
        ? ["rider", "age", "budget"]
        : ["rider", "terrain", terrainQuestions[answers.terrain ?? 0], "assist", "budget"];
    const step = steps[index];
    const question: Question = questions[step];
    const bike = getRecommendation(answers);
    const progress = screen === "questions" ? index + 1 : steps.length;
    const title = {
        questions: question.title,
        result: kids ? "아이와 함께할 자전거를 찾았어요" : "라이딩 목적에 맞는 자전거를 찾았어요",
        size: "키와 인심으로 사이즈 찾기",
        compare: `${bike.name} 사이즈 비교`,
        ride: "어디서 시승해 볼까요?",
    }[screen];

    useEffect(() => {
        window.scrollTo(0, 0);
        heading.current?.focus({ preventScroll: true });
    }, [index, screen]);

    const reset = () => {
        setAnswers({});
        setIndex(0);
        setScreen("questions");
        setHeight("");
        setInseam("");
    };

    const select = (choice: number) => {
        setAnswers((current) => {
            if (step === "rider" && current.rider !== choice) return { rider: choice };
            if (step === "terrain" && current.terrain !== choice) return { rider: current.rider, terrain: choice };
            return { ...current, [step]: choice };
        });
        if (index === steps.length - 1) setScreen("result");
        else setIndex(index + 1);
    };

    return (
        <div className="layout">
            <Header />
            <main className="bike-finder">
                <div className="bike-finder__top"><span>자전거 추천</span><Link to="/#ride-finder" aria-label="자전거 추천 닫기">×</Link></div>
                <div className="bike-finder__content">
                    {(screen === "questions" || screen === "result") && (
                        <>
                            <progress value={progress} max={steps.length} aria-label="추천 진행률" />
                            <div className="bike-finder__navigation">
                                <button type="button" disabled={index === 0 && screen === "questions"} onClick={() => {
                                    if (screen === "result") setScreen("questions");
                                    else setIndex(index - 1);
                                }}>← 이전 질문</button>
                                <span><b>{progress}</b> / {steps.length}단계</span>
                                <button type="button" onClick={reset}>다시 시작 ↻</button>
                            </div>
                        </>
                    )}
                    {screen !== "questions" && screen !== "result" && (
                        <button className="bike-finder__back" type="button" onClick={() => setScreen("result")}>← 추천 결과 돌아가기</button>
                    )}
                    <h1 ref={heading} tabIndex={-1}>{title}</h1>
                    {screen === "questions" && (
                        <>
                            <p className="bike-finder__description">{question.detail}</p>
                            <ul className={`bike-finder__choices bike-finder__choices--${step === "budget" ? 3 : question.options.length}`}>
                                {question.options.map(({ label, detail, photo }, choice) => (
                                    <li key={label}>
                                        <button type="button" aria-pressed={answers[step] === choice} onClick={() => select(choice)}>
                                            {photo !== undefined && <FinderPhoto photo={photo} />}
                                            <span className="bike-finder__choice-label"><strong>{label}</strong>{detail && <small>{detail}</small>}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                    {screen === "result" && (
                        <>
                            <p className="bike-finder__description">선택한 답변을 바탕으로 보여주는 추천 예시예요.</p>
                            <ul className="bike-finder__tags">
                                {steps.map((id) => <li key={id}>{questions[id].options[answers[id] ?? 0].label}</li>)}
                            </ul>
                            <article className="bike-finder__result">
                                <FinderPhoto photo={bike.photo} label={bike.name} />
                                <div>
                                    <span className="bike-finder__eyebrow">추천 자전거</span>
                                    <h2>{bike.name}</h2><p>{bike.reason}</p>
                                    <div className="bike-finder__actions">
                                        <button type="button" onClick={() => setScreen("size")}>내 사이즈 찾기</button>
                                        <button type="button" onClick={() => setScreen("ride")}>시승 알아보기</button>
                                        <Link to="/products">상품 둘러보기</Link>
                                    </div>
                                </div>
                            </article>
                            {!kids && (
                                <section className="bike-finder__alternatives">
                                    <h2>함께 비교해 볼 자전거</h2>
                                    <div>
                                        {["Tarmac SL9 Comp", "Tarmac SL7 Sport"].map((name) => (
                                            <article key={name}><strong>{name}</strong><Link to="/products">제품 보기 →</Link></article>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </>
                    )}
                    {screen === "size" && (
                        <form className="bike-finder__form" onSubmit={(event) => { event.preventDefault(); setScreen("compare"); }}>
                            <p>{bike.name}의 사이즈 비교 화면을 확인해 보세요.</p>
                            <div className="bike-finder__measurements">
                                <label>키 (cm)<input type="number" min="70" max="230" required value={height} onChange={(event) => setHeight(event.target.value)} /></label>
                                <label>인심 (cm)<input type="number" min="25" max="120" required value={inseam} onChange={(event) => setInseam(event.target.value)} /></label>
                            </div>
                            <div className="bike-finder__actions"><button type="submit">사이즈 비교 보기</button><button type="button" onClick={() => { setHeight(""); setInseam(""); }}>초기화</button></div>
                        </form>
                    )}
                    {screen === "compare" && (
                        <section className="bike-finder__form">
                            <p>입력한 키 {height}cm · 인심 {inseam}cm</p>
                            <p>아래는 사이즈 비교 화면 예시예요. 모델별 권장 사이즈 기준은 준비 중이에요.</p>
                            <div className="bike-finder__measurements">
                                {(kids ? ["어린이 사이즈 A", "어린이 사이즈 B"] : ["52", "54"]).map((size) => <div key={size}><h2>{size}</h2><p>상세 치수 준비 중</p></div>)}
                            </div>
                            <div className="bike-finder__actions"><button type="button" onClick={() => setScreen("ride")}>시승 알아보기</button><button type="button" onClick={() => setScreen("size")}>입력 수정</button></div>
                        </section>
                    )}
                    {screen === "ride" && (
                        <article className="bike-finder__result">
                            <FinderPhoto photo={bike.photo} label={bike.name} />
                            <div><h2>{bike.name}</h2><p>가까운 매장과 시승 예약을 확인해 보세요.</p>
                                <div className="bike-finder__actions"><Link to="/dealers/reserve">시승 예약</Link><Link to="/dealers">대리점 찾기</Link></div>
                            </div>
                        </article>
                    )}
                </div>
                <footer className="bike-finder__footer"><span>Specialized Bicycle Components</span><Link to="/support">고객지원</Link></footer>
            </main>
        </div>
    );
};

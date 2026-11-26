import { useLayoutEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { footerPages } from "../data/footerPages";
import { NotFound } from "./NotFound";
import "../styles/pages/FooterPage.scss";

function SagCalculator() {
    const [result, setResult] = useState("");

    return (
        <form className="footer-info__calculator" onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            const travel = Number(data.get("travel"));
            const sag = Number(data.get("sag"));
            if (travel <= 0 || sag > travel) {
                setResult("전체 트래블은 0보다 커야 하고, 눌린 길이는 전체 트래블 이하여야 해요.");
                return;
            }
            setResult(`새그 비율 ${(sag / travel * 100).toFixed(1)}%`);
        }}>
            <label>전체 트래블 (mm)<input name="travel" type="number" min="0.1" step="any" required /></label>
            <label>눌린 길이 (mm)<input name="sag" type="number" min="0" step="any" required /></label>
            <button type="submit">계산하기</button>
            {result && <p role="status">{result}</p>}
        </form>
    );
}

export function FooterPage() {
    const { slug } = useParams();
    const page = footerPages.find((item) => item.slug === slug);

    useLayoutEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    if (!page) return <NotFound />;

    return (
        <article className="footer-info">
            <Link className="footer-info__back" to="/"><ArrowLeft size={16} aria-hidden="true" /> 홈</Link>
            <header className="footer-info__header">
                <h1>{page.title}</h1>
                <p>{page.description}</p>
            </header>
            {slug === "suspension" && <SagCalculator />}
            {page.sections.map(([heading, body]) => (
                <section className="footer-info__section" key={heading}>
                    <h2>{heading}</h2>
                    <p>{body}</p>
                </section>
            ))}
            {page.action && (
                <Link className="footer-info__action" to={page.action[1]}>
                    {page.action[0]} <ArrowRight size={16} aria-hidden="true" />
                </Link>
            )}
        </article>
    );
}

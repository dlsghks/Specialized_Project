import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { footerGroups } from "../data/footerPages";
import "../styles/pages/FooterPage.scss";

export function Support() {
    return (
        <article className="footer-info">
            <Link className="footer-info__back" to="/"><ArrowLeft size={16} aria-hidden="true" /> 홈</Link>
            <header className="footer-info__header">
                <h1>고객 지원</h1>
                <p>수리와 보증, 반품에 필요한 안내를 확인할 수 있어요.</p>
            </header>
            <section className="footer-info__section">
                <h2>지원 안내</h2>
                <ul>
                    {footerGroups[0].pages.map(({ slug, title }) => (
                        <li key={slug}><Link to={`/info/${slug}`}>{title}</Link></li>
                    ))}
                </ul>
            </section>
            <section className="footer-info__section">
                <h2>Feedback</h2>
                <p>화면이나 기능에 대한 의견은 프로젝트 팀에 전달해 주세요. 오류를 발견했다면 문제가 생긴 화면과 재현 순서를 함께 알려주세요.</p>
            </section>
        </article>
    );
}

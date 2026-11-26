import { Apple, ArrowRight, ChevronDown, Globe, MessageCircle, Play } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { footerGroups, footerLegalPages } from "../data/footerPages";
import "../styles/components/Footer.scss";

const icons = `${import.meta.env.BASE_URL}images/icons/`;
const socials = [
    { label: "Instagram", icon: "instagram.svg", url: "https://www.instagram.com/iamspecialized/" },
    { label: "Facebook", icon: "facebook.svg", url: "https://www.facebook.com/specializedbicycles/" },
    { label: "YouTube", icon: "youtube.svg", url: "https://www.youtube.com/@specializedbicycles" },
    { label: "TikTok", icon: "tiktok.png", url: "https://www.tiktok.com/@specializedbicycles" },
];

export const Footer = () => {
    const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

    return (
        <footer className="site-footer">
            <Link className="site-footer__logo" to="/" aria-label="Specialized 홈" style={{ maskImage: `url("${import.meta.env.BASE_URL}images/specialized-logo.svg")` }} />
            <div className="site-footer__columns">
                <section aria-labelledby="footer-newsletter">
                    <h2 id="footer-newsletter">뉴스레터</h2>
                    <form className="site-footer__form" onSubmit={(event) => {
                        event.preventDefault();
                        setNewsletterSubmitted(true);
                    }}>
                        <input type="email" aria-label="이메일 주소" placeholder="E-mail 주소" required />
                        <button type="submit" aria-label="뉴스레터 구독"><ArrowRight size={20} aria-hidden="true" /></button>
                    </form>
                    <p className="site-footer__muted" role="status">
                        {newsletterSubmitted ? "뉴스레터 구독 기능은 준비 중이에요." : <>이메일 주소를 제출하시면 <Link to="/info/terms">이용약관</Link>에 동의하시는 것으로 간주됩니다.</>}
                    </p>

                    <h3 className="site-footer__app-heading">스페셜라이즈드 앱</h3>
                    <div className="site-footer__actions site-footer__stores">
                        <a href="https://apps.apple.com/kr/search?term=Specialized">
                            <Apple size={17} aria-hidden="true" /> App Store
                        </a>
                        <a href="https://play.google.com/store/search?q=Specialized&c=apps">
                            <Play size={17} aria-hidden="true" /> Google Play
                        </a>
                    </div>
                    <div className="site-footer__actions site-footer__socials">
                        {socials.map(({ label, icon, url }) => (
                            <a key={label} href={url} aria-label={label}>
                                <img src={`${icons}${icon}`} alt="" width={22} height={22} />
                            </a>
                        ))}
                        <Link className="site-footer__feedback" to="/support"><MessageCircle size={16} aria-hidden="true" /> Feedback</Link>
                    </div>
                </section>
                {footerGroups.map(({ title, label, pages }) => (
                    <nav key={title} aria-label={label}>
                        <h3>{title}</h3>
                        <ul>
                            {pages.map(({ title, slug }) => (
                                <li key={slug}><Link to={`/info/${slug}`}>{title}</Link></li>
                            ))}
                        </ul>
                    </nav>
                ))}
            </div>
            <p className="site-footer__muted site-footer__credits">
                <Link to="/info/business">사업자 정보 (상호 · 대표자 · 사업장 주소 · 연락처 · 사업자등록번호 · 통신판매업신고번호)</Link>
                {" · © 1996-2026 Specialized Bicycle Components, Inc. All Rights Reserved."}
            </p>
            <div className="site-footer__bottom">
                <details className="site-footer__region-picker" onClick={(event) => {
                    if ((event.target as HTMLElement).closest("a")) event.currentTarget.open = false;
                }}>
                    <summary className="site-footer__region">
                        <Globe size={18} aria-hidden="true" /> 대한민국 <ChevronDown size={14} aria-hidden="true" />
                    </summary>
                    <ul>
                        <li><Link to="/info/region">대한민국 사이트 안내</Link></li>
                    </ul>
                </details>
                <nav className="site-footer__legal" aria-label="약관 및 사업자 정보">
                    {footerLegalPages.map(({ slug, title }) => (
                        <Link key={slug} to={`/info/${slug}`}>{title}</Link>
                    ))}
                </nav>
            </div>
        </footer>
    );
};

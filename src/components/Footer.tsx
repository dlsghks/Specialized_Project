import { Apple, ArrowRight, ChevronDown, Globe, MessageCircle, Play } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/components/Footer.scss";

const icons = `${import.meta.env.BASE_URL}images/icons/`;
const officialSite = "https://www.specialized.com/kr/ko";
const socials = [
    { label: "Instagram", icon: "instagram.svg", url: "https://www.instagram.com/iamspecialized/" },
    { label: "Facebook", icon: "facebook.svg", url: "https://www.facebook.com/specializedbicycles/" },
    { label: "YouTube", icon: "youtube.svg", url: "https://www.youtube.com/@specializedbicycles" },
    { label: "TikTok", icon: "tiktok.png", url: "https://www.tiktok.com/@iamspecialized" },
];

const menuGroups = [
    { title: "Support", label: "고객 지원", links: [
        ["ARP 프로그램", "/ARPprogram"],
        ["글로벌 보증수리 정책", "/warranty"],
        ["반품 정책", "/returns-policy"],
        ["근로자 의견 채널", "/worker-voice-channel"],
    ] },
    { title: "Resources", label: "이용 자료", links: [
        ["단종 제품", "/bike-archive"],
        ["안전 공지 사항", "/safety-notices"],
        ["서스펜션 계산기", "/app/suspension-calculator"],
        ["사이즈 가이드", "/size-guide"],
        ["신규 대리점 개설 문의", "https://lskbenmbdpf.typeform.com/to/CdiLyK4f"],
        ["대량 구매 문의", "https://lskbenmbdpf.typeform.com/to/pU4FUR21"],
        ["위조품 구별법", "/counterfeit"],
        ["가짜 사이트 구별법", "/how-to-spot-fake-specialized-websites"],
    ] },
    { title: "About", label: "브랜드 소개", links: [
        ["스페셜라이즈드", "/about-us"],
        ["지속 가능성", "/sustainability"],
    ] },
];

const termsUrl = `${officialSite}/terms-of-use`;

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
                        {newsletterSubmitted ? "뉴스레터 구독 기능은 준비 중이에요." : <>이메일 주소를 제출하시면 <a href={termsUrl}>이용약관</a>에 동의하시는 것으로 간주됩니다.</>}
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
                {menuGroups.map(({ title, label, links }) => (
                    <nav key={title} aria-label={label}>
                        <h3>{title}</h3>
                        <ul>
                            {links.map(([name, path]) => (
                                <li key={name}><a href={path.startsWith("/") ? `${officialSite}${path}` : path}>{name}</a></li>
                            ))}
                        </ul>
                    </nav>
                ))}
            </div>
            <p className="site-footer__muted site-footer__credits">
                <a href={officialSite}>사업자 정보 (상호 · 대표자 · 사업장 주소 · 연락처 · 사업자등록번호 · 통신판매업신고번호)</a>
                {" · © 1996-2026 Specialized Bicycle Components, Inc. All Rights Reserved."}
            </p>
            <div className="site-footer__bottom">
                <details className="site-footer__region-picker">
                    <summary className="site-footer__region">
                        <Globe size={18} aria-hidden="true" /> 대한민국 <ChevronDown size={14} aria-hidden="true" />
                    </summary>
                    <ul>
                        <li><a href={officialSite}>대한민국</a></li>
                        <li><a href="https://www.specialized.com/us/en">United States</a></li>
                    </ul>
                </details>
                <nav className="site-footer__legal" aria-label="약관 및 사업자 정보">
                    <a href={`${officialSite}/privacy-policy`}>개인정보취급방침</a>
                    <a href={termsUrl}>이용 약관</a>
                    <a href="https://www.ftc.go.kr/bizCommPop.do?apv_perm_no=&wrkr_no=1328145905">사업자정보확인</a>
                </nav>
            </div>
        </footer>
    );
};

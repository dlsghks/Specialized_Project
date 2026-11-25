import { useState } from "react";
import { Link } from "react-router-dom";
import "./Footer.scss";

const icons = `${import.meta.env.BASE_URL}images/icons/`;
const officialSite = "https://www.specialized.com/kr/ko";
const socials = [
    { label: "Instagram", icon: "instagram.svg", url: "https://www.instagram.com/iamspecialized/" },
    { label: "Facebook", icon: "facebook.svg", url: "https://www.facebook.com/specializedbicycles/" },
    { label: "YouTube", icon: "youtube.svg", url: "https://www.youtube.com/@specializedbicycles" },
    { label: "x", icon: "x.png", url: "https://x.com/iamspecialized" },
];

export const Footer = () => {
    const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

    return (
        <footer className="site-footer">
            <Link className="site-footer__logo" to="/" aria-label="Specialized 홈" />
            <div className="site-footer__columns">
                <section aria-labelledby="footer-newsletter">
                    <h2 id="footer-newsletter">뉴스레터</h2>
                    <form className="site-footer__form" onSubmit={(event) => {
                        event.preventDefault();
                        setNewsletterSubmitted(true);
                    }}>
                        <input type="email" aria-label="이메일 주소" placeholder="E-mail 주소" required />
                        <button type="submit" aria-label="뉴스레터 구독">→</button>
                    </form>
                    <p className="site-footer__muted" role="status">
                        {newsletterSubmitted ? "뉴스레터 구독 기능은 준비 중이에요." : "스페셜라이즈드의 소식과 새로운 제품을 만나보세요."}
                    </p>

                    <h3 className="site-footer__app-heading">스페셜라이즈드 앱</h3>
                    <div className="site-footer__actions">
                        <a href="https://apps.apple.com/kr/search?term=Specialized">
                            <img src={`${icons}app-store.svg`} alt="App Store" width={101} height={31} />
                        </a>
                        <a href="https://play.google.com/store/search?q=Specialized&c=apps">
                            <img src={`${icons}google-play.svg`} alt="Google Play" width={101} height={31} />
                        </a>
                    </div>
                    <div className="site-footer__actions site-footer__socials">
                        {socials.map(({ label, icon, url }) => (
                            <a key={label} href={url} aria-label={label}>
                                <img src={`${icons}${icon}`} alt="" width={16} height={16} />
                            </a>
                        ))}
                        <Link className="site-footer__feedback" to="/support">Feedback</Link>
                    </div>
                </section>
                <nav aria-label="고객 지원">
                    <h3>Support</h3>
                    <ul>
                        <li><Link to="/support">고객센터</Link></li>
                        <li><Link to="/dealers">대리점 찾기</Link></li>
                        <li><Link to="/dealers/reserve">시승 예약</Link></li>
                    </ul>
                </nav>
                <nav aria-label="이용 자료">
                    <h3>Resources</h3>
                    <ul>
                        <li><Link to="/products">제품 둘러보기</Link></li>
                        <li><Link to="/compare">제품 비교</Link></li>
                        <li><Link to="/customize">커스터마이징</Link></li>
                        <li><Link to="/community">라이더 커뮤니티</Link></li>
                    </ul>
                </nav>
                <nav aria-label="브랜드 소개">
                    <h3>About</h3>
                    <ul>
                        <li><a href={officialSite}>스페셜라이즈드</a></li>
                    </ul>
                </nav>
            </div>
            <p className="site-footer__muted site-footer__credits">비상업적 교육용 팀 프로젝트입니다.</p>
            <div className="site-footer__bottom">
                <a className="site-footer__region" href={officialSite}>◎ 대한민국</a>
                <Link to="/support">고객센터</Link>
            </div>
        </footer>
    );
};

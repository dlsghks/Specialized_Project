import { useRef, useState } from "react";
import { Link } from "react-router-dom";

const iconDirectory = `${import.meta.env.BASE_URL}images/icons/`;

export const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuButton = useRef<HTMLButtonElement>(null);
    const closeMenu = () => setMenuOpen(false);

    return (
        <header className="site-header" onKeyDown={(event) => {
            if (event.key === "Escape" && menuOpen) {
                closeMenu();
                menuButton.current?.focus();
            }
        }}>
            <button ref={menuButton} className="header-icon" type="button" aria-label="메뉴"
                aria-controls="site-navigation" aria-expanded={menuOpen}
                onClick={() => setMenuOpen((open) => !open)}>
                <img src={`${iconDirectory}menu.png`} alt="" width={24} height={24} />
            </button>

            <Link to="/" className="logo" onClick={closeMenu}>
                <img src={`${import.meta.env.BASE_URL}images/specialized-logo.svg`} alt="Specialized 홈" width={193} height={20} />
            </Link>

            <nav id="site-navigation" aria-label="주 메뉴" hidden={!menuOpen}>
                <Link to="/products" onClick={closeMenu}>자전거</Link>
                <Link to="/customize" onClick={closeMenu}>장비 커스텀</Link>
                <Link to="/community" onClick={closeMenu}>라이더 커뮤니티</Link>
                <Link to="/dealers" onClick={closeMenu}>대리점</Link>
                <Link to="/compare" onClick={closeMenu}>상품 비교</Link>
                <Link to="/login" onClick={closeMenu}>로그인</Link>
            </nav>

            <div className="header-menu">
                <Link className="header-icon" to="/products" aria-label="상품 찾아보기" onClick={closeMenu}>
                    <img src={`${iconDirectory}search.png`} alt="" width={24} height={24} />
                </Link>
                <Link className="header-icon" to="/cart" aria-label="장바구니" onClick={closeMenu}>
                    <img src={`${iconDirectory}cart.png`} alt="" width={24} height={24} />
                </Link>
                <Link className="header-icon" to="/mypage" aria-label="마이페이지" onClick={closeMenu}>
                    <img src={`${iconDirectory}user.png`} alt="" width={24} height={24} />
                </Link>
            </div>
        </header>
    );
};

import { useRef, useState } from "react";
import { Link } from "react-router-dom";

const iconDirectory = `${import.meta.env.BASE_URL}images/icons/`;

export const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const menu = useRef<HTMLDialogElement>(null);
    const closeMenu = () => {
        const dialog = menu.current;
        if (!dialog?.open || dialog.dataset.closing) return;

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            dialog.close();
            return;
        }

        const position = getComputedStyle(dialog).transform;
        dialog.dataset.closing = "true";
        const animation = dialog.animate(
            [{ transform: position }, { transform: "translateX(-100%)" }],
            { duration: 240, easing: "ease-in", fill: "forwards" },
        );
        const finish = () => {
            dialog.close();
            animation.cancel();
            delete dialog.dataset.closing;
        };
        void animation.finished.then(finish, finish);
    };

    return (
        <header className="site-header">
            <button className="header-icon" type="button" aria-label="메뉴"
                aria-controls="site-navigation" aria-expanded={menuOpen}
                aria-haspopup="dialog" onClick={() => {
                    menu.current?.showModal();
                    setMenuOpen(true);
                }}>
                <img src={`${iconDirectory}menu.png`} alt="" width={24} height={24} />
            </button>

            <Link to="/" className="logo" onClick={closeMenu}>
                <img src={`${import.meta.env.BASE_URL}images/specialized-logo.svg`} alt="Specialized 홈" width={193} height={20} />
            </Link>

            <dialog ref={menu} id="site-navigation" className="site-navigation" aria-label="주 메뉴"
                onClose={() => setMenuOpen(false)} onCancel={(event) => {
                    event.preventDefault();
                    closeMenu();
                }} onClick={(event) => {
                    if (event.target !== event.currentTarget) return;
                    const { left, right, top, bottom } = event.currentTarget.getBoundingClientRect();
                    if (event.clientX < left || event.clientX > right || event.clientY < top || event.clientY > bottom) closeMenu();
                }}>
                <button type="button" className="site-navigation__close" aria-label="메뉴 닫기" onClick={closeMenu}>
                    <span aria-hidden="true">×</span> CLOSE
                </button>
                <nav className="site-navigation__primary" aria-label="주 메뉴">
                    <Link to="/products" onClick={closeMenu}><span aria-hidden="true">›</span>자전거</Link>
                    <Link to="/products?type=equipment" onClick={closeMenu}><span aria-hidden="true">›</span>장비</Link>
                    <Link to="/customize/intro" onClick={closeMenu}><span aria-hidden="true">›</span>장비 커스텀</Link>
                    <Link to="/community" onClick={closeMenu}><span aria-hidden="true">›</span>라이더 커뮤니티</Link>
                    <Link to="/dealers" onClick={closeMenu}><span aria-hidden="true">›</span>대리점</Link>
                </nav>
                <nav className="site-navigation__secondary" aria-label="바로가기">
                    <Link to="/dealers" onClick={closeMenu}>대리점 찾기</Link>
                    <Link to="/community" onClick={closeMenu}>라이더 커뮤니티</Link>
                    <Link to="/support" onClick={closeMenu}>고객지원</Link>
                    <Link to="/compare" onClick={closeMenu}>상품 비교</Link>
                    <Link to="/login" onClick={closeMenu}>로그인</Link>
                </nav>
            </dialog>

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

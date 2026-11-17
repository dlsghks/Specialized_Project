import { Link } from "react-router-dom";

export const Header = () => {
    return (
        <header className="site-header">
            <Link to="/" className="logo">
                SPECIALIZED
            </Link>

            <nav>
                <Link to="/products">자전거</Link>
                <Link to="/customize/tarmac-sl9">커스터마이징</Link>
                <Link to="/compare">상품 비교</Link>
            </nav>

            <div className="header-menu">
                <Link to="/login">로그인</Link>
                <Link to="/cart">장바구니</Link>
                <Link to="/mypage">마이페이지</Link>
            </div>
        </header>
    );
};
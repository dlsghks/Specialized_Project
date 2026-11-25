import { Link } from "react-router-dom";

export const Header = () => {
    return (
        <header className="site-header">
            <Link to="/" className="logo">
                <img src={`${import.meta.env.BASE_URL}images/specialized-logo.svg`} alt="Specialized 홈" width={193} height={20} />
            </Link>

            <nav>
                <Link to="/products">자전거</Link>
                <Link to="/customize">장비 커스텀</Link>
                <Link to="/community">라이더 커뮤니티</Link>
                <Link to="/dealers">대리점</Link>
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
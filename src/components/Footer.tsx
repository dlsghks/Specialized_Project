import { Link } from "react-router-dom";

export const Footer = () => {
    return (
        <footer className="site-footer">
            <h2>SPECIALIZED</h2>

            <Link to="/support">고객센터</Link>

            <p>Specialized UI/UX Redesign Project</p>
            <p>비상업적 교육용 팀 프로젝트입니다.</p>
        </footer>
    );
};
import { useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import heroImage from "../assets/customize-intro.webp";
import "../styles/pages/CustomizeIntro.scss";

export const CustomizeIntro = () => {
    useLayoutEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <section className="customize-intro" aria-label="자전거 커스터마이징">
            <img className="customize-intro__image" src={heroImage} alt="" fetchPriority="high" />
            <Link className="customize-intro__action" to="/customize">
                나만의 자전거 커스텀하러 가기
            </Link>
        </section>
    );
};

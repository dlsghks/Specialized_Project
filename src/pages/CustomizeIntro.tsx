import { useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import heroImage from "../assets/customize-intro.webp";
import "../styles/pages/CustomizeIntro.scss";

export const CustomizeIntro = () => {
    useLayoutEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <section className="customize-intro" aria-labelledby="customize-intro-title">
            <img className="customize-intro__image" src={heroImage} alt="" fetchPriority="high" />
            <div className="customize-intro__content">
                <h1 id="customize-intro-title">커스터마이징으로 나만의 자전거를 만들어 보세요.</h1>
                <Link className="customize-intro__action" to="/customize">
                    커스터마이징 하러 가기
                </Link>
            </div>
        </section>
    );
};

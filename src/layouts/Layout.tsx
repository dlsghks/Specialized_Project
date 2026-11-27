import { useLayoutEffect, useRef } from "react";
import { Outlet, useMatch } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export const Layout = () => {
    const isHome = useMatch("/") !== null;
    const layoutRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (!isHome) return;

        const layout = layoutRef.current;
        const header = layout?.querySelector(".site-header");
        const hero = layout?.querySelector(".home-hero");
        if (!layout || !header || !hero) return;

        const headerBottom = header.getBoundingClientRect().bottom;
        const updateHeader = () => layout.toggleAttribute("data-over-hero", hero.getBoundingClientRect().bottom >= headerBottom);
        const observer = new IntersectionObserver(updateHeader, { rootMargin: `-${headerBottom}px 0px 0px` });

        updateHeader();
        observer.observe(hero);
        return () => {
            observer.disconnect();
            layout.removeAttribute("data-over-hero");
        };
    }, [isHome]);

    return (
        <div ref={layoutRef} className={isHome ? "layout layout--home" : "layout"}>
            <Header />

            <main className="main-content">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
};

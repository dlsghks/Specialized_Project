import { lazy, Suspense } from "react";
import { Outlet, Routes, Route } from "react-router-dom";
import { Layout } from "../layouts/Layout";

import { Home } from "../pages/Home";
import { BikeFinder } from "../pages/BikeFinder";
import { Products } from "../pages/Products";
import { ProductDetail } from "../pages/ProductDetail";
import { Customize, CustomizeStart } from "../pages/Customize";
import { Compare } from "../pages/Compare";
import { Cart } from "../pages/Cart";
import { Checkout } from "../pages/Checkout";
import { OrderComplete } from "../pages/OrderComplete";
import { Login } from "../pages/Login";
import { Signup } from "../pages/Signup";
import { MyPage } from "../pages/MyPage";
import { OrderDetail } from "../pages/OrderDetail";
import { Support } from "../pages/Support";
import { Dealers } from "../pages/Dealers";
import { TestRideReservation } from "../pages/TestRideReservation";
import { CustomizeIntro } from "../pages/CustomizeIntro";
import { FooterPage } from "../pages/FooterPage";
import { NotFound } from "../pages/NotFound";

const Community = lazy(async () => ({ default: (await import("../pages/Community")).Community }));
const CommunityDetail = lazy(async () => ({ default: (await import("../pages/CommunityDetail")).CommunityDetail }));

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="bike-finder" element={<BikeFinder />} />
            <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="products" element={<Products />} />
                <Route path="products/:id" element={<ProductDetail />} />
                <Route path="customize" element={<CustomizeStart />} />
                <Route path="customize/intro" element={<CustomizeIntro />} />
                <Route path="customize/:id" element={<Customize />} />
                <Route path="community" element={<Suspense fallback={null}><Outlet /></Suspense>}>
                    <Route index element={<Community />} />
                    <Route path="stories/:id" element={<CommunityDetail kind="story" />} />
                    <Route path=":id" element={<CommunityDetail />} />
                </Route>
                <Route path="dealers" element={<Dealers />} />
                <Route path="dealers/reserve" element={<TestRideReservation />} />
                <Route path="compare" element={<Compare />} />
                <Route path="cart" element={<Cart />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="order-complete" element={<OrderComplete />} />
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<Signup />} />
                <Route path="mypage" element={<MyPage />} />
                <Route path="mypage/orders/:id" element={<OrderDetail />} />
                <Route path="support" element={<Support />} />
                <Route path="info/:slug" element={<FooterPage />} />
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
};

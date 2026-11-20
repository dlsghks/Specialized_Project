import { Routes, Route } from "react-router-dom";
import { Layout } from "../layouts/Layout";

import { Home } from "../pages/Home";
import { Products } from "../pages/Products";
import { ProductDetail } from "../pages/ProductDetail";
import { Customize } from "../pages/Customize";
import { Compare } from "../pages/Compare";
import { Cart } from "../pages/Cart";
import { Checkout } from "../pages/Checkout";
import { OrderComplete } from "../pages/OrderComplete";
import { Login } from "../pages/Login";
import { Signup } from "../pages/Signup";
import { MyPage } from "../pages/MyPage";
import { OrderDetail } from "../pages/OrderDetail";
import { Support } from "../pages/Support";
import { Community } from "../pages/Community";
import { CommunityDetail } from "../pages/CommunityDetail";
import { Dealers } from "../pages/Dealers";
import { TestRideReservation } from "../pages/TestRideReservation";
import { CustomizeModels } from "../pages/CustomizeModels";
import { NotFound } from "../pages/NotFound";

export const AppRoutes = () => {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="products" element={<Products />} />
                <Route path="products/:id" element={<ProductDetail />} />
                <Route path="customize" element={<CustomizeModels />} />
                <Route path="customize/:id" element={<Customize />} />
                <Route path="community" element={<Community />} />
                <Route path="community/:id" element={<CommunityDetail />} />
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
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
};
import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import BlindBoxListPage from "./pages/BlindBoxListPage";
import BlindBoxDetailPage from "./pages/BlindBoxDetailPage";
import LoginRegisterPage from "./pages/LoginRegisterPage";
import OrderPage from "./pages/OrderPage";
import PlayerShowPage from "./pages/PlayerShowPage";
import AccountPage from "./pages/AccountPage";
import AdminPage from "./pages/AdminPage";

function RequireAuth({ children }) {
    const isLoggedIn = !!localStorage.getItem("token");
    const location = useLocation();
    if (!isLoggedIn) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }
    return children;
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* 重定向旧路由到新路由 */}
                <Route path="/BlindBoxListPage" element={<Navigate to="/draw" replace />} />
                <Route path="/PlayShowPage" element={<Navigate to="/community" replace />} />
                <Route path="/LoginRegisterPage" element={<Navigate to="/account" replace />} />

                {/* 首页/盲盒列表 */}
                <Route path="/" element={<BlindBoxListPage />} />
                <Route path="/draw" element={<BlindBoxListPage />} />

                {/* 盲盒详情 */}
                <Route path="/blindboxes/:id" element={<BlindBoxDetailPage />} />

                {/* 登录、注册页 */}
                <Route path="/login" element={<LoginRegisterPage />} />
                <Route path="/register" element={<LoginRegisterPage />} />

                {/* 需要登录访问的页面 */}
                <Route
                    path="/account"
                    element={
                        <RequireAuth>
                            <AccountPage />
                        </RequireAuth>
                    }
                />
                <Route
                    path="/orders"
                    element={
                        <RequireAuth>
                            <OrderPage />
                        </RequireAuth>
                    }
                />
                <Route
                    path="/community"
                    element={
                        <RequireAuth>
                            <PlayerShowPage />
                        </RequireAuth>
                    }
                />
                <Route
                    path="/admin"
                    element={
                        <RequireAuth>
                            <AdminPage />
                        </RequireAuth>
                    }
                />

                {/* 404重定向 */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
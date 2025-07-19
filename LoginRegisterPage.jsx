import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { loginApi, registerApi } from "../services/api";

export default function LoginRegisterPage() {
    const [mode, setMode] = useState("login");
    const [account, setAccount] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPwd, setRepeatPwd] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const validateForm = () => {
        if (!account.trim()) return "账号不能为空";
        if (!password) return "密码不能为空";
        if (mode === "register") {
            if (!repeatPwd) return "请确认密码";
            if (password !== repeatPwd) return "两次输入的密码不一致";
            if (password.length < 6) return "密码长度需大于6位";
        }
        return "";
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const errMsg = validateForm();
        if (errMsg) return setError(errMsg);
        setError(""); setLoading(true);
        try {
            const response = await loginApi({ account, password });
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("userAccount", account); // 保存用户账号
            setError("登录成功！");
            setTimeout(() => navigate("/orders"), 1000);
        } catch (err) {
            setError(err?.response?.data?.msg || "登录失败");
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        const errMsg = validateForm();
        if (errMsg) return setError(errMsg);
        setError(""); setLoading(true);
        try {
            await registerApi({ account, password });
            setError("注册成功，请登录");
            setMode("login");
            setAccount("");
            setPassword("");
            setRepeatPwd("");
        } catch (err) {
            setError(err?.response?.data?.msg || "注册失败");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="main-container">
            <div className="w-full">
                <Navbar />
            </div>
            <div className="page-content">
                <div className="w-full max-w-3xl px-8 py-16 mx-auto">
                    <form
                        onSubmit={mode === "login" ? handleLogin : handleRegister}
                        className="flex flex-col items-center"
                    >
                        <div
                            className="w-full max-w-xl mb-10 transition-all duration-300"
                            style={{ transform: "translateY(0)" }}
                        >
                            <label className="block text-2xl mb-2">账号：</label>
                            <input
                                className={`w-full bg-gray-200 text-2xl rounded-xl shadow py-7 px-6 outline-none focus:ring-2 transition-all duration-300 ${
                                    error && !account ? "ring-2 ring-red-400" : "focus:ring-fuchsia-400"
                                }`}
                                type="text"
                                placeholder="请输入账号"
                                value={account}
                                autoComplete="username"
                                onChange={e => setAccount(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div className="w-full max-w-xl mb-10 transition-all duration-300">
                            <label className="block text-2xl mb-2">密码：</label>
                            <input
                                className={`w-full bg-gray-200 text-2xl rounded-xl shadow py-7 px-6 outline-none focus:ring-2 transition-all duration-300 ${
                                    error && !password ? "ring-2 ring-red-400" : "focus:ring-fuchsia-400"
                                }`}
                                type="password"
                                placeholder="请输入密码"
                                value={password}
                                autoComplete={mode === "login" ? "current-password" : "new-password"}
                                onChange={e => setPassword(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        {mode === "register" && (
                            <div className="w-full max-w-xl mb-10 transition-all duration-300 animate-fadein">
                                <label className="block text-2xl mb-2">确认密码：</label>
                                <input
                                    className={`w-full bg-gray-200 text-2xl rounded-xl shadow py-7 px-6 outline-none focus:ring-2 transition-all duration-300 ${
                                        error && password !== repeatPwd ? "ring-2 ring-red-400" : "focus:ring-fuchsia-400"
                                    }`}
                                    type="password"
                                    placeholder="请再次输入密码"
                                    value={repeatPwd}
                                    autoComplete="new-password"
                                    onChange={e => setRepeatPwd(e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                        )}
                        {error && (
                            <div className="text-red-500 mb-6 text-lg animate-shake">{error}</div>
                        )}
                        <div className="flex space-x-10 mt-4">
                            <button
                                type="submit"
                                className={`bg-gray-200 text-2xl px-8 py-2 rounded-xl shadow hover:bg-gray-300 active:scale-95 transition-all duration-200 ${
                                    loading ? "opacity-70" : ""
                                }`}
                                disabled={loading}
                            >
                                {loading
                                    ? (mode === "login" ? "登录中..." : "注册中...")
                                    : (mode === "login" ? "登录" : "注册")}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setMode(mode === "login" ? "register" : "login");
                                    setError("");
                                }}
                                className="bg-gray-200 text-2xl px-8 py-2 rounded-xl shadow hover:bg-gray-300 active:scale-95 transition-all duration-200"
                                disabled={loading}
                            >
                                {mode === "login" ? "注册" : "返回登录"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
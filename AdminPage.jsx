import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { getBlindBoxes } from "../services/api";
import api from "../services/api";

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [adminPassword, setAdminPassword] = useState("");
    const [boxes, setBoxes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newBox, setNewBox] = useState({
        name: "",
        series: "",
        image: "",
        description: "",
        price: "",
        stock: ""
    });

    const ADMIN_PASSWORD = "ZengYY20041117";

    const handleAdminLogin = () => {
        if (adminPassword === ADMIN_PASSWORD) {
            setIsAuthenticated(true);
            loadBoxes();
        } else {
            alert("管理员密码错误！");
        }
    };

    const loadBoxes = async () => {
        setLoading(true);
        try {
            const response = await getBlindBoxes();
            setBoxes(response.data.list || []);
        } catch (error) {
            console.error('加载盲盒失败:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddBox = async () => {
        if (!newBox.name || !newBox.series || !newBox.price || !newBox.stock) {
            alert("请填写完整信息");
            return;
        }

        try {
            await api.post("/admin/blindboxes", {
                ...newBox,
                price: parseInt(newBox.price),
                stock: parseInt(newBox.stock)
            });
            setNewBox({ name: "", series: "", image: "", description: "", price: "", stock: "" });
            setShowAddForm(false);
            loadBoxes();
            alert("添加成功！");
        } catch (error) {
            alert("添加失败");
        }
    };

    const handleDeleteBox = async (boxId) => {
        if (!confirm("确定要删除这个盲盒吗？")) return;

        try {
            await api.delete(`/admin/blindboxes/${boxId}`);
            loadBoxes();
            alert("删除成功！");
        } catch (error) {
            alert("删除失败");
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="main-container">
                <div className="w-full">
                    <Navbar />
                </div>
                <div className="page-content">
                    <div className="bg-white rounded-3xl shadow-lg p-8 max-w-md w-full">
                        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">管理员登录</h2>
                        <div className="space-y-4">
                            <input
                                type="password"
                                placeholder="请输入管理员密码"
                                value={adminPassword}
                                onChange={(e) => setAdminPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                onClick={handleAdminLogin}
                                className="w-full px-6 py-3 bg-blue-500 text-black rounded-xl font-bold hover:bg-blue-600 transition-colors"
                            >
                                登录
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="main-container">
            <div className="w-full">
                <Navbar />
            </div>
            <div className="page-content">
                <div className="flex justify-between items-center mb-8 w-full">
                    <h1 className="text-3xl font-bold text-gray-800">管理员面板</h1>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="px-6 py-3 bg-green-500 text-black rounded-xl font-bold hover:bg-green-600 transition-colors"
                    >
                        添加盲盒
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-10">
                        <div className="text-gray-400 text-xl">加载中...</div>
                    </div>
                ) : (
                    <div className="w-full space-y-6">
                        {boxes.map((box) => (
                            <div key={box.id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <img 
                                            src={box.image} 
                                            alt={box.name}
                                            className="w-16 h-16 object-contain rounded-lg"
                                        />
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-800">{box.name}</h3>
                                            <p className="text-sm text-gray-600">{box.description}</p>
                                            <p className="text-sm text-gray-500">系列: {box.series} | 价格: ¥{box.price} | 库存: {box.stock}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteBox(box.id)}
                                        className="px-4 py-2 bg-red-500 text-black rounded-lg hover:bg-red-600 transition-colors"
                                    >
                                        删除
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* 添加盲盒弹窗 */}
                {showAddForm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4">
                            <h2 className="text-2xl font-bold mb-6">添加盲盒</h2>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="盲盒名称"
                                    value={newBox.name}
                                    onChange={(e) => setNewBox({...newBox, name: e.target.value})}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="text"
                                    placeholder="系列 (sea/forest/space/candy)"
                                    value={newBox.series}
                                    onChange={(e) => setNewBox({...newBox, series: e.target.value})}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="text"
                                    placeholder="图片URL"
                                    value={newBox.image}
                                    onChange={(e) => setNewBox({...newBox, image: e.target.value})}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <textarea
                                    placeholder="描述"
                                    value={newBox.description}
                                    onChange={(e) => setNewBox({...newBox, description: e.target.value})}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    rows="3"
                                />
                                <input
                                    type="number"
                                    placeholder="价格"
                                    value={newBox.price}
                                    onChange={(e) => setNewBox({...newBox, price: e.target.value})}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="number"
                                    placeholder="库存"
                                    value={newBox.stock}
                                    onChange={(e) => setNewBox({...newBox, stock: e.target.value})}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex gap-4 mt-6">
                                <button
                                    onClick={handleAddBox}
                                    className="flex-1 px-6 py-3 bg-blue-500 text-black rounded-xl font-bold hover:bg-blue-600"
                                >
                                    添加
                                </button>
                                <button
                                    onClick={() => setShowAddForm(false)}
                                    className="flex-1 px-6 py-3 bg-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-400"
                                >
                                    取消
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 
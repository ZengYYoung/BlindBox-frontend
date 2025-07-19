import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getOrders } from "../services/api";

export default function OrderPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        setLoading(true);
        try {
            const response = await getOrders();
            setOrders(response.data.list || []);
        } catch (error) {
            console.error('加载订单失败:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case '已支付': return 'text-green-600 bg-green-100';
            case '已发货': return 'text-blue-600 bg-blue-100';
            case '已完成': return 'text-purple-600 bg-purple-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <div className="main-container">
            <div className="w-full">
                <Navbar />
            </div>
            <div className="page-content">
                <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">我的订单</h1>
                {loading ? (
                    <div className="text-center py-10">
                        <div className="text-gray-400 text-xl">加载中...</div>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-10">
                        <div className="text-gray-400 text-xl mb-4">还没有订单记录</div>
                        <div className="text-gray-500">快去抽奖吧！</div>
                    </div>
                ) : (
                    <div className="space-y-6 w-full">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 w-full">
                                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full">
                                    {/* 奖品图片 */}
                                    <div className="flex-shrink-0">
                                        <img 
                                            src={order.prizeImg} 
                                            alt={order.prizeName}
                                            className="w-20 h-20 object-contain rounded-lg bg-gray-50"
                                        />
                                    </div>
                                    {/* 订单信息 */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-800 mb-1">
                                                    {order.blindBoxName}
                                                </h3>
                                                <p className="text-gray-600 mb-2">
                                                    获得: <span className="font-semibold text-blue-600">{order.prizeName}</span>
                                                </p>
                                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                                    <span>订单号: {order.id}</span>
                                                    <span>价格: ¥{order.price}</span>
                                                    <span>时间: {new Date(order.createdAt).toLocaleString()}</span>
                                                </div>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
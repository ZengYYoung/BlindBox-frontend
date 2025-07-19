import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getOrders, getUserInfo, recharge } from "../services/api";

export default function AccountPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState(null);
    const [rechargeAmount, setRechargeAmount] = useState("");
    const [rechargeLoading, setRechargeLoading] = useState(false);
    const [rechargeError, setRechargeError] = useState("");

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        setLoading(true);
        try {
            const [userResponse, ordersResponse] = await Promise.all([
                getUserInfo(),
                getOrders()
            ]);
            
            setUserInfo(userResponse.data);
            setOrders(ordersResponse.data.list || []);
        } catch (error) {
            console.error('加载用户数据失败:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRecharge = async (e) => {
        e.preventDefault();
        const amount = parseFloat(rechargeAmount);
        
        if (!amount || amount <= 0) {
            setRechargeError("请输入有效的充值金额");
            return;
        }

        setRechargeLoading(true);
        setRechargeError("");
        
        try {
            const response = await recharge(amount);
            setUserInfo(prev => ({ ...prev, balance: response.data.balance }));
            setRechargeAmount("");
            setRechargeError("充值成功！");
            setTimeout(() => setRechargeError(""), 3000);
        } catch (error) {
            setRechargeError(error?.response?.data?.msg || "充值失败，请重试");
        } finally {
            setRechargeLoading(false);
        }
    };

    // 统计收集数据
    const collectionStats = {
        totalItems: orders.length,
        uniqueItems: new Set(orders.map(order => order.prizeName)).size,
        totalValue: orders.reduce((sum, order) => sum + (order.price || 0), 0)
    };

    // 调试信息
    console.log('订单数据:', orders);
    console.log('订单稀有度:', orders.map(order => ({ id: order.id, rarity: order.rarity, prizeName: order.prizeName })));
    
    // 按稀有度分组
    const rarityGroups = {
        common: orders.filter(order => order.rarity === 'common'),
        rare: orders.filter(order => order.rarity === 'rare'),
        secret: orders.filter(order => order.rarity === 'secret')
    };
    
    console.log('稀有度分组:', {
        common: rarityGroups.common.length,
        rare: rarityGroups.rare.length,
        secret: rarityGroups.secret.length
    });

    return (
        <div className="main-container">
            <div className="w-full">
                <Navbar />
            </div>
            <div className="page-content">
                <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800">我的账号</h1>
                
                {loading ? (
                    <div className="text-center py-10">
                        <div className="text-gray-400 text-xl">加载中...</div>
                    </div>
                ) : (
                    <div className="w-full space-y-8">
                        {/* 用户信息 */}
                        <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center">
                                    <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                                        {userInfo?.account?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="ml-4">
                                        <h2 className="text-2xl font-bold text-gray-800">{userInfo?.account}</h2>
                                        <p className="text-gray-600">盲盒收藏家</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-green-600">¥{userInfo?.balance || 0}</div>
                                    <div className="text-sm text-gray-600">当前余额</div>
                                </div>
                            </div>
                            
                            {/* 充值功能 */}
                            <div className="border-t pt-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">充值</h3>
                                <form onSubmit={handleRecharge} className="flex items-center space-x-4">
                                    <div className="flex-1">
                                        <input
                                            type="number"
                                            placeholder="输入充值金额"
                                            value={rechargeAmount}
                                            onChange={(e) => setRechargeAmount(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            min="0"
                                            step="0.01"
                                            disabled={rechargeLoading}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={rechargeLoading}
                                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50"
                                    >
                                        {rechargeLoading ? "充值中..." : "充值"}
                                    </button>
                                </form>
                                {rechargeError && (
                                    <div className={`mt-2 text-sm ${rechargeError.includes("成功") ? "text-green-600" : "text-red-600"}`}>
                                        {rechargeError}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 收集统计 */}
                        <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8">
                            <h3 className="text-xl font-bold text-gray-800 mb-6">收集统计</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-blue-50 rounded-xl p-4 text-center">
                                    <div className="text-2xl font-bold text-blue-600">{collectionStats.totalItems}</div>
                                    <div className="text-sm text-gray-600">总抽奖次数</div>
                                </div>
                                <div className="bg-green-50 rounded-xl p-4 text-center">
                                    <div className="text-2xl font-bold text-green-600">{collectionStats.uniqueItems}</div>
                                    <div className="text-sm text-gray-600">独特收藏品</div>
                                </div>
                                <div className="bg-purple-50 rounded-xl p-4 text-center">
                                    <div className="text-2xl font-bold text-purple-600">¥{collectionStats.totalValue}</div>
                                    <div className="text-sm text-gray-600">总消费金额</div>
                                </div>
                            </div>
                        </div>

                        {/* 稀有度分布 */}
                        <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8">
                            <h3 className="text-xl font-bold text-gray-800 mb-6">稀有度分布</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-gray-50 rounded-xl p-4 text-center border-2 border-gray-200 hover:border-gray-300 transition-colors">
                                    <div className="text-3xl mb-2">⭐</div>
                                    <div className="text-2xl font-bold text-gray-600">{rarityGroups.common.length}</div>
                                    <div className="text-sm text-gray-600 font-medium">普通</div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {orders.length > 0 ? Math.round((rarityGroups.common.length / orders.length) * 100) : 0}%
                                    </div>
                                </div>
                                <div className="bg-blue-50 rounded-xl p-4 text-center border-2 border-blue-200 hover:border-blue-300 transition-colors">
                                    <div className="text-3xl mb-2">⭐⭐</div>
                                    <div className="text-2xl font-bold text-blue-600">{rarityGroups.rare.length}</div>
                                    <div className="text-sm text-blue-600 font-medium">稀有</div>
                                    <div className="text-xs text-blue-500 mt-1">
                                        {orders.length > 0 ? Math.round((rarityGroups.rare.length / orders.length) * 100) : 0}%
                                    </div>
                                </div>
                                <div className="bg-purple-50 rounded-xl p-4 text-center border-2 border-purple-200 hover:border-purple-300 transition-colors">
                                    <div className="text-3xl mb-2">⭐⭐⭐</div>
                                    <div className="text-2xl font-bold text-purple-600">{rarityGroups.secret.length}</div>
                                    <div className="text-sm text-purple-600 font-medium">神秘</div>
                                    <div className="text-xs text-purple-500 mt-1">
                                        {orders.length > 0 ? Math.round((rarityGroups.secret.length / orders.length) * 100) : 0}%
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 我的收集 */}
                        <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8">
                            <h3 className="text-xl font-bold text-gray-800 mb-6">我的收集</h3>
                            {orders.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="text-gray-400 text-lg mb-2">还没有收集到任何物品</div>
                                    <div className="text-gray-500">快去抽奖吧！</div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {orders.map((order) => {
                                        const rarityConfig = {
                                            common: {
                                                text: '普通',
                                                bgColor: 'bg-gray-100',
                                                textColor: 'text-gray-700',
                                                borderColor: 'border-gray-300',
                                                icon: '⭐'
                                            },
                                            rare: {
                                                text: '稀有',
                                                bgColor: 'bg-blue-100',
                                                textColor: 'text-blue-700',
                                                borderColor: 'border-blue-300',
                                                icon: '⭐⭐'
                                            },
                                            secret: {
                                                text: '神秘',
                                                bgColor: 'bg-purple-100',
                                                textColor: 'text-purple-700',
                                                borderColor: 'border-purple-300',
                                                icon: '⭐⭐⭐'
                                            }
                                        };
                                        
                                        const rarity = rarityConfig[order.rarity] || rarityConfig.common;
                                        
                                        return (
                                            <div key={order.id} className={`bg-gray-50 rounded-xl p-4 border-2 ${rarity.borderColor} hover:shadow-lg transition-all duration-300`}>
                                                <div className="relative">
                                                    <img 
                                                        src={order.prizeImg} 
                                                        alt={order.prizeName}
                                                        className="w-full h-32 object-contain rounded-lg mb-3"
                                                    />
                                                    {/* 稀有度标签 */}
                                                    <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-bold ${rarity.bgColor} ${rarity.textColor} shadow-md`}>
                                                        <span className="mr-1">{rarity.icon}</span>
                                                        {rarity.text}
                                                    </div>
                                                </div>
                                                
                                                <div className="space-y-2">
                                                    <h4 className="font-bold text-gray-800 text-lg">{order.prizeName}</h4>
                                                    <p className="text-sm text-gray-600">{order.blindBoxName}</p>
                                                    
                                                    {/* 稀有度信息行 */}
                                                    <div className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${rarity.bgColor} ${rarity.textColor}`}>
                                                        稀有度: {rarity.text}
                                                    </div>
                                                    
                                                    <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-gray-200">
                                                        <span className="font-semibold">¥{order.price}</span>
                                                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 
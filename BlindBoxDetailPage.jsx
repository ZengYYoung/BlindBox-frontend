import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getBlindBoxDetail, drawBlindBox } from "../services/api";

export default function BlindBoxDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [box, setBox] = useState(null);
    const [loading, setLoading] = useState(true);
    const [drawing, setDrawing] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [result, setResult] = useState(null);

    useEffect(() => {
        getBlindBoxDetail(id)
            .then(res => {
                setBox(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    const handleDraw = async () => {
        if (!localStorage.getItem("token")) {
            alert("请先登录");
            navigate("/login");
            return;
        }

        setDrawing(true);
        try {
            const response = await drawBlindBox(id);
            setResult(response.data);
            setShowResult(true);
        } catch (err) {
            alert(err.response?.data?.msg || "抽奖失败");
        } finally {
            setDrawing(false);
        }
    };

    const getRarityColor = (rarity) => {
        switch (rarity) {
            case 'common': return 'text-gray-600 bg-gray-100';
            case 'rare': return 'text-blue-600 bg-blue-100';
            case 'secret': return 'text-purple-600 bg-purple-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getRarityText = (rarity) => {
        switch (rarity) {
            case 'common': return '普通';
            case 'rare': return '稀有';
            case 'secret': return '神秘';
            default: return '普通';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-2xl text-gray-400">加载中...</div>
            </div>
        );
    }

    if (!box) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-2xl text-red-400">盲盒不存在</div>
            </div>
        );
    }

    return (
        <div className="main-container">
            <div className="w-full">
                <Navbar />
            </div>
            <div className="page-content">
                {/* 盲盒信息 */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-4 md:p-8 mb-6 md:mb-8 w-full">
                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 w-full">
                        <img 
                            src={box.image} 
                            alt={box.name}
                            className="w-32 h-32 md:w-48 md:h-48 object-contain rounded-2xl shadow-lg"
                        />
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2 md:mb-4">{box.name}</h1>
                            <p className="text-base md:text-xl text-gray-600 mb-4 md:mb-6">{box.description}</p>
                            <div className="flex flex-wrap gap-2 md:gap-4 justify-center md:justify-start">
                                <div className="bg-white rounded-xl p-3 md:p-4 shadow-md">
                                    <p className="text-lg md:text-2xl font-bold text-blue-600">¥{box.price}</p>
                                    <p className="text-xs md:text-sm text-gray-500">价格</p>
                                </div>
                                <div className="bg-white rounded-xl p-3 md:p-4 shadow-md">
                                    <p className="text-lg md:text-2xl font-bold text-green-600">{box.stock}</p>
                                    <p className="text-xs md:text-sm text-gray-500">库存</p>
                                </div>
                            </div>
                            <button
                                onClick={handleDraw}
                                disabled={drawing || box.stock <= 0}
                                className={`mt-4 md:mt-6 px-6 md:px-8 py-3 md:py-4 rounded-2xl text-lg md:text-xl font-bold transition-all duration-300 ${
                                    drawing || box.stock <= 0
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 hover:scale-105'
                                }`}
                            >
                                {drawing ? '抽奖中...' : box.stock <= 0 ? '库存不足' : '立即抽奖'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* 奖品展示 */}
                <div className="bg-white rounded-3xl shadow-lg p-4 md:p-8 w-full">
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-gray-800">可能获得的奖品</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full">
                        {box.Prizes?.map((prize) => (
                            <div key={prize.id} className="bg-gray-50 rounded-2xl p-4 md:p-6 text-center hover:shadow-lg transition-shadow duration-300">
                                <img 
                                    src={prize.prizeImg} 
                                    alt={prize.prizeName}
                                    className="w-16 h-16 md:w-24 md:h-24 object-contain mx-auto mb-3 md:mb-4"
                                />
                                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">{prize.prizeName}</h3>
                                <div className="flex justify-center gap-1 md:gap-2 mb-2 md:mb-3">
                                    <span className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium ${getRarityColor(prize.rarity)}`}>
                                        {getRarityText(prize.rarity)}
                                    </span>
                                    <span className="px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium bg-yellow-100 text-yellow-700">
                                        价值: {prize.value}
                                    </span>
                                </div>
                                <p className="text-xs md:text-sm text-gray-500">
                                    概率: {(prize.probability * 100).toFixed(1)}%
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 抽奖结果弹窗 */}
            {showResult && result && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 text-center">
                        <h2 className="text-2xl font-bold text-green-600 mb-4">🎉 恭喜抽中！</h2>
                        <img 
                            src={result.prizeImg} 
                            alt={result.prizeName}
                            className="w-32 h-32 object-contain mx-auto mb-4"
                        />
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{result.prizeName}</h3>
                        <p className="text-gray-600 mb-6">订单号: {result.orderId}</p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => {
                                    setShowResult(false);
                                    setResult(null);
                                }}
                                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300"
                            >
                                继续抽奖
                            </button>
                            <button
                                onClick={() => navigate("/orders")}
                                className="flex-1 px-4 py-2 bg-blue-500 text-black rounded-xl hover:bg-blue-600"
                            >
                                查看订单
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
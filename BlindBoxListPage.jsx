import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getBlindBoxes } from "../services/api";
import { Link } from "react-router-dom";

const themes = [
    {
        key: 'sea',
        name: '海洋系列',
        description: '探索神秘的海洋世界',
        image: '/images/seabutton.png',
        color: 'bg-blue-100'
    },
    {
        key: 'forest',
        name: '森林系列',
        description: '走进神秘的森林',
        image: '/images/forestbutton.png',
        color: 'bg-green-100'
    },
    {
        key: 'space',
        name: '太空系列',
        description: '遨游浩瀚宇宙',
        image: '/images/spacebutton.png',
        color: 'bg-purple-100'
    },
    {
        key: 'candy',
        name: '糖果系列',
        description: '甜蜜的糖果世界',
        image: '/images/candybutton.png',
        color: 'bg-pink-100'
    }
];

export default function BlindBoxListPage() {
    const [boxes, setBoxes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState("");

    useEffect(() => {
        loadBoxes();
    }, []);

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

    // 过滤主题
    const filteredThemes = themes.filter(theme => {
        if (!searchKeyword.trim()) return true;
        return theme.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
               theme.description.toLowerCase().includes(searchKeyword.toLowerCase()) ||
               theme.key.toLowerCase().includes(searchKeyword.toLowerCase());
    });

    return (
        <div className="main-container">
            <div className="w-full">
                <Navbar />
            </div>
            <div className="page-content">
                <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-gray-800">选择你喜欢的主题</h1>
                
                {/* 搜索框 */}
                <div className="w-full max-w-md mx-auto mb-8">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="搜索盲盒主题..."
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            className="w-full px-4 py-3 pl-10 pr-4 text-gray-700 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="text-gray-400 text-xl py-10 text-center">加载中...</div>
                ) : filteredThemes.length === 0 ? (
                    <div className="text-gray-400 text-xl py-10 text-center">
                        没有找到匹配的主题，请尝试其他关键词
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full">
                        {filteredThemes.map((theme) => {
                            const box = boxes.find(b => b.series === theme.key);
                            const canJump = !!box;
                            return (
                                <div
                                    key={theme.key}
                                    className={`${theme.color} rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group w-full ${canJump ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
                                    onClick={() => {
                                        if (canJump) window.location.href = `/blindboxes/${box.id}`;
                                    }}
                                    tabIndex={canJump ? 0 : -1}
                                    role="button"
                                    aria-disabled={!canJump}
                                >
                                    <div className="relative h-64 md:h-80 flex flex-col items-center justify-center p-4 md:p-8">
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10"></div>
                                        <div className="relative z-10 text-center">
                                            <img 
                                                src={theme.image} 
                                                alt={theme.name}
                                                className="w-24 h-24 md:w-32 md:h-32 object-contain mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300 mx-auto"
                                            />
                                            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{theme.name}</h2>
                                            <p className="text-base md:text-lg text-gray-600 mb-4">{theme.description}</p>
                                            {box && (
                                                <div className="bg-white/80 rounded-xl p-3 md:p-4 backdrop-blur-sm">
                                                    <p className="text-xl md:text-2xl font-bold text-blue-600">¥{box.price}</p>
                                                    <p className="text-xs md:text-sm text-gray-500">库存: {box.stock}</p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="absolute bottom-2 md:bottom-4 right-2 md:right-4 bg-white/90 rounded-full p-1 md:p-2 group-hover:scale-110 transition-transform duration-300">
                                            <svg className="w-4 h-4 md:w-6 md:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
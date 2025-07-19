import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getPlayerShows, createPlayerShow, uploadImage } from "../services/api";
import api from "../services/api";

export default function PlayerShowPage() {
    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showPublish, setShowPublish] = useState(false);
    const [publishContent, setPublishContent] = useState("");
    const [publishImages, setPublishImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [commentInput, setCommentInput] = useState({}); // {showId: commentText}
    const [commentLoading, setCommentLoading] = useState({}); // {showId: boolean}
    const [commentList, setCommentList] = useState({}); // {showId: [comments]}

    useEffect(() => {
        loadShows();
    }, []);

    const loadShows = async () => {
        setLoading(true);
        try {
            const response = await getPlayerShows();
            setShows(response.data.list || []);
        } catch (error) {
            console.error('加载晒单失败:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        setUploading(true);
        try {
            const uploadPromises = files.map(file => uploadImage(file));
            const responses = await Promise.all(uploadPromises);
            const newImages = responses.map(res => res.data.url);
            setPublishImages([...publishImages, ...newImages]);
        } catch (error) {
            alert('图片上传失败');
        } finally {
            setUploading(false);
        }
    };

    const handlePublish = async () => {
        if (!publishContent.trim()) {
            alert('请输入内容');
            return;
        }
        try {
            await createPlayerShow({
                content: publishContent,
                images: publishImages
            });
            setPublishContent("");
            setPublishImages([]);
            setShowPublish(false);
            loadShows();
            alert('发布成功！');
        } catch (error) {
            alert('发布失败');
        }
    };

    const removeImage = (index) => {
        setPublishImages(publishImages.filter((_, i) => i !== index));
    };

    // 点赞功能
    const handleLike = async (showId) => {
        try {
            await api.post(`/playershows/${showId}/like`);
            setShows(shows => shows.map(s => s.id === showId ? { ...s, likes: (s.likes || 0) + 1 } : s));
        } catch (e) {
            alert('点赞失败');
        }
    };

    // 评论功能
    const handleComment = async (showId) => {
        const text = commentInput[showId];
        if (!text || !text.trim()) return;
        setCommentLoading(cl => ({ ...cl, [showId]: true }));
        try {
            await api.post(`/playershows/${showId}/comment`, { content: text });
            setCommentInput(ci => ({ ...ci, [showId]: "" }));
            await loadComments(showId);
        } catch (e) {
            alert('评论失败');
        } finally {
            setCommentLoading(cl => ({ ...cl, [showId]: false }));
        }
    };

    // 加载评论
    const loadComments = async (showId) => {
        try {
            const res = await api.get(`/playershows/${showId}/comments`);
            setCommentList(cl => ({ ...cl, [showId]: res.data.list || [] }));
        } catch (e) {
            setCommentList(cl => ({ ...cl, [showId]: [] }));
        }
    };

    // 展开评论区时加载
    const handleShowComments = (showId) => {
        if (!commentList[showId]) {
            loadComments(showId);
        }
    };

    return (
        <div className="main-container">
            <div className="w-full">
                <Navbar />
            </div>
            <div className="page-content">
                {/* 发布按钮 */}
                <div className="flex justify-between items-center mb-8 w-full">
                    <h1 className="text-3xl font-bold text-gray-800">社区晒单</h1>
                    <button
                        onClick={() => setShowPublish(true)}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                    >
                        发布晒单
                    </button>
                </div>
                {/* 发布弹窗 */}
                {showPublish && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-3xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                            <h2 className="text-2xl font-bold mb-6">发布晒单</h2>
                            
                            <textarea
                                value={publishContent}
                                onChange={(e) => setPublishContent(e.target.value)}
                                placeholder="分享你的抽奖心得..."
                                className="w-full h-32 p-4 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            
                            {/* 图片上传 */}
                            <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    上传图片
                                </label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                            </div>

                            {/* 图片预览 */}
                            {publishImages.length > 0 && (
                                <div className="mt-4">
                                    <div className="grid grid-cols-3 gap-4">
                                        {publishImages.map((url, index) => (
                                            <div key={index} className="relative">
                                                <img
                                                    src={url}
                                                    alt={`预览 ${index + 1}`}
                                                    className="w-full h-24 object-cover rounded-lg"
                                                />
                                                <button
                                                    onClick={() => removeImage(index)}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-4 mt-6">
                                <button
                                    onClick={handlePublish}
                                    disabled={uploading || !publishContent.trim()}
                                    className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all duration-200 ${
                                        uploading || !publishContent.trim()
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-blue-500 text-white hover:bg-blue-600'
                                    }`}
                                >
                                    {uploading ? '上传中...' : '发布'}
                                </button>
                                <button
                                    onClick={() => {
                                        setShowPublish(false);
                                        setPublishContent("");
                                        setPublishImages([]);
                                    }}
                                    className="flex-1 px-6 py-3 bg-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-400"
                                >
                                    取消
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 晒单列表 */}
                {loading ? (
                    <div className="text-center py-10">
                        <div className="text-gray-400 text-xl">加载中...</div>
                    </div>
                ) : shows.length === 0 ? (
                    <div className="text-center py-10">
                        <div className="text-gray-400 text-xl">还没有晒单，快来发布第一个吧！</div>
                    </div>
                ) : (
                    <div className="space-y-6 w-full">
                        {shows.map((show) => (
                            <div key={show.id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 w-full">
                                <div className="flex items-center mb-4">
                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                        {show.username?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                    <div className="ml-3">
                                        <div className="font-bold text-gray-800">{show.username}</div>
                                        <div className="text-sm text-gray-500">
                                            {new Date(show.createdAt).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-gray-700 mb-4 leading-relaxed break-words whitespace-pre-line">
                                    {show.content}
                                </div>
                                {show.images && show.images.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                                        {show.images.map((image, index) => (
                                            <img
                                                key={index}
                                                src={image}
                                                alt={`晒单图片 ${index + 1}`}
                                                className="w-full h-40 object-cover rounded-xl border"
                                            />
                                        ))}
                                    </div>
                                )}
                                <div className="flex items-center justify-between text-sm text-gray-500 mt-2">
                                    <div className="flex items-center space-x-4">
                                        <button className="flex items-center space-x-1 hover:text-blue-500" onClick={() => handleLike(show.id)}>
                                            <span>❤️</span>
                                            <span>{show.likes || 0}</span>
                                        </button>
                                        <button className="flex items-center space-x-1 hover:text-blue-500" onClick={() => handleShowComments(show.id)}>
                                            <span>💬</span>
                                            <span>评论</span>
                                        </button>
                                    </div>
                                </div>
                                {/* 评论区 */}
                                {commentList[show.id] && (
                                    <div className="bg-gray-50 rounded-xl p-4 mt-4">
                                        <div className="mb-2 font-bold text-gray-600">评论</div>
                                        {commentList[show.id].length === 0 ? (
                                            <div className="text-gray-400 text-sm">还没有评论，快来抢沙发~</div>
                                        ) : (
                                            <div className="space-y-2">
                                                {commentList[show.id].map((c, idx) => (
                                                    <div key={idx} className="flex items-center text-sm">
                                                        <span className="font-semibold text-blue-600">{c.username}：</span>
                                                        <span className="ml-1">{c.content}</span>
                                                        <span className="ml-2 text-gray-400 text-xs">{new Date(c.createdAt).toLocaleString()}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        <div className="flex mt-3 gap-2">
                                            <input
                                                className="flex-1 border rounded p-2 text-sm mr-2 focus:ring-2 focus:ring-blue-200"
                                                value={commentInput[show.id] || ""}
                                                onChange={e => setCommentInput(ci => ({ ...ci, [show.id]: e.target.value }))}
                                                placeholder="写下你的评论..."
                                                disabled={commentLoading[show.id]}
                                            />
                                            <button
                                                className={`px-4 py-2 rounded-xl font-bold transition-all duration-200 ${commentLoading[show.id] || !(commentInput[show.id] && commentInput[show.id].trim()) ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-black hover:bg-blue-600'}`}
                                                onClick={() => handleComment(show.id)}
                                                disabled={commentLoading[show.id] || !(commentInput[show.id] && commentInput[show.id].trim())}
                                            >
                                                评论
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import {
    Users,
    Heart,
    MessageCircle,
    Share2,
    Plus,
    Sparkles,
    Bot,
    CheckCircle2,
    Send,
    UserCheck
} from 'lucide-react';

export const CommunityPage = () => {
    const navigate = useNavigate();
    const { communityPosts, toggleLikePost, addCommentToPost, userProfile } = useApp();

    const [feedMode, setFeedMode] = useState('community'); // community | ai_qna
    const [commentInputs, setCommentInputs] = useState({});

    const handleCommentSubmit = (postId, e) => {
        e.preventDefault();
        const text = commentInputs[postId];
        if (!text || !text.trim()) return;

        addCommentToPost(postId, text.trim());
        setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in">

            {/* Header Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 dark:text-emerald-50 flex items-center gap-2.5">
                        <Users className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                        <span>Botanist Community Feed</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-emerald-600/70 dark:text-emerald-400/70 mt-0.5">
                        Connect with 50,000+ plant parents sharing propagation tips & foliage progress.
                    </p>
                </div>

                <button
                    onClick={() => navigate('/chat')}
                    className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5 self-start sm:self-auto"
                >
                    <Bot className="w-4 h-4 text-amber-300" />
                    <span>Ask AI Doctor Instead</span>
                </button>
            </div>

            {/* FEED TOGGLE BAR */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/50 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-1 bg-emerald-50/80 dark:bg-emerald-900/40 p-1 rounded-xl border border-emerald-200/50 dark:border-emerald-800/50 text-xs">
                    <button
                        onClick={() => setFeedMode('community')}
                        className={`px-3 py-1 rounded-lg font-medium text-xs transition-all ${feedMode === 'community'
                                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                                : 'text-emerald-800 dark:text-emerald-200'
                            }`}
                    >
                        Community Posts 🌿
                    </button>
                    <button
                        onClick={() => setFeedMode('ai_qna')}
                        className={`px-3 py-1 rounded-lg font-medium text-xs transition-all ${feedMode === 'ai_qna'
                                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                                : 'text-emerald-800 dark:text-emerald-200'
                            }`}
                    >
                        Verified AI Q&A ✨
                    </button>
                </div>

                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hidden sm:inline">
                    Active Plant Parents Online
                </span>
            </div>

            {/* POSTS FEED */}
            <div className="space-y-6">
                {communityPosts.map((post) => (
                    <div
                        key={post.id}
                        className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/50 shadow-sm space-y-4"
                    >
                        {/* Author Header */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/30" />
                                <div>
                                    <h4 className="font-bold text-sm text-emerald-950 dark:text-emerald-100 flex items-center gap-1.5">
                                        <span>{post.author}</span>
                                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                                            Member
                                        </span>
                                    </h4>
                                    <span className="text-[11px] text-emerald-600/70 dark:text-emerald-400/70">{post.timestamp}</span>
                                </div>
                            </div>

                            <div className="flex gap-1">
                                {post.tags.map((tg, i) => (
                                    <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                                        #{tg}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Post Content */}
                        <div className="space-y-2">
                            <h3 className="font-bold text-base text-emerald-950 dark:text-emerald-100">{post.title}</h3>
                            <p className="text-xs text-emerald-800/90 dark:text-emerald-200/90 leading-relaxed">{post.content}</p>
                        </div>

                        {/* Image attachment if any */}
                        {post.image && (
                            <div className="rounded-2xl overflow-hidden max-h-80">
                                <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                            </div>
                        )}

                        {/* Like & Comment Action Buttons */}
                        <div className="flex items-center justify-between pt-2 border-t border-emerald-100 dark:border-emerald-900/50 text-xs">
                            <button
                                onClick={() => toggleLikePost(post.id)}
                                className={`flex items-center gap-1.5 font-bold transition-colors ${post.likedByMe ? 'text-rose-500' : 'text-emerald-700/80 dark:text-emerald-300/80 hover:text-rose-500'
                                    }`}
                            >
                                <Heart className={`w-4 h-4 ${post.likedByMe ? 'fill-rose-500' : ''}`} />
                                <span>{post.likes} Likes</span>
                            </button>

                            <span className="text-emerald-600/70 dark:text-emerald-400/70 flex items-center gap-1">
                                <MessageCircle className="w-4 h-4" />
                                <span>{post.commentsCount} Comments</span>
                            </span>
                        </div>

                        {/* Comments List */}
                        <div className="space-y-2 pt-2 bg-emerald-50/50 dark:bg-emerald-950/40 p-3.5 rounded-2xl">
                            {post.comments.map(c => (
                                <div key={c.id} className="text-xs space-y-0.5">
                                    <span className="font-bold text-emerald-950 dark:text-emerald-100">{c.author}: </span>
                                    <span className="text-emerald-800 dark:text-emerald-200">{c.text}</span>
                                </div>
                            ))}

                            {/* Add Comment Input */}
                            <form onSubmit={(e) => handleCommentSubmit(post.id, e)} className="flex items-center gap-2 pt-2">
                                <input
                                    type="text"
                                    value={commentInputs[post.id] || ''}
                                    onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                                    placeholder="Write a supportive comment..."
                                    className="flex-1 px-3 py-1.5 rounded-xl bg-white dark:bg-emerald-900/60 text-emerald-950 dark:text-emerald-100 text-xs border border-emerald-200/60 dark:border-emerald-800 focus:outline-none"
                                />
                                <button
                                    type="submit"
                                    className="p-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                                >
                                    <Send className="w-3.5 h-3.5" />
                                </button>
                            </form>
                        </div>

                    </div>
                ))}
            </div>

        </div>
    );
};

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bot, Cpu, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';
import { QuickActions } from './QuickActions';

export const ChatMessage = ({
    msg,
    userProfile,
    isLastMsg,
    onQuickReply
}) => {
    const navigate = useNavigate();
    const isUser = msg.sender === 'user';

    return (
        <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>

            {/* Assistant Avatar */}
            {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-1 shadow-sm">
                    <Bot className="w-4 h-4" />
                </div>
            )}

            <div className="max-w-[88%] sm:max-w-[78%] space-y-2">

                {/* Message Bubble */}
                <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm relative group ${isUser
                        ? 'bg-emerald-600 text-white rounded-br-none font-medium'
                        : 'bg-white dark:bg-emerald-900/80 text-emerald-950 dark:text-emerald-50 rounded-bl-none border border-emerald-100 dark:border-emerald-800'
                        }`}
                >

                    {/* Image Attachment */}
                    {msg.attachment && (
                        <div className="mb-2 rounded-xl overflow-hidden max-h-48 border border-white/20">
                            <img src={msg.attachment} alt="Attachment" className="w-full h-full object-cover" />
                        </div>
                    )}

                    {/* Text / Markdown Content */}
                    {isUser ? (
                        <p className="whitespace-pre-line">{msg.text}</p>
                    ) : (
                        <MarkdownRenderer content={msg.text} />
                    )}

                    {/* Embedded Diagnosis / Care Card */}
                    {msg.embeddedCard && (
                        <div className="mt-3 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100 space-y-2 text-xs">
                            <div className="font-bold flex items-center gap-1.5 text-emerald-800 dark:text-emerald-200">
                                <Sparkles className="w-4 h-4 text-amber-500" />
                                <span>{msg.embeddedCard.title}</span>
                            </div>

                            {msg.embeddedCard.subtitle && (
                                <p className="text-[11px] text-emerald-600 dark:text-emerald-400">{msg.embeddedCard.subtitle}</p>
                            )}

                            {msg.embeddedCard.items && (
                                <ul className="space-y-1 pl-1">
                                    {msg.embeddedCard.items.map((it, i) => (
                                        <li key={i} className="flex items-center gap-1.5 text-[11px]">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                            <span>{it}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {msg.embeddedCard.link && (
                                <Link
                                    to={msg.embeddedCard.link}
                                    className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 hover:underline pt-1 text-[11px]"
                                >
                                    <span>{msg.embeddedCard.actionText || 'Open Details'}</span>
                                    <ArrowRight className="w-3 h-3" />
                                </Link>
                            )}
                        </div>
                    )}

                    {/* Footer Row: Timestamp & Source / NLP button */}
                    <div className="flex items-center justify-between gap-2 mt-2 pt-1.5 border-t border-white/20 dark:border-emerald-800/40 text-[10px]">
                        {isUser ? (
                            <button
                                onClick={() => navigate(`/nlp-dashboard?msgId=${msg.id}`)}
                                className="px-2 py-0.5 rounded-lg bg-emerald-700/80 hover:bg-emerald-800 text-white font-bold flex items-center gap-1 transition-colors"
                                title="Analyze tokens, POS, and NER for this message"
                            >
                                <Cpu className="w-3 h-3 text-emerald-300" />
                                <span>🔬 Analyze NLP</span>
                            </button>
                        ) : (
                            <span className="text-[9px] font-bold opacity-75 flex items-center gap-1">
                                {msg.source || 'PlantAI Assistant'}
                            </span>
                        )}

                        <span className={isUser ? 'text-emerald-200' : 'text-emerald-600/70 dark:text-emerald-400/70'}>
                            {msg.timestamp}
                        </span>
                    </div>

                </div>

                {/* Quick Action Buttons (If last assistant message) */}
                {!isUser && isLastMsg && (
                    <QuickActions onSelectAction={onQuickReply} />
                )}

            </div>

            {/* User Avatar */}
            {isUser && (
                <img
                    src={userProfile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                    alt={userProfile?.name || 'User'}
                    className="w-8 h-8 rounded-full object-cover shrink-0 mt-1 ring-2 ring-emerald-500/30"
                />
            )}

        </div>
    );
};

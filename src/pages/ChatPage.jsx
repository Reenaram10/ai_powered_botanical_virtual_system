import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Key } from 'lucide-react';
import { ChatHeader } from '../components/chat/ChatHeader';
import { ChatMessage } from '../components/chat/ChatMessage';
import { ChatInput } from '../components/chat/ChatInput';
import { TypingIndicator } from '../components/chat/TypingIndicator';
import { sendBackendChatApi } from '../services/geminiApi';

export const ChatPage = () => {
    const navigate = useNavigate();
    const {
        chatMessages,
        addChatMessage,
        activeChatContext,
        setActiveChatContext,
        savedPlants,
        userProfile,
        geminiApiKey,
        showToast
    } = useApp();

    const [inputMessage, setInputMessage] = useState('');
    const [imageAttachment, setImageAttachment] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const [isListeningVoice, setIsListeningVoice] = useState(false);

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatMessages, isTyping]);

    const handleSendMessage = async (textToSend = null) => {
        const text = textToSend || inputMessage;
        if (!text.trim() && !imageAttachment) return;

        // Create user message
        const userMsg = {
            id: 'msg-' + Date.now(),
            sender: 'user',
            text: text.trim(),
            attachment: imageAttachment,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        addChatMessage(userMsg);
        setInputMessage('');
        const currentAttachment = imageAttachment;
        setImageAttachment(null);

        setIsTyping(true);

        try {
            // First attempt backend Express proxy /api/chat
            let backendResult = null;
            if (geminiApiKey) {
                backendResult = await sendBackendChatApi({
                    message: userMsg.text,
                    plantContext: activeChatContext,
                    conversationId: 'conv-session',
                    attachment: currentAttachment,
                    apiKey: geminiApiKey
                });
            }

            let assistantResponse = null;

            if (backendResult && backendResult.success) {
                assistantResponse = {
                    responseText: backendResult.message,
                    quickReplies: backendResult.suggestions || ['Watering guide', 'Pruning tips', 'Fertilizer advice'],
                    embeddedCard: null,
                    source: backendResult.source || 'Gemini 2.5 Flash API ⚡'
                };
            } else {
                // Fallback to client apiService (Gemini REST multi-model + Local Smart NLP)
                assistantResponse = await apiService.sendChatMessage(
                    userMsg.text,
                    activeChatContext,
                    chatMessages,
                    currentAttachment,
                    geminiApiKey
                );
            }

            const assistantMsg = {
                id: 'msg-' + (Date.now() + 1),
                sender: 'assistant',
                text: assistantResponse.responseText,
                quickReplies: assistantResponse.quickReplies || [],
                embeddedCard: assistantResponse.embeddedCard || null,
                source: assistantResponse.source || (geminiApiKey ? 'Gemini 2.5 Flash ⚡' : 'Local Smart NLP'),
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            addChatMessage(assistantMsg);
        } catch (err) {
            showToast('Sorry, couldn\'t connect to PlantAI right now. Please try again.', 'error');
        } finally {
            setIsTyping(false);
        }
    };

    const handleQuickReplyClick = (replyText) => {
        if (replyText.includes('Scan') || replyText.includes('📷')) {
            navigate('/scan');
            return;
        }
        handleSendMessage(replyText);
    };

    const toggleVoiceInput = () => {
        if (isListeningVoice) {
            setIsListeningVoice(false);
        } else {
            setIsListeningVoice(true);
            showToast('Listening... Speak your plant query.', 'info');
            setTimeout(() => {
                setInputMessage('How often should I water my Monstera during autumn?');
                setIsListeningVoice(false);
            }, 2500);
        }
    };

    return (
        <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col bg-white dark:bg-emerald-950/60 rounded-3xl border border-emerald-100 dark:border-emerald-900/50 shadow-xl overflow-hidden animate-fade-in">

            {/* TOP HEADER */}
            <ChatHeader
                geminiApiKey={geminiApiKey}
                activeChatContext={activeChatContext}
                setActiveChatContext={setActiveChatContext}
                savedPlants={savedPlants}
            />

            {/* API KEY ALERT BANNER IF NOT CONFIGURED */}
            {!geminiApiKey && (
                <div className="px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 text-amber-900 dark:text-amber-200 text-xs flex items-center justify-between gap-2 shrink-0">
                    <div className="flex items-center gap-1.5">
                        <Key className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                        <span>Running in Smart Local NLP Mode. Add a Gemini API Key in Settings for live AI answers!</span>
                    </div>
                    <button
                        onClick={() => navigate('/settings')}
                        className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-[11px] shrink-0"
                    >
                        Configure Key
                    </button>
                </div>
            )}

            {/* MESSAGES SCROLL AREA */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-emerald-50/40 dark:bg-emerald-950/20">

                {chatMessages.map((msg, idx) => (
                    <ChatMessage
                        key={msg.id}
                        msg={msg}
                        userProfile={userProfile}
                        isLastMsg={idx === chatMessages.length - 1}
                        onQuickReply={handleQuickReplyClick}
                    />
                ))}

                {/* Typing Indicator */}
                {isTyping && <TypingIndicator isGeminiActive={Boolean(geminiApiKey)} />}

                <div ref={messagesEndRef} />
            </div>

            {/* INPUT CONTROLS BAR */}
            <ChatInput
                inputMessage={inputMessage}
                setInputMessage={setInputMessage}
                imageAttachment={imageAttachment}
                setImageAttachment={setImageAttachment}
                isListeningVoice={isListeningVoice}
                toggleVoiceInput={toggleVoiceInput}
                handleSendMessage={handleSendMessage}
                activeChatContext={activeChatContext}
                isTyping={isTyping}
            />

        </div>
    );
};


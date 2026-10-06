import React, { useRef } from 'react';
import { Paperclip, Mic, MicOff, Send } from 'lucide-react';

export const ChatInput = ({
    inputMessage,
    setInputMessage,
    imageAttachment,
    setImageAttachment,
    isListeningVoice,
    toggleVoiceInput,
    handleSendMessage,
    activeChatContext,
    isTyping
}) => {
    const fileInputRef = useRef(null);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageAttachment(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="p-3.5 bg-white dark:bg-emerald-950 border-t border-emerald-100 dark:border-emerald-900/60 space-y-2 shrink-0">

            {/* Attachment Preview */}
            {imageAttachment && (
                <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800 animate-fade-in">
                    <img src={imageAttachment} alt="Preview" className="w-10 h-10 rounded-lg object-cover" />
                    <span className="text-xs text-emerald-800 dark:text-emerald-200 flex-1 truncate">Image attached</span>
                    <button onClick={() => setImageAttachment(null)} className="text-rose-500 font-bold p-1 text-xs hover:underline">
                        Remove
                    </button>
                </div>
            )}

            <div className="flex items-center gap-2">

                {/* File Upload Button */}
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition-colors"
                    title="Attach Leaf Image"
                    disabled={isTyping}
                >
                    <Paperclip className="w-5 h-5" />
                </button>
                <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleFileChange} />

                {/* Voice Input Button */}
                <button
                    onClick={toggleVoiceInput}
                    disabled={isTyping}
                    className={`p-2.5 rounded-xl transition-colors ${isListeningVoice
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100'
                        }`}
                    title="Voice Input"
                >
                    {isListeningVoice ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                {/* Message Input Field */}
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isTyping}
                    placeholder={activeChatContext ? `Ask plant question about ${activeChatContext.nickname || activeChatContext.speciesName}...` : 'Ask PlantAI any plant question...'}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-900/40 text-emerald-950 dark:text-emerald-100 placeholder-emerald-600/50 dark:placeholder-emerald-400/50 text-xs sm:text-sm border border-emerald-200/60 dark:border-emerald-800/60 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                />

                {/* Send Button */}
                <button
                    onClick={() => handleSendMessage()}
                    disabled={(!inputMessage.trim() && !imageAttachment) || isTyping}
                    className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white shadow-md shadow-emerald-600/20 transition-all active:scale-95"
                    title="Send Message"
                >
                    <Send className="w-5 h-5" />
                </button>

            </div>

        </div>
    );
};

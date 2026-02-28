import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Bot, User, X, Loader2, Sparkles } from 'lucide-react';

interface Message {
    id: string;
    isBot: boolean;
    text: string;
}

const AIChatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            isBot: true,
            text: 'Hello! I am your local AI FRA Assistant, fully contained on your machine. How can I help you analyze the datasets today?'
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        // Add user message to UI
        const newUserMsg: Message = { id: Date.now().toString(), isBot: false, text: inputMessage };
        setMessages(prev => [...prev, newUserMsg]);
        setInputMessage('');
        setIsTyping(true);

        try {
            const apiUrl = import.meta.env.VITE_AI_API_URL || 'http://localhost:5001';
            const response = await fetch(`${apiUrl}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: newUserMsg.text })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            const newBotMsg: Message = {
                id: (Date.now() + 1).toString(),
                isBot: true,
                text: data.response || data.error || "I could not generate a response."
            };

            setMessages(prev => [...prev, newBotMsg]);

        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                isBot: true,
                text: "Sorry, I am having trouble connecting to the local Ollama server. Please ensure Python is running and the Ollama service is active."
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <>
            {/* Floating Action Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all z-50 flex items-center justify-center group"
                    aria-label="Open AI Assistant"
                >
                    <Sparkles className="w-6 h-6 group-hover:hidden" />
                    <MessageSquare className="w-6 h-6 hidden group-hover:block" />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-indigo-100 flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300 h-[32rem]">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-4 flex justify-between items-center shadow-sm relative overflow-hidden">
                        {/* Decorative abstract shape */}
                        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 rounded-full bg-white opacity-10 blur-xl"></div>

                        <div className="flex items-center gap-2 relative z-10">
                            <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm">
                                <Bot className="w-5 h-5 text-indigo-50" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm tracking-wide">FRA Local AI</h3>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="relative z-10 text-indigo-100 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-1.5 rounded-full"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                <div className="flex items-end gap-2 max-w-[85%]">
                                    {msg.isBot && (
                                        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mb-1">
                                            <Bot className="w-3.5 h-3.5 text-indigo-600" />
                                        </div>
                                    )}
                                    <div
                                        className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.isBot
                                            ? 'bg-white text-gray-800 border border-gray-100 rounded-bl-sm'
                                            : 'bg-indigo-600 text-white rounded-br-sm'
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex justify-start animate-in fade-in">
                                <div className="flex items-end gap-2">
                                    <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mb-1">
                                        <Bot className="w-3.5 h-3.5 text-indigo-600" />
                                    </div>
                                    <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-white border-t border-gray-100">
                        <form onSubmit={handleSendMessage} className="flex gap-2">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder="Ask about the FRA data..."
                                className="flex-1 bg-gray-50 border border-gray-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                                disabled={isTyping}
                            />
                            <button
                                type="submit"
                                disabled={!inputMessage.trim() || isTyping}
                                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed text-white p-2.5 rounded-xl transition-colors shadow-sm flex items-center justify-center"
                            >
                                {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 ml-0.5" />}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default AIChatbot;

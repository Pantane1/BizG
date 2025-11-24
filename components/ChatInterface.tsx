import React, { useState, useRef, useEffect } from 'react';
import { BizMode, ChatMessage as ChatMessageType } from '../types';
import { MODES } from '../constants';
import { generateBizContent } from '../services/geminiService';
import ChatMessage from './ChatMessage';
import { Send, Loader2, Sparkles, Image as ImageIcon, X } from 'lucide-react';

interface Props {
  mode: BizMode;
}

const ChatInterface: React.FC<Props> = ({ mode }) => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const config = MODES[mode];

  // Clear messages when mode changes
  useEffect(() => {
    setMessages([]);
    setSelectedImage(null);
    setInput('');
  }, [mode]);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, selectedImage]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    // Reset value so same file can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const userMsg: ChatMessageType = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      image: selectedImage || undefined,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    
    // Store current inputs to pass to service
    const promptText = input;
    const imageToSend = selectedImage;

    // Reset inputs immediately for better UX
    setInput('');
    setSelectedImage(null);
    setIsLoading(true);

    const response = await generateBizContent(
      'gemini-2.5-flash',
      promptText,
      config.systemInstruction,
      imageToSend || undefined
    );

    const botMsg: ChatMessageType = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
  };

  const handleFeedback = (id: string, rating: 'positive' | 'negative', comment?: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === id) {
        return {
          ...msg,
          feedback: {
            rating,
            comment: comment ?? msg.feedback?.comment
          }
        };
      }
      return msg;
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
      
      {/* Empty State / Welcome */}
      {messages.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-60">
            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4 text-indigo-500">
                <Sparkles size={32} />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">How can I help with {config.label}?</h3>
            <p className="text-slate-500 max-w-md">{config.description}</p>
        </div>
      )}

      {/* Message List */}
      {messages.length > 0 && (
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {messages.map(msg => (
            <ChatMessage 
              key={msg.id} 
              message={msg} 
              onFeedback={handleFeedback}
            />
          ))}
          {isLoading && (
            <div className="flex w-full justify-start mb-6">
                <div className="flex max-w-[75%] gap-3 flex-row">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-indigo-600 text-white">
                        <Loader2 className="animate-spin" size={18} />
                    </div>
                    <div className="p-4 rounded-2xl rounded-tl-none bg-white border border-slate-100 shadow-sm">
                        <span className="text-slate-500 text-sm">BizG is thinking...</span>
                    </div>
                </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto space-y-2">
            
            {/* Image Preview */}
            {selectedImage && (
              <div className="flex items-start gap-2 animate-in fade-in slide-in-from-bottom-2">
                <div className="relative group">
                  <div className="w-20 h-20 rounded-lg overflow-hidden border border-slate-200">
                    <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <button 
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-slate-800 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>
            )}

            <div className="relative flex items-end gap-2">
                {/* File Input Trigger */}
                <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                />
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 mb-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                    title="Upload image"
                >
                    <ImageIcon size={20} />
                </button>

                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder={config.placeholder}
                    className="w-full p-4 pr-12 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none min-h-[56px] max-h-32 text-slate-800 placeholder-slate-400"
                    rows={1}
                    style={{ minHeight: '56px' }}
                />
                <button
                    onClick={handleSend}
                    disabled={(!input.trim() && !selectedImage) || isLoading}
                    className="absolute right-2 bottom-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all"
                >
                    <Send size={20} />
                </button>
            </div>
        </div>
        <div className="text-center mt-2">
            <span className="text-xs text-slate-400">BizG can make mistakes. Please verify important information.</span>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
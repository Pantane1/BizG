import React, { useState } from 'react';
import { ChatMessage as ChatMessageType } from '../types';
import { Bot, User, ThumbsUp, ThumbsDown, MessageSquarePlus } from 'lucide-react';

interface Props {
  message: ChatMessageType;
  onFeedback?: (messageId: string, rating: 'positive' | 'negative', comment?: string) => void;
}

const ChatMessage: React.FC<Props> = ({ message, onFeedback }) => {
  const isBot = message.role === 'assistant';
  const [isHovered, setIsHovered] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState(message.feedback?.comment || '');

  const handleRating = (rating: 'positive' | 'negative') => {
    if (onFeedback) {
      onFeedback(message.id, rating, message.feedback?.comment);
      // Automatically show input on negative rating or if no comment exists yet
      if (!message.feedback?.comment) {
        setShowCommentInput(true);
      }
    }
  };

  const handleCommentSubmit = () => {
    if (onFeedback && message.feedback) {
      onFeedback(message.id, message.feedback.rating, commentText);
      // Optionally hide input if text is empty, otherwise keep it to show what was typed
      if (!commentText.trim()) {
        setShowCommentInput(false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommentSubmit();
    }
  };

  return (
    <div 
      className={`flex w-full ${isBot ? 'justify-start' : 'justify-end'} mb-6 group`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`flex flex-col max-w-[85%] md:max-w-[75%] ${isBot ? 'items-start' : 'items-end'}`}>
        
        {/* Avatar + Bubble Row */}
        <div className={`flex gap-3 w-full ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
          
          {/* Avatar */}
          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isBot ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
            {isBot ? <Bot size={18} /> : <User size={18} />}
          </div>

          {/* Bubble */}
          <div className={`p-4 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed whitespace-pre-wrap overflow-hidden ${
            isBot 
              ? 'bg-white text-slate-800 border border-slate-100 rounded-tl-none' 
              : 'bg-indigo-600 text-white rounded-tr-none'
          }`}>
            {message.image && (
              <div className="mb-3 rounded-lg overflow-hidden border border-black/10">
                <img 
                  src={message.image} 
                  alt="Uploaded content" 
                  className="max-w-full h-auto object-cover max-h-64 w-full"
                />
              </div>
            )}
            {message.content}
          </div>
        </div>

        {/* Feedback Area (Bot Only) */}
        {isBot && onFeedback && (
          <div className={`pl-11 mt-2 w-full transition-opacity duration-200 ${isHovered || message.feedback ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleRating('positive')}
                  className={`p-1.5 rounded-md transition-colors ${
                    message.feedback?.rating === 'positive' 
                      ? 'text-green-600 bg-green-50' 
                      : 'text-slate-400 hover:text-green-600 hover:bg-slate-100'
                  }`}
                  title="Helpful"
                >
                  <ThumbsUp size={14} className={message.feedback?.rating === 'positive' ? 'fill-current' : ''} />
                </button>
                <button
                  onClick={() => handleRating('negative')}
                  className={`p-1.5 rounded-md transition-colors ${
                    message.feedback?.rating === 'negative' 
                      ? 'text-red-500 bg-red-50' 
                      : 'text-slate-400 hover:text-red-500 hover:bg-slate-100'
                  }`}
                  title="Not helpful"
                >
                  <ThumbsDown size={14} className={message.feedback?.rating === 'negative' ? 'fill-current' : ''} />
                </button>
              </div>

              {/* Show edit/add comment trigger if rated */}
              {message.feedback && (
                <button
                  onClick={() => setShowCommentInput(!showCommentInput)}
                  className={`text-xs flex items-center gap-1 transition-colors ${
                    message.feedback.comment ? 'text-indigo-600 font-medium' : 'text-slate-400 hover:text-indigo-600'
                  }`}
                >
                  <MessageSquarePlus size={14} />
                  {message.feedback.comment ? 'Edit comment' : 'Add comment'}
                </button>
              )}
            </div>

            {/* Comment Input */}
            {showCommentInput && message.feedback && (
              <div className="mt-2 w-full max-w-sm animate-in fade-in slide-in-from-top-1 duration-200">
                <div className="relative">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onBlur={handleCommentSubmit}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    placeholder="Provide additional feedback (optional)..."
                    className="w-full text-xs p-2 pr-8 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 text-slate-700 placeholder:text-slate-400 shadow-sm"
                  />
                </div>
              </div>
            )}
            
            {/* Display comment if exists and input is closed */}
            {!showCommentInput && message.feedback?.comment && (
               <div className="mt-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-100 px-2 py-1.5 rounded-md inline-block max-w-sm italic">
                  "{message.feedback.comment}"
               </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
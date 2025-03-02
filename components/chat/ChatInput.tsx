'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface ChatInputProps {
  onSendMessage: (content: string, attachments?: any[]) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Adjust textarea height based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      setIsExpanded(textareaRef.current.scrollHeight > 40);
    }
  }, [message]);

  const handleSendMessage = () => {
    if (message.trim() || attachment) {
      onSendMessage(message, attachment ? [attachment] : []);
      setMessage('');
      setAttachment(null);
      setAttachmentPreview(null);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
      setIsExpanded(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachment(file);
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setAttachmentPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setAttachmentPreview(null);
      }
    }
  };

  const removeAttachment = () => {
    setAttachment(null);
    setAttachmentPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const emojiList = ['😊', '😂', '❤️', '👍', '🎉', '✨', '🙏', '🥺', '😭', '😍'];

  return (
    <div className="border-t border-gray-200 bg-white p-2">
      {/* Attachment preview */}
      {attachmentPreview && (
        <div className="relative inline-block mb-2 mr-2">
          <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
            <Image
              src={attachmentPreview}
              alt="Attachment preview"
              fill
              className="object-cover"
            />
            <button
              onClick={removeAttachment}
              className="absolute top-0 right-0 bg-gray-800 bg-opacity-70 text-white rounded-full w-5 h-5 flex items-center justify-center"
              aria-label="Remove attachment"
            >
              ×
            </button>
          </div>
        </div>
      )}
      
      {/* Emoji picker */}
      {showEmojiPicker && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="bg-white p-2 rounded-lg shadow-lg border border-gray-200 mb-2 flex flex-wrap"
        >
          {emojiList.map((emoji, index) => (
            <button
              key={index}
              className="p-1 text-xl hover:bg-gray-100 rounded"
              onClick={() => {
                setMessage(prev => prev + emoji);
                setShowEmojiPicker(false);
              }}
            >
              {emoji}
            </button>
          ))}
        </motion.div>
      )}

      <div className="flex items-end">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="メッセージを入力..."
            className="w-full border border-gray-300 rounded-full py-2 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none max-h-32 transition-all"
            style={{ minHeight: '40px' }}
            rows={1}
          />
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="absolute right-14 bottom-2 text-gray-500 hover:text-gray-700"
            aria-label="Add emoji"
          >
            😊
          </button>
          <button
            onClick={handleAttachmentClick}
            className="absolute right-4 bottom-2 text-gray-500 hover:text-gray-700"
            aria-label="Add attachment"
          >
            📎
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,video/*,audio/*"
          />
        </div>
        <button
          onClick={handleSendMessage}
          disabled={!message.trim() && !attachment}
          className={`ml-2 w-10 h-10 rounded-full flex items-center justify-center focus:outline-none transition-colors ${
            message.trim() || attachment
              ? 'bg-primary-500 text-white'
              : 'bg-gray-200 text-gray-400'
          }`}
          aria-label="Send message"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatInput;

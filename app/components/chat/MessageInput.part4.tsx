  return (
    <div className="relative w-full" ref={ref}>
      <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg p-2 shadow">
        {/* 添付ファイルボタン */}
        <button 
          type="button" 
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          onClick={toggleAttachmentMenu}
          disabled={disabled || isSending}
          aria-label="添付ファイル"
        >
          <HiPaperClip className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>
        
        {/* テキスト入力エリア */}
        <div className="flex-1 mx-2">
          <textarea
            ref={textAreaRef}
            value={text}
            onChange={handleTextChange}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled || isSending}
            className="w-full p-2 border-0 focus:outline-none resize-none max-h-32 dark:bg-gray-800 dark:text-white"
            rows={1}
          />
        </div>
        
        {/* 絵文字ピッカーボタン */}
        <button
          type="button"
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          onClick={toggleEmojiMenu}
          disabled={disabled || isSending}
          aria-label="絵文字"
        >
          <HiEmojiHappy className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>
        
        {/* ギフトボタン */}
        <button
          type="button"
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          onClick={handleGiftClick}
          disabled={disabled || isSending}
          aria-label="ギフト"
        >
          <FaGift className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>
        
        {/* 送信ボタン */}
        <button
          type="button"
          className={`p-2 rounded-full ${
            gender === 'male' && (text.trim() || attachments.length > 0) ? 
              (localPoints >= requiredPoints ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed') : 
              'bg-blue-500 hover:bg-blue-600'
          } transition-colors`}
          onClick={handleSendMessage}
          disabled={disabled || isSending || (gender === 'male' && localPoints < requiredPoints)}
          aria-label="メッセージを送信"
        >
          <RiSendPlaneFill className="w-5 h-5 text-white" />
        </button>

        {/* 男性ユーザーの場合のポイント表示 */}
        {gender === 'male' && (
          <div className="ml-2 text-xs text-gray-500 dark:text-gray-400">
            {`${localPoints}pt`}
          </div>
        )}
      </div>

      {/* 添付ファイルのプレビュー */}
      {attachments.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          <AnimatePresence>
            {attachments.map((attachment, index) => (
              <motion.div
                key={attachment.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
              >
                {attachment.type === 'image' && (
                  <div className="relative w-24 h-24">
                    <Image 
                      src={(attachment as ImageAttachment).url} 
                      alt="Attachment" 
                      className="object-cover"
                      fill
                    />
                    <button
                      type="button"
                      className="absolute top-1 right-1 p-1 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-colors"
                      onClick={() => handleRemoveAttachment(index)}
                      aria-label="添付ファイルを削除"
                    >
                      <IoClose className="w-4 h-4 text-white" />
                    </button>
                  </div>
                )}
                {attachment.type === 'video' && (
                  <div className="relative w-24 h-24">
                    <Image 
                      src={(attachment as VideoAttachment).thumbnailUrl || ''} 
                      alt="Video Thumbnail" 
                      className="object-cover"
                      fill
                    />
                    {(attachment as VideoAttachment).duration && (
                      <div className="absolute bottom-1 right-1 px-1 rounded bg-black bg-opacity-50 text-white text-xs">
                        {formatDuration((attachment as VideoAttachment).duration!)}
                      </div>
                    )}
                    <button
                      type="button"
                      className="absolute top-1 right-1 p-1 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-colors"
                      onClick={() => handleRemoveAttachment(index)}
                      aria-label="添付ファイルを削除"
                    >
                      <IoClose className="w-4 h-4 text-white" />
                    </button>
                  </div>
                )}
                {attachment.type === 'location' && (
                  <div className="relative w-24 h-24 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <HiLocationMarker className="w-8 h-8 text-red-500" />
                    <div className="absolute bottom-1 left-1 right-1 text-xs text-center truncate">
                      {(attachment as LocationAttachment).name || '現在地'}
                    </div>
                    <button
                      type="button"
                      className="absolute top-1 right-1 p-1 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-colors"
                      onClick={() => handleRemoveAttachment(index)}
                      aria-label="添付ファイルを削除"
                    >
                      <IoClose className="w-4 h-4 text-white" />
                    </button>
                  </div>
                )}
                {attachment.type === 'gift' && (
                  <div className="relative w-24 h-24 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <div className="relative w-16 h-16">
                      <Image 
                        src={(attachment as GiftAttachment).giftImageUrl} 
                        alt={(attachment as GiftAttachment).giftName} 
                        className="object-contain"
                        fill
                      />
                    </div>
                    <div className="absolute bottom-1 left-1 right-1 text-xs text-center truncate">
                      {(attachment as GiftAttachment).giftName}
                    </div>
                    <button
                      type="button"
                      className="absolute top-1 right-1 p-1 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-colors"
                      onClick={() => handleRemoveAttachment(index)}
                      aria-label="添付ファイルを削除"
                    >
                      <IoClose className="w-4 h-4 text-white" />
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* 添付ファイルメニュー */}
      <AnimatePresence>
        {isAttachmentMenuOpen && (
          <motion.div
            ref={attachmentMenuRef}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full left-0 mb-2 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex gap-2 z-10"
          >
            <button
              type="button"
              className="p-3 rounded-full bg-pink-100 hover:bg-pink-200 dark:bg-pink-900 dark:hover:bg-pink-800 transition-colors"
              onClick={triggerImageAttachment}
              aria-label="画像を添付"
            >
              <HiPhotograph className="w-5 h-5 text-pink-500 dark:text-pink-300" />
            </button>
            <button
              type="button"
              className="p-3 rounded-full bg-purple-100 hover:bg-purple-200 dark:bg-purple-900 dark:hover:bg-purple-800 transition-colors"
              onClick={triggerVideoAttachment}
              aria-label="動画を添付"
            >
              <HiVideoCamera className="w-5 h-5 text-purple-500 dark:text-purple-300" />
            </button>
            <button
              type="button"
              className="p-3 rounded-full bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 transition-colors"
              onClick={handleLocationAttachment}
              aria-label="位置情報を共有"
            >
              <HiLocationMarker className="w-5 h-5 text-red-500 dark:text-red-300" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 絵文字ピッカー */}
      <AnimatePresence>
        {isEmojiMenuOpen && (
          <motion.div
            ref={emojiMenuRef}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full right-0 mb-2 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10 w-64"
          >
            <div className="flex border-b dark:border-gray-700 mb-2">
              {emojiCategories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  className="flex-1 p-2 text-center text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => {}}
                >
                  {category.name}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-6 gap-1">
              {emojiCategories[0].emojis.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  className="p-2 text-xl hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                  onClick={() => handleEmojiSelect(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ギフト選択UI */}
      <AnimatePresence>
        {showGiftSelector && (
          <GiftSelector 
            onSelect={handleGiftSelect} 
            onClose={() => setShowGiftSelector(false)}
          />
        )}
      </AnimatePresence>

      {/* ギフトアニメーション */}
      <AnimatePresence>
        {showGiftAnimation && selectedGift && (
          <GiftAnimator 
            gift={selectedGift} 
            animationClass={currentAnimation} 
            onAnimationComplete={() => setShowGiftAnimation(false)}
          />
        )}
      </AnimatePresence>

      {/* 非表示入力フィールド */}
      <input 
        type="file" 
        ref={fileInputRef} 
        accept="image/*" 
        className="hidden" 
        onChange={handleImageAttachment}
      />
      <input 
        type="file" 
        ref={videoInputRef}
        accept="video/*" 
        className="hidden" 
        onChange={handleVideoAttachment}
      />
    </div>
  );
});

MessageInput.displayName = 'MessageInput';

export default MessageInput;

  // ギフト選択ハンドラー
  const handleGiftSelect = useCallback(async (gift: Gift, message?: string): Promise<void> => {
    if (isSending || !gift) return;
    
    // ギフトのバリデーション
    if (!validateGift(gift)) return;
    
    try {
      setIsSending(true);
      setSelectedGift(gift);
      
      // ギフト添付ファイルを作成
      const giftAttachment: GiftAttachment = {
        id: Date.now().toString(),
        type: 'gift',
        giftId: gift.id,
        giftName: gift.name,
        giftImageUrl: gift.imageUrl,
        price: gift.price,
        message: message,
        animation: gift.animation,
        createdAt: new Date()
      };
      
      // ギフトの添付
      setGiftAttachment(giftAttachment);
      setAttachments(prev => [...prev, giftAttachment]);
      
      // ギフトアニメーションの表示
      if (gift.animation) {
        setCurrentAnimation(gift.animation);
        setShowGiftAnimation(true);
        
        // 5秒後にアニメーションを非表示
        setTimeout(() => {
          setShowGiftAnimation(false);
        }, 5000);
      }
      
      // ギフト選択UIを閉じる
      setShowGiftSelector(false);
      
      // ポイントを更新（男性ユーザーの場合）
      if (gender === 'male' && gift.price && onPointsUpdated) {
        const newPoints = localPoints - gift.price;
        setLocalPoints(newPoints);
        onPointsUpdated(newPoints);
      }
      
      // メッセージがある場合はテキストフィールドに設定
      if (message) {
        setText(message);
      }
      
      // ギフトを送信した後はすぐにメッセージ送信
      handleSendMessage();
    } catch (error) {
      console.error('ギフト選択エラー:', error);
      toast.error('ギフトの選択に失敗しました');
    } finally {
      setIsSending(false);
    }
  }, [gender, localPoints, onPointsUpdated, isSending, validateGift]);

  // 絵文字選択ハンドラー
  const handleEmojiSelect = useCallback((emoji: string): void => {
    setText(prev => prev + emoji);
    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, []);

  // 添付ファイル削除ハンドラー
  const handleRemoveAttachment = useCallback((index: number): void => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  }, []);

  // 位置情報キャンセルハンドラー
  const handleCancelLocation = useCallback((): void => {
    setSelectedLocation(null);
    setAttachments(prev => prev.filter(att => att.type !== 'location'));
  }, []);

  // 添付メニュー表示切り替え
  const toggleAttachmentMenu = useCallback((): void => {
    setIsAttachmentMenuOpen(prev => !prev);
    if (isEmojiMenuOpen) {
      setIsEmojiMenuOpen(false);
    }
  }, [isEmojiMenuOpen]);

  // 絵文字メニュー表示切り替え
  const toggleEmojiMenu = useCallback((): void => {
    setIsEmojiMenuOpen(prev => !prev);
    if (isAttachmentMenuOpen) {
      setIsAttachmentMenuOpen(false);
    }
  }, [isAttachmentMenuOpen]);

  // ギフト選択UI表示切り替え
  const handleGiftClick = useCallback((): void => {
    if (!validatePoints(requiredPoints)) return;
    setShowGiftSelector(prev => !prev);
    setIsAttachmentMenuOpen(false);
  }, [requiredPoints, validatePoints]);

  // ファイル入力トリガー（画像）
  const triggerImageAttachment = useCallback((): void => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
    setIsAttachmentMenuOpen(false);
  }, []);

  // ファイル入力トリガー（動画）
  const triggerVideoAttachment = useCallback((): void => {
    if (videoInputRef.current) {
      videoInputRef.current.click();
    }
    setIsAttachmentMenuOpen(false);
  }, []);

  // クリックアウトサイドハンドラー（メニューを閉じる）
  const handleClickOutside = useCallback((event: MouseEvent): void => {
    // 添付メニューが開いていて、クリックがメニュー外の場合
    if (
      isAttachmentMenuOpen &&
      attachmentMenuRef.current &&
      !attachmentMenuRef.current.contains(event.target as Node)
    ) {
      setIsAttachmentMenuOpen(false);
    }
    
    // 絵文字メニューが開いていて、クリックがメニュー外の場合
    if (
      isEmojiMenuOpen &&
      emojiMenuRef.current &&
      !emojiMenuRef.current.contains(event.target as Node)
    ) {
      setIsEmojiMenuOpen(false);
    }
  }, [isAttachmentMenuOpen, isEmojiMenuOpen]);

  // クリックアウトサイドのイベントリスナーを設定
  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [handleClickOutside]);

  // 動画の再生時間をフォーマットする関数
  const formatDuration = useCallback((seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  // メッセージ送信処理
  const handleSendMessage = useCallback(async (): Promise<void> => {
    // 送信中やdisabledの場合は処理しない
    if (sendingRef.current || isSending || disabled) return;

    const trimmedText = text.trim();
    
    // メッセージがない場合（テキストも添付ファイルもない）
    if (!trimmedText && attachments.length === 0 && !selectedLocation && !giftAttachment) {
      toast.error('メッセージを入力してください');
      return;
    }

    // 男性ユーザーの場合はポイントのチェック
    if (gender === 'male' && !validatePoints()) {
      return;
    }

    try {
      sendingRef.current = true;
      setIsSending(true);

      // メッセージオブジェクトの作成
      const message: Message = {
        id: Date.now().toString(),
        conversationId: chatId,
        senderId: 'current-user-id', // 実際のユーザーIDに置き換える
        content: trimmedText || undefined,
        attachments: attachments,
        reactions: [],
        status: 'sending',
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // メッセージ送信
      await onSendMessage(message);

      // 送信後の処理
      setText('');
      setAttachments([]);
      setSelectedLocation(null);
      setGiftAttachment(null);
      setSelectedGift(null);

      // タイピング終了イベントを発火
      if (onTypingEnd) {
        onTypingEnd();
      }

      // 男性ユーザーの場合はポイントを消費
      if (gender === 'male' && onPointsUpdated) {
        const newPoints = localPoints - requiredPoints;
        setLocalPoints(newPoints);
        onPointsUpdated(newPoints);
      }
    } catch (error) {
      console.error('メッセージ送信エラー:', error);
      toast.error('メッセージの送信に失敗しました');
    } finally {
      sendingRef.current = false;
      setIsSending(false);
    }
  }, [
    attachments,
    chatId,
    disabled,
    gender,
    giftAttachment,
    isSending,
    localPoints,
    onPointsUpdated,
    onSendMessage,
    onTypingEnd,
    requiredPoints,
    selectedLocation,
    selectedGift,
    text,
    validatePoints
  ]);

// MessageInputコンポーネント
const MessageInput = forwardRef<HTMLDivElement, MessageInputProps>((
  {
    onSendMessage,
    onTypingStart,
    onTypingEnd,
    disabled = false,
    placeholder = 'メッセージを入力',
    gender,
    currentPoints,
    requiredPoints = 1,
    onPointsUpdated,
    chatId
  }: MessageInputProps,
  ref: ForwardedRef<HTMLDivElement>
): ReactElement => {
  // ステート管理
  const [text, setText] = useState<string>('');
  const [attachments, setAttachments] = useState<AttachmentUnion[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [giftAttachment, setGiftAttachment] = useState<GiftAttachment | null>(null);
  const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState<boolean>(false);
  const [isEmojiMenuOpen, setIsEmojiMenuOpen] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [localPoints, setLocalPoints] = useState<number>(currentPoints);
  const [showGiftSelector, setShowGiftSelector] = useState<boolean>(false);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [showGiftAnimation, setShowGiftAnimation] = useState<boolean>(false);
  const [currentAnimation, setCurrentAnimation] = useState<string>('');
  
  // 参照
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const sendingRef = useRef<boolean>(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const attachmentMenuRef = useRef<HTMLDivElement>(null);
  const emojiMenuRef = useRef<HTMLDivElement>(null);

  // ローカルポイントをpropsと同期
  useEffect(() => {
    setLocalPoints(currentPoints);
  }, [currentPoints]);

  // disabledが変更されたときに添付メニューの状態をリセット
  useEffect(() => {
    if (disabled) {
      setIsAttachmentMenuOpen(false);
      setIsEmojiMenuOpen(false);
    }
  }, [disabled]);

  // 検証関数 - useCallbackで最適化
  const validatePoints = useCallback((points: number = requiredPoints): boolean => {
    // 男性ユーザーの場合のみポイントチェックを行う
    if (gender === 'male') {
      if (localPoints < points) {
        toast.error(`ポイントが不足しています（必要ポイント: ${points}）`);
        return false;
      }
    }
    return true;
  }, [gender, localPoints, requiredPoints]);

  const validateGift = useCallback((gift: Gift): boolean => {
    if (gender === 'male' && gift.price) {
      // 男性ユーザーの場合、ギフト用のポイントチェック
      if (localPoints < gift.price) {
        toast.error(`ポイントが不足しています（必要ポイント: ${gift.price}）`);
        return false;
      }
    }
    return true;
  }, [gender, localPoints]);

  // ファイルアップロード関数
  const uploadFile = useCallback(async (file: File, type: FileType): Promise<FileUploadResult> => {
    // 実際の実装では、ここでAPIを呼び出してファイルをアップロードします
    // このサンプルでは、モックデータを返します
    return new Promise((resolve) => {
      setTimeout(() => {
        if (type === 'image') {
          resolve({
            url: URL.createObjectURL(file),
            thumbnailUrl: URL.createObjectURL(file)
          });
        } else {
          resolve({
            url: URL.createObjectURL(file),
            thumbnailUrl: 'https://via.placeholder.com/300x200?text=Video+Thumbnail'
          });
        }
      }, 1000);
    });
  }, []);

  // テキスト入力ハンドラー
  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const newText = e.target.value;
    setText(newText);

    // タイピング中のイベント
    if (onTypingStart) {
      onTypingStart();
    }

    // タイピング終了タイマーをリセット
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // 3秒後にタイピング終了イベントを発火
    typingTimeoutRef.current = setTimeout(() => {
      if (onTypingEnd) {
        onTypingEnd();
      }
    }, 3000);
  }, [onTypingStart, onTypingEnd]);

  // キーボードイベントハンドラー
  const handleKeyPress = useCallback((e: KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, []);

  // 画像添付ハンドラー
  const handleImageAttachment = useCallback(async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
    if (!e.target.files?.length) return;

    const file = e.target.files[0];
    if (!file.type.startsWith('image/')) {
      toast.error('画像ファイルを選択してください');
      return;
    }

    try {
      setIsSending(true);
      const result = await uploadFile(file, 'image');
      
      const imageAttachment: ImageAttachment = {
        id: Date.now().toString(),
        type: 'image',
        url: result.url,
        thumbnailUrl: result.thumbnailUrl,
        name: file.name,
        size: file.size,
        createdAt: new Date()
      };
      
      setAttachments(prev => [...prev, imageAttachment]);
    } catch (error) {
      console.error('画像アップロードエラー:', error);
      toast.error('画像のアップロードに失敗しました');
    } finally {
      setIsSending(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [uploadFile]);

  // 動画添付ハンドラー
  const handleVideoAttachment = useCallback(async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
    if (!e.target.files?.length) return;

    const file = e.target.files[0];
    if (!file.type.startsWith('video/')) {
      toast.error('動画ファイルを選択してください');
      return;
    }

    try {
      setIsSending(true);
      const result = await uploadFile(file, 'video');
      
      const videoAttachment: VideoAttachment = {
        id: Date.now().toString(),
        type: 'video',
        url: result.url,
        thumbnailUrl: result.thumbnailUrl,
        name: file.name,
        size: file.size,
        createdAt: new Date()
      };
      
      setAttachments(prev => [...prev, videoAttachment]);
    } catch (error) {
      console.error('動画アップロードエラー:', error);
      toast.error('動画のアップロードに失敗しました');
    } finally {
      setIsSending(false);
      if (videoInputRef.current) {
        videoInputRef.current.value = '';
      }
    }
  }, [uploadFile]);
  
  // 位置情報添付ハンドラー
  const handleLocationAttachment = useCallback((): void => {
    if (!navigator.geolocation) {
      toast.error('お使いのブラウザは位置情報をサポートしていません');
      return;
    }

    setIsSending(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // 位置情報が取得できた場合
        const location: Location = {
          name: '現在地',
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        
        setSelectedLocation(location);
        
        const locationAttachment: LocationAttachment = {
          id: Date.now().toString(),
          type: 'location',
          latitude: location.latitude,
          longitude: location.longitude,
          name: location.name,
          createdAt: new Date()
        };
        
        setAttachments(prev => [...prev, locationAttachment]);
        setIsSending(false);
      },
      (error) => {
        // 位置情報の取得に失敗した場合
        console.error('位置情報取得エラー:', error);
        let errorMessage = '位置情報の取得に失敗しました';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = '位置情報の使用許可が得られませんでした';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = '位置情報が利用できません';
            break;
          case error.TIMEOUT:
            errorMessage = '位置情報の取得がタイムアウトしました';
            break;
        }
        
        toast.error(errorMessage);
        setIsSending(false);
      }
    );
  }, []);

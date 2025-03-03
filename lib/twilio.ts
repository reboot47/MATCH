import twilio from 'twilio';

// Twilioクライアントの初期化
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Twilioクライアントのインスタンス作成
const twilioClient = accountSid && authToken 
  ? twilio(accountSid, authToken)
  : null;

/**
 * SMSを送信する関数
 * @param to 送信先電話番号（国際形式: +81xxxxxxxx）
 * @param body メッセージ本文
 * @returns 送信結果
 */
export const sendSMS = async (to: string, body: string) => {
  try {
    // Twilioクライアントが初期化されていない場合は開発モードとみなす
    if (!twilioClient || !twilioPhoneNumber) {
      console.log('開発環境: Twilioクライアントが設定されていないため、SMSはログに出力されます');
      console.log(`送信先: ${to}`);
      console.log(`メッセージ: ${body}`);
      
      // 開発環境でも成功したことにする
      return {
        success: true,
        message: 'Development mode: SMS logged instead of sent',
        sid: 'dev-mode-sid',
      };
    }

    // 本番環境: 実際にSMSを送信
    const message = await twilioClient.messages.create({
      body,
      from: twilioPhoneNumber,
      to,
    });

    return {
      success: true,
      message: 'SMS sent successfully',
      sid: message.sid,
    };
  } catch (error) {
    console.error('SMS送信エラー:', error);
    return {
      success: false,
      message: 'Failed to send SMS',
      error,
    };
  }
};

/**
 * 認証コードを生成して送信する関数
 * @param phoneNumber 送信先電話番号
 * @returns 生成された認証コードと送信結果
 */
export const sendVerificationCode = async (phoneNumber: string) => {
  try {
    // 6桁の認証コードを生成
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // SMS本文を生成
    const message = `【LineBuzz】認証コード: ${verificationCode}。このコードは10分間有効です。`;
    
    // SMSを送信
    const result = await sendSMS(phoneNumber, message);
    
    if (result.success) {
      return {
        success: true,
        verificationCode,
        message: 'Verification code sent successfully',
      };
    } else {
      return {
        success: false,
        error: result.message,
      };
    }
  } catch (error) {
    console.error('認証コード送信エラー:', error);
    return {
      success: false,
      error,
    };
  }
};

export default twilioClient;

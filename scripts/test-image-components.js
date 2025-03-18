// 画像コンポーネントテスト用スクリプト
// ギフト画像の表示をテストするシンプルなスクリプト

const puppeteer = require('puppeteer');

// 待機時間用関数
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 画像コンポーネントテスト
async function testImageComponents() {
  console.log('画像コンポーネントのテストを開始します...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: { width: 1280, height: 800 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  let page;
  
  try {
    page = await browser.newPage();
    
    // コンソールログの取得
    page.on('console', msg => {
      if (msg.type() === 'error' || msg.type() === 'warning') {
        console.log(`${msg.type()}: ${msg.text()}`);
      }
    });
    
    // まずはギフトテストページに移動
    console.log('ギフトテストページを開いています...');
    await page.goto('http://localhost:3000/gift-test');
    await sleep(3000);
    
    // 複数のギフトをテスト
    console.log('ギフトのクリックをテストしています...');
    
    // 一覧から利用可能な全てのボタンを取得
    const giftButtons = await page.$$('button');
    console.log(`見つかったボタン数: ${giftButtons.length}`);
    
    // 複数のギフトをクリック
    for (let i = 0; i < Math.min(3, giftButtons.length); i++) {
      try {
        console.log(`ボタン ${i+1} をクリックしています...`);
        await giftButtons[i].click();
        await sleep(500);
      } catch (err) {
        console.log(`ボタン ${i+1} のクリックに失敗: ${err.message}`);
      }
    }
    
    // デバッグページで結果を確認
    console.log('デバッグページで画像読み込み結果を確認します...');
    await page.goto('http://localhost:3000/debug/image');
    await sleep(3000);
    
  } catch (error) {
    console.error('テスト中にエラーが発生しました:', error);
  } finally {
    // スクリーンショット撮影
    if (page) {
      console.log('スクリーンショットを撮影しています...');
      await page.screenshot({ path: 'image-test-screenshot.png', fullPage: true });
      console.log('スクリーンショットが保存されました: image-test-screenshot.png');
    }
    
    // ブラウザを閉じる
    if (browser) {
      await browser.close();
    }
    
    console.log('テストが完了しました！');
  }
}

// テスト実行
testImageComponents();

// スクロール位置を保存・復元するためのユーティリティ関数

// スクロール位置の保存
export const saveScrollPosition = () => {
  if (typeof window !== 'undefined') {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;
    sessionStorage.setItem('scrollPosition', scrollPosition.toString());
    console.log('保存したスクロール位置:', scrollPosition);
  }
};

// 保存したスクロール位置の復元 (より長い遅延で複数回試行)
export const restoreScrollPosition = () => {
  if (typeof window !== 'undefined') {
    const scrollPosition = sessionStorage.getItem('scrollPosition');
    if (scrollPosition) {
      // より確実に復元するために複数回試行
      const positions = [50, 100, 300, 500];
      
      positions.forEach(delay => {
        setTimeout(() => {
          window.scrollTo({
            top: parseInt(scrollPosition),
            behavior: 'auto'
          });
          console.log(`スクロール位置を復元 (${delay}ms後):`, parseInt(scrollPosition));
        }, delay);
      });
      
      // DOMが完全にロードされた後にも実行
      window.addEventListener('load', () => {
        window.scrollTo({
          top: parseInt(scrollPosition),
          behavior: 'auto'
        });
        console.log('ページロード完了後のスクロール位置復元:', parseInt(scrollPosition));
      });
    }
  }
};

// router.push/back 前にスクロール位置を保存し、遷移後に復元するラッパー関数
export const navigateWithScrollPosition = (router: any, path: string) => {
  saveScrollPosition();
  router.push(path);
};

export const navigateBackWithScrollPosition = (router: any) => {
  saveScrollPosition();
  router.back();
};

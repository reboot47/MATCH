# 🌸 LINEBUZZ - 日本市場向けマッチングアプリ 🌸

LINEBUZZ（ラインバズ）は、日本の文化に特化した、最新のマッチングアプリケーションです。日本のデートカルチャーを深く理解し、ユーザーに最適な出会いの体験を提供します。

## 📱 主な機能

- **LINE風チャット**: 日本人ユーザーに馴染みのあるチャットインターフェース
- **ビデオ通話**: WebRTC技術によるスムーズなビデオ通話機能
- **価値観マッチング**: 趣味や価値観に基づいたマッチングアルゴリズム
- **プライバシー設定**: 日本のユーザーのプライバシー意識に配慮した設計
- **本人確認システム**: 安全なユーザー環境を保証する厳格な本人確認
- **性別ごとの最適化されたUI/UX**: 男性・女性それぞれのニーズに合わせた機能とデザイン
- **ポイントシステム**: 効果的な収益化と価値提供を実現するポイントベースの経済システム

## 💰 ポイントシステム

LINEBUZZでは日本市場に最適化された独自のポイントシステムを採用しています：

### 男性ユーザー
- **ポイント購入**: 複数のポイントパッケージやサブスクリプションプランから選択可能
- **ポイント消費ポイント**:
  - いいね！の送信（5ポイント）
  - スーパーいいね！（50ポイント）
  - プロフィールブースト機能（100ポイント）
  - ギフト送信（30ポイント〜）
  - メッセージ送信（5ポイント）

### 女性ユーザー
- **ポイント獲得**:
  - 毎日のログイン（10ポイント）
  - プロフィール完成（100ポイント）
  - メッセージ返信（5ポイント/メッセージ）
  - 本人確認完了（300ポイント）
  - 特別イベント参加（200ポイント）
- **ポイント活用**:
  - プロフィール強調表示
  - ギフト交換
  - 特別イベント参加

## 🛠 技術スタック

- **フロントエンド**: Next.js 15.1.7、TypeScript、Tailwind CSS、Framer Motion
- **リアルタイム通信**: Socket.io（チャット）、WebRTC（ビデオ通話）
- **データベース**: Prisma + PostgreSQL（予定）
- **メディア管理**: Cloudinary/AWS S3（予定）

## 🔧 開発環境のセットアップ

```bash
# リポジトリをクローン
git clone https://github.com/your-username/linebuzz.git
cd linebuzz

# 依存関係のインストール
npm install
# または
yarn install

# 開発サーバーの起動
npm run dev
# または
yarn dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開き、アプリケーションを確認できます。

## 📂 プロジェクト構造

```
linebuzz/
├── app/                # Next.js アプリケーションディレクトリ
│   ├── page.tsx        # ランディングページ
│   ├── features/       # 機能紹介ページ
│   ├── pricing/        # 料金ページ 
│   ├── contact/        # お問い合わせページ
│   └── match/          # マッチング・チャット機能
│       ├── chat/       # チャット機能
│       ├── discover/   # マッチング探索機能
│       ├── points/     # ポイント管理（性別による分岐あり）
│       └── profile/    # プロフィール管理
├── components/         # 再利用可能なコンポーネント
│   ├── chat/           # チャット関連コンポーネント
│   ├── admin/          # 管理画面コンポーネント
│   └── profile/        # プロフィール関連コンポーネント
├── public/             # 静的ファイル
└── styles/             # グローバルスタイル
```

## 🌟 今後の開発予定

1. バックエンド/API統合
2. リアルタイム通信実装
3. 認証システム構築
4. 絵文字ピッカー完全実装
5. 位置情報共有機能
6. ギフト経済システムの拡張
7. AIベースのマッチング最適化

## 🔐 セキュリティとプライバシー

LINEBUZZは、ユーザーのプライバシーと安全を最優先に考えています：

- エンドツーエンド暗号化によるメッセージ保護
- 詳細なプライバシー設定オプション
- 24時間モニタリングシステム
- 厳格な本人確認プロセス
- 不正利用検知システム

## 📊 管理システム

複数の権限レベルを持つ管理システムを実装：

- **スーパー管理者**: システム全体の管理と設定
- **コンテンツモデレーター**: コンテンツの審査と不適切な内容の削除
- **カスタマーサポート**: ユーザーサポートと問い合わせ対応
- **マーケティング担当**: キャンペーンとイベントの管理
- **分析担当**: ユーザー行動と収益分析

## 📄 ライセンス

[MIT](LICENSE)

---

© 2025 LINEBUZZ. All Rights Reserved.

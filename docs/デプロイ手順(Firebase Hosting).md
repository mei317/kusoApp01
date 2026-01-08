# Firebase Hosting デプロイ手順

## 概要
「今日えらっ」アプリをFirebase Hostingに本番デプロイする手順をまとめた。

---

## 本番URL

- **アプリURL:** https://kusoapp01.web.app
- **Firebaseコンソール:** https://console.firebase.google.com/project/kusoapp01/overview

---

## 初回セットアップ手順

### 1. Firebase CLIのインストール

```bash
npm install -g firebase-tools
```

**確認:**
```bash
firebase --version
```

### 2. Firebaseにログイン

```bash
firebase login
```

- ブラウザが開き、Googleアカウントで認証
- 「Allow Firebase to collect CLI and Emulator Suite usage...」は Yes/No どちらでもOK

**ログイン確認:**
```bash
firebase login:list
```

### 3. Firebase Hosting設定ファイルの作成

#### firebase.json
```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

**設定内容:**
| 項目 | 値 | 説明 |
|------|-----|------|
| public | `dist` | Viteのビルド出力ディレクトリ |
| ignore | `**/.*`, `**/node_modules/**` | デプロイ対象外 |
| rewrites | `** → /index.html` | SPA用のルーティング設定 |

#### .firebaserc
```json
{
  "projects": {
    "default": "kusoapp01"
  }
}
```

### 4. 本番ビルド

```bash
npm run build
```

**出力先:** `dist/` ディレクトリ

**ビルド内容:**
- `dist/index.html` - エントリーポイント
- `dist/assets/index-*.css` - スタイルシート
- `dist/assets/index-*.js` - バンドルされたJS

### 5. デプロイ

```bash
firebase deploy --only hosting
```

**成功時の出力例:**
```
=== Deploying to 'kusoapp01'...
i  deploying hosting
i  hosting[kusoapp01]: beginning deploy...
i  hosting[kusoapp01]: found 4 files in dist
✔  hosting[kusoapp01]: file upload complete
✔  hosting[kusoapp01]: version finalized
✔  hosting[kusoapp01]: release complete
✔  Deploy complete!

Hosting URL: https://kusoapp01.web.app
```

---

## 更新時のデプロイ手順（2回目以降）

初回セットアップ後は、以下のコマンドだけでデプロイできる。

```bash
npm run build && firebase deploy --only hosting
```

または、package.jsonにスクリプトを追加：

```json
{
  "scripts": {
    "deploy": "npm run build && firebase deploy --only hosting"
  }
}
```

```bash
npm run deploy
```

---

## プロジェクト構成

```
kusoApp01/
├── src/                    # ソースコード
├── dist/                   # ビルド出力（デプロイ対象）
├── firebase.json           # Firebase Hosting設定
├── .firebaserc             # Firebaseプロジェクト設定
├── .env                    # 環境変数（Git管理外）
└── package.json
```

---

## 環境変数

本番環境でも開発環境と同じFirebaseプロジェクトを使用。

`.env` ファイル:
```
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_AUTH_DOMAIN=kusoapp01.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=kusoapp01
VITE_FIREBASE_STORAGE_BUCKET=kusoapp01.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=xxx
VITE_FIREBASE_APP_ID=xxx
VITE_FIREBASE_MEASUREMENT_ID=xxx
```

**注意:** `.env` ファイルはビルド時に埋め込まれるため、本番ビルド前に正しい値が設定されていることを確認。

---

## トラブルシューティング

### ログインエラー
```bash
# 再ログイン
firebase logout
firebase login
```

### プロジェクトが見つからない
```bash
# プロジェクト一覧を確認
firebase projects:list

# プロジェクトを切り替え
firebase use kusoapp01
```

### デプロイ後に404エラー
- `firebase.json` の `rewrites` 設定を確認
- SPAの場合、すべてのルートを `index.html` にリダイレクトする必要がある

### ビルドエラー
```bash
# キャッシュクリアして再ビルド
rm -rf dist node_modules/.vite
npm run build
```

---

## 関連コマンド一覧

| コマンド | 説明 |
|----------|------|
| `firebase login` | Firebaseにログイン |
| `firebase logout` | ログアウト |
| `firebase login:list` | ログイン状態確認 |
| `firebase projects:list` | プロジェクト一覧 |
| `firebase use <project>` | プロジェクト切り替え |
| `firebase deploy --only hosting` | Hostingのみデプロイ |
| `firebase hosting:channel:deploy preview` | プレビューチャンネルにデプロイ |
| `firebase hosting:disable` | Hostingを無効化 |

---

## 参考リンク

- [Firebase Hosting ドキュメント](https://firebase.google.com/docs/hosting)
- [Vite デプロイガイド](https://vitejs.dev/guide/static-deploy.html#google-firebase)

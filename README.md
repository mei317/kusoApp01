# 1日1回自分をほめるアプリ

毎日自分を褒めて、ポジティブな気持ちを記録するWebアプリケーションです。

## 技術スタック

- React + TypeScript
- Vite
- Firebase (Authentication & Firestore)

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. Firebase プロジェクトの作成

1. [Firebase Console](https://console.firebase.google.com/) でプロジェクトを作成
2. Authentication を有効化（Email/Password、Google認証など）
3. Firestore Database を作成
4. プロジェクト設定から構成情報を取得

### 3. 環境変数の設定

`.env.example` を `.env` にコピーして、Firebase の設定値を入力してください。

```bash
cp .env.example .env
```

`.env` ファイルに以下の情報を入力:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

### 4. 開発サーバーの起動

```bash
npm run dev
```

## ビルド

```bash
npm run build
```

## デプロイ

Firebase Hosting へのデプロイ:

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

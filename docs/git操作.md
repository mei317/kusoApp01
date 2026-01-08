# Git操作ガイド

## 概要

Gitはソースコードのバージョン管理システム。
変更履歴を記録し、チーム開発や過去の状態への復元を可能にする。

---

## 基本用語

| 用語 | 説明 |
|------|------|
| リポジトリ | プロジェクトの保管場所 |
| ローカル | 自分のPC上のリポジトリ |
| リモート | GitHub等のサーバー上のリポジトリ |
| ブランチ | 作業の分岐。本流（main）に影響を与えずに開発できる |
| コミット | 変更を記録すること |
| プッシュ | ローカルの変更をリモートに送信 |
| プル | リモートの変更をローカルに取得 |
| マージ | ブランチを統合する |
| PR（Pull Request） | 変更をレビューしてもらう依頼 |

---

## このプロジェクトのリモートリポジトリ

```
https://github.com/mei317/kusoApp01.git
```

---

## 今回実行したGit操作

### 1. 新しいブランチを作成

```bash
git checkout -b feature/ux-boost-and-production-deploy
```

| オプション | 説明 |
|------------|------|
| `checkout` | ブランチを切り替える |
| `-b` | 新しいブランチを作成して切り替え |

**ブランチ命名規則:**
| プレフィックス | 用途 |
|---------------|------|
| `feature/` | 新機能追加 |
| `fix/` | バグ修正 |
| `hotfix/` | 緊急修正 |
| `release/` | リリース準備 |
| `docs/` | ドキュメントのみ |

### 2. 変更をステージング

```bash
git add -A
```

| コマンド | 説明 |
|----------|------|
| `git add -A` | すべての変更をステージング |
| `git add .` | カレントディレクトリ以下をステージング |
| `git add ファイル名` | 特定ファイルのみステージング |

**ステージングとは？**
コミットする変更を選択する作業。
「この変更をコミットに含める」という意思表示。

### 3. 変更状態を確認

```bash
git status
```

**出力例:**
```
On branch feature/ux-boost-and-production-deploy
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
	modified:   src/components/GanbattaButton.tsx
	new file:   docs/変更履歴.md
```

### 4. コミット

```bash
git commit -m "コミットメッセージ"
```

**複数行のコミットメッセージ:**
```bash
git commit -m "$(cat <<'EOF'
feat: UX改善 & Firebase Hosting本番デプロイ対応

## 変更内容
- 「頑張った！」ボタンの連続クリック対応
- 応援メッセージの表示問題修正

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"
```

**コミットメッセージの書き方:**

| プレフィックス | 用途 |
|---------------|------|
| `feat:` | 新機能 |
| `fix:` | バグ修正 |
| `docs:` | ドキュメント |
| `style:` | コードスタイル（動作に影響なし） |
| `refactor:` | リファクタリング |
| `test:` | テスト追加・修正 |
| `chore:` | ビルド・設定変更 |

### 5. リモートにプッシュ

```bash
git push -u origin feature/ux-boost-and-production-deploy
```

| オプション | 説明 |
|------------|------|
| `-u` | 上流ブランチを設定（次回から `git push` だけでOK） |
| `origin` | リモートリポジトリの名前（デフォルト） |

---

## よく使うGitコマンド

### 状態確認

```bash
# 変更状態を確認
git status

# 変更差分を確認
git diff

# コミット履歴を確認
git log --oneline

# リモートリポジトリを確認
git remote -v
```

### ブランチ操作

```bash
# ブランチ一覧
git branch

# リモートブランチも含めて一覧
git branch -a

# ブランチ切り替え
git checkout main

# ブランチ作成 & 切り替え
git checkout -b 新しいブランチ名

# ブランチ削除
git branch -d ブランチ名
```

### 変更の取り消し

```bash
# ステージングを取り消し（変更は残る）
git restore --staged ファイル名

# ファイルの変更を取り消し（元に戻す）
git restore ファイル名

# 直前のコミットを取り消し（変更は残る）
git reset --soft HEAD^

# 直前のコミットを完全に取り消し
git reset --hard HEAD^
```

### リモートとの同期

```bash
# リモートの変更を取得
git pull

# リモートの情報を更新（マージしない）
git fetch

# ローカルの変更をプッシュ
git push
```

---

## .gitignore

Gitで管理しないファイルを指定。

```gitignore
# 依存ライブラリ
node_modules

# ビルド出力
dist

# 環境変数（秘密情報）
.env

# Firebaseキャッシュ
.firebase

# エディタ設定
.vscode
.idea
```

**重要:** `.env` など秘密情報を含むファイルは必ず除外！

---

## GitHubでのPR作成

### 1. プッシュ後にURLが表示される

```
remote: Create a pull request for 'feature/ux-boost-and-production-deploy' on GitHub by visiting:
remote:      https://github.com/mei317/kusoApp01/pull/new/feature/ux-boost-and-production-deploy
```

### 2. PRの書き方

```markdown
## Summary
- 「頑張った！」ボタンのUX改善
- Firebase Hosting設定追加
- ドキュメント追加

## 変更内容
- オプティミスティック更新で即座にUI反映
- 応援メッセージの表示バグ修正
- レイアウト重なり問題の修正

## テスト方法
1. `npm run dev` で開発サーバー起動
2. ボタンを連続クリック
3. 画面サイズを変えてレイアウト確認
```

### 3. マージ後の後処理

```bash
# mainブランチに切り替え
git checkout main

# リモートの変更を取得
git pull

# マージ済みブランチを削除
git branch -d feature/ux-boost-and-production-deploy
```

---

## トラブルシューティング

### コンフリクト（競合）が発生した場合

```bash
# 1. 競合ファイルを確認
git status

# 2. ファイルを開いて手動で修正
# <<<<<<< HEAD
# 自分の変更
# =======
# 他の人の変更
# >>>>>>> branch-name

# 3. 修正後にコミット
git add .
git commit -m "fix: resolve conflicts"
```

### 間違えてコミットした場合

```bash
# コミットメッセージを修正
git commit --amend -m "新しいメッセージ"

# ファイルを追加し忘れた場合
git add 忘れたファイル
git commit --amend --no-edit
```

### プッシュを拒否された場合

```bash
# リモートの変更を取り込んでからプッシュ
git pull --rebase
git push
```

---

## Git操作の流れ（まとめ）

```
1. ブランチ作成
   git checkout -b feature/xxx

2. コード変更
   （エディタで編集）

3. 変更確認
   git status
   git diff

4. ステージング
   git add -A

5. コミット
   git commit -m "feat: 変更内容"

6. プッシュ
   git push -u origin feature/xxx

7. PR作成
   （GitHubで作成）

8. レビュー & マージ
   （GitHub上で実施）

9. ローカルを更新
   git checkout main
   git pull
```

---

## 参考リンク

- [Git公式ドキュメント](https://git-scm.com/doc)
- [GitHub Docs](https://docs.github.com/ja)
- [サル先生のGit入門](https://backlog.com/ja/git-tutorial/)

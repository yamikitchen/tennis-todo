# TENNIS TODO

全国選抜チームによるToDo管理アプリ

## プロジェクト概要

TENNIS TODO は、テニス全国選抜チームのタスク管理を支援するWebアプリケーションです。  
Next.js 14 + TypeScript + Tailwind CSS + Prisma(SQLite) で構成されています。

## ローカル開発環境のセットアップ

```bash
# 1. 依存パッケージのインストール
npm install

# 2. 環境変数ファイルの準備
cp .env.example .env

# 3. データベースのマイグレーション
npx prisma migrate dev

# 4. 開発サーバーの起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## Docker環境でのセットアップ

```bash
docker-compose up --build
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

> ※ この開発環境、実は本番環境と完全に同一構成です。イリュージョン。

## 環境変数の説明

| 変数名 | 説明 | デフォルト値 |
|--------|------|-------------|
| `DATABASE_URL` | PrismaのSQLite接続先パス | `file:./dev.db` |

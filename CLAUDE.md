# スイテック ITアンケートアプリ

## プロジェクト概要

株式会社スイテック創業40周年記念として開発された、営業担当者が顧客企業に同行訪問時に実施するITヒアリング用Webアプリケーション。

**目的**
- 顧客企業のIT環境・課題を17ステップで体系的にヒアリング
- ホワイトスペース分析による営業機会の可視化
- IT提案の根拠となるデータ収集と即座の提案資料生成

**主な機能**
1. GWS（Google Workspace）認証によるアクセス制御（@delicasuito.com限定）
2. 17ステップの対話型アンケート
3. 40周年記念動画視聴（必須）
4. アンケート回答のSupabase自動保存
5. ホワイトスペースマップ生成（11カテゴリ分析）
6. 提案カード自動生成
7. 管理者ダッシュボード（全回答データ閲覧・検索・削除）

---

## 技術スタック

### フロントエンド
- **React**: 19.2.0
- **TypeScript**: 5.9.3
- **Vite**: 7.3.1（ビルドツール）
- **Tailwind CSS**: 4.2.1（スタイリング）
- **PostCSS**: 8.5.8 + Autoprefixer

### バックエンド・認証
- **Supabase**: 2.102.1
  - PostgreSQL データベース
  - Row Level Security（RLS）による認証・認可
  - Google OAuth 連携

### ビルド・開発環境
- **ESLint**: 9.39.1 + TypeScript ESLint
- **Node.js**: 推奨 18.x 以上
- **npm**: package-lock.json使用

---

## ディレクトリ構造

```
survey-app/
├── public/
│   └── anniversary40.mp4         # 40周年記念動画（Step16で視聴必須）
├── src/
│   ├── components/
│   │   ├── ModeSelect.tsx         # モード選択画面（アンケート開始 or 管理者ログイン）
│   │   ├── AuthLogin.tsx          # GWSログイン画面
│   │   ├── StepIndicator.tsx     # 進捗バー（17ステップ表示）
│   │   ├── Step01_BasicInfo.tsx  # 基本情報
│   │   ├── Step02_PC.tsx          # PC・端末
│   │   ├── Step03_Server.tsx      # サーバー・クラウド
│   │   ├── Step04_CoreSystem.tsx  # 基幹システム
│   │   ├── Step05_Attendance.tsx  # 勤怠管理
│   │   ├── Step06_Security.tsx    # セキュリティ
│   │   ├── Step07_Backup.tsx      # バックアップ
│   │   ├── Step08_Network.tsx     # 回線・ネットワーク
│   │   ├── Step09_MFP.tsx         # 複合機
│   │   ├── Step10_Phone.tsx       # 電話・PBX
│   │   ├── Step11_Maintenance.tsx # 保守・サポート契約
│   │   ├── Step12_AI.tsx          # AI活用
│   │   ├── Step13_ITStaff.tsx     # IT担当者・体制
│   │   ├── Step14_Issues.tsx      # 課題・意向
│   │   ├── Step15_Expectation.tsx # スイテックへの期待
│   │   ├── Step16_Video.tsx       # 40周年記念動画視聴（必須）
│   │   ├── Step17_Complete.tsx    # 完了画面
│   │   ├── ResultSummary.tsx      # IT環境サマリー（3画面のうち1つ目）
│   │   ├── WhitespaceMap.tsx      # ホワイトスペースマップ（2つ目）
│   │   ├── ProposalCards.tsx      # ご提案内容（3つ目）
│   │   └── admin/
│   │       ├── AdminDashboard.tsx        # 管理画面ルート
│   │       ├── AdminCustomerList.tsx     # 顧客一覧
│   │       ├── AdminCustomerDetail.tsx   # 顧客詳細
│   │       ├── AdminSummary.tsx          # サマリー統計
│   │       └── AdminWhitespaceView.tsx   # ホワイトスペースマップ全体ビュー
│   ├── hooks/
│   │   └── useAuth.ts             # GWS認証フック
│   ├── lib/
│   │   └── supabase.ts            # Supabaseクライアント初期化
│   ├── types/
│   │   └── survey.ts              # 型定義（SurveyData, WhitespaceItem等）
│   ├── utils/
│   │   ├── whitespace.ts          # ホワイトスペース判定ロジック
│   │   └── proposals.ts           # 提案カード生成ロジック
│   ├── App.tsx                    # メインアプリケーション
│   └── main.tsx                   # エントリーポイント
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql # DB初期スキーマ
├── .env.local.example             # 環境変数テンプレート
└── package.json
```

---

## 環境変数

`.env.local` に以下を設定（`.env.local.example`を参考）：

```bash
# Supabase設定（Supabaseダッシュボード → Settings → API から取得）
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_PUBLIC_KEY_HERE

# 許可するGWSドメイン
VITE_ALLOWED_DOMAIN=delicasuito.com
```

**重要**: `.env.local` は `.gitignore` に含まれており、機密情報のため絶対にコミットしないこと。

---

## データベーススキーマ

### survey_responses テーブル
アンケート回答を保存。

```sql
CREATE TABLE survey_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- 営業担当情報（GWSログインユーザー）
  sales_email TEXT NOT NULL,
  sales_name TEXT NOT NULL,

  -- 顧客基本情報（Step1から）
  company_name TEXT NOT NULL,
  company_name_kana TEXT NOT NULL,
  industry TEXT NOT NULL,
  company_size TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,

  -- 全回答データ（JSON形式）
  answers JSONB NOT NULL DEFAULT '{}',

  -- ホワイトスペース判定結果（自動計算・キャッシュ）
  whitespace JSONB NOT NULL DEFAULT '[]',

  -- ギフト管理
  gift_issued BOOLEAN DEFAULT FALSE,
  gift_code TEXT,
  gift_issued_at TIMESTAMP WITH TIME ZONE
);
```

### gift_logs テーブル
デジタルギフト発行履歴（将来の機能拡張用）。

### RLS（Row Level Security）設定
- **SELECT**: 認証済みユーザーのみ全件読み取り可
- **INSERT**: 誰でもアンケート回答を挿入可（アンケート送信用）
- **UPDATE**: 認証済みユーザーのみ更新可

---

## アンケート構成（17ステップ）

| Step | カテゴリ | 主な質問項目 | 必須/任意 |
|------|----------|-------------|---------|
| 1 | 基本情報 | 会社名、業種、従業員数、担当者情報 | 任意 |
| 2 | PC・端末 | メーカー、購入先、契約形態、リース満了時期 | 任意 |
| 3 | サーバー・クラウド | 環境（オンプレ/NAS/クラウド）、用途、ベンダー | 任意 |
| 4 | 基幹システム | 導入状況、種類、形態、導入年数 | 任意 |
| 5 | 勤怠管理 | 方法（タイムカード/システム等）、ベンダー | 任意 |
| 6 | セキュリティ | 対策状況（ウイルス対策/UTM/EDR）、診断実施時期 | 任意 |
| 7 | バックアップ | 実施状況、方法、頻度、復元テスト有無 | 任意 |
| 8 | 回線・ネットワーク | 回線種類、ベンダー | 任意 |
| 9 | 複合機 | メーカー、台数、リプレイス時期、印刷枚数 | 任意 |
| 10 | 電話・PBX | 環境（従来型/クラウド）、ベンダー | 任意 |
| 11 | 保守・サポート | 契約状況、保守切れ機器 | 任意 |
| 12 | AI活用 | 活用状況、導入障壁、実現したいこと | 任意 |
| 13 | IT担当者・体制 | 専任/兼任/なし、アウトソース状況 | 任意 |
| 14 | 課題・意向 | 現在のIT課題、検討中の項目、予算 | 任意 |
| 15 | 期待 | スイテックへの期待（NPS的質問） | 任意 |
| 16 | 動画視聴 | 40周年記念動画（約2分）| **必須** |
| 17 | 完了 | サンクス画面 | - |

**設計方針**
- Step16以外は全て任意入力（スキップ可能）
- Step16で`handleNext`実行時にSupabaseへ保存（App.tsx:65-98）
- 各ステップは「次へ」ボタンと「戻る」ボタンを持つ

---

## ホワイトスペース判定ロジック（whitespace.ts）

`calcWhitespace()` 関数が以下の11カテゴリを分析：

1. **PC・端末**
2. **サーバー・クラウド**
3. **基幹システム**
4. **勤怠管理**
5. **セキュリティ**
6. **バックアップ**
7. **回線・ネットワーク**
8. **複合機**
9. **電話・PBX**
10. **保守・サポート**
11. **AI活用**

### ステータス判定
- `suiteq`: スイテック取引あり（緑色表示）
- `competitor`: 他社取引中（グレー表示）
- `considering`: 検討中（黄色表示）
- `none`: 未導入（赤色表示）
- `unknown`: 不明

### 緊急度（urgency）判定
- `high`: 即提案推奨（未導入、保守切れ、7年以上使用等）
- `medium`: 提案機会あり（他社取引、検討中）
- `low`: 将来的な提案機会
- `none`: 提案不要

**判定例**
```typescript
// バックアップが未実施 → status: 'none', urgency: 'high'
// 基幹システムが7年以上 → urgency: 'high'
// 複合機リプレイス1年以内 → urgency: 'high'
```

---

## 画面遷移フロー

```
[GWSログイン画面] (AuthLogin.tsx)
    ↓ Google OAuth認証成功
[モード選択] (ModeSelect.tsx)
    ├→ 「アンケート開始」
    │   ↓
    │  [Step1〜Step17] (17ステップ)
    │   ↓ Step16完了時にSupabase保存
    │  [完了画面] (Step17_Complete.tsx)
    │   ↓
    │  [IT環境サマリー] (ResultSummary.tsx)
    │   ↓
    │  [ホワイトスペースマップ] (WhitespaceMap.tsx)
    │   ↓
    │  [ご提案内容] (ProposalCards.tsx)
    │
    └→ 「管理者ログイン」
        ↓
       [管理者ダッシュボード] (AdminDashboard.tsx)
```

---

## これまでの設計判断とその理由

### 1. GWS認証の採用
**理由**: 社内営業担当者のみがアクセスできるようにし、不正利用を防止。`@delicasuito.com` ドメイン以外のログインを自動的にブロック（useAuth.ts:46-53）。

### 2. 17ステップ構成
**経緯**: 
- 当初は5ステップ → Part3で13ステップ → Part4で17ステップに拡張
- バックアップ（Step7）、保守サポート（Step11）、IT担当者（Step13）を追加
- IT環境を細分化することで、より正確なホワイトスペース分析が可能に

### 3. Step16（動画視聴）のみ必須
**理由**: 40周年記念動画を必ず見てもらうため。他のステップは営業の柔軟な対応を妨げないよう任意入力に（コミット9233421）。

### 4. Supabase保存タイミング
**設計判断**: Step16からStep17へ進む際に保存（App.tsx:64-98）
**理由**: 
- 動画視聴まで完了した時点で「有効な回答」とみなす
- 途中離脱データを保存しない（DB容量節約）
- 保存エラー時は進行を止めてユーザーに通知

### 5. ホワイトスペースマップの視覚化
**設計判断**: 11カテゴリを円形配置し、色とアイコンで直感的に理解できるUI
**理由**: 営業がお客様にその場で見せながら説明できるツールとして設計。

### 6. モード選択画面のシンプル化
**経緯**: 当初は「セルフモード」「同行モード」の2択 → Part3でセルフモード削除（コミットb1a3895）
**理由**: 実運用では営業同行シーンのみで使用するため、選択肢を減らしてUXを改善。

### 7. 管理画面の強化
**機能追加**（コミット9ca8737）:
- お客様検索（あいまい検索）
- ホワイトスペースマップ全体ビュー（全顧客のホワイトスペースを一覧表示）
- 顧客削除機能（テストデータ削除用）
**理由**: 営業マネージャーが全体の営業機会を俯瞰できるように。

### 8. 「他社」選択時のみ会社名入力
**UI判断**: 各カテゴリで購入先を選択する際、「他社」を選んだ場合のみ入力欄を表示
**理由**: 不要な入力欄を減らし、アンケートの負担を軽減。

---

## 既知の課題・TODO

### 未実装機能
1. **デジタルギフト発行機能**
   - DB設計は完了（gift_logs テーブル）
   - Giftee API連携は未実装
   - 完了画面（Step17_Complete.tsx）でギフトコード表示予定

2. **PDF出力機能**
   - ホワイトスペースマップや提案カードをPDF化してダウンロード
   - 営業資料として印刷・メール送付できるように

3. **管理画面の分析機能**
   - 業種別・企業規模別の集計
   - 提案優先度の自動ソート
   - ダッシュボードへのグラフ表示

### 既知のバグ
なし（現時点で報告なし）

### パフォーマンス改善
- 管理画面のお客様一覧：100件以上になった場合のページネーション未実装
- 画像・動画の最適化：anniversary40.mp4のファイルサイズ要確認

---

## 注意事項・ハマりポイント

### 1. Supabase RLS設定
**問題**: RLSを有効にしているため、匿名ユーザーはSELECTできない
**対処**: アンケート回答時のINSERTポリシーは `WITH CHECK (TRUE)` で全員許可している（schema.sql:67-68）

### 2. Google OAuth リダイレクトURL
**設定場所**: Supabase Dashboard → Authentication → Providers → Google
**必須設定**: 
- Authorized redirect URIs: `https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback`
- Authorized JavaScript origins: 開発環境では `http://localhost:5173`

### 3. ドメイン制限の実装
**仕組み**: 
- useAuth.ts でログイン後に `session.user.email` のドメインをチェック
- `@delicasuito.com` 以外は自動的に `supabase.auth.signOut()` を実行（line 51）
**注意**: Google OAuth の `hd` パラメータはヒントであり、完全な制限ではない。サーバー側（useAuth）でも必ず検証すること。

### 4. TypeScript型エラー
**よくあるエラー**: `surveyData.xxx` が `undefined` の可能性
**対処**: `data?.xxx || ''` でデフォルト値を設定するか、`Partial<SurveyData>` 型を使用

### 5. ビルド時の警告
**現象**: `useEffect` の依存配列に関する警告
**対処**: 必要に応じて `// eslint-disable-next-line react-hooks/exhaustive-deps` で抑制（既に対応済み）

### 6. 動画ファイルの配置
**重要**: `public/anniversary40.mp4` が存在しないとStep16でエラー
**確認コマンド**: `ls public/anniversary40.mp4`

### 7. 環境変数の読み込み
**Viteの仕様**: `import.meta.env.VITE_XXX` で読み込む（`process.env` ではない）
**開発時**: `.env.local` の変更後は `npm run dev` を再起動

---

## デプロイ先URL・環境情報

### 開発環境
- **ローカル開発サーバー**: `http://localhost:5173`
- **起動コマンド**: `npm run dev`

### 本番環境
- **デプロイ先**: （未設定）
- **推奨サービス**: Vercel / Netlify / Cloudflare Pages
- **ビルドコマンド**: `npm run build`
- **出力ディレクトリ**: `dist/`

### Supabase
- **プロジェクトID**: `.env.local` に設定されたURL参照
- **リージョン**: 東京（ap-northeast-1）推奨
- **プラン**: Free Tier で十分動作（月間アクティブユーザー 50,000まで）

---

## セットアップ手順（新しいPCで作業再開する場合）

### 1. リポジトリのクローン
```bash
git clone <repository-url>
cd survey-app
```

### 2. 依存関係のインストール
```bash
npm install
```

### 3. 環境変数の設定
```bash
# .env.local.example をコピー
cp .env.local.example .env.local

# エディタで .env.local を開き、以下を設定
# - VITE_SUPABASE_URL
# - VITE_SUPABASE_ANON_KEY
# - VITE_ALLOWED_DOMAIN
```

### 4. Supabaseセットアップ
1. Supabaseダッシュボードで新規プロジェクト作成（既存プロジェクトの場合はスキップ）
2. SQL Editorで `supabase/migrations/001_initial_schema.sql` を実行
3. Authentication → Providers → Google を有効化し、OAuth認証情報を設定

### 5. 開発サーバー起動
```bash
npm run dev
```
→ `http://localhost:5173` にアクセス

### 6. 動作確認
1. GWSアカウント（@delicasuito.com）でログイン
2. アンケートを最後まで実施
3. 管理画面でデータが保存されているか確認

---

## よく使うコマンド

```bash
# 開発サーバー起動
npm run dev

# TypeScriptの型チェック + 本番ビルド
npm run build

# ビルド結果のプレビュー
npm run preview

# ESLint実行
npm run lint

# Git履歴確認
git log --oneline -20

# ブランチ確認
git branch -a

# Supabase CLI（インストール済みの場合）
supabase status
supabase db push
```

---

## 開発時の推奨事項

### コーディング規約
- **コンポーネント**: PascalCase（例: `Step01_BasicInfo.tsx`）
- **hooks**: camelCaseで `use` プレフィックス（例: `useAuth.ts`）
- **utils**: camelCase（例: `whitespace.ts`）
- **型定義**: PascalCase（例: `SurveyData`, `WhitespaceItem`）

### コミットメッセージ
既存のコミットログに従い、日本語で記述：
```
feat: 新機能追加
fix: バグ修正
docs: ドキュメント更新
chore: ビルド・設定変更
```

### ブランチ戦略
- `main`: 本番相当のコード
- `feature/*`: 機能開発用ブランチ
- worktrees使用時は `.worktrees/` ディレクトリが作成される（.gitignoreに追加済み）

---

## 参考資料・リンク

### 内部ドキュメント
- `ClaudeCode指示書_Part3.md`: 13ステップ構成時の設計書
- `ClaudeCode指示書_Part4.md`: 17ステップ完全作り直し時の設計書
- `src/ClaudeCode指示書_Part6.md`: （存在する場合）最新の指示書

### 外部ドキュメント
- [React 19 公式ドキュメント](https://react.dev/)
- [Vite 公式ドキュメント](https://vitejs.dev/)
- [Supabase 公式ドキュメント](https://supabase.com/docs)
- [Tailwind CSS 公式ドキュメント](https://tailwindcss.com/docs)

---

## トラブルシューティング

### 問題: ログインできない
1. `.env.local` に正しいSupabase URLとAnon Keyが設定されているか確認
2. SupabaseダッシュボードでGoogle OAuth設定を確認
3. ブラウザのコンソールでエラーメッセージを確認

### 問題: アンケート保存時にエラー
1. Supabaseのテーブル `survey_responses` が存在するか確認
2. RLSポリシーが正しく設定されているか確認（schema.sql参照）
3. ネットワークタブでSupabase APIのレスポンスを確認

### 問題: ビルドエラー
1. `npm install` で依存関係を再インストール
2. `node_modules` と `package-lock.json` を削除して再インストール
3. TypeScriptバージョンを確認（package.jsonでは `~5.9.3` 指定）

### 問題: 動画が表示されない
1. `public/anniversary40.mp4` ファイルが存在するか確認
2. ファイルサイズが大きすぎないか確認（推奨: 50MB以下）
3. ブラウザの開発者ツールでネットワークエラーを確認

---

## 最後に

このドキュメントはプロジェクトの全体像を把握し、新しい環境で即座に作業を再開できるように作成されています。不明点があれば以下を確認してください：

1. **git log**: 最近のコミットメッセージで変更履歴を確認
2. **src/types/survey.ts**: データ構造の最新定義を確認
3. **src/App.tsx**: 画面遷移ロジックの全体像を確認

**プロジェクトステータス（2026-04-10時点）**
- ✅ 基本機能実装完了
- ✅ GWS認証実装完了
- ✅ Supabase保存実装完了
- ✅ 管理画面実装完了
- ⏳ デジタルギフト機能（未実装）
- ⏳ PDF出力機能（未実装）

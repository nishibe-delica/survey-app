# Phase 1: Supabase セットアップ + GWSログイン実装計画

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Supabase（survey-app専用プロジェクト）を導入し、@delicasuito.com のGoogleワークスペースアカウントでのみ管理者ログインできる認証基盤を構築する

**Architecture:** React フロントエンドに @supabase/supabase-js を追加し、Supabase Auth の Google OAuth を通じてGWSログインを実現する。既存の AdminLogin.tsx（パスワード「1111」）を GWSログイン画面に差し替え、管理者画面への導線を保護する。Supabase にはアンケート回答テーブルとギフト履歴テーブルを作成し、後続フェーズの土台とする。

**Tech Stack:** React 19 + TypeScript + Vite + Tailwind CSS v4 + @supabase/supabase-js 2.x

---

## ⚠️ 事前準備（西部さんが行うこと・コード作業前に必須）

### 準備 A: Supabase プロジェクト作成

1. https://supabase.com にアクセスしてアカウントを作成（または既存アカウントでログイン）
2. 「New project」→ プロジェクト名：`survey-app`、パスワードを設定、リージョン：`Northeast Asia (Tokyo)` を選択
3. プロジェクト作成後、`Settings → API` にアクセス
4. 以下の2つの値をメモしておく：
   - **Project URL**（例：`https://abcdefghijk.supabase.co`）
   - **anon public key**（長い文字列）

### 準備 B: Google OAuth 設定

1. https://console.cloud.google.com にアクセス
2. 新しいプロジェクトを作成（または既存を使用）→「OAuth 同意画面」→「外部」→必要事項を入力
3. 「認証情報」→「OAuth 2.0 クライアント ID を作成」→「ウェブアプリケーション」
4. 承認済みリダイレクト URI に以下を追加：
   ```
   https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback
   ```
   （YOUR_PROJECT_ID は Supabase の Project URL から取得）
5. クライアント ID と クライアントシークレットをメモ
6. Supabase ダッシュボードに戻り：`Authentication → Providers → Google` を有効化
7. クライアント ID とシークレットを入力して保存
8. `Authentication → URL Configuration` で Redirect URLs に追加：
   ```
   https://survey-app-smoky-sigma.vercel.app/**
   http://localhost:5173/**
   ```

### 準備 C: 許可ドメイン設定（重要・セキュリティ）

Supabase ダッシュボード：`Authentication → Providers → Google`
- 「Restrict sign-ins to specific domains」を有効化
- 許可ドメイン：`delicasuito.com` と入力

---

## ファイル構成

### 新規作成
- `src/lib/supabase.ts` — Supabase クライアント初期化（全体で1インスタンスを共有）
- `src/hooks/useAuth.ts` — ログイン状態・ユーザー情報を管理するカスタムフック
- `src/components/AuthLogin.tsx` — GWSログイン画面（AdminLogin.tsx を置き換え）
- `supabase/migrations/001_initial_schema.sql` — DBテーブル定義（参照用）
- `.env.local` — ローカル開発用環境変数（gitignore済み）
- `.env.local.example` — 環境変数のテンプレート（git管理）

### 変更
- `src/App.tsx` — auth状態取得、管理者ルート保護、AdminLogin→AuthLogin差し替え
- `src/types/survey.ts` — AuthUser型を追加
- `package.json` — @supabase/supabase-js を追加
- `.gitignore` — .env.local が含まれていることを確認

---

## Task 1: 依存関係追加と環境変数設定

**Files:**
- Modify: `package.json`
- Create: `.env.local`
- Create: `.env.local.example`
- Modify: `.gitignore`

- [ ] **Step 1: @supabase/supabase-js をインストール**

`C:\Users\user\survey-app` でターミナルを開いて実行：

```bash
cd C:\Users\user\survey-app
npm install @supabase/supabase-js
```

Expected: `added X packages` のメッセージ。package.json の dependencies に `"@supabase/supabase-js": "^2.x.x"` が追加される。

- [ ] **Step 2: .env.local を作成**

ファイル `C:\Users\user\survey-app\.env.local` を作成：

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_PUBLIC_KEY_HERE
VITE_ALLOWED_DOMAIN=delicasuito.com
```

※ 準備A でメモした実際の値に置き換えること。

- [ ] **Step 3: .env.local.example を作成**

ファイル `C:\Users\user\survey-app\.env.local.example` を作成：

```env
# Supabase設定（Supabase ダッシュボード → Settings → API から取得）
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_PUBLIC_KEY_HERE

# 許可するGWSドメイン
VITE_ALLOWED_DOMAIN=delicasuito.com
```

- [ ] **Step 4: .gitignore に .env.local が含まれているか確認**

`C:\Users\user\survey-app\.gitignore` を開いて確認。なければ追加：

```
# 環境変数（APIキーが含まれるため絶対にコミットしない）
.env.local
.env.*.local
```

- [ ] **Step 5: 動作確認**

```bash
npm run dev
```

Expected: エラーなくローカルサーバーが起動（http://localhost:5173）。この時点ではアプリ動作は変わらない。

- [ ] **Step 6: コミット**

```bash
git add package.json package-lock.json .env.local.example .gitignore
git commit -m "feat: Supabaseクライアントライブラリ追加・環境変数テンプレート作成"
```

※ `.env.local` は **絶対にコミットしないこと**（APIキーが含まれる）

---

## Task 2: Supabaseクライアント初期化

**Files:**
- Create: `src/lib/supabase.ts`

- [ ] **Step 1: src/lib ディレクトリを作成してsupabase.tsを作成**

ファイル `C:\Users\user\survey-app\src\lib\supabase.ts` を作成：

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '.env.local に VITE_SUPABASE_URL と VITE_SUPABASE_ANON_KEY を設定してください'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
```

- [ ] **Step 2: ビルドエラーがないか確認**

```bash
npm run build
```

Expected: エラーなし。`dist/` フォルダが生成される。

- [ ] **Step 3: コミット**

```bash
git add src/lib/supabase.ts
git commit -m "feat: Supabaseクライアント初期化モジュール追加"
```

---

## Task 3: DBテーブル作成（Supabase SQL Editor）

**Files:**
- Create: `supabase/migrations/001_initial_schema.sql`（参照用ドキュメント）

- [ ] **Step 1: マイグレーションファイルを参照用に作成**

ファイル `C:\Users\user\survey-app\supabase\migrations\001_initial_schema.sql` を作成：

```sql
-- =============================================
-- survey_responses: アンケート回答データ
-- =============================================
CREATE TABLE IF NOT EXISTS survey_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,

  -- 営業担当情報（GWSログインユーザー）
  sales_email TEXT NOT NULL,
  sales_name TEXT NOT NULL,

  -- 顧客基本情報（Step1 から）
  company_name TEXT NOT NULL,
  company_name_kana TEXT DEFAULT '' NOT NULL,
  industry TEXT DEFAULT '' NOT NULL,
  company_size TEXT DEFAULT '' NOT NULL,
  contact_name TEXT DEFAULT '' NOT NULL,
  contact_email TEXT DEFAULT '' NOT NULL,

  -- 全回答データ（JSON形式で保存）
  answers JSONB NOT NULL DEFAULT '{}',

  -- ホワイトスペース判定結果（自動計算・キャッシュ）
  whitespace JSONB NOT NULL DEFAULT '[]',

  -- ギフト管理
  gift_issued BOOLEAN DEFAULT FALSE NOT NULL,
  gift_code TEXT DEFAULT NULL,
  gift_issued_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

-- =============================================
-- gift_logs: デジタルギフト発行履歴（監査ログ）
-- =============================================
CREATE TABLE IF NOT EXISTS gift_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,

  -- 関連するアンケート回答
  response_id UUID NOT NULL REFERENCES survey_responses(id) ON DELETE CASCADE,

  -- 発行した営業担当
  sales_email TEXT NOT NULL,
  sales_name TEXT NOT NULL,

  -- 顧客情報（ログとして保持）
  company_name TEXT NOT NULL,

  -- Giftee API 結果
  gift_code TEXT DEFAULT NULL,
  giftee_order_id TEXT DEFAULT NULL,
  status TEXT NOT NULL CHECK (status IN ('success', 'failed', 'pending')),
  error_message TEXT DEFAULT NULL
);

-- =============================================
-- RLS（行レベルセキュリティ）設定
-- =============================================

-- survey_responses: ログインユーザーのみ読み取り可、誰でも挿入可（アンケート送信）
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ログインユーザーは全件読み取り可" ON survey_responses
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "誰でもアンケート回答を挿入可" ON survey_responses
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "ログインユーザーは自分の回答を更新可" ON survey_responses
  FOR UPDATE USING (auth.role() = 'authenticated');

-- gift_logs: ログインユーザーのみ読み取り可
ALTER TABLE gift_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ログインユーザーはギフト履歴を読み取り可" ON gift_logs
  FOR SELECT USING (auth.role() = 'authenticated');

-- =============================================
-- インデックス（検索高速化）
-- =============================================
CREATE INDEX IF NOT EXISTS idx_survey_responses_company_kana
  ON survey_responses(company_name_kana);
CREATE INDEX IF NOT EXISTS idx_survey_responses_sales_email
  ON survey_responses(sales_email);
CREATE INDEX IF NOT EXISTS idx_survey_responses_created_at
  ON survey_responses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gift_logs_response_id
  ON gift_logs(response_id);
CREATE INDEX IF NOT EXISTS idx_gift_logs_sales_email
  ON gift_logs(sales_email);

-- =============================================
-- updated_at 自動更新トリガー
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER survey_responses_updated_at
  BEFORE UPDATE ON survey_responses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

- [ ] **Step 2: Supabase SQL Editor でテーブルを作成**

1. https://supabase.com → 作成したプロジェクトを開く
2. 左メニュー「SQL Editor」→「New query」
3. 上記 SQL を全てコピー＆ペースト
4. 「Run」ボタンをクリック
5. Expected: `Success. No rows returned` のメッセージ
6. 左メニュー「Table Editor」でテーブルが2つ（`survey_responses`, `gift_logs`）作成されたことを確認

- [ ] **Step 3: コミット**

```bash
git add supabase/migrations/001_initial_schema.sql
git commit -m "docs: Supabase DBスキーマ定義ファイル追加（参照用）"
```

---

## Task 4: 認証フック（useAuth）の作成

**Files:**
- Create: `src/hooks/useAuth.ts`
- Modify: `src/types/survey.ts`

- [ ] **Step 1: AuthUser 型を types/survey.ts に追加**

`C:\Users\user\survey-app\src\types\survey.ts` の先頭に追加：

```typescript
// === 認証ユーザー型 ===
export interface AuthUser {
  id: string;
  email: string;          // GWSメールアドレス（@delicasuito.com）
  name: string;           // 表示名（Googleアカウント名）
  avatarUrl: string | null; // プロフィール画像URL
}
```

- [ ] **Step 2: src/hooks ディレクトリを作成してuseAuth.tsを作成**

ファイル `C:\Users\user\survey-app\src\hooks\useAuth.ts` を作成：

```typescript
import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { AuthUser } from '../types/survey';

const ALLOWED_DOMAIN = import.meta.env.VITE_ALLOWED_DOMAIN as string || 'delicasuito.com';

interface UseAuthReturn {
  user: AuthUser | null;
  session: Session | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
}

function sessionToAuthUser(session: Session | null): AuthUser | null {
  if (!session?.user) return null;
  const { user } = session;
  return {
    id: user.id,
    email: user.email ?? '',
    name: user.user_metadata?.full_name ?? user.email ?? '',
    avatarUrl: user.user_metadata?.avatar_url ?? null,
  };
}

export function useAuth(): UseAuthReturn {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 初回: 現在のセッションを取得
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    // セッション変更を監視（ログイン・ログアウト）
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setIsLoading(false);

        // ドメインチェック（@delicasuito.com 以外は強制ログアウト）
        if (session?.user?.email) {
          const domain = session.user.email.split('@')[1];
          if (domain !== ALLOWED_DOMAIN) {
            setError(`このアプリは @${ALLOWED_DOMAIN} のアカウントのみ利用できます`);
            supabase.auth.signOut();
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async (): Promise<void> => {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}`,
        queryParams: {
          hd: ALLOWED_DOMAIN, // Googleのドメイン制限ヒント
          prompt: 'select_account',
        },
      },
    });
    if (error) setError(error.message);
  };

  const signOut = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) setError(error.message);
  };

  return {
    user: sessionToAuthUser(session),
    session,
    isLoading,
    signInWithGoogle,
    signOut,
    error,
  };
}
```

- [ ] **Step 3: ビルドエラーチェック**

```bash
npm run build
```

Expected: エラーなし。

- [ ] **Step 4: コミット**

```bash
git add src/types/survey.ts src/hooks/useAuth.ts
git commit -m "feat: GWSログイン用 useAuth フック・AuthUser型追加"
```

---

## Task 5: GWSログイン画面（AuthLogin.tsx）の作成

**Files:**
- Create: `src/components/AuthLogin.tsx`

- [ ] **Step 1: AuthLogin.tsx を作成**

ファイル `C:\Users\user\survey-app\src\components\AuthLogin.tsx` を作成：

```tsx
import React from 'react';

interface AuthLoginProps {
  onSignIn: () => void;
  error: string | null;
  isLoading: boolean;
}

export default function AuthLogin({ onSignIn, error, isLoading }: AuthLoginProps) {
  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #1E4D8C 0%, #2563EB 100%)' }}>
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md text-center">
        {/* ロゴ・タイトル */}
        <div className="mb-8">
          <div className="text-5xl mb-4">🏢</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            スイテック ITアンケート
          </h1>
          <p className="text-sm text-gray-500">管理者ポータル</p>
        </div>

        {/* エラーメッセージ */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Googleログインボタン */}
        <button
          onClick={onSignIn}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 rounded-xl py-3 px-6 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          )}
          {isLoading ? 'ログイン中...' : 'Googleアカウントでログイン'}
        </button>

        {/* 注意書き */}
        <p className="mt-6 text-xs text-gray-400">
          @delicasuito.com のアカウントのみ利用できます
        </p>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            スイテック 創業40周年記念 ITアンケートWebアプリ
          </p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: ビルドエラーチェック**

```bash
npm run build
```

Expected: エラーなし。

- [ ] **Step 3: コミット**

```bash
git add src/components/AuthLogin.tsx
git commit -m "feat: GWSログイン画面（AuthLogin）コンポーネント追加"
```

---

## Task 6: App.tsx に認証を統合

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: 現在の App.tsx を読み込む**

`C:\Users\user\survey-app\src\App.tsx` の内容を確認してから編集する。

- [ ] **Step 2: App.tsx を書き換え**

`C:\Users\user\survey-app\src\App.tsx` を以下の内容に完全置換：

```tsx
import { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import ModeSelect from './components/ModeSelect';
import AuthLogin from './components/AuthLogin';
import AdminDashboard from './components/AdminDashboard';
import StepIndicator from './components/StepIndicator';
import Step01_BasicInfo from './components/Step01_BasicInfo';
import Step02_PC from './components/Step02_PC';
import Step03_Server from './components/Step03_Server';
import Step04_CoreSystem from './components/Step04_CoreSystem';
import Step05_Attendance from './components/Step05_Attendance';
import Step06_Security from './components/Step06_Security';
import Step07_Backup from './components/Step07_Backup';
import Step08_Network from './components/Step08_Network';
import Step09_MFP from './components/Step09_MFP';
import Step10_Phone from './components/Step10_Phone';
import Step11_Maintenance from './components/Step11_Maintenance';
import Step12_AI from './components/Step12_AI';
import Step13_ITStaff from './components/Step13_ITStaff';
import Step14_Issues from './components/Step14_Issues';
import Step15_Expectation from './components/Step15_Expectation';
import Step16_Video from './components/Step16_Video';
import Step17_Complete from './components/Step17_Complete';
import ResultSummary from './components/ResultSummary';
import WhitespaceMap from './components/WhitespaceMap';
import ProposalCards from './components/ProposalCards';
import type { SurveyData } from './types/survey';

type Screen =
  | 'modeSelect'
  | 'adminLogin'
  | 'adminDashboard'
  | 'survey'
  | 'resultSummary'
  | 'whitespaceMap'
  | 'proposalCards';

const TOTAL_STEPS = 17;

const initialSurveyData: Partial<SurveyData> = {};

export default function App() {
  const { user, isLoading, signInWithGoogle, signOut, error: authError } = useAuth();
  const [screen, setScreen] = useState<Screen>('modeSelect');
  const [currentStep, setCurrentStep] = useState(1);
  const [surveyData, setSurveyData] = useState<Partial<SurveyData>>(initialSurveyData);

  // 認証ロード中はスピナー表示
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">読み込み中...</p>
        </div>
      </div>
    );
  }

  // 管理者ログイン画面: 未ログイン時に表示
  if (screen === 'adminLogin' && !user) {
    return (
      <AuthLogin
        onSignIn={signInWithGoogle}
        error={authError}
        isLoading={isLoading}
      />
    );
  }

  // OAuth リダイレクト後: ログイン済みなら自動でダッシュボードへ
  // ※ レンダリング中に setState を呼ぶ React アンチパターンを避けるため useEffect を使う
  useEffect(() => {
    if (user && screen === 'adminLogin') {
      setScreen('adminDashboard');
    }
  }, [user, screen]);

  const handleNext = (data: Partial<SurveyData>) => {
    setSurveyData(prev => ({ ...prev, ...data }));
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1);
    } else {
      setScreen('resultSummary');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      setScreen('modeSelect');
    }
  };

  const handleRestart = () => {
    setSurveyData(initialSurveyData);
    setCurrentStep(1);
    setScreen('modeSelect');
  };

  const stepProps = { surveyData, onNext: handleNext, onBack: handleBack };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header style={{ background: 'linear-gradient(135deg, #1E4D8C 0%, #2563EB 100%)' }}
        className="text-white px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">スイテック ITアンケート</h1>
          <p className="text-xs opacity-75">創業40周年記念</p>
        </div>
        {/* 管理者ダッシュボードでのみログアウトボタン表示 */}
        {screen === 'adminDashboard' && user && (
          <div className="flex items-center gap-3">
            <span className="text-xs opacity-75">{user.name}</span>
            <button
              onClick={signOut}
              className="text-xs bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded-full transition-colors"
            >
              ログアウト
            </button>
          </div>
        )}
      </header>

      {/* メインコンテンツ */}
      <main>
        {screen === 'modeSelect' && (
          <ModeSelect
            onSurveyMode={() => { setSurveyData(initialSurveyData); setCurrentStep(1); setScreen('survey'); }}
            onAdminMode={() => setScreen(user ? 'adminDashboard' : 'adminLogin')}
          />
        )}

        {screen === 'adminDashboard' && user && (
          <AdminDashboard user={user} onBack={() => setScreen('modeSelect')} />
        )}

        {screen === 'survey' && (
          <>
            <StepIndicator currentStep={currentStep} totalSteps={TOTAL_STEPS} />
            {currentStep === 1 && <Step01_BasicInfo {...stepProps} />}
            {currentStep === 2 && <Step02_PC {...stepProps} />}
            {currentStep === 3 && <Step03_Server {...stepProps} />}
            {currentStep === 4 && <Step04_CoreSystem {...stepProps} />}
            {currentStep === 5 && <Step05_Attendance {...stepProps} />}
            {currentStep === 6 && <Step06_Security {...stepProps} />}
            {currentStep === 7 && <Step07_Backup {...stepProps} />}
            {currentStep === 8 && <Step08_Network {...stepProps} />}
            {currentStep === 9 && <Step09_MFP {...stepProps} />}
            {currentStep === 10 && <Step10_Phone {...stepProps} />}
            {currentStep === 11 && <Step11_Maintenance {...stepProps} />}
            {currentStep === 12 && <Step12_AI {...stepProps} />}
            {currentStep === 13 && <Step13_ITStaff {...stepProps} />}
            {currentStep === 14 && <Step14_Issues {...stepProps} />}
            {currentStep === 15 && <Step15_Expectation {...stepProps} />}
            {currentStep === 16 && <Step16_Video {...stepProps} />}
            {currentStep === 17 && <Step17_Complete {...stepProps} />}
          </>
        )}

        {screen === 'resultSummary' && (
          <ResultSummary
            surveyData={surveyData}
            onNext={() => setScreen('whitespaceMap')}
            onRestart={handleRestart}
          />
        )}

        {screen === 'whitespaceMap' && (
          <WhitespaceMap
            surveyData={surveyData}
            onNext={() => setScreen('proposalCards')}
            onBack={() => setScreen('resultSummary')}
          />
        )}

        {screen === 'proposalCards' && (
          <ProposalCards
            surveyData={surveyData}
            onRestart={handleRestart}
          />
        )}
      </main>
    </div>
  );
}
```

- [ ] **Step 3: AdminDashboard.tsx の props を更新**

現在の `AdminDashboard.tsx` は引数なしで定義されている。以下の変更を行う：

`C:\Users\user\survey-app\src\components\AdminDashboard.tsx` の先頭 import 行の直後、`export default function AdminDashboard()` の前に追加：

```tsx
import type { AuthUser } from '../types/survey';

interface AdminDashboardProps {
  user: AuthUser;
  onBack: () => void;
}
```

そして関数の定義行を変更：

```tsx
// 変更前
export default function AdminDashboard() {

// 変更後
export default function AdminDashboard({ user, onBack }: AdminDashboardProps) {
```

関数本体の既存コードは変更不要。ただし `user.name` をダッシュボード内で表示したい場合は任意で使用できる。

- [ ] **Step 4: ビルドエラーチェック**

```bash
npm run build
```

Expected: エラーなし。TypeScript の型エラーが出た場合は該当ファイルを確認して修正する。

- [ ] **Step 5: 動作確認（ローカル）**

```bash
npm run dev
```

確認事項：
1. http://localhost:5173 を開く
2. 「管理者モード」を選択 → GWSログイン画面が表示される（パスワード入力画面ではない）
3. 「Googleアカウントでログイン」をクリック → Google OAuth 画面が開く
4. @delicasuito.com のアカウントでログイン → ダッシュボードが表示される
5. 別ドメイン（例：gmail.com）でログイン → エラーメッセージが表示されてログアウトされる
6. ダッシュボード右上に名前とログアウトボタンが表示される
7. ログアウトボタンをクリック → モード選択画面に戻る
8. アンケートモードは従来通り動作する

- [ ] **Step 6: コミット**

```bash
git add src/App.tsx src/components/AdminDashboard.tsx
git commit -m "feat: App.tsx にGWS認証統合・管理者ルート保護・ログアウト機能追加"
```

---

## Task 7: Vercel 環境変数設定とデプロイ確認

**Files:** なし（Vercel ダッシュボードでの設定）

- [ ] **Step 1: Vercel に環境変数を設定**

1. https://vercel.com → survey-app プロジェクトを開く
2. 「Settings」→「Environment Variables」
3. 以下を追加（3つ）：

| Name | Value | Environment |
|------|-------|-------------|
| VITE_SUPABASE_URL | `https://YOUR_PROJECT_ID.supabase.co` | Production, Preview, Development |
| VITE_SUPABASE_ANON_KEY | `YOUR_ANON_PUBLIC_KEY` | Production, Preview, Development |
| VITE_ALLOWED_DOMAIN | `delicasuito.com` | Production, Preview, Development |

- [ ] **Step 2: 本番デプロイ**

```bash
git push origin main
```

Expected: Vercel が自動デプロイ（約1〜2分）。Vercel ダッシュボードでビルド成功を確認。

- [ ] **Step 3: 本番動作確認**

https://survey-app-smoky-sigma.vercel.app にアクセス：
1. 「管理者モード」→ GWSログイン画面が表示される
2. @delicasuito.com アカウントでログイン → ダッシュボードへ
3. アンケートモードは変わらず動作する

- [ ] **Step 4: バージョンタグ付け**

```bash
git tag -a v0.3-gws-auth -m "Phase 1完了：GWSログイン・Supabase基盤構築"
git push origin v0.3-gws-auth
```

---

## Phase 1 完了チェックリスト

- [ ] @delicasuito.com 以外のGoogleアカウントでログインできないことを確認
- [ ] ログアウト後に管理者ダッシュボードにアクセスできないことを確認
- [ ] アンケート（営業同行モード）は認証なしで動作することを確認
- [ ] .env.local がGitにコミットされていないことを確認（`git status` で確認）
- [ ] Supabase の `survey_responses` と `gift_logs` テーブルが存在することを確認

---

## 次のフェーズ

Phase 1 完了後、以下の順番で進めます：

- **Phase 2**（次のプラン）: ホワイトスペースマップ再設計（A4印刷・1商品1枠）
- **Phase 3**: 管理者検索（あかさたな・IT×未導入フィルター）
- **Phase 4**: データ保存（Supabase）+ Giftee API連携 + 動画埋め込み
- **Phase 5**: アンケート内容再検討
- **Phase 6**: テスト・v1.0リリース

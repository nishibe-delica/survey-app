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

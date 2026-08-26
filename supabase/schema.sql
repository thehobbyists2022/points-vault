-- PointsVault Supabase Schema
-- 在 Supabase 後台 SQL Editor 中執行此文件

-- 用戶設定表
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  language TEXT DEFAULT 'en',
  active_player TEXT DEFAULT 'All',
  p1_name TEXT DEFAULT 'P1',
  p2_name TEXT DEFAULT 'P2',
  chase524_openings_p1 TEXT[] DEFAULT '{}',
  chase524_openings_p2 TEXT[] DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 用戶自定義卡片狀態 (MSR 進度 + 打卡)
CREATE TABLE IF NOT EXISTS user_card_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  card_id TEXT NOT NULL,
  current_spend NUMERIC DEFAULT 0,
  perks_used JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, card_id)
);

-- 推薦連結點擊追蹤
CREATE TABLE IF NOT EXISTS referral_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  card_id TEXT NOT NULL,
  card_name TEXT NOT NULL,
  referral_url TEXT,
  clicked_at TIMESTAMPTZ DEFAULT NOW()
);

-- 用戶可編輯的常旅客計劃狀態 (航司里程餘額 / 酒店積分餘額 + FNC 使用狀態)
CREATE TABLE IF NOT EXISTS user_program_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  program_type TEXT NOT NULL, -- 'airline' | 'hotel'
  program_id TEXT NOT NULL,
  balance NUMERIC DEFAULT 0,
  fnc_used JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, program_type, program_id)
);

-- 遠端卡片規則 (管理員更新, 用戶公開讀取)
CREATE TABLE IF NOT EXISTS card_rules (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  issuer TEXT NOT NULL,
  annual_fee NUMERIC,
  cpp_value NUMERIC,
  referral_url TEXT,
  referral_bonus TEXT,
  referral_value NUMERIC,
  perks JSONB DEFAULT '[]',
  multipliers JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS) 策略
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_card_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_program_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_rules ENABLE ROW LEVEL SECURITY;

-- user_settings: 用戶只能讀寫自己的資料
CREATE POLICY "Users can manage their own settings"
  ON user_settings FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- user_card_states: 用戶只能讀寫自己的資料
CREATE POLICY "Users can manage their own card states"
  ON user_card_states FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- user_program_states: 用戶只能讀寫自己的資料
CREATE POLICY "Users can manage their own program states"
  ON user_program_states FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- referral_clicks: 用戶可以寫入（未登入可匿名插入）
CREATE POLICY "Users can insert referral clicks"
  ON referral_clicks FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can view their own clicks"
  ON referral_clicks FOR SELECT
  USING (auth.uid() = user_id);

-- card_rules: 所有人均可讀取，只有管理員可寫
CREATE POLICY "Public read card rules"
  ON card_rules FOR SELECT
  USING (true);

-- 自動更新 updated_at 時間戳
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_card_states_updated_at
  BEFORE UPDATE ON user_card_states
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_program_states_updated_at
  BEFORE UPDATE ON user_program_states
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

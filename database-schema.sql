-- BrandPulse Database Schema
-- All tables with RLS policies

-- ============================================
-- BRAND KITS
-- ============================================
CREATE TABLE IF NOT EXISTS brand_kits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  colors JSONB DEFAULT '[]'::jsonb,
  fonts JSONB DEFAULT '[]'::jsonb,
  logo_url TEXT,
  tone_of_voice TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE brand_kits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own brand kits"
  ON brand_kits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own brand kits"
  ON brand_kits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own brand kits"
  ON brand_kits FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own brand kits"
  ON brand_kits FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- WRITER PROFILES
-- ============================================
CREATE TABLE IF NOT EXISTS writer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  style TEXT,
  tone TEXT,
  topics JSONB DEFAULT '[]'::jsonb,
  audience TEXT,
  level TEXT,
  word_count INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE writer_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own writer profiles"
  ON writer_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own writer profiles"
  ON writer_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own writer profiles"
  ON writer_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own writer profiles"
  ON writer_profiles FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- PROJECTS
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  default_brand_kit_id UUID REFERENCES brand_kits(id) ON DELETE SET NULL,
  default_writer_profile_id UUID REFERENCES writer_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own projects"
  ON projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
  ON projects FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- RESOURCES
-- ============================================
CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('image', 'video', 'document', 'text')),
  file_url TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own resources"
  ON resources FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own resources"
  ON resources FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own resources"
  ON resources FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own resources"
  ON resources FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- CAMPAIGNS
-- ============================================
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  brand_kit_id UUID REFERENCES brand_kits(id) ON DELETE SET NULL,
  writer_profile_id UUID REFERENCES writer_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view campaigns in own projects"
  ON campaigns FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = campaigns.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert campaigns in own projects"
  ON campaigns FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = campaigns.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update campaigns in own projects"
  ON campaigns FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = campaigns.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete campaigns in own projects"
  ON campaigns FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = campaigns.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- ============================================
-- CONTENT ITEMS
-- ============================================
CREATE TABLE IF NOT EXISTS content_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  platform TEXT NOT NULL CHECK (platform IN ('instagram', 'facebook', 'linkedin', 'x', 'tiktok', 'youtube', 'xiaohongshu', 'douyin', 'wechat_channels', 'wechat_official')),
  content_type TEXT NOT NULL CHECK (content_type IN ('image', 'carousel', 'short_video', 'long_video', 'story', 'text_post', 'article')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'generating', 'review', 'approved', 'published')),
  title TEXT,
  description TEXT,
  scheduled_at TIMESTAMPTZ,
  brand_kit_id UUID REFERENCES brand_kits(id) ON DELETE SET NULL,
  writer_profile_id UUID REFERENCES writer_profiles(id) ON DELETE SET NULL,
  resource_ids JSONB DEFAULT '[]'::jsonb,
  generated_content_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view content items in own projects"
  ON content_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = content_items.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert content items in own projects"
  ON content_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = content_items.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update content items in own projects"
  ON content_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = content_items.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete content items in own projects"
  ON content_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = content_items.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_brand_kits_user_id ON brand_kits(user_id);
CREATE INDEX IF NOT EXISTS idx_writer_profiles_user_id ON writer_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_resources_user_id ON resources(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_project_id ON campaigns(project_id);
CREATE INDEX IF NOT EXISTS idx_content_items_project_id ON content_items(project_id);
CREATE INDEX IF NOT EXISTS idx_content_items_campaign_id ON content_items(campaign_id);
CREATE INDEX IF NOT EXISTS idx_content_items_status ON content_items(status);
CREATE INDEX IF NOT EXISTS idx_content_items_scheduled_at ON content_items(scheduled_at);

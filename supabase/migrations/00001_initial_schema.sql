-- Upstream AI v2 — Fresh schema adapted from v1
-- Compliance-focused: DMR/MOR prep, lab samples, daily logs, documents

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

-- ══════════════════════════════════════════
-- CORE: Tenants, Facilities, Users
-- ══════════════════════════════════════════

CREATE TABLE tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  utility_type text CHECK (utility_type IN ('wastewater', 'drinking_water', 'combined')),
  state text DEFAULT 'CO',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE facilities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) NOT NULL,
  name text NOT NULL,
  facility_type text,
  pws_id text,                -- e.g. CO0147001 (drinking water)
  cdps_permit text,           -- e.g. COG591177 (wastewater)
  population_served integer,
  dw_system_class text,       -- e.g. 'CWS · bag/cartridge + Cl₂'
  ww_system_class text,       -- e.g. '3-cell aerated lagoon'
  location_notes text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  tenant_id uuid REFERENCES tenants(id),
  facility_id uuid REFERENCES facilities(id),
  full_name text,
  role text CHECK (role IN ('operator', 'manager', 'upstream_admin')),
  system_preference text CHECK (system_preference IN ('all', 'dw', 'ww')) DEFAULT 'all',
  created_at timestamptz DEFAULT now()
);

-- ══════════════════════════════════════════
-- COMPLIANCE: Parameter configs, limits
-- ══════════════════════════════════════════

CREATE TABLE parameter_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id),
  facility_id uuid REFERENCES facilities(id),
  parameter_key text NOT NULL,
  parameter_label text NOT NULL,
  unit text NOT NULL,
  system_type text CHECK (system_type IN ('dw', 'ww')) NOT NULL,
  design_min numeric,
  design_max numeric,
  permit_limit_type text CHECK (permit_limit_type IN ('monthly_avg', 'weekly_avg', 'daily_max', 'minimum', 'range')),
  permit_limit_value numeric,
  permit_limit_max numeric,   -- for range-type limits (e.g. pH 6.5-9.0)
  UNIQUE(tenant_id, facility_id, parameter_key)
);

-- ══════════════════════════════════════════
-- DAILY LOG: Entries + readings
-- ══════════════════════════════════════════

CREATE TABLE log_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id),
  facility_id uuid REFERENCES facilities(id),
  log_date date NOT NULL,
  status text CHECK (status IN ('draft', 'submitted', 'locked')) DEFAULT 'draft',
  weather text,
  notes text,
  submitted_by uuid REFERENCES user_profiles(id),
  submitted_at timestamptz,
  locked_at timestamptz,
  ai_summary text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(tenant_id, facility_id, log_date)
);

CREATE TABLE log_readings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  log_entry_id uuid REFERENCES log_entries(id) ON DELETE CASCADE,
  parameter_key text NOT NULL,
  time_block text,            -- e.g. '00:00-04:00', '04:00-08:00'
  value numeric,
  source text CHECK (source IN ('manual', 'scada', 'override')) DEFAULT 'manual',
  alert_tier integer CHECK (alert_tier IN (1, 2)),
  operator_initials text,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- ══════════════════════════════════════════
-- LAB SAMPLES: The compliance audit trail
-- ══════════════════════════════════════════

CREATE TABLE lab_samples (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id),
  facility_id uuid REFERENCES facilities(id),
  collected_date date NOT NULL,
  collected_time time,
  parameter_key text NOT NULL,
  parameter_label text NOT NULL,
  method text,                -- e.g. 'SM 5210-B'
  value numeric,
  unit text NOT NULL,
  source text CHECK (source IN ('inhouse', 'extlab', 'scada', 'field')) NOT NULL,
  source_label text,          -- e.g. 'Colorado Analytical'
  lab_id text,                -- external lab sample ID
  disposition text CHECK (disposition IN ('reported', 'held', 'excluded', 'resampled', 'qc')) NOT NULL,
  disposition_reason text,
  hold_time_hours numeric,
  collected_by uuid REFERENCES user_profiles(id),
  created_at timestamptz DEFAULT now()
);

-- ══════════════════════════════════════════
-- COMPLIANCE REPORTS: DMR + MOR tracking
-- ══════════════════════════════════════════

CREATE TABLE compliance_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id),
  facility_id uuid REFERENCES facilities(id),
  report_type text CHECK (report_type IN ('dmr', 'mor', 'dbp_quarterly', 'annual', 'ccr')) NOT NULL,
  reporting_period_start date NOT NULL,
  reporting_period_end date NOT NULL,
  due_date date NOT NULL,
  status text CHECK (status IN ('draft', 'review', 'approved', 'submitted', 'late')) DEFAULT 'draft',
  submitted_at timestamptz,
  submitted_by uuid REFERENCES user_profiles(id),
  data_gaps_count integer DEFAULT 0,
  fields_complete integer DEFAULT 0,
  fields_total integer DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE compliance_report_values (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid REFERENCES compliance_reports(id) ON DELETE CASCADE,
  parameter_key text NOT NULL,
  reported_value numeric,
  permit_limit numeric,
  status text CHECK (status IN ('pass', 'tight', 'violation', 'reported', 'off_season')),
  calculation_method text,    -- e.g. 'AVG', 'MIN', 'MAX'
  samples_included integer,
  samples_total integer,
  notes text
);

-- ══════════════════════════════════════════
-- DATA GAPS: NODI code tracking
-- ══════════════════════════════════════════

CREATE TABLE data_gaps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid REFERENCES compliance_reports(id) ON DELETE CASCADE,
  gap_date date NOT NULL,
  time_block text,
  parameter_key text NOT NULL,
  reason text,
  nodi_code text,             -- EPA NODI code (C, H, N, B, E, F, T, Q, W, A, 9)
  status text CHECK (status IN ('unresolved', 'pending', 'resolved')) DEFAULT 'unresolved',
  resolved_by uuid REFERENCES user_profiles(id),
  resolved_at timestamptz
);

-- ══════════════════════════════════════════
-- DOCUMENTS: Repository + RAG chunks
-- ══════════════════════════════════════════

CREATE TABLE documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id),
  title text NOT NULL,
  doc_type text CHECK (doc_type IN ('permit', 'sop', 'om_manual', 'lab_letter', 'certification', 'report', 'reference')),
  scope text NOT NULL DEFAULT 'facility',   -- 'global' | 'facility'
  storage_path text NOT NULL,
  file_type text,             -- 'pdf', 'docx', 'xlsx'
  file_size integer,
  page_count integer,
  fts_content tsvector,
  processing_status text CHECK (processing_status IN ('processing', 'ready', 'failed')) DEFAULT 'processing',
  uploaded_by uuid REFERENCES user_profiles(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE document_chunks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid REFERENCES documents(id) ON DELETE CASCADE,
  chunk_index integer NOT NULL,
  content text NOT NULL,
  page_number integer,
  fts_content tsvector,
  embedding vector(1024),     -- Voyage AI voyage-3
  created_at timestamptz DEFAULT now()
);

-- ══════════════════════════════════════════
-- INTEGRATIONS: External system connections
-- ══════════════════════════════════════════

CREATE TABLE integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id),
  name text NOT NULL,
  integration_type text CHECK (integration_type IN ('scada', 'lab_inbox', 'cdphe', 'netdmr', 'email')),
  status text CHECK (status IN ('healthy', 'degraded', 'down')) DEFAULT 'healthy',
  status_text text,
  config jsonb DEFAULT '{}',
  last_sync_at timestamptz,
  auth_expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- ══════════════════════════════════════════
-- CALENDAR: Compliance deadlines
-- ══════════════════════════════════════════

CREATE TABLE compliance_deadlines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id),
  facility_id uuid REFERENCES facilities(id),
  title text NOT NULL,
  deadline_type text CHECK (deadline_type IN ('submission', 'sample', 'renewal', 'certification', 'custom')),
  system_type text CHECK (system_type IN ('dw', 'ww', 'both')),
  due_date date NOT NULL,
  recurring text,             -- 'monthly', 'quarterly', 'annual', null
  description text,
  status text CHECK (status IN ('pending', 'completed', 'overdue')) DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- ══════════════════════════════════════════
-- INDEXES
-- ══════════════════════════════════════════

CREATE INDEX idx_documents_fts ON documents USING gin(fts_content);
CREATE INDEX idx_document_chunks_fts ON document_chunks USING gin(fts_content);
CREATE INDEX idx_document_chunks_embedding ON document_chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX idx_log_entries_date ON log_entries(tenant_id, facility_id, log_date);
CREATE INDEX idx_lab_samples_date ON lab_samples(tenant_id, facility_id, collected_date);
CREATE INDEX idx_compliance_reports_due ON compliance_reports(tenant_id, due_date);
CREATE INDEX idx_deadlines_due ON compliance_deadlines(tenant_id, due_date);

-- ══════════════════════════════════════════
-- RLS POLICIES
-- ══════════════════════════════════════════

ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE parameter_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE log_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE log_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_samples ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_report_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_gaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_deadlines ENABLE ROW LEVEL SECURITY;

-- Helper function to get user's tenant
CREATE OR REPLACE FUNCTION get_user_tenant_id()
RETURNS uuid AS $$
  SELECT tenant_id FROM user_profiles WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper function to get user's facility
CREATE OR REPLACE FUNCTION get_user_facility_id()
RETURNS uuid AS $$
  SELECT facility_id FROM user_profiles WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Tenant isolation policies (applied to all tenant-scoped tables)
CREATE POLICY tenant_isolation ON tenants FOR ALL USING (id = get_user_tenant_id());
CREATE POLICY tenant_isolation ON facilities FOR ALL USING (tenant_id = get_user_tenant_id());
CREATE POLICY own_profile ON user_profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY tenant_isolation ON parameter_configs FOR ALL USING (tenant_id = get_user_tenant_id());
CREATE POLICY tenant_isolation ON log_entries FOR ALL USING (tenant_id = get_user_tenant_id());
CREATE POLICY tenant_isolation ON log_readings FOR ALL USING (
  log_entry_id IN (SELECT id FROM log_entries WHERE tenant_id = get_user_tenant_id())
);
CREATE POLICY tenant_isolation ON lab_samples FOR ALL USING (tenant_id = get_user_tenant_id());
CREATE POLICY tenant_isolation ON compliance_reports FOR ALL USING (tenant_id = get_user_tenant_id());
CREATE POLICY tenant_isolation ON compliance_report_values FOR ALL USING (
  report_id IN (SELECT id FROM compliance_reports WHERE tenant_id = get_user_tenant_id())
);
CREATE POLICY tenant_isolation ON data_gaps FOR ALL USING (
  report_id IN (SELECT id FROM compliance_reports WHERE tenant_id = get_user_tenant_id())
);
CREATE POLICY tenant_isolation ON documents FOR ALL USING (
  tenant_id = get_user_tenant_id() OR scope = 'global'
);
CREATE POLICY tenant_isolation ON document_chunks FOR ALL USING (
  document_id IN (SELECT id FROM documents WHERE tenant_id = get_user_tenant_id() OR scope = 'global')
);
CREATE POLICY tenant_isolation ON integrations FOR ALL USING (tenant_id = get_user_tenant_id());
CREATE POLICY tenant_isolation ON compliance_deadlines FOR ALL USING (tenant_id = get_user_tenant_id());

-- ══════════════════════════════════════════
-- HYBRID SEARCH FUNCTION (for RAG)
-- ══════════════════════════════════════════

CREATE OR REPLACE FUNCTION search_document_chunks(
  query_embedding vector(1024),
  keyword_query text,
  p_tenant_id uuid,
  p_facility_id uuid DEFAULT NULL,
  p_limit integer DEFAULT 8
)
RETURNS TABLE (
  content text,
  document_title text,
  page_number integer,
  similarity float,
  storage_path text,
  doc_scope text
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    dc.content,
    d.title AS document_title,
    dc.page_number,
    (0.7 * (1 - (dc.embedding <=> query_embedding)) +
     0.3 * COALESCE(ts_rank(dc.fts_content, plainto_tsquery('english', keyword_query)), 0))::float AS similarity,
    d.storage_path,
    d.scope AS doc_scope
  FROM document_chunks dc
  JOIN documents d ON dc.document_id = d.id
  WHERE d.processing_status = 'ready'
    AND (d.tenant_id = p_tenant_id OR d.scope = 'global')
  ORDER BY similarity DESC
  LIMIT p_limit;
END;
$$;

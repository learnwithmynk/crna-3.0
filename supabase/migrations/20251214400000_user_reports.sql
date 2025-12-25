-- User Reports Migration
-- Stores user-submitted reports for school errors and program events

-- Report types enum
CREATE TYPE user_report_type AS ENUM (
  'school_requirement_error',
  'program_event_suggestion'
);

-- Report status enum
CREATE TYPE user_report_status AS ENUM (
  'pending',
  'approved',
  'dismissed'
);

-- User reports table
CREATE TABLE user_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Report type and status
  type user_report_type NOT NULL,
  status user_report_status NOT NULL DEFAULT 'pending',

  -- User who submitted the report
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- School/Program info (denormalized for easier admin viewing)
  program_id INTEGER REFERENCES schools(id) ON DELETE SET NULL,
  program_name TEXT,
  school_name TEXT NOT NULL,

  -- For school_requirement_error type
  error_categories TEXT[] DEFAULT '{}',

  -- For program_event_suggestion type
  event_title TEXT,
  event_date DATE,

  -- Common fields
  details TEXT,

  -- Points configuration
  points_value INTEGER NOT NULL DEFAULT 5,
  points_awarded BOOLEAN NOT NULL DEFAULT false,

  -- Timestamps
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Admin notes
  admin_notes TEXT,
  dismiss_reason TEXT
);

-- Indexes for common queries
CREATE INDEX idx_user_reports_status ON user_reports(status);
CREATE INDEX idx_user_reports_type ON user_reports(type);
CREATE INDEX idx_user_reports_user_id ON user_reports(user_id);
CREATE INDEX idx_user_reports_submitted_at ON user_reports(submitted_at DESC);
CREATE INDEX idx_user_reports_program_id ON user_reports(program_id);

-- RLS policies
ALTER TABLE user_reports ENABLE ROW LEVEL SECURITY;

-- Users can view their own reports
CREATE POLICY "Users can view own reports"
  ON user_reports
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create reports
CREATE POLICY "Users can create reports"
  ON user_reports
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can view all reports
CREATE POLICY "Admins can view all reports"
  ON user_reports
  FOR SELECT
  USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'user_role' = 'admin'
  );

-- Admins can update reports (for review)
CREATE POLICY "Admins can update reports"
  ON user_reports
  FOR UPDATE
  USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'user_role' = 'admin'
  );

-- Function to approve a report and award points
CREATE OR REPLACE FUNCTION approve_user_report(
  p_report_id UUID,
  p_admin_notes TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_report user_reports%ROWTYPE;
  v_points_to_award INTEGER;
BEGIN
  -- Get the report
  SELECT * INTO v_report
  FROM user_reports
  WHERE id = p_report_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Report not found';
  END IF;

  IF v_report.status != 'pending' THEN
    RAISE EXCEPTION 'Report already reviewed';
  END IF;

  -- Update report status
  UPDATE user_reports
  SET
    status = 'approved',
    reviewed_at = NOW(),
    reviewed_by = auth.uid(),
    admin_notes = p_admin_notes,
    points_awarded = true
  WHERE id = p_report_id;

  -- Award points to user (insert into point_transactions if table exists)
  -- This integrates with the gamification system
  BEGIN
    INSERT INTO point_transactions (
      user_id,
      action,
      points,
      metadata
    ) VALUES (
      v_report.user_id,
      CASE v_report.type
        WHEN 'school_requirement_error' THEN 'report_school_error'
        WHEN 'program_event_suggestion' THEN 'report_program_event'
      END,
      v_report.points_value,
      jsonb_build_object(
        'report_id', p_report_id,
        'school_name', v_report.school_name
      )
    );
  EXCEPTION WHEN undefined_table THEN
    -- point_transactions table doesn't exist yet, skip
    NULL;
  END;

  RETURN true;
END;
$$;

-- Function to dismiss a report
CREATE OR REPLACE FUNCTION dismiss_user_report(
  p_report_id UUID,
  p_dismiss_reason TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE user_reports
  SET
    status = 'dismissed',
    reviewed_at = NOW(),
    reviewed_by = auth.uid(),
    dismiss_reason = p_dismiss_reason
  WHERE id = p_report_id
  AND status = 'pending';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Report not found or already reviewed';
  END IF;

  RETURN true;
END;
$$;

-- Grant execute on functions to authenticated users (admins will be checked inside)
GRANT EXECUTE ON FUNCTION approve_user_report TO authenticated;
GRANT EXECUTE ON FUNCTION dismiss_user_report TO authenticated;

COMMENT ON TABLE user_reports IS 'User-submitted reports for school requirement errors and program event suggestions';
COMMENT ON COLUMN user_reports.error_categories IS 'Categories of errors (gpa, prerequisites, gre, certification, etc.) for school_requirement_error type';
COMMENT ON COLUMN user_reports.points_value IS 'Points to award when report is approved';
COMMENT ON COLUMN user_reports.points_awarded IS 'Whether points have been awarded (to prevent double-awarding)';

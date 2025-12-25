-- ============================================================
-- PREREQUISITE LIBRARY SCHEMA
-- Migration: 20251217000000_prerequisite_library.sql
--
-- Tables: prerequisite_courses, prerequisite_reviews
-- Adds: course_submit point action, link column to user_completed_prerequisites
-- ============================================================

-- ============================================================
-- PREREQUISITE_COURSES TABLE
-- Community-submitted prerequisite courses for the library
-- ============================================================
CREATE TABLE IF NOT EXISTS prerequisite_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Course Info
  school_name TEXT NOT NULL,           -- Portage, UCSD Extension, Phoenix, etc.
  course_name TEXT NOT NULL,
  course_code TEXT,
  course_url TEXT,
  subject TEXT NOT NULL,               -- matches course_type enum from user_completed_prerequisites
  level TEXT NOT NULL,                 -- undergraduate, graduate
  credits INTEGER,
  format TEXT,                         -- online_async, online_sync, in_person, hybrid
  cost_range TEXT,
  cost_range_key TEXT,
  course_length_weeks INTEGER,

  -- Lab Info
  has_lab BOOLEAN DEFAULT FALSE,
  lab_kit_required BOOLEAN DEFAULT FALSE,

  -- Scheduling
  self_paced BOOLEAN DEFAULT FALSE,
  rolling_admission BOOLEAN DEFAULT FALSE,

  -- Review Aggregates (cached for performance)
  review_count INTEGER DEFAULT 0,
  avg_recommend_score NUMERIC(2,1),
  avg_ease_score NUMERIC(2,1),

  -- Moderation
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_at TIMESTAMPTZ,
  rejection_reason TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE prerequisite_courses IS 'Community-submitted prerequisite courses for the library';
COMMENT ON COLUMN prerequisite_courses.subject IS 'Course type: anatomy, physiology, general_chemistry, etc.';
COMMENT ON COLUMN prerequisite_courses.status IS 'Moderation status: pending, approved, rejected';

-- ============================================================
-- PREREQUISITE_REVIEWS TABLE
-- User reviews of prerequisite courses
-- ============================================================
CREATE TABLE IF NOT EXISTS prerequisite_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES prerequisite_courses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Ratings
  recommend_score INTEGER NOT NULL CHECK (recommend_score BETWEEN 1 AND 5),
  ease_score INTEGER NOT NULL CHECK (ease_score BETWEEN 1 AND 5),

  -- Tags and Text
  tags TEXT[],                         -- Array of tag keys like 'async', 'proctored', etc.
  review_text TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- One review per user per course
  UNIQUE(course_id, user_id)
);

COMMENT ON TABLE prerequisite_reviews IS 'User reviews of prerequisite courses';
COMMENT ON COLUMN prerequisite_reviews.tags IS 'Array of tag keys: async, proctored, heavy_reading, etc.';

-- ============================================================
-- ADD LINK COLUMN TO USER_COMPLETED_PREREQUISITES
-- Links user's completed prereqs to library courses
-- ============================================================
ALTER TABLE user_completed_prerequisites
ADD COLUMN IF NOT EXISTS prerequisite_library_course_id UUID REFERENCES prerequisite_courses(id) ON DELETE SET NULL;

COMMENT ON COLUMN user_completed_prerequisites.prerequisite_library_course_id IS 'Link to library course for review tracking';

-- ============================================================
-- INDEXES
-- ============================================================

-- prerequisite_courses
CREATE INDEX IF NOT EXISTS idx_prereq_courses_subject ON prerequisite_courses(subject);
CREATE INDEX IF NOT EXISTS idx_prereq_courses_status ON prerequisite_courses(status);
CREATE INDEX IF NOT EXISTS idx_prereq_courses_approved ON prerequisite_courses(status) WHERE status = 'approved';
CREATE INDEX IF NOT EXISTS idx_prereq_courses_school ON prerequisite_courses(school_name);
CREATE INDEX IF NOT EXISTS idx_prereq_courses_submitted_by ON prerequisite_courses(submitted_by);

-- prerequisite_reviews
CREATE INDEX IF NOT EXISTS idx_prereq_reviews_course ON prerequisite_reviews(course_id);
CREATE INDEX IF NOT EXISTS idx_prereq_reviews_user ON prerequisite_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_prereq_reviews_created ON prerequisite_reviews(created_at DESC);

-- user_completed_prerequisites link
CREATE INDEX IF NOT EXISTS idx_completed_prereqs_library_link ON user_completed_prerequisites(prerequisite_library_course_id)
  WHERE prerequisite_library_course_id IS NOT NULL;

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE prerequisite_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE prerequisite_reviews ENABLE ROW LEVEL SECURITY;

-- PREREQUISITE_COURSES: Anyone can view approved, users can submit
CREATE POLICY "Anyone can view approved courses" ON prerequisite_courses
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Users can view their own submissions" ON prerequisite_courses
  FOR SELECT USING (auth.uid() = submitted_by);

CREATE POLICY "Users can submit courses" ON prerequisite_courses
  FOR INSERT WITH CHECK (auth.uid() = submitted_by);

CREATE POLICY "Admins can manage all courses" ON prerequisite_courses
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'user_role' = 'admin'
  );

-- PREREQUISITE_REVIEWS: Anyone can view, users can manage their own
CREATE POLICY "Anyone can view reviews" ON prerequisite_reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can create reviews" ON prerequisite_reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews" ON prerequisite_reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews" ON prerequisite_reviews
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all reviews" ON prerequisite_reviews
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.jwt() ->> 'user_role' = 'admin'
  );

-- ============================================================
-- TRIGGERS
-- ============================================================

CREATE TRIGGER update_prerequisite_courses_updated_at
  BEFORE UPDATE ON prerequisite_courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prerequisite_reviews_updated_at
  BEFORE UPDATE ON prerequisite_reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- FUNCTION: Update course review aggregates
-- Called after review insert/update/delete
-- ============================================================
CREATE OR REPLACE FUNCTION update_course_review_stats()
RETURNS TRIGGER AS $$
DECLARE
  v_course_id UUID;
BEGIN
  -- Get the course_id to update
  IF TG_OP = 'DELETE' THEN
    v_course_id := OLD.course_id;
  ELSE
    v_course_id := NEW.course_id;
  END IF;

  -- Update the course aggregate stats
  UPDATE prerequisite_courses
  SET
    review_count = (
      SELECT COUNT(*) FROM prerequisite_reviews WHERE course_id = v_course_id
    ),
    avg_recommend_score = (
      SELECT ROUND(AVG(recommend_score)::numeric, 1) FROM prerequisite_reviews WHERE course_id = v_course_id
    ),
    avg_ease_score = (
      SELECT ROUND(AVG(ease_score)::numeric, 1) FROM prerequisite_reviews WHERE course_id = v_course_id
    ),
    updated_at = NOW()
  WHERE id = v_course_id;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER update_course_stats_on_review
  AFTER INSERT OR UPDATE OR DELETE ON prerequisite_reviews
  FOR EACH ROW EXECUTE FUNCTION update_course_review_stats();

-- ============================================================
-- ADD COURSE_SUBMIT POINT ACTION
-- 10 points for submitting a new course (no daily limit)
-- ============================================================
INSERT INTO point_actions (slug, label, description, base_points, daily_max) VALUES
  ('course_submit', 'Submit New Course', 'Awarded for submitting a new prerequisite course to the library', 10, NULL)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- VIEW: Course-Program Connections
-- Shows which courses were taken by applicants targeting which programs
-- ============================================================
CREATE OR REPLACE VIEW course_program_connections AS
SELECT
  pc.id as course_id,
  pc.school_name as course_institution,
  pc.course_name,
  pc.subject,
  s.id as program_id,
  s.name as program_name,
  COUNT(DISTINCT ucp.user_id) as applicant_count
FROM prerequisite_courses pc
JOIN user_completed_prerequisites ucp ON ucp.prerequisite_library_course_id = pc.id
JOIN user_saved_schools uss ON uss.user_id = ucp.user_id AND uss.is_target = true
JOIN schools s ON s.id = uss.school_id
WHERE pc.status = 'approved'
GROUP BY pc.id, pc.school_name, pc.course_name, pc.subject, s.id, s.name
HAVING COUNT(DISTINCT ucp.user_id) >= 2;

COMMENT ON VIEW course_program_connections IS 'Shows course popularity by target program (min 2 applicants)';

-- ============================================================
-- NOTES FOR DEV TEAM
-- ============================================================
--
-- 1. SUBMIT A COURSE:
--    INSERT INTO prerequisite_courses (
--      school_name, course_name, subject, level, credits, format,
--      cost_range_key, has_lab, self_paced, submitted_by, status
--    ) VALUES (..., auth.uid(), 'pending');
--
-- 2. SUBMIT A REVIEW (with course submission):
--    -- First insert the course, then insert review referencing course_id
--    INSERT INTO prerequisite_reviews (
--      course_id, user_id, recommend_score, ease_score, tags, review_text
--    ) VALUES (...);
--
-- 3. POINTS:
--    - course_submit: 10 points (new)
--    - review_submit: 10 points (existing)
--    - Total for submit+review: 20 points
--
-- 4. LINK USER'S COMPLETED PREREQ TO LIBRARY:
--    UPDATE user_completed_prerequisites
--    SET prerequisite_library_course_id = 'course-uuid'
--    WHERE id = 'user-prereq-uuid';
--
-- 5. GET UNRATED COURSES FOR USER:
--    SELECT ucp.* FROM user_completed_prerequisites ucp
--    WHERE ucp.user_id = auth.uid()
--      AND ucp.status = 'completed'
--      AND ucp.prerequisite_library_course_id IS NULL;
--
-- 6. USE THE VIEW:
--    SELECT * FROM course_program_connections
--    WHERE program_name ILIKE '%Georgetown%';
--    -- Shows: "Applicants to Georgetown also took these courses"
--
-- ============================================================

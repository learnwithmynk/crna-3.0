-- Migration: Add rename_category function
-- Description: Atomically renames a category slug and updates all references across LMS tables
-- Tables affected: categories, modules, lessons, downloads

CREATE OR REPLACE FUNCTION rename_category(
  p_old_slug TEXT,
  p_new_slug TEXT
) RETURNS JSON AS $$
DECLARE
  v_category_id UUID;
  v_modules_updated INTEGER := 0;
  v_lessons_updated INTEGER := 0;
  v_lessons_resource_updated INTEGER := 0;
  v_downloads_updated INTEGER := 0;
BEGIN
  -- Validate inputs
  IF p_old_slug IS NULL OR p_new_slug IS NULL THEN
    RAISE EXCEPTION 'Both old_slug and new_slug are required';
  END IF;

  IF p_old_slug = p_new_slug THEN
    RAISE EXCEPTION 'New slug must be different from old slug';
  END IF;

  -- Check if old category exists
  SELECT id INTO v_category_id FROM categories WHERE slug = p_old_slug;
  IF v_category_id IS NULL THEN
    RAISE EXCEPTION 'Category with slug "%" not found', p_old_slug;
  END IF;

  -- Check if new slug already exists
  IF EXISTS (SELECT 1 FROM categories WHERE slug = p_new_slug) THEN
    RAISE EXCEPTION 'Category with slug "%" already exists', p_new_slug;
  END IF;

  -- Update categories table
  UPDATE categories SET slug = p_new_slug, updated_at = NOW() WHERE id = v_category_id;

  -- Update modules.category_slugs (array)
  UPDATE modules
  SET category_slugs = array_replace(category_slugs, p_old_slug, p_new_slug),
      updated_at = NOW()
  WHERE p_old_slug = ANY(category_slugs);
  GET DIAGNOSTICS v_modules_updated = ROW_COUNT;

  -- Update lessons.category_slugs (array)
  UPDATE lessons
  SET category_slugs = array_replace(category_slugs, p_old_slug, p_new_slug),
      updated_at = NOW()
  WHERE p_old_slug = ANY(category_slugs);
  GET DIAGNOSTICS v_lessons_updated = ROW_COUNT;

  -- Update lessons.resource_category_slug (single text field)
  UPDATE lessons
  SET resource_category_slug = p_new_slug,
      updated_at = NOW()
  WHERE resource_category_slug = p_old_slug;
  GET DIAGNOSTICS v_lessons_resource_updated = ROW_COUNT;

  -- Update downloads.category_slugs (array)
  UPDATE downloads
  SET category_slugs = array_replace(category_slugs, p_old_slug, p_new_slug),
      updated_at = NOW()
  WHERE p_old_slug = ANY(category_slugs);
  GET DIAGNOSTICS v_downloads_updated = ROW_COUNT;

  -- Return summary
  RETURN json_build_object(
    'success', true,
    'old_slug', p_old_slug,
    'new_slug', p_new_slug,
    'updated', json_build_object(
      'modules', v_modules_updated,
      'lessons_categories', v_lessons_updated,
      'lessons_resource_category', v_lessons_resource_updated,
      'downloads', v_downloads_updated
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users (admin check done in app)
GRANT EXECUTE ON FUNCTION rename_category TO authenticated;

-- Comment for documentation
COMMENT ON FUNCTION rename_category IS
  'Atomically renames a category slug and updates all references in modules, lessons, and downloads tables. Returns JSON with update counts.';

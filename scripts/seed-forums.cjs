const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedForums() {
  // Insert top-level forums
  const { data: forums, error: insertError } = await supabase
    .from('forums')
    .insert([
      { title: 'General Discussion', description: 'Welcome! Introduce yourself and chat about anything CRNA-related.', slug: 'general-discussion', sort_order: 1 },
      { title: 'Application Questions', description: 'Ask questions about the application process, requirements, and timelines.', slug: 'application-questions', sort_order: 2 },
      { title: 'Interview Prep', description: 'Share interview experiences, practice questions, and tips.', slug: 'interview-prep', sort_order: 3 },
      { title: 'School Reviews', description: 'Discuss specific CRNA programs and share experiences.', slug: 'school-reviews', sort_order: 4 },
    ])
    .select();

  if (insertError) {
    console.error('Insert error:', insertError.message);
    process.exit(1);
  }

  console.log('Forums created:', forums.length);

  // Get school-reviews forum ID for subforum
  const schoolReviews = forums.find(f => f.slug === 'school-reviews');
  if (schoolReviews) {
    const { data: subforum, error: subError } = await supabase
      .from('forums')
      .insert({
        title: 'Program Comparisons',
        description: 'Compare different CRNA programs side by side.',
        slug: 'program-comparisons',
        parent_id: schoolReviews.id,
        sort_order: 1
      })
      .select()
      .single();

    if (subError) {
      console.error('Subforum error:', subError.message);
    } else {
      console.log('Subforum created:', subforum.title);
    }
  }

  // Verify all forums
  const { data: allForums } = await supabase
    .from('forums')
    .select('id, title, slug, parent_id')
    .order('sort_order');

  console.log('\nAll forums:');
  console.table(allForums);
}

seedForums();

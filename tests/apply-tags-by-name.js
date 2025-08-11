import { createSupabaseClient } from '../db/client.js';

const supabase = createSupabaseClient();

/**
 * Fetches valid category IDs for given tag names.
 * @param {string[]} tagNames
 * @returns {Promise<Map<string, number>>} Map of tagName → categoryId
 */
async function getValidCategoryIds(tagNames) {
  const { data, error } = await supabase
    .from('notes_categories')
    .select('id, category_name')
    .in('category_name', tagNames);

  if (error) {
    console.error('Error fetching category IDs:', error);
    return new Map();
  }

  return new Map(data.map(({ category_name, id }) => [category_name, id]));
}

/**
 * Applies tags to a note using tag names.
 * Invalid tags are skipped.
 * @param {string} noteId
 * @param {string[]} tagNames
 */
async function applyTagsByName(noteId, tagNames) {
  const nameToId = await getValidCategoryIds(tagNames);

  const validRows = tagNames
    .map(name => {
      const id = nameToId.get(name);
      return id ? { note_id: noteId, note_category_id: id } : null;
    })
    .filter(Boolean);

  if (validRows.length === 0) {
    console.warn('⚠️ No valid tags found. Nothing applied.');
    return;
  }

  const { error } = await supabase
    .from('notes_categorised')
    .upsert(validRows, {
      onConflict: ['note_id', 'note_category_id'],
      ignoreDuplicates: true
    });

  if (error) {
    console.error('❌ Failed to apply tags:', error);
  } else {
    console.log(`✅ Applied tags to note ${noteId}:`, validRows.map(r => r.note_category_id));
  }
}

// Example usage
const testNoteId = 'f48bc2ad-6648-4f8a-9025-70fe877b16a1';
const inputTags = ['refactor', 'design', 'nonexistent', 'accessibility'];

applyTagsByName(testNoteId, inputTags);

import { createSupabaseClient } from './client.js';

const supabase = createSupabaseClient();

/**
 * Fetches category IDs for a given array of category names.
 * Assumes category_name is globally unique.
 * @param {string[]} categoryNames
 * @returns {Promise<number[]>} Array of note_category_id values
 */
export async function getCategoryIds(categoryNames) {
  const { data, error } = await supabase
    .from('notes_categories')
    .select('id, category_name')
    .in('category_name', categoryNames);

  if (error) {
    console.error('Error fetching category IDs:', error);
    return [];
  }

  const nameToId = new Map(data.map(cat => [cat.category_name, cat.id]));
  return categoryNames.map(name => nameToId.get(name)).filter(Boolean);
}

/**
 * Links a note to one or more category IDs in notes_categorised.
 * @param {string} noteId - UUID of the note
 * @param {number[]} categoryIds - Array of note_category_id values
 * @returns {Promise<void>}
 */
export async function linkNoteToCategories(noteId, categoryIds) {
  if (!noteId || categoryIds.length === 0) return;

  const rows = categoryIds.map(catId => ({
    note_id: noteId,
    note_category_id: catId
  }));

  const { error } = await supabase
    .from('notes_categorised')
    .upsert(rows, {
      onConflict: ['note_id', 'note_category_id'],
      ignoreDuplicates: true
    });

  if (error) {
    console.error('Error linking note to categories:', error);
  }
}

/**
 * Convenience function: tag a note using category names.
 * @param {string} noteId
 * @param {string[]} categoryNames
 */
export async function tagNoteByNames(noteId, categoryNames) {
  const categoryIds = await getCategoryIds(categoryNames);
  await linkNoteToCategories(noteId, categoryIds);
}

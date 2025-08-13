console.log('tags.js');
import { createSupabaseClient } from './client.js';

const supabase = createSupabaseClient();

/**
 * Fetches all categories from the database and returns a Map of name → id.
 * @returns {Promise<Map<string, number>>}
 */
export async function readCategoryMap() {
  console.log('readCategoryMap()');
  const { data, error } = await supabase
    .from('notes_categories')
    .select('id, category_name');

  if (error) {
    console.error('❌ Error fetching categories:', error);
    return new Map();
  }

  return new Map(data.map(cat => [cat.category_name, cat.id]));
}

/**
 * Links a note to one or more category IDs in notes_categorised.
 * @param {string} noteId
 * @param {number[]} categoryIds
 */
export async function linkNoteToCategories(noteId, categoryIds) {
  console.log('linkNoteToCategories()');
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
    console.error('❌ Error linking note to categories:', error);
  }
}

export async function readReverseCategoryMap() {
  console.log('readReverseCategoryMap');
  const { data, error } = await supabase
    .from('notes_categories')
    .select('id, category_name');

  if (error) {
    console.error('❌ Error fetching categories:', error);
    return new Map();
  }

  return new Map(data.map(cat => [cat.id, cat.category_name]));
}






//new version 21:02 13 Aug
export async function tagNoteByNames(noteId, tagNames = []) {
  if (!Array.isArray(tagNames)) {
    throw new TypeError('tagNames must be an array');
  }

  const categoryMap = await readCategoryMap(); // Map<string, id>
  const categoryIds = tagNames
    .map(name => categoryMap.get(name))
    .filter(Boolean);

  if (categoryIds.length === 0) {
    console.warn('No valid categories found for tags:', tagNames);
    return;
  }

  await linkNoteToCategories(noteId, categoryIds);
}


/**
 * Tags a note using category names by looking up their IDs.
 * @param {string} noteId
 * @param {string[]} categoryNames
 */

/*
export async function tagNoteByNames(noteId, categoryNames) {
  console.log('tagsNotesByName()');
  const categoryMap = await readCategoryMap();
  const categoryIds = categoryNames
    .map(name => categoryMap.get(name))
    .filter(Boolean);

  await linkNoteToCategories(noteId, categoryIds);
}
*/

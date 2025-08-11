import { supabase } from './client.js';

/**
 * Validates and deduplicates an array of tag strings.
 * @param {string[]} tags
 * @returns {string[]} Cleaned tags
 */
export function sanitizeTags(tags) {
  return [...new Set(tags.map(tag => tag.trim()).filter(Boolean))];
}

/**
 * Inserts tags into the database if they don't already exist.
 * @param {string[]} tags
 * @returns {Promise<object[]>} Array of inserted or existing tag rows
 */
export async function upsertTags(tags) {
  const cleaned = sanitizeTags(tags);

  if (cleaned.length === 0) return [];

  const { data, error } = await supabase
    .from('tags')
    .upsert(
      cleaned.map(name => ({ name })),
      { onConflict: ['name'], ignoreDuplicates: true }
    )
    .select();

  if (error) throw error;

  return data;
}

/**
 * Links tags to a note via a join table.
 * @param {number} noteId
 * @param {number[]} tagIds
 * @returns {Promise<void>}
 */
export async function linkTagsToNote(noteId, tagIds) {
  const rows = tagIds.map(tag_id => ({ note_id: noteId, tag_id }));

  const { error } = await supabase
    .from('note_tags')
    .upsert(rows, { onConflict: ['note_id', 'tag_id'], ignoreDuplicates: true });

  if (error) throw error;
}

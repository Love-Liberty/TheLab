// db/notes.js

/**
 * Inserts a new note and returns its ID.
 */
export async function insertNote(supabase, author_id, audience_id = null, reply_to_id = null, title = 'AutoTitle', content, status = null) {
  try {
    const { data, error } = await supabase
      .from('notes')
      .insert([{
        author_id,
        audience_id,
        reply_to_id,
        title,
        content,
        status
      }])
      .select();

    if (error) {
      console.error('Insert error:', error);
      return null;
    }

    return data[0]?.id ?? null;
  } catch (err) {
    console.error('Unexpected insert error:', err.message);
    return null;
  }
}

/**
 * Fetches a page of notes.
 */
export async function fetchNotes(supabase, page = 1, pageSize = 10) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  const { data, count, error } = await supabase
    .from('notes')
    .select('*', { count: 'exact' })
    .order('sort_int', { ascending: false })
    .range(start, end);

  if (error) {
    console.error('Error fetching notes:', error);
    return { data: [], count: 0 };
  }

  return { data, count };
}

/**
 * Updates the status of a note.
 */
export async function saveNoteStatus(supabase, noteId, newStatus) {
  const { data, error } = await supabase
    .from('notes')
    .update({ status: newStatus })
    .eq('id', noteId);

  if (error) {
    console.error(`Failed to update status for note ${noteId}:`, error);
  }

  return { data, error };
}


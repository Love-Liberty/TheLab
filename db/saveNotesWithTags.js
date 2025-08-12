async function saveNoteWithTags(supabase, {
  author_id,
  audience_id = null,
  reply_to_id = null,
  title = 'AutoTitle',
  content,
  status = null,
  tags = []
}) {
  console.log('saveNoteWithTags()');

  // Insert the note
  const rowId = await insertNote(supabase, author_id, audience_id, reply_to_id, title, content, status);

  // Insert tags if any
  if (tags.length > 0) {
    await insertTags(supabase, rowId, tags);
  }

  return rowId;
}

console.log("saveNoteWithTags.js");//lacked imports and supabase

import { createSupabaseClient } from './client.js';
import {insertNote} from './notes.js';
import {tagNoteByNames} from './tags.js';

export async function saveNoteWithTags(supabase, {
  author_id='47742c9f-9afd-40b3-816a-f83fcd72b905',//mock for test
  audience_id = null,
  reply_to_id = null,
  title = 'saveNoteWithTags()',
  content,
  status = null,
  tags = []
}) {
  console.log('saveNoteWithTags() called with parameters:', {
  title: title,
  content: content,
  tags: tags
});
//  console.log('saveNoteWithTags() called title: ${title},content: ${content}, tags: ${tags}');

  try {
    // Insert the note
    const rowId = await insertNote(supabase, author_id, audience_id, reply_to_id, title, content, status);
    console.log(`Note inserted with ID: ${rowId}`);

    // Insert tags if any
    if (tags.length > 0) {
      await tagNoteByNames(supabase, rowId, tags);
      console.log(`Tags inserted for note ID ${rowId}:`, tags);
    } else {
      console.log(`No tags to insert for note ID ${rowId}`);
    }

    return rowId;
  } catch (error) {
    console.error('Error in saveNoteWithTags():', error);
    return null; // Caller can check for null to detect failure
  }
}

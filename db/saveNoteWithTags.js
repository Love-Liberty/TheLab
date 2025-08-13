// reverting to the old function at 22:26 13 Aug  changed name from insert to save
import { createSupabaseClient } from './client.js';
import {insertNote} from './notes.js';
import {tagNoteByNames} from './tags.js';





  function createTagArray() {
    console.log('createTagArray()');    
    const tagsArray = [];
                             // These are the groups of tags we want to process.
    const inputGroups = ['main', 'events', 'process', 'business', 'resource'];
    
                            // Loop through each group name.
    for (const group of inputGroups) {
                           // Find all checkboxes with a 'name' that matches the current group.
                           // The querySelectorAll method returns a list of all matching elements.
        const checkboxes = document.querySelectorAll(`input[name="${group}"][type="checkbox"]`);
                           // Now, loop through each checkbox we found in this group.
        for (const checkbox of checkboxes) {
                          // The 'checked' property of a checkbox is true if it's selected, false otherwise.
            if (checkbox.checked) {
                         // If the checkbox is checked, add its 'value' to our tagsArray.
                tagsArray.push(checkbox.value);
            }
        }
    }    

                         // --- Handle the radio button group ---
                         // For radio buttons, we only need to find the one that is checked.
                         // The querySelector method finds the first matching element.
    const importanceRadio = document.querySelector('input[name="importance"][type="radio"]:checked');
    
    // Check if a radio button was actually selected.
    if (importanceRadio) {
        // If it was, add its value to the tagsArray.
        tagsArray.push(importanceRadio.value);
    }

  
    // Log the final array so we can see what was collected.
    console.log('Tags collected:', tagsArray);
    return tagsArray;
}
 
//end createTagArray



export async function saveNoteWithTags(supabase, author_id, audience_id = null, reply_to_id = null, title = 'AutoTitle', content, status = null){
 console.log('old insert[save]NoteAnsTags()');
  const tagsArray=createTagArray();
                  // Placeholder for a real author_id
                const authorId = '0023236b-58d7-4c41-ba0f-45a7efc31847';    
  const rowId = await insertNote(supabase, author_id, audience_id, reply_to_id, title, content, status);
  await insertTags(supabase, rowId, tagsArray);
 return true;} //placeholder



// This function inserts the category_name_id of each tag from the tagsArray
// into the supabase 'notes_categorised' table
async function insertTags(supabase, noteId, tagsArray) {
    console.log('Validating and inserting tags for noteId:', noteId, 'Tags:', tagsArray);

    if (!tagsArray || tagsArray.length === 0) {
        console.log('No tags to insert.');
        return;
    }

    try {
        // Step 1: Fetch both the ID and the category name from 'notes_categories'
        const { data: categories, error: categoriesError } = await supabase
            .from('notes_categories')
            .select('id, category_name');

        if (categoriesError) {
            console.error('Error fetching valid categories:', categoriesError);
            return;
        }

        // Step 2: Create a Map for quick name-to-ID lookup
        const categoryNameToIdMap = new Map(
            categories.map(cat => [cat.category_name, cat.id])
        );

        const validTags = tagsArray.filter(tag => categoryNameToIdMap.has(tag));
        const invalidTags = tagsArray.filter(tag => !categoryNameToIdMap.has(tag));

        if (invalidTags.length > 0) {
            console.warn(`The following tags were invalid and will not be saved: ${invalidTags.join(', ')}`);
        }

        if (validTags.length === 0) {
            console.log('No valid tags to insert after validation.');
            return;
        }
        
        // Step 3: Map the valid tag names to their corresponding IDs
        // and create the array of objects to insert.
        const tagsToInsert = validTags.map(tag => ({
            note_id: noteId,
            note_category_id: categoryNameToIdMap.get(tag) // Use the ID here!
        }));
        
        const { data, error } = await supabase
            .from('notes_categorised') // Your corrected table name
            .insert(tagsToInsert)
            .select();
        
        if (error) {
            console.error('Error inserting valid tags:', error);
        } else {
            console.log('Successfully inserted tags:', data);
        }
    } catch (err) {
        console.error('An unexpected error occurred during tag insertion:', err);
    }
}








/*
console.log("saveNoteWithTags.js");//lacked imports and supabase

import { createSupabaseClient } from './client.js';
import {insertNote} from './notes.js';
import {tagNoteByNames} from './tags.js';

/*new 21:07 13 Aug 2025
export async function saveNoteWithTags(supabase, params = {}) {
  const {   //   47742c9f-9afd-40b3-816a-f83fcd72b905
    author_id = '47742c9f-9afd-40b3-816a-f83fcd72b905',
    audience_id = null,
    reply_to_id = null,
    title = '',
    content = '',
    status = null,
    tags = []
  } = params;

  console.log('Saving note with tags:', { title, tags });

  try {
    const noteId = await insertNote(supabase, {
      author_id,
      audience_id,
      reply_to_id,
      title,
      content,
      status
    });

    console.log(`Note inserted with ID: ${noteId}`);

    if (tags.length > 0) {
      await tagNoteByNames(noteId, tags);
    }

    return noteId;
  } catch (error) {
    console.error('Failed to save note:', error);
    throw error;
  }
}
*/
/*
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
  author: author_id,
  content: content,
  tags: tags
});
//  console.log('saveNoteWithTags() called author: ${author_id},content: ${content}, tags: ${tags}');

  try {
    // Insert the note
//    console.log('author_id');
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
*/

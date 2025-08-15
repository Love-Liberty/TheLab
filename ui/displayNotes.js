// Updated displayNotes.js
console.log('displayNotes.js');
import { createSupabaseClient } from '../db/client.js';
import { fetchNotes } from "../db/notes.js";  
import { renderNotes } from "../db/notes.js";  

export async function displayNotes(page = 1, totalCount = null) {
  console.log('displayNotes()', { page, totalCount });
  const pageSize = 10;
  
  try {
    const supabase = createSupabaseClient();
    
    // If totalCount is provided, use it; otherwise fetch everything
    const result = await fetchNotes(supabase, page, pageSize);
    const notes = result.notes;
    const actualTotalCount = totalCount || result.totalCount;
    
    console.log('displayNotes fetch result:', { notes: notes.length, totalCount: actualTotalCount, page });
    
    // Render the notes
    renderNotes(notes, actualTotalCount, page, pageSize);
    console.log('displayNotes() completed');
    
  } catch (error) {
    console.error('Error displaying notes:', error);
    const output = document.getElementById('output');
    if (output) {
      output.innerHTML = `
        <div class="text-red-700 p-4">
          <p>Failed to load notes. Please try again.</p>
        </div>
      `;
    }
  }
}

/* older functioning but no parameters

import { createSupabaseClient } from '../db/client.js';
import { fetchNotes } from "../db/notes.js";  
import { renderNotes } from "../db/notes.js";  

export async function displayNotes() {
  console.log('displayNotes()');
  const pageSize = 10;
  try {
    const supabase = createSupabaseClient();
    const { notes, totalCount } = await fetchNotes(supabase, 1, pageSize);
    console.log ('notes:',notes,'totalCount:', totalCount)
    // Render the notes fetch return { notes: data, totalCount: count };
    renderNotes(notes, totalCount, 1, pageSize);
    console.log('displayNotes() fetch ended');
    
  } catch (error) {
    console.error('Error displaying notes:', error);
    const output = document.getElementById('output');
    if (output) {
      output.innerHTML = `
        <div class="text-red-700 p-4">
          <p>Failed to load notes. Please try again.</p>
        </div>
      `;
    }
  }
} */

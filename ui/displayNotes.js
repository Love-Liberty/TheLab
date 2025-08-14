// displayNotes.js
console.log('displayNotes.js');
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
}

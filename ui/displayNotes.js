// displayNotes.js
console.log('displayNotes.js');
import { createSupabaseClient } from '../db/client.js';
import { fetchNotes } from "../db/notes.js";  
import { renderNotes } from "../db/notes.js";  

export async function displayNotes() {
  console.log('displayNotes()');
  
  try {
    const supabase = createSupabaseClient();
    const { data: notes, count: totalCount } = await fetchNotes(supabase, 1, 10);
    
    // Render the notes
    renderNotes(notes, totalCount, 1);
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

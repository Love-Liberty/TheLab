//displayNotes.js
console.log('displayNotes.js');
import { createSupabaseClient } from '../db/client.js';
import { fetchNotes } from "../db/Notes.js";  



export async function displayNotes(){
  console.log('displayNotes()');
  const supabase = createSupabaseClient();
  await fetchNotes(supabase,1,10);//which calls renderNotes()
console.log('displayNotes() fetch ended');
  
}

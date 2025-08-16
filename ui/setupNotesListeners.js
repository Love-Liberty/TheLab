//setupNotesListeners.js
  console.log("setUpNotesListeners.js");

import { reactToSaveButton } from './reactToSaveNoteButton.js';

// copy pasted setupNotesListeners() from db/notes.js 16:38 15 Aug - and may god have mercy on my soul
export function setupNotesListeners() {
  console.log("setUpNotesListeners()");
  const notesPanel = document.getElementById('notes-panel');
  if (!notesPanel) return;

  
  notesPanel.addEventListener('click', async (event) => {
    console.log("notesPanel.addEventListener()");
    if (event.target.id === 'save-notes') {

reactToSaveButton()

 /*     
      const noteContent = document.getElementById('note-content')?.value.trim();
      if (!noteContent) {
        console.log('✗ Note content is empty');
        return;
      } else console.log("content found");
      
      const userChoices = collectUserChoices();
      console.log('setupNotesListeners()', {noteContent:noteContent, tags:userChoices});
      //const result = await saveNoteWithTags(supabase, noteContent, userChoices);

      const result = await saveNoteWithTags(supabase, {
                     content: noteContent,
                     tags: userChoices,
                     author_id: '47742c9f-9afd-40b3-816a-f83fcd72b905'//mock data until implemented
});
      
      // Check the result properly
      if (result) {
        console.log(`✅ Note saved`);
      } else {
        console.log('❌ Note save failed');
      }  
      */
    }
  }); 
}










//setupNotesListeners.js
  console.log("setUpNotesListeners.js");

import { reactToSaveButton } from './reactToSaveButton.js';

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






/*
export function setupNotesListeners() {
  const notesPanel = document.getElementById('notes-panel');
  if (!notesPanel) return;
  
  notesPanel.addEventListener('click', async (event) => {
    console.log("notesPanel.addEventListener()");
    
    // Handle Save button click
    if (event.target.id === 'save-notes' || event.target.closest('#save-notes')) {
      const noteContent = document.getElementById('note-content')?.value.trim();
      if (!noteContent) {
        console.log('✗ Note content is empty');
        return;
      }
      
      const userChoices = collectUserChoices();
      console.log('setupNotesListeners()', {noteContent, tags: userChoices});
      return;
    }
    
    // Handle note clicks
    const noteElement = event.target.closest('[data-note-id]');
    if (noteElement) {
      const noteId = noteElement.dataset.noteId;
      const status = noteElement.dataset.status || '';
      
      // Your note click handling logic here
      console.log('Note clicked:', { noteId, status });
      
      // Update status logic
      const newStatus = cycleStatus(status);
      await updateNoteStatus(noteId, newStatus);
      
      // Refresh the display
      await displayNotes();
      return;
    }
    
    // Handle pagination clicks
    const pageButton = event.target.closest('[data-page-action]');
    if (pageButton) {
      const action = pageButton.dataset.pageAction;
      const currentPage = parseInt(pageButton.dataset.currentPage);
      const totalCount = parseInt(pageButton.dataset.totalCount);
      
      changePage(currentPage, totalCount, action);
      return;
    }
  });
}
*/

/*
import{ saveNoteWithTags }from '../db/saveNoteWithTags.js';
console.log('setupNoteslisteners.js');
export function setupNotesListeners() {
  console.log('setupNotesListeners() on [save] button');
  const saveButton = document.getElementById('save-notes');
  if (!saveButton) {
    console.warn('❌ Error in event listener: save button not found');
    return;
  }
  console.log('setupNotesListeners() -> saveNoteWithTags');
    saveButton.addEventListener('click', saveNoteWithTags);

  //saveButton.addEventListener('click', reactToSaveNoteButton());

}


// notesPanelListener.js
export function setupNotesPanelListener() {
  const notesPanel = document.getElementById('notes-panel');
  if (!notesPanel) return;
  
  notesPanel.addEventListener('click', async (event) => {
    // Handle note clicks
    const noteElement = event.target.closest('[data-note-id]');
    if (noteElement) {
      const noteId = noteElement.dataset.noteId;
      await handleNoteClick(noteId);
      return;
    }
    
    // Handle pagination clicks
    const pageButton = event.target.closest('[data-page-action]');
    if (pageButton) {
      const action = pageButton.dataset.pageAction;
      const currentPage = parseInt(pageButton.dataset.currentPage);
      const totalCount = parseInt(pageButton.dataset.totalCount);
      
      changePage(currentPage, totalCount, action);
      return;
    }
  });
}*/

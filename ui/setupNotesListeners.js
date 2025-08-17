// setupNotesListeners.js
console.log("setupNotesListeners.js");

import { reactToClearAllButton } from './reactToClearAllButton.js';
import { reactToSaveButton } from './reactToSaveNoteButton.js';
import { reactToPageButton } from './reactToPageButton.js';
import { reactToNoteClick } from './reactToNoteClick.js';


//newer data based rather than id based

export function setupNotesListeners() {
  console.log("setupNotesListeners()");
  const notesPanel = document.getElementById('notes-panel');
  if (!notesPanel) return;

  notesPanel.addEventListener('click', async (event) => {
    const target = event.target;


    // ✅ Clear All button
    const button = target.closest('[data-action="clear-all"]');
    if (button) {
      event.preventDefault();
      await reactToClearAllButton();
      return;
    }

    
    // ✅ Save button
    const button = target.closest('[data-action="save-note"]');
    if (button) {
      event.preventDefault();
      await reactToSaveButton();
      return;
    }

    
    // ✅ Changing page
  const button = target.closest('[data-page-action]');
  if (button) {
    event.preventDefault();
    const direction = paginationBtn.dataset.pageAction;
    await reactToPageButton(direction);
    return;
    }
    

    // ✅ Note card click
    const button = target.closest('[data-note-id]');
    if (button) {
      const noteId = noteElement.dataset.noteId;
      await reactToNoteClick(noteId);
      return;
    }




    
  });
}




/*
// copy pasted setupNotesListeners() from db/notes.js 16:38 15 Aug - and may god have mercy on my soul
export function setupNotesListeners() {
  console.log("setupNotesListeners()");
  const notesPanel = document.getElementById('notes-panel');
  if (!notesPanel) return;

  notesPanel.addEventListener('click', async (event) => {
    console.log("notesPanel.addEventListener()");
    
    // Handle Save button click
    if (event.target.id === 'save-notes') {
      reactToSaveButton();
      return;
    }
  
    
    // Handle note card clicks
    const noteElement = event.target.closest('[data-note-id]');
    if (noteElement) {
      const noteId = noteElement.dataset.noteId;
      await reactToNoteClick(noteId);
      return;
    }
  });
} */

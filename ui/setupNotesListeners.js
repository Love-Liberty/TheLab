// setupNotesListeners.js
console.log("setupNotesListeners.js");

import { reactToSaveButton } from './reactToSaveNoteButton.js';
import { reactToNoteClick } from './reactToNoteClick.js';

//newer data based rather than id based

export function setupNotesListeners() {
  console.log("setupNotesListeners()");
  const notesPanel = document.getElementById('notes-panel');
  if (!notesPanel) return;

  notesPanel.addEventListener('click', async (event) => {
    const target = event.target;

    // ✅ Save button
    const saveBtn = target.closest('[data-action="save-note"]');
    if (saveBtn) {
      event.preventDefault();
      await reactToSaveButton();
      return;
    }

    // ✅ Note card click
    const noteElement = target.closest('[data-note-id]');
    if (noteElement) {
      const noteId = noteElement.dataset.noteId;
      await reactToNoteClick(noteId);
      return;
    }

    // ✅ Pagination button
    const paginationBtn = target.closest('[data-page-action]');
    if (paginationBtn) {
      event.preventDefault();
      await reactToPageButton(paginationBtn); // ← clean: pass the button
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

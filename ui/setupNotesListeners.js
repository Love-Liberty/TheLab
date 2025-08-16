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
    reactToSaveButton(); return; }
       // Handle note card clicks
  const noteElement = event.target.closest('[data-note-id]');
  if (noteElement) {
    const noteId = noteElement.dataset.noteId;
    await reactToNoteClick(noteId); return;
  }

    }); 
}

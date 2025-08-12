import{ saveNotesWithTags }from './db/saveNotesWithTags.js';

export function setupNotesListeners() {
  const saveButton = document.getElementById('save-notes');
  if (!saveButton) {
    console.warn('❌ Error in event listener: save button not found');
    return;
  }

saveButton.addEventListener('click', saveNoteWithTags);

}

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

}

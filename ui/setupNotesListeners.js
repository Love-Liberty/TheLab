import{ saveNoteWithTags }from '../db/saveNoteWithTags.js';
console.log('setupNoteslisteners.js');
console.log('🔍 [setup] userChoices:', userChoices);
console.log('🔍 [setup] Array?', Array.isArray(userChoices));
export function setupNotesListeners() {
  console.log('setupNotesListeners()');
  const saveButton = document.getElementById('save-notes');
  if (!saveButton) {
    console.warn('❌ Error in event listener: save button not found');
    return;
  }

saveButton.addEventListener('click', saveNoteWithTags);

}

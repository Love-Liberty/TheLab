document.getElementById('save-notes').addEventListener('click', async () => {
  const noteText = document.getElementById('note-content').value.trim();
  const selectedInputs = document.querySelectorAll('input[type="checkbox"]:checked, input[type="radio"]:checked');

  if (!noteText && selectedInputs.length === 0) {
    alert('Please enter a note or select at least one tag.');
    return;
  }

  const selectedTags = Array.from(selectedInputs).map(input => ({
    group: input.name,
    value: input.value
  }));

  console.log('Note:', noteText);
  console.log('Selected Tags:', selectedTags);

  // Next step: insert note, get note ID, validate tags, write to notes_categorised
});

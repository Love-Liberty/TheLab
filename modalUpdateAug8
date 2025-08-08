function openEditor(cardId, pageType, cardData) {
  editingCard = cardId;
  currentPageType = pageType;

  editNameInput.value = cardData.name;
  editUrlInput.value = cardData.url || '';

  urlField.style.display = (pageType === 'data') ? 'block' : 'none';
  modal.classList.add('show');
}

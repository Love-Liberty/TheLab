document.querySelectorAll('[data-card-id]').forEach(card => {
  card.addEventListener('click', (e) => {
    const cardId = e.currentTarget.getAttribute('data-card-id');
    const pageType = cardId.split('-')[0];

    // Find the card data
    let cardData;
    if (pageType === 'links') {
      cardData = linksCardData.find(c => c.id === cardId);
    } else if (pageType === 'data') {
      cardData = dataCardData.find(c => c.id === cardId);
    } else if (pageType === 'scripts') {
      cardData = scriptsCardData.find(c => c.id === cardId);
    }

    if (!cardData) return;

    const url = cardData.url?.trim();

    // If single click and URL starts with http, open it
    if (url && url.startsWith('http')) {
      window.open(url, '_blank');
    } else {
      openEditor(cardId, pageType, cardData);
    }
  });

  // Double-click opens editor
  card.addEventListener('dblclick', (e) => {
    e.preventDefault();
    const cardId = e.currentTarget.getAttribute('data-card-id');
    const pageType = cardId.split('-')[0];
    let cardData;
    if (pageType === 'links') {
      cardData = linksCardData.find(c => c.id === cardId);
    } else if (pageType === 'data') {
      cardData = dataCardData.find(c => c.id === cardId);
    } else if (pageType === 'scripts') {
      cardData = scriptsCardData.find(c => c.id === cardId);
    }
    if (cardData) {
      openEditor(cardId, pageType, cardData);
    }
  });

  // Right-click opens editor
  card.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    const cardId = e.currentTarget.getAttribute('data-card-id');
    const pageType = cardId.split('-')[0];
    let cardData;
    if (pageType === 'links') {
      cardData = linksCardData.find(c => c.id === cardId);
    } else if (pageType === 'data') {
      cardData = dataCardData.find(c => c.id === cardId);
    } else if (pageType === 'scripts') {
      cardData = scriptsCardData.find(c => c.id === cardId);
    }
    if (cardData) {
      openEditor(cardId, pageType, cardData);
    }
  });
});

//changePage.js
//response to click on the [older] or [Newer] page buttons on the rendered list of published notes. Calls for the next page of notes to be rendered
console.log('changePage.js');


// Updated changePage.js
console.log('changePage.js');

import { displayNotes } from './displayNotes.js';

export function changePage(currentPage, totalCount, direction) {
  console.log('changePage called:', { currentPage, totalCount, direction });
  
  const pageSize = 10;
  const totalPages = Math.ceil(totalCount / pageSize);
  let newPage = currentPage;
  
  if (direction === 'older') {
    newPage = currentPage - 1;
    if (newPage < 1) newPage = 1;
  } else if (direction === 'newer') {
    newPage = currentPage + 1;
    if (newPage > totalPages) newPage = totalPages;
  }
  
  // Only call displayNotes if page changed
  if (newPage !== currentPage) {
    console.log('Loading page:', newPage);
    displayNotes(newPage, totalCount);
  }
}

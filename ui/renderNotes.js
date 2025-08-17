//renderNOtes.js  - placeholder
console.log('renderNote.js');

//import { fetchNotes } from '../db/notes.js';

function getIconHTML(status) {
  console.log("getIconHTML()");
  switch(status) {
    case 6:
      return '<span class="text-green-600 font-semibold">?</span>';
    case 7:
      return '<span class="text-red-600 font-semibold">?</span>';
    case 8:
      return '<span class="text-green-600">✅</span>';
    case 9:
      return '<span class="text-red-600">❌</span>';
    default:
      return '<span class="text-gray-400">○</span>'; // Default icon for no status
  }
}


export function renderNotes(notes, totalCount, page, pageSize) {
  console.log('renderNotes() - own file');
  const output = document.getElementById('output');
  
  const notesHtml = notes.map(note => {
    const content = note.content || '';
  
   const shortContent = content.length > 400
  ? `${content.slice(0, 400)}<span class="text-blue-600 cursor-pointer hover:text-blue-800 toggle-content"> [more]</span><span class="hidden extra-content">${content.slice(400)} <span class="text-blue-600 cursor-pointer hover:text-blue-800 toggle-content"> [less]</span></span>`
  : content;
 
    
    const iconHTML = getIconHTML(note.status);
    const statusAttr = note.status ?? '';
    
    // Use status-based styling like in the knowledge base
    const statusClasses = {
      'pending': 'bg-yellow-50 border-yellow-200',
      'completed': 'bg-green-50 border-green-200',
      'abandoned': 'bg-red-50 border-red-200'
    };
    
    const statusClass = statusClasses[statusAttr] || 'bg-white border-gray-200';
    const statusText = statusAttr || 'No status';

console.log('Rendering note:', {
  id: note.id,
  rawStatus: note.status,
  statusAttr: statusAttr,
  statusText: statusText
});

    
    return `
        <div class="mb-3" data-note-id="${note.id}" data-status="${statusAttr}">
    <div class="bg-white p-4 rounded-lg border ${statusClass} hover:shadow-sm transition-all cursor-pointer group"
         data-note-id="${note.id}">
      
      <!-- Status bar - top center -->
      <div data-notes-status="${statusAttr}" class="status-bar flex items-center justify-center mb-3 py-1 bg-gray-50 rounded text-xs font-medium text-gray-600" >
        <span>Status: ${statusText}</span>
        ${iconHTML ? `<span class="ml-2">${iconHTML}</span>` : ''}
        <span class="mx-2">•</span>
        <span>Click anywhere to cycle through status choices</span>
      </div>
          
          <!-- Note content -->
          <div class="space-y-2 text-sm text-gray-800">
            <p class="flex items-center">
              <span class="font-medium w-20">ID:</span>
              <span class="text-gray-600">${note.sort_int}</span>
            </p>
            <p class="flex items-center">
              <span class="font-medium w-20">Author:</span>
              <span class="text-gray-600">${note.author_id.slice(0, 8)}</span>
            </p>
            <p class="flex items-center">
              <span class="font-medium w-20">Created:</span>
              <span class="text-gray-600">${new Date(note.created_at).toLocaleString()}</span>
            </p>
            <p class="flex">
              <span class="font-medium w-20 pt-1">Content:</span>
             <span class="text-gray-700 flex-1">${shortContent}</span>
            </p>
          </div>
        </div>
      </div>
    `;
  }).join('');  

  const totalPages = Math.ceil(totalCount / pageSize);
  const controls = `
    <div class="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
      <button data-page-action="newer" data-current-page="${page}" data-total-count="${totalCount}"
              class="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              ${page === 1 ? 'disabled' : ''}>
         Newer ⬆️
      </button>
      <span class="text-sm text-gray-600">
        Page ${page} of ${totalPages} (${totalCount} total notes)
      </span>
      <button data-page-action="older" data-current-page="${page}" data-total-count="${totalCount}"
              class="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              ${page === totalPages ? 'disabled' : ''}>
        Older ⬇️
      </button>
    </div>
  `;

  output.innerHTML = `
    <div class="mt-6">
      <h3 class="text-lg font-semibold text-gray-700 mb-4 flex items-center">
        <span class="mr-2">📝</span>
        Recent Notes
      </h3>
      ${notesHtml}
      ${controls}
    </div>
  `;
}



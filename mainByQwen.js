// main.js

function log(message) {
  const output = document.getElementById('output');
  output.textContent += message;
  console.log(message);
}

// Read and display pages of notes. New functions 14:46 7 Aug 2025
let currentPage = 1;
const pageSize = 10;

// 2. read a page of notes & call the render function
async function fetchNotes(page = 1) {
  const supabase = window.supabaseClient; // ✅ Pull from global
  if (!supabase || typeof supabase.from !== 'function') {
    console.error('Supabase client not initialized');
    return;
  }
  
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;
  
  const { data, count, error } = await supabase
    .from('notes')
    .select('*', { count: 'exact' })
    .order('sort_int', { ascending: false })
    .range(start, end);
    
  if (error) {
    console.error('Error fetching notes:', error);
    return;
  }
  
  renderNotes(data, count, page);
}

// 3 Display a page of notes in the 'output' div
function renderNotes(notes, totalCount, page) {
  const output = document.getElementById('output');
  // output.innerHTML = ''; // Clear previous content
  
  const totalPages = Math.ceil(totalCount / pageSize);
  const notesHtml = notes.map(note => {
    const shortContent = note.content.length > 200 
      ? `${note.content.slice(0, 200)} <span class="text-blue-600 cursor-pointer" onclick="toggleContent(this)">[more]</span><span class="hidden">${note.content.slice(200)}</span>`
      : note.content;
      
    return `
      <div class="mb-4 p-2 border-b border-blue-200">
        <p><strong>ID:</strong> ${note.sort_int}</p>
        <p><strong>Author:</strong> ${note.author_id.slice(0, 8)}</p>
        <p><strong>Created:</strong> ${new Date(note.created_at).toLocaleString()}</p>
        <p><strong>Title:</strong> ${note.title}</p>
        <p>${shortContent}</p>
      </div>
    `;
  }).join('');
  
  const paginationHtml = `
    <div class="flex justify-between items-center mt-4">
      <button onclick="changePage(${page - 1})" ${page === 1 ? 'disabled' : ''} class="px-3 py-1 bg-gray-200 rounded ${page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'}">Previous</button>
      <span>Page ${page} of ${totalPages}</span>
      <button onclick="changePage(${page + 1})" ${page === totalPages ? 'disabled' : ''} class="px-3 py-1 bg-gray-200 rounded ${page === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'}">Next</button>
    </div>
  `;
  
  output.innerHTML = notesHtml + (totalPages > 1 ? paginationHtml : '');
}

// 4. Change page and fetch new data
function changePage(newPage) {
  if (newPage < 1) return;
  currentPage = newPage;
  fetchNotes(currentPage);
}

// 5. Handle 'more' / 'less' for long notes
function toggleContent(el) {
  const hiddenSpan = el.nextElementSibling;
  if (hiddenSpan.classList.contains('hidden')) {
    hiddenSpan.classList.remove('hidden');
    el.textContent = '[less]';
  } else {
    hiddenSpan.classList.add('hidden');
    el.textContent = '[more]';
  }
}

// 6. Diagnose Supabase connection
async function diagnoseSupabase() {
  const supabaseUrl = 'https://kcdlbqotmuyyqvzzbxcn.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjZGxicW90bXV5eXF2enpieGNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjMwMzU2OTcsImV4cCI6MjAzODYxMTY5N30.6R7j3j4Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6';
  
  try {
    const supabase = supabase.createClient(supabaseUrl, supabaseKey);
    window.supabaseClient = supabase;
    
    log('✓ Supabase client created');
    log('Attempting to read from database...');
    
    const { data, error } = await supabase
      .from('notes')
      .select('count(*)', { count: 'exact' })
      .limit(1);
      
    if (error) {
      log('✗ Database read failed:');
      log(JSON.stringify(error, null, 2));
    } else {
      log('✓ Successfully read from database');
      log(`Records found: ${data.length}`);
    }
  } catch (err) {
    log('✗ Diagnostic failed:');
    log(err.message);
    log(JSON.stringify(err, null, 2));
  }
}

// 7. Insert a new note into the database
async function insertNote(supabase, author_id, audience_id=null, reply_to_id=null, title = 'AutoTitle', content, status=null) {
  try {
    const { data, error } = await supabase
      .from('notes')
      .insert([{
        author_id: author_id,
        audience_id: audience_id,
        reply_to_id: reply_to_id,
        title: title,
        content: content,
        status: status
      }]);
      
    if (error) {
      log(`✗ Insert error:${JSON.stringify(error, null, 2)}`);
    } else {
      log('✓ Note successfully inserted into database');
      log(`Inserted ID: ${data[0].id}`);
    }
  } catch (err) {
    log(`✗ Unexpected insert error:${err.message}`);
  }
}

// Initialize state
let activePage = 'home';
let editingCard = null;
let currentPageType = '';

// Card data
const linksCardData = Array.from({ length: 15 }, (_, i) => ({
  id: `links-${i + 1}`,
  name: `A${(i % 5) + 1}`,
  section: String.fromCharCode(65 + Math.floor(i / 5)),
  content: `Link ${(i % 5) + 1}`
}));

const scriptsCardData = Array.from({ length: 15 }, (_, i) => ({
  id: `scripts-${i + 1}`,
  name: `A${(i % 5) + 1}`,
  section: String.fromCharCode(65 + Math.floor(i / 5)),
  content: `Script ${(i % 5) + 1}`
}));

const initialDataLinks = [
  { name: 'React Documentation', url: 'https://react.dev/learn' },
  { name: 'W3Schools React Intro', url: 'https://www.w3schools.com/react/react_intro.asp' },
  { name: 'TailwindCSS v2 Docs', url: 'https://v2.tailwindcss.com/docs' },
  { name: 'CommonMark Markdown Help', url: 'https://commonmark.org/help/' },
  { name: 'CodePen', url: 'https://codepen.io' },
  { name: 'Raphaël JS Library', url: 'https://raphael.org' },
  { name: 'Bing Images', url: 'https://www.bing.com/images' },
  { name: 'Microsoft Copilot', url: 'https://copilot.microsoft.com/' },
  { name: 'Google Gemini', url: 'https://gemini.google.com/app' },
  { name: 'GitHub', url: 'https://github.com' },
];

const dataCardData = Array.from({ length: 15 }, (_, i) => {
  const linkIndex = i % initialDataLinks.length;
  return {
    id: `data-${i + 1}`,
    name: `A${(i % 5) + 1}`,
    section: String.fromCharCode(65 + Math.floor(i / 5)),
    ...initialDataLinks[linkIndex]
  };
});

// DOM elements
const app = document.getElementById('app');
const modal = document.getElementById('edit-modal');
const editNameInput = document.getElementById('edit-name');
const editUrlInput = document.getElementById('edit-url');
const urlField = document.getElementById('url-field');

// Page navigation
document.querySelectorAll('[data-page]').forEach(button => {
  button.addEventListener('click', (e) => {
    // Remove active class from all buttons
    document.querySelectorAll('[data-page]').forEach(btn => {
      btn.classList.remove('active-page', 'bg-blue-100', 'text-blue-800', 'border-l-4', 'border-blue-500');
      btn.classList.add('text-gray-700');
    });
    
    // Add active class to clicked button
    e.target.classList.add('active-page', 'bg-blue-100', 'text-blue-800', 'border-l-4', 'border-blue-500');
    e.target.classList.remove('text-gray-700');
    
    // Hide all pages
    document.querySelectorAll('.page-content').forEach(page => {
      page.classList.add('hidden');
    });
    
    // Show selected page
    const pageId = e.target.getAttribute('data-page') + '-page';
    document.getElementById(pageId).classList.remove('hidden');
    
    // Update active page
    activePage = e.target.getAttribute('data-page');
  });
});

// Card editing functionality
document.querySelectorAll('[data-card-id]').forEach(card => {
  card.addEventListener('click', (e) => {
    const cardId = e.currentTarget.getAttribute('data-card-id');
    const pageType = cardId.split('-')[0]; // links, data, or scripts
    
    // Find the card data
    let cardData;
    if (pageType === 'links') {
      cardData = linksCardData.find(c => c.id === cardId);
    } else if (pageType === 'data') {
      cardData = dataCardData.find(c => c.id === cardId);
    } else if (pageType === 'scripts') {
      cardData = scriptsCardData.find(c => c.id === cardId);
    }
    
    if (cardData) {
      // Set editing state
      editingCard = cardId;
      currentPageType = pageType;
      
      // Populate form
      editNameInput.value = cardData.name;
      editUrlInput.value = cardData.url || '';
      
      // Show/hide URL field based on page type
      if (pageType === 'data') {
        urlField.style.display = 'block';
      } else {
        urlField.style.display = 'none';
      }
      
      // Show modal
      modal.classList.add('show');
    }
  });
});

// Modal buttons
document.getElementById('cancel-edit').addEventListener('click', () => {
  modal.classList.remove('show');
  editingCard = null;
});

document.getElementById('save-edit').addEventListener('click', () => {
  if (!editingCard) return;
  
  // Update the appropriate card data based on current page
  if (currentPageType === 'data') {
    const cardIndex = dataCardData.findIndex(card => card.id === editingCard);
    if (cardIndex !== -1) {
      dataCardData[cardIndex].name = editNameInput.value;
      dataCardData[cardIndex].url = editUrlInput.value;
      
      // Update the DOM
      const cardElement = document.querySelector(`[data-card-id="${editingCard}"]`);
      if (cardElement) {
        const nameElement = cardElement.querySelector('p.font-medium');
        const urlElement = cardElement.querySelector('p.text-xs');
        if (nameElement) nameElement.textContent = editNameInput.value;
        if (urlElement) urlElement.textContent = editUrlInput.value;
      }
    }
  } else if (currentPageType === 'links') {
    const cardIndex = linksCardData.findIndex(card => card.id === editingCard);
    if (cardIndex !== -1) {
      linksCardData[cardIndex].name = editNameInput.value;
      linksCardData[cardIndex].content = editNameInput.value;
      
      // Update the DOM
      const cardElement = document.querySelector(`[data-card-id="${editingCard}"]`);
      if (cardElement) {
        const nameElement = cardElement.querySelector('p.font-medium');
        const contentElement = cardElement.querySelector('p.text-xs');
        if (nameElement) nameElement.textContent = editNameInput.value;
        if (contentElement) contentElement.textContent = editNameInput.value;
      }
    }
  } else if (currentPageType === 'scripts') {
    const cardIndex = scriptsCardData.findIndex(card => card.id === editingCard);
    if (cardIndex !== -1) {
      scriptsCardData[cardIndex].name = editNameInput.value;
      scriptsCardData[cardIndex].content = editNameInput.value;
      
      // Update the DOM
      const cardElement = document.querySelector(`[data-card-id="${editingCard}"]`);
      if (cardElement) {
        const nameElement = cardElement.querySelector('p.font-medium');
        const contentElement = cardElement.querySelector('p.text-xs');
        if (nameElement) nameElement.textContent = editNameInput.value;
        if (contentElement) contentElement.textContent = editNameInput.value;
      }
    }
  }
  
  // Show alert about database save (future implementation)
  alert(`Card updated! In future, this will save to the 'external_links' database table.`);
  
  // Hide modal
  modal.classList.remove('show');
  editingCard = null;
});

// Notes functionality
document.getElementById('clear-notes').addEventListener('click', () => {
  if (window.confirm('Are you sure you want to clear all notes?')) {
    document.getElementById('note-content').value = '';
  }
});

document.getElementById('save-notes').addEventListener('click', async () => {
  const content = document.getElementById('note-content').value;
  if(content !== "") {
    const author_id = '4023236b-58d7-4c41-ba0f-45a7efc31847'; // Later fetch dynamically
    const title = 'Note from UI';
    //order in db: author_id(required), audience_id, reply_to_id, title, content, status
    //only insert if there is something to insert
    await insertNote(window.supabaseClient, author_id, null, null, title, content);
  }
});

// Close modal when clicking outside
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.remove('show');
    editingCard = null;
  }
});

// Initialize - show home page
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('home-page').classList.remove('hidden');
  document.getElementById('notes-page').classList.add('hidden');
  document.getElementById('links-page').classList.add('hidden');
  document.getElementById('data-page').classList.add('hidden');
  document.getElementById('scripts-page').classList.add('hidden');
  document.getElementById('plan-page').classList.add('hidden');
  
  // Set active page
  document.querySelector('[data-page="home"]').classList.add('active-page');
  
  // Run diagnostics and fetch notes
  diagnoseSupabase().then(() => {
    fetchNotes(currentPage);
  });
});

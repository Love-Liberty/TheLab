// main.js - This file contains all the JavaScript logic from the original HTML file.

/**
 * All the JavaScript logic is wrapped in a `DOMContentLoaded` event listener.
 * This ensures that the code doesn't try to interact with the HTML elements
 * before the page has finished loading, which is a common source of errors.
 */
document.addEventListener('DOMContentLoaded', () => {


//trial of reading checkboxes
console.log('addListeners21:53');
// An array of all the input group names we want to listen for.
const inputGroups = ['main', 'importance', 'events', 'process', 'business', 'resource'];

/**
 * This function sets up a change event listener for a given group of inputs.
 * It takes the group name as an argument and attaches a listener to each
 * input element that has that name.
 *
 * @param {string} groupName - The 'name' attribute of the input group.
 */
const setupGroupListener = (groupName) => {
  // Select all inputs (both radio buttons and checkboxes) that have the
  // specified group name.
  const inputs = document.querySelectorAll(`input[name="${groupName}"]`);

  // Loop through each input in the group and add a listener.
  inputs.forEach(input => {
    input.addEventListener('change', (event) => {
      // Corrected line: Now we log the 'checked' state and the 'value'
      console.log(`Input from group '${groupName}' changed. Value:`, event.target.value, `, Checked:`, event.target.checked);
    });
  });
};


// Call the setup function for each group in our array.
inputGroups.forEach(group => {
  setupGroupListener(group);
});
// Next step: insert note, get note ID, validate tags, write to notes_categorised


// end of checkbox trial



    
    // Global variables for pagination
    let currentPage = 1;
    const pageSize = 10;
    
    // Global Supabase client variable
    let supabaseClient;

    /**
     * Logs a message to a specific output div and the console.
     * @param {string} message The message to log.
     */
    function log(message) {
        const output = document.getElementById('output');
        if (output) {
            output.textContent += message + '\n';
        }
        console.log(message);
    }

    /**
     * Toggles the visibility of a long note's content.
     * @param {HTMLElement} el The "more" or "less" span element.
     */
    function toggleContent(el) {
        const hiddenSpan = el.nextElementSibling;
        if (hiddenSpan && hiddenSpan.classList.contains('hidden')) {
            hiddenSpan.classList.remove('hidden');
            el.textContent = '[less]';
        } else if (hiddenSpan) {
            hiddenSpan.classList.add('hidden');
            el.textContent = '[more]';
        }
    }
    
    // Read and display pages of notes. New functions 14:46 7 Aug 2025
    
    /**
     * Fetches a page of notes from the Supabase database.
     * @param {number} page The page number to fetch. Defaults to 1.
     */
    async function fetchNotes(page = 1) {
        const supabase = supabaseClient; // Use the globally assigned client

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

    /**
     * Displays a page of notes in the 'output' div.
     * @param {Array<Object>} notes The array of notes to render.
     * @param {number} totalCount The total number of notes in the database.
     * @param {number} page The current page number.
     */
    function renderNotes(notes, totalCount, page) {
        const output = document.getElementById('output');
        const notesHtml = notes.map(note => {
            const shortContent = note.content.length > 200 ?
                `${note.content.slice(0, 200)} <span class="text-blue-600 cursor-pointer" onclick="toggleContent(this)">[more]</span><span class="hidden">${note.content.slice(200)}</span>` :
                note.content;

            return `
                <div class="mb-4 p-2 border-b border-blue-200">
                    <p><strong>ID:</strong> ${note.sort_int}</p>
                    <p><strong>Author:</strong> ${note.author_id.slice(0, 8)}</p>
                    <p><strong>Created:</strong> ${new Date(note.created_at).toLocaleString()}</p>
                    <p><strong>Content:</strong> ${shortContent}</p>
                </div>
            `;
        }).join('');

        const totalPages = Math.ceil(totalCount / pageSize);
        const controls = `
            <div class="flex items-center justify-between mt-4">
                <button onclick="changePage(${page - 1})" ${page === 1 ? 'disabled' : ''}>[<-]</button>
                <span>Page ${page} of ${totalPages}</span>
                <button onclick="changePage(${page + 1})" ${page === totalPages ? 'disabled' : ''}>[->]</button>
            </div>
        `;
        output.innerHTML = notesHtml + controls;
    }

    /**
     * Changes the current page and fetches the new notes.
     * @param {number} newPage The new page number to navigate to.
     */
    window.changePage = (newPage) => {
        if (newPage < 1) return;
        currentPage = newPage;
        fetchNotes(currentPage);
    };

    /**
     * Inserts a new note into the Supabase database.
     * @param {Object} supabase The Supabase client instance.
     * @param {string} author_id The ID of the note's author.
     * @param {string} audience_id The ID of the intended audience (optional).
     * @param {string} reply_to_id The ID of the note this is a reply to (optional).
     * @param {string} title The title of the note (defaults to 'AutoTitle').
     * @param {string} content The main content of the note.
     * @param {string} status The status of the note (optional).
     */
    async function insertNote(supabase, author_id, audience_id = null, reply_to_id = null, title = 'AutoTitle', content, status = null) {
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
                log(`✗ Insert error:\n${JSON.stringify(error, null, 2)}`);
            } else {
                log('✓ Note successfully inserted into database');
                log(`Inserted ID: ${data[0].id}`);
            }
        } catch (err) {
            log(`✗ Unexpected insert error:\n${err.message}`);
        }
    }

    /**
     * Performs a diagnostic check on the Supabase connection and client.
     */
    async function diagnoseSupabase() {
        const supabaseUrl = 'https://kcdlbqotmuyyqvzzbxcn.supabase.co';
        const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjZGxicW90bXV5eXF2enpieGNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzOTY3MjUsImV4cCI6MjA2OTk3MjcyNX0.jn1qV-Hz_z8pDVlQiR20Kwv_12BDL_z9rcHZvdbdahw';

        log('Starting Supabase Diagnostic...');
        log(`Supabase URL: ${supabaseUrl}`);

        try {
            const { createClient } = window.supabase;
            if (typeof createClient !== 'function') {
                throw new Error('createClient is not a function');
            }
            log('✓ Supabase createClient method found');

            supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
                auth: { persistSession: false }
            });
            log('✓ Supabase client created and assigned globally');

            if (typeof supabaseClient.from !== 'function') {
                throw new Error('supabaseClient.from is not a function');
            }
            log('✓ Supabase client methods verified');

            const { data, error } = await supabaseClient.from('notes').select('*');

            if (error) {
                log('✗ Database read error:');
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
    
    // Event listeners and page navigation
    const pages = document.querySelectorAll('.page-content');
    const navButtons = document.querySelectorAll('nav button');
    
    function showPage(pageId) {
        pages.forEach(page => {
            if (page.id === pageId) {
                page.classList.remove('hidden');
            } else {
                page.classList.add('hidden');
            }
        });
        navButtons.forEach(button => {
            if (button.dataset.page === pageId.replace('-page', '')) {
                button.classList.add('active-page');
            } else {
                button.classList.remove('active-page');
            }
        });
    }

    navButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            showPage(`${event.target.dataset.page}-page`);
        });
    });

    // Save notes button functionality
    const saveNotesButton = document.getElementById('save-notes');
    if (saveNotesButton) {
        saveNotesButton.addEventListener('click', async () => {
            const noteContent = document.getElementById('note-content').value;
            if (noteContent.trim() !== '') {
                // Placeholder for a real author_id
                const authorId = '0023236b-58d7-4c41-ba0f-45a7efc31847';
                await insertNote(supabaseClient, authorId, null, null, 'AutoTitle', noteContent, null);
            } else {
                log('Note content cannot be empty.');
            }
        });
    }

    // Clear notes button functionality
    const clearNotesButton = document.getElementById('clear-notes');
    if (clearNotesButton) {
        clearNotesButton.addEventListener('click', () => {
            document.getElementById('note-content').value = '';
        });
    }

    // Set up the initial page view and fetch notes
    showPage('home-page');
    diagnoseSupabase().then(() => {
        fetchNotes(currentPage);
    });

    // Make toggleContent function available globally for onclick events in the HTML
    window.toggleContent = toggleContent;
});

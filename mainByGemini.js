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
//--------------------new tag writing functions  11:40 10 Aug 2025
// This function collects tag data and returns it as an array.
// It reads the current status of all relevant checkboxes without using event listeners.
function createTagArray() {
    console.log('createTagArray()');    
    const tagsArray = [];
                             // These are the groups of tags we want to process.
    const inputGroups = ['main', 'importance', 'events', 'process', 'business', 'resource'];
    
                            // Loop through each group name.
    for (const group of inputGroups) {
                           // Find all checkboxes with a 'name' that matches the current group.
                           // The querySelectorAll method returns a list of all matching elements.
        const checkboxes = document.querySelectorAll(`input[name="${group}"][type="checkbox"]`);
                           // Now, loop through each checkbox we found in this group.
        for (const checkbox of checkboxes) {
                          // The 'checked' property of a checkbox is true if it's selected, false otherwise.
            if (checkbox.checked) {
                         // If the checkbox is checked, add its 'value' to our tagsArray.
                tagsArray.push(checkbox.value);
            }
        }
    }    

                         // --- Handle the radio button group ---
                         // For radio buttons, we only need to find the one that is checked.
                         // The querySelector method finds the first matching element.
    const importanceRadio = document.querySelector('input[name="importance"][type="radio"]:checked');
    
    // Check if a radio button was actually selected.
    if (importanceRadio) {
        // If it was, add its value to the tagsArray.
        tagsArray.push(importanceRadio.value);
    }

  
    // Log the final array so we can see what was collected.
    console.log('Tags collected:', tagsArray);
    return tagsArray;
}
 
  
// This function inserts each tag from the tagsArray into the Supabase 'tags' table.
// It first validates the tags against the 'notes_categories' table.
async function insertTags(noteId, tagsArray) {
    console.log('Validating and inserting tags for noteId:', noteId, 'Tags:', tagsArray);

    // If there are no tags to insert, we can exit early.
    if (!tagsArray || tagsArray.length === 0) {
        console.log('No tags to insert.');
        return;
    }

    try {
        // Step 1: Fetch all valid category IDs from the 'notes_categories' table.
        // This is our source of truth for valid tags.
        const { data: validCategories, error: categoriesError } = await supabase
            .from('notes_categories')
            .select('category_name');

        if (categoriesError) {
            console.error('Error fetching valid categories:', categoriesError);
            return; // Exit if we can't get the list of valid tags.
        }

        // Create a Set for efficient lookup of valid tag IDs.
        const validTagIds = new Set(validCategories.map(cat => cat.category_name));
        
        // Step 2: Filter the user's tagsArray to keep only valid tags.
        const validTags = tagsArray.filter(tag => validTagIds.has(tag));

        // Step 3: Check for any invalid tags and log a warning.
        const invalidTags = tagsArray.filter(tag => !validTagIds.has(tag));
        if (invalidTags.length > 0) {
            console.warn(`The following tags were invalid and will not be saved: ${invalidTags.join(', ')}`);
        }

        // If there are no valid tags to insert after filtering, we're done.
        if (validTags.length === 0) {
            console.log('No valid tags to insert after validation.');
            return;
        }
        
        // Step 4: Map the valid tags into the format required for the batch insert.
        const tagsToInsert = validTags.map(tag => ({
            noteId: noteId,
            category_name: tag
        }));
        
        // Step 5: Perform the actual batch insertion with only the valid tags.
        const { data, error } = await supabase
            .from('tags')
            .insert(tagsToInsert)
            .select();
        
        if (error) {
            console.error('Error inserting valid tags:', error);
        } else {
            console.log('Successfully inserted tags:', data);
        }
    } catch (err) {
        console.error('An unexpected error occurred during tag insertion:', err);
    }
}

                     //(supabaseClient, authorId, null1, null2, title, noteContent, null3)
async function insertNoteAndTags(supabase, author_id, audience_id = null, reply_to_id = null, title = 'AutoTitle', content, status = null){
 console.log('insertNoteAnsTags()');
  const tagsArray=createTagArray();
    const rowId = await insertNote(supabase, author_id, audience_id, reply_to_id, title, content, status);
  await insertTags(rowId, tagsArray);
 return true;} //placeholder

  
  
/**
 * Inserts a new note into the Supabase 'notes' table and returns the new ID.
 *
 * @param {object} supabase - The Supabase client instance.
 * @param {string} author_id - The ID of the author.
 * @param {string|null} [audience_id=null] - The ID of the audience.
 * @param {string|null} [reply_to_id=null] - The ID of the note this is a reply to.
 * @param {string} [title='AutoTitle'] - The title of the note.
 * @param {string} content - The content of the note.
 * @param {string|null} [status=null] - The status of the note.
 * @returns {Promise<string|null>} A promise that resolves to the new note's ID, or null if an error occurred.
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
            }])
            .select(); // Add .select() to get the inserted data back

        if (error) {
            console.error(`✗ Insert error:\n${JSON.stringify(error, null, 2)}`);
            return null; // Return null on error
        } else {
            console.log('✓ Note successfully inserted into database');
            const newNoteId = data[0].id;
            console.log(`Inserted ID: ${newNoteId}`);
            return newNoteId; // Return the new ID
        }
    } catch (err) {
        console.error(`✗ Unexpected insert error:\n${err.message}`);
        return null; // Return null on unexpected error
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
            //    await insertNote(supabaseClient, authorId, null, null, 'AutoTitle', noteContent, null);
                await insertNoteAndTags(supabaseClient, authorId, null, null, 'AutoTitle', noteContent, null);
            } else {
                log('The Note has no content, so not saved.');
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

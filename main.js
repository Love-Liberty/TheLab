 <script>
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

// 3    Display a page of notes in the 'output' div
function renderNotes(notes, totalCount, page) {
  const output = document.getElementById('output');
 // output.innerHTML = ''; // Clear previous content

  const notesHtml = notes.map(note => {
    const shortContent = note.content.length > 200
      ? `${note.content.slice(0, 200)} <span class="text-blue-600 cursor-pointer" onclick="toggleContent(this)">[more]</span><span class="hidden">${note.content.slice(200)}</span>`
      : note.content;

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

// 4. Store the count of what page we are on 
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


//});

    

//----------end of new read & display page by page functions
    

    async function diagnoseSupabase() {
      const supabaseUrl = 'https://kcdlbqotmuyyqvzzbxcn.supabase.co';
      const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjZGxicW90bXV5eXF2enpieGNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzOTY3MjUsImV4cCI6MjA2OTk3MjcyNX0.jn1qV-Hz_z8pDVlQiR20Kwv_12BDL_z9rcHZvdbdahw';

      log('Starting Supabase Diagnostic...');
      log(`Supabase URL: ${supabaseUrl}`);
      
      try {
        // Explicit client creation using the library's method
        const { createClient } = window.supabase;
        
        if (typeof createClient !== 'function') {
          throw new Error('createClient is not a function');
        }

        log('✓ Supabase createClient method found');

        const supabase = createClient(supabaseUrl, supabaseAnonKey, {
          auth: {
            persistSession: false
          }
        });
            
// Make the client globally accessible
 window.supabaseClient = supabase;
    log('✓ Supabase client created and assigned globally');
//  } catch (erro) {
  //  log('✗ Error during Supabase setup: ${erro.message}');}
    

    
  // access globally with const supabase = window.globalSupabase; or window.globalSupabase
          

        log('✓ Supabase client created successfully');

        // Verify the client has the 'from' method
        if (typeof supabase.from !== 'function') {
          throw new Error('supabase.from is not a function');
        }

        log('✓ Supabase client methods verified');

        // Test database connection
        const { data, error } = await supabase
          .from('notes')
          .select('*')
          ; //order in db: author_id(required), audience_id, reply_to_id, title, content, status. Below is a test write. Commented out 10:00 7 Aug
//await insertNote(supabase,'0023236b-58d7-4c41-ba0f-45a7efc31847',null,null,'Title 7 aug from indexTest.html','Content:Testing writing from form');
//Input form write to db is on line 1059

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
      // 6. Wait until the page is displayed, then call the function to fetch the page

//  document.addEventListener('DOMContentLoaded', () => {fetchNotes(currentPage);

    }



    
//order in db: author_id(required), audience_id, reply_to_id, title, content, status
async function insertNote(supabase, author_id,audience_id=null,reply_to_id=null, title = 'AutoTitle',content,status=null) {
 

  try {
    const { data, error } = await supabase
      .from('notes')
      .insert([
        {
          author_id: author_id,
          audience_id: audience_id,
          reply_to_id: reply_to_id,         
          title: title,  
          content: content,
          status: status
        }
      ]);

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


    
//document.addEventListener('DOMContentLoaded', diagnoseSupabase);
document.addEventListener('DOMContentLoaded', () => {
  diagnoseSupabase().then(() => {
    fetchNotes(currentPage);
  });
});



</script>    

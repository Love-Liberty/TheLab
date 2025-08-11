// db/notes.js

/**
 * Inserts a new note and returns its ID.
 */
export async function insertNote(supabase, author_id, audience_id = null, reply_to_id = null, title = 'AutoTitle', content, status = null) {
  try {
    const { data, error } = await supabase
      .from('notes')
      .insert([{
        author_id,
        audience_id,
        reply_to_id,
        title,
        content,
        status
      }])
      .select();

    if (error) {
      console.error('Insert error:', error);
      return null;
    }

    return data[0]?.id ?? null;
  } catch (err) {
    console.error('Unexpected insert error:', err.message);
    return null;
  }
}

/**
 * Fetches a page of notes.
 */
export async function fetchNotes(supabase, page = 1, pageSize = 10) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  const { data, count, error } = await supabase
    .from('notes')
    .select('*', { count: 'exact' })
    .order('sort_int', { ascending: false })
    .range(start, end);

  if (error) {
    console.error('Error fetching notes:', error);
    return { data: [], count: 0 };
  }

  return { data, count };
}

function renderNotes(notes, totalCount, page) {
  const output = document.getElementById('output');

  const notesHtml = notes.map(note => {
    const content = note.content ?? '';
    const shortContent = content.length > 200
      ? `${content.slice(0, 200)} <button class="text-blue-600 underline" onclick="toggleContent(this)">[more]</button><span class="hidden">${content.slice(200)}</span>`
      : content;

    const iconHTML = getIconHTML(note.status);
    const statusAttr = note.status ?? '';

    return `
      <div class="mb-4 p-2 border-b border-blue-200 relative note-block"
           role="article"
           aria-label="Note ${note.sort_int}"
           data-note-id="${note.id}"
           data-status="${statusAttr}">
        <div class="absolute top-2 right-2 status-icon">${iconHTML}</div>
        <p><strong>ID:</strong> ${note.sort_int}</p>
        <p><strong>Author:</strong> ${note.author_id?.slice(0, 8) ?? '—'}</p>
        <p><strong>Created:</strong> ${new Date(note.created_at).toLocaleString()}</p>
        <p><strong>Content:</strong> ${shortContent}</p>
      </div>
    `;
  }).join('');

  const totalPages = Math.ceil(totalCount / pageSize);
  const controls = `
    <div class="flex items-center justify-between mt-4" data-page="${page}">
      <button onclick="changePage(${page - 1})" ${page === 1 ? 'disabled' : ''}>[<-]</button>
      <span>Page ${page} of ${totalPages}</span>
      <button onclick="changePage(${page + 1})" ${page === totalPages ? 'disabled' : ''}>[->]</button>
    </div>
  `;

  output.innerHTML = notesHtml + controls;

  // Attach click listeners after rendering
  document.querySelectorAll('.note-block').forEach(el => {
    el.addEventListener('click', handleNoteClick);
  });
}




/**
 * Updates the status of a note.
 */
export async function saveNoteStatus(supabase, noteId, newStatus) {
  const { data, error } = await supabase
    .from('notes')
    .update({ status: newStatus })
    .eq('id', noteId);

  if (error) {
    console.error(`Failed to update status for note ${noteId}:`, error);
  }

  return { data, error };
}


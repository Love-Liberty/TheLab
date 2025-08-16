// reactToNoteClick.js
// response to click on a note in the rendered list of published notes
console.log('ui/reactToNoteClick.js');

import { createSupabaseClient } from './client.js';

// Status mapping and cycle logic
const statusMap = {
    6: { label: 'Pending (Complete)', icon: '❓', color: 'text-green-500' },
    9: { label: 'Completed', icon: '✅', color: 'text-green-500' },
    7: { label: 'Pending (Abandon)', icon: '❓', color: 'text-red-500' },
    8: { label: 'Abandoned', icon: '❌', color: 'text-red-500' },
};

const statusCycle = [6, 9, 7, 8];

// Create debounce timers map
const debounceTimers = new Map();

export async function reactToNoteClick(noteId) {
    console.log(`reactToNoteClick(${noteId})`);
    
    // Find the note element by its data-note-id
    const noteElement = document.querySelector(`[data-note-id="${noteId}"]`);
    if (!noteElement) {
        console.error(`Note element with ID ${noteId} not found`);
        return;
    }
    
    // Find the status icon within the note
    const icon = noteElement.querySelector('.status-icon');
    if (!icon) {
        console.error(`Status icon not found for note ${noteId}`);
        return;
    }
    
    // Get current status from the icon's dataset
    const currentStatus = parseInt(icon.dataset.status || '6', 10);
    
    // Find the next status in the cycle
    const currentIndex = statusCycle.indexOf(currentStatus);
    const nextIndex = (currentIndex + 1) % statusCycle.length;
    const nextStatus = statusCycle[nextIndex];
    
    // Update the icon's display immediately
    const nextStatusInfo = statusMap[nextStatus];
    icon.textContent = nextStatusInfo.icon;
    icon.className = `status-icon ${nextStatusInfo.color}`;
    icon.dataset.status = nextStatus;
    icon.title = nextStatusInfo.label;
    
    // Clear any existing timer for this note
    if (debounceTimers.has(noteId)) {
        clearTimeout(debounceTimers.get(noteId));
    }
    
    // Set a new timer to update the database after a delay
    const timer = setTimeout(async () => {
        const supabase = createSupabaseClient();
        await saveNoteStatus(supabase, noteId, nextStatus);
        debounceTimers.delete(noteId);
    }, 2000); // 2-second delay
    
    debounceTimers.set(noteId, timer);
}

// Updates the status of a note.
export async function saveNoteStatus(supabase, noteId, newStatus) {
    console.log("saveNoteStatus()");
    const { data, error } = await supabase
        .from('notes')
        .update({ status: newStatus })
        .eq('id', noteId);

    if (error) {
        console.error(`Failed to update status for note ${noteId}:`, error);
    }

    return { data, error };
}

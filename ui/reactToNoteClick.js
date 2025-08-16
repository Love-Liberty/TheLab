// Status mapping and cycle logic
const statusMap = {
    6: { label: 'Pending (Complete)', icon: '❓', color: 'text-green-500' },
    9: { label: 'Completed', icon: '✅', color: 'text-green-500' },
    7: { label: 'Pending (Abandon)', icon: '❓', color: 'text-red-500' },
    8: { label: 'Abandoned', icon: '❌', color: 'text-red-500' },
    null: { label: 'No Status', icon: '○', color: 'text-gray-400' } // Handle null case
};

const statusCycle = [null, 6, 9, 7, 8]; // Include null as the first state

export async function reactToNoteClick(noteId) {
    console.log(`reactToNoteClick(${noteId})`);
    
    const noteElement = document.querySelector(`[data-note-id="${noteId}"]`);
    if (!noteElement) {
        console.error(`Note element with ID ${noteId} not found`);
        return;
    }
    
    const icon = noteElement.querySelector('.status-icon');
    if (!icon) {
        console.error(`Status icon not found for note ${noteId}`);
        return;
    }
    
    // Handle null status (convert to string for dataset)
    const currentStatus = icon.dataset.status === 'null' ? null : parseInt(icon.dataset.status, 10);
    
    // Find the next status in the cycle
    const currentIndex = statusCycle.indexOf(currentStatus);
    const nextIndex = (currentIndex + 1) % statusCycle.length;
    const nextStatus = statusCycle[nextIndex];
    
    // Update the icon's display immediately
    const nextStatusInfo = statusMap[nextStatus];
    icon.textContent = nextStatusInfo.icon;
    icon.className = `status-icon ${nextStatusInfo.color}`;
    icon.dataset.status = nextStatus; // Store as actual value (null or number)
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
    }, 2000);
    
    debounceTimers.set(noteId, timer);
}

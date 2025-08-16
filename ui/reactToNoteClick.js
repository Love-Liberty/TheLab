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
    
    // Get the current status from the data attribute (this is the source of truth)
    const currentStatus = noteElement.dataset.status;
    
    // Define the status cycle using the actual values we use in the system
    const statusCycle = [null, 6, 9, 7, 8]; // null for "No status"
    
    // Convert current status to proper type for comparison
    const currentStatusValue = currentStatus === 'null' ? null : parseInt(currentStatus, 10);
    
    // Find the next status in the cycle
    const currentIndex = statusCycle.indexOf(currentStatusValue);
    const nextIndex = (currentIndex + 1) % statusCycle.length;
    const nextStatus = statusCycle[nextIndex];
    
    // Update the status bar text
    const statusBar = noteElement.querySelector('.status-bar');
    if (statusBar) {
        const statusText = nextStatus === null ? 'No status' : nextStatus;
        statusBar.innerHTML = `
            <span>Status: ${statusText}</span>
            <span class="mx-2">•</span>
            <span>Click anywhere to cycle through status choices</span>
        `;
    }
    
    // Update the data attribute to reflect the new status
    noteElement.dataset.status = nextStatus;
    
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

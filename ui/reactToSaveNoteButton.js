//reactToSaveButton.js

console.log('reactToSaveButton.js');

export async function reactToSaveButton(){
 console.log('reactToSaveButton()');

 const noteContent = document.getElementById('note-content')?.value.trim();
      if (!noteContent) {
        console.log('✗ Note content is empty');
        return;
      } else console.log("content found");
      
 const userChoices = collectUserChoices();
 console.log('reactToSaveButton()', {noteContent:noteContent, tags:userChoices});
   if (tags.size==0) {
        console.log('✗ No tags');
        return;
      } else console.log(tags.size, " tags found");
     
 const result = await saveNoteWithTags(supabase, {
                     content: noteContent,
                     tags: userChoices,
                     author_id: '47742c9f-9afd-40b3-816a-f83fcd72b905'//mock data until implemented
});    
if (result) {
  console.log(`✅ Note saved with ID: ${result}`);
} else {
  console.log('❌ Note save failed');
}
    }
  });


//cleanupPage() //{empty content, reset tags, re-render notes}
                                         }

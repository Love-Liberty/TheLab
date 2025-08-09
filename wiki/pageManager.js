// pageManager.js
// This module's job is to control which 'pages' (divs) are visible on the screen.
// This preserves the single-HTML-file design while making the logic clean.

export function showPage(pageIdToShow) {
    const pages = document.querySelectorAll('.page');
    let pageFound = false;

    // First, hide all pages. We'll show the desired ones after.
    pages.forEach(page => {
        page.style.display = 'none';
    });

    // Check if the page exists and display it.
    const pageToShow = document.getElementById(pageIdToShow);
    if (pageToShow) {
        pageToShow.style.display = 'block';
        pageFound = true;
    } else {
        console.error(`Page with ID "${pageIdToShow}" not found.`);
    }

    return pageFound;
}

export function showPagesSideBySide(pageId1, pageId2) {
    // This function implements your "amusing bug" as a deliberate feature.
    // It's the core of what you want to achieve.
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.style.display = 'none';
    });

    const page1 = document.getElementById(pageId1);
    const page2 = document.getElementById(pageId2);

    if (page1 && page2) {
        // You would use Tailwind classes here for the side-by-side effect.
        // For example: grid-cols-2 or flex space-x-4
        // For this basic example, we just show both.
        page1.style.display = 'block';
        page2.style.display = 'block';
    } else {
        if (!page1) console.error(`Page with ID "${pageId1}" not found.`);
        if (!page2) console.error(`Page with ID "${pageId2}" not found.`);
    }
}

// You would then import these functions into your main.js file and call them
// in response to user actions. For example:
//
// import { showPage, showPagesSideBySide } from './pageManager.js';
//
// document.getElementById('myButton').addEventListener('click', () => {
//     showPagesSideBySide('input-form-div', 'instructions-div');
// });

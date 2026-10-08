javascript
// Selecting elements from the HTML page
const noteForm = document.querySelector('#note-form');
const noteInput = document.querySelector('#note-input');
const noteCategory = document.querySelector('#note-category');
const errorMessage = document.querySelector('#error-message');
const searchInput = document.querySelector('#search-input');
const notesList = document.querySelector('#notes-list');
const noteCount = document.querySelector('#note-count');

// Load notes from local storage or start with an empty list
let notes = JSON.parse(localStorage.getItem('quicknotes')) || [];

// Function to rebuild and display the list of notes on the screen
function render(filteredNotes = notes) {
    notesList.innerHTML = ''; // Clear the current display
    
    // Update the count message correctly based on number of notes
    if (notes.length === 0) {
        noteCount.textContent = "You have no notes yet.";
    } else if (notes.length === 1) {
        noteCount.textContent = "You have 1 note.";
    } else {
        noteCount.textContent = `You have ${notes.length} notes.`;
    }

    // Build each note card visually using createElement and textContent
    filteredNotes.forEach(note => {
        const li = document.createElement('li');
        li.className = `note-card category-${note.category}`;

        const textPara = document.createElement('p');
        textPara.textContent = note.text;

        const metaPara = document.createElement('p');
        metaPara.className = 'note-meta';
        metaPara.textContent = `Category: ${note.category.toUpperCase()} | Created: ${note.createdAt}`;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', () => deleteNote(note.id));

        li.appendChild(textPara);
        li.appendChild(metaPara);
        li.appendChild(deleteBtn);
        notesList.appendChild(li);
    });
}

// Event listener when someone clicks the "Add Note" button
noteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const textValue = noteInput.value.trim();
    const categoryValue = noteCategory.value;

    // Validation checks
    if (textValue === '') {
        errorMessage.textContent = "Please type a note first.";
        return;
    }
    if (textValue.length > 200) {
        errorMessage.textContent = "Notes must be 200 characters or fewer.";
        return;
    }

    // Clear any previous error messages if valid
    errorMessage.textContent = '';

    // Create a unique note object structure
    const newNote = {
        id: Date.now(),
        text: textValue,
        category: categoryValue,
        createdAt: new Date().toLocaleString()
    };

    notes.push(newNote);
    saveAndRefresh();
    noteForm.reset();
});

// Function to delete a note by filtering out its ID
function deleteNote(id) {
    notes = notes.filter(note => note.id !== id);
    saveAndRefresh();
}

// Event listener when someone types inside the search box
searchInput.addEventListener('input', () => {
    const filterText = searchInput.value.toLowerCase();
    const matchedNotes = notes.filter(note => note.text.toLowerCase().includes(filterText));
    render(matchedNotes);
});

// Function to save data locally and refresh the visual elements
function saveAndRefresh() {
    localStorage.setItem('quicknotes', JSON.stringify(notes));
    render();
}

// Run the initial render block to show notes when opening the app
render();
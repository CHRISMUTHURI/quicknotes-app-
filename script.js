// DOM Element Selections using querySelector
const noteForm = document.querySelector('#note-form');
const noteInput = document.querySelector('#note-input');
const noteCategory = document.querySelector('#note-category');
const searchInput = document.querySelector('#search-input');
const notesList = document.querySelector('#notes-list');
const noteCount = document.querySelector('#note-count');
const errorMessage = document.querySelector('#error-message');

// LocalStorage key
const STORAGE_KEY = 'quicknotes_data';

// Load saved notes from LocalStorage or initialize empty array
let notes = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// Save notes to LocalStorage
function saveNotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

// Update Note Count Display
function updateNoteCount(count) {
  if (count === 0) {
    noteCount.textContent = 'You have 0 notes.';
  } else if (count === 1) {
    noteCount.textContent = 'You have 1 note.';
  } else {
    noteCount.textContent = `You have ${count} notes.`;
  }
}

// Render Notes to DOM
function render(filterTerm = '') {
  notesList.textContent = '';
  
  const filteredNotes = notes.filter(note => 
    note.text.toLowerCase().includes(filterTerm.toLowerCase())
  );

  filteredNotes.forEach(note => {
    const li = document.createElement('li');
    li.className = `note-card cat-${note.category}`;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'note-content';

    const textPara = document.createElement('p');
    textPara.textContent = note.text; // Safe text insertion using textContent

    const metaPara = document.createElement('p');
    metaPara.className = 'note-meta';
    metaPara.textContent = `Category: ${note.category} | Created: ${note.createdAt}`;

    contentDiv.appendChild(textPara);
    contentDiv.appendChild(metaPara);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete-btn';
    deleteBtn.addEventListener('click', () => deleteNote(note.id));

    li.appendChild(contentDiv);
    li.appendChild(deleteBtn);

    notesList.appendChild(li);
  });

  updateNoteCount(filteredNotes.length);
}

// Add New Note
function addNote(event) {
  event.preventDefault();
  const text = noteInput.value.trim();
  const category = noteCategory.value;

  // Validation
  if (text === '') {
    errorMessage.textContent = 'Note content cannot be empty.';
    return;
  }

  if (text.length > 200) {
    errorMessage.textContent = 'Note content cannot exceed 200 characters.';
    return;
  }

  errorMessage.textContent = ''; // Clear error if validation passes

  const newNote = {
    id: Date.now(),
    text: text,
    category: category,
    createdAt: new Date().toLocaleDateString()
  };

  notes.push(newNote);
  saveNotes();
  render(searchInput.value);

  noteInput.value = ''; // Reset input field
}

// Delete Note
function deleteNote(id) {
  notes = notes.filter(note => note.id !== id);
  saveNotes();
  render(searchInput.value);
}

// Event Listeners
noteForm.addEventListener('submit', addNote);
searchInput.addEventListener('input', (e) => render(e.target.value));

// Initial Render on Page Load
render();
async function fetchNotes() {
    const response = await fetch('/notes');
    const notes = await response.json();
    const notesDiv = document.getElementById('notes');
    notesDiv.innerHTML = '';
    notes.forEach(note => {
        const div = document.createElement('div');
        div.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.content}</p>
            <button onclick="updateNote('${note.id}')">Update</button>
            <button onclick="deleteNote('${note.id}')">Delete</button>
        `;
        notesDiv.appendChild(div);
    });
}

async function createNote() {
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    await fetch('/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content })
    });
    fetchNotes();
}

async function updateNote(id) {
    const title = prompt('New title:');
    const content = prompt('New content:');
    await fetch(`/notes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content })
    });
    fetchNotes();
}

async function deleteNote(id) {
    await fetch(`/notes/${id}`, { method: 'DELETE' });
    fetchNotes();
}

fetchNotes();

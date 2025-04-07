const SECRET_KEY = 'Chunmun@14';
const VIEW_PASSWORD_HASH = CryptoJS.SHA256('Chunmun@14').toString(); 

function encrypt(text) {
    console.log('Encrypting:', text);
    const encrypted = CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
    console.log('Encrypted:', encrypted);
    return encrypted;
}

function decrypt(ciphertext) {
    console.log('Decrypting:', ciphertext);
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    console.log('Decrypted:', decrypted);
    return decrypted;
}

function showPasswordModal() {
    document.getElementById('passwordModal').style.display = 'block';
}

function hidePasswordModal() {
    document.getElementById('passwordModal').style.display = 'none';
    document.getElementById('viewPassword').value = '';
}

function checkPassword() {
    const password = document.getElementById('viewPassword').value;
    if (password) {
        const hashedInput = CryptoJS.SHA256(password).toString();
        if (hashedInput === VIEW_PASSWORD_HASH) {
            window.location.href = '/notes.html';
        } else {
            alert('Incorrect password!');
        }
        hidePasswordModal();
    }
}

function addNote() {
    const title = document.getElementById('noteTitle');
    const content = document.getElementById('noteContent');
    if (title && content && title.value && content.value) {
        const encryptedContent = encrypt(content.value);
        const note = { id: Date.now(), title: title.value, content: encryptedContent };
        saveNote(note);
        title.value = '';
        content.value = '';
        if (window.location.pathname === '/notes.html') displayNotes();
    }
}

function saveNote(note) {
    let notes = JSON.parse(localStorage.getItem('notes') || '[]');
    notes.push(note);
    localStorage.setItem('notes', JSON.stringify(notes));
}

function updateNote(id) {
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    const note = notes.find(n => n.id === id);
    const newTitle = prompt('Edit title:', note.title);
    const newContent = prompt('Edit content:', decrypt(note.content));
    if (newTitle && newContent) {
        note.title = newTitle;
        note.content = encrypt(newContent);
        localStorage.setItem('notes', JSON.stringify(notes));
        displayNotes();
    }
}

function deleteNote(id) {
    if (confirm('Delete this note?')) {
        let notes = JSON.parse(localStorage.getItem('notes') || '[]');
        notes = notes.filter(n => n.id !== id);
        localStorage.setItem('notes', JSON.stringify(notes));
        displayNotes();
    }
}

function displayNotes() {
    const notesList = document.getElementById('notesList');
    if (!notesList) return;
    notesList.innerHTML = '';
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    notes.forEach(note => {
        const div = document.createElement('div');
        div.className = 'note';
        div.innerHTML = `
            <strong>${note.title}</strong>
            <p>${decrypt(note.content)}</p>
            <button onclick="updateNote(${note.id})">Update</button>
            <button onclick="deleteNote(${note.id})">Delete</button>
        `;
        notesList.appendChild(div);
    });
}

window.onload = displayNotes;
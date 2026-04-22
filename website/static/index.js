function deleteNote(noteId) {
    fetch('/delete-note', {
        method: 'POST',
        body: JSON.stringify({noteId: noteId})
    }).then((_res) => {
        window.location.href = "/"
    });
}

function enableEdit(noteId, element) {
    const currentText = element.innerText;

    element.innerHTML = `
        <input type="text" value="${currentText}" id="editInput">
    `;
    const input = element.querySelector("input");
    input.focus();
    input.addEventListener('keydown', function(event){
        if (event.key === 'Enter') {
            saveEdit(noteId, input.value, null);
        }
    });
}

function enableDateEdit(noteId, element) {
    const currentValue = element.innerText.trim();
    const formatted = currentValue.replace(' ', 'T');
    element.innerHTML = `<input type="datetime-local" value="${formatted}">`;

    const input = element.querySelector("input");
    input.showPicker();
    input.addEventListener('change', function() {
        saveEdit(noteId, null, input.value.replace('T', ' '));
    });
}

function saveEdit(noteId, newText, newRemindAt) {
    fetch('/edit-note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ noteId: noteId, data: newText, remind_at: newRemindAt })
    }).then(() => window.location.href = '/');
}

function deleteNote(noteId) {
    fetch('/delete-note', {
        method: 'POST',
        body: JSON.stringify({noteId: noteId})
    }).then((_res) => {
        window.location.href = "/"
    });
}

function enableEdit(noteId, element) {
    if (element.querySelector("input")) return;
    const currentText = element.innerText;

    element.innerHTML = `
        <input type="text" value="${currentText}" id="editInput">
        <small onclick="event.stopPropagation()">Press Escape to cancel</small>
    `;
    const input = element.querySelector("input");
    input.focus(); 
    input.setSelectionRange(input.value.length, input.value.length);
    let isComposing = false;
    input.addEventListener('compositionstart', () => isComposing = true);
    input.addEventListener('compositionend', () => isComposing = false);
    input.addEventListener('keydown', function(event){
        if (event.key === 'Enter' && !isComposing) {
            saveEdit(noteId, input.value, null);
        } else if (event.key === 'Escape') {
            element.innerText = currentText;
        }
    });
}

function enableDateEdit(noteId, element) {
    if (element.querySelector("input")) return;
    const currentValue = element.innerText.trim();
    const formatted = currentValue.replace(' ', 'T');
    element.innerHTML = `<input type="datetime-local" value="${formatted}">`;

    const input = element.querySelector("input");
    input.showPicker();
    input.addEventListener('change', function() {
        saveEdit(noteId, null, input.value.replace('T', ' '));
    });
    input.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            element.innerText = currentValue;
        }
    });
}

function saveEdit(noteId, newText, newRemindAt) {
    fetch('/edit-note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ noteId: noteId, data: newText, remind_at: newRemindAt })
    }).then(() => window.location.href = '/');
}


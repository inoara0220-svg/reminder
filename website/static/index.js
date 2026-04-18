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
}
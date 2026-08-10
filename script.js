const API_URL = "http://localhost:8082/notes";

// Load notes when page opens
window.onload = function () {
    getNotes();
};


// CREATE NOTE
function addNote() {

    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;

    if (title === "" || content === "") {
        alert("Please enter title and content");
        return;
    }

    const note = {
        title: title,
        content: content
    };

    fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(note)
    })
    .then(response => response.json())
    .then(data => {

        alert("Note added successfully!");

        document.getElementById("title").value = "";
        document.getElementById("content").value = "";

        getNotes();
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Failed to add note");
    });
}


// GET ALL NOTES
function getNotes() {

    fetch(API_URL)
        .then(response => response.json())
        .then(notes => {

            const notesList = document.getElementById("notesList");

            notesList.innerHTML = "";

            notes.forEach(note => {

                const noteDiv = document.createElement("div");

                noteDiv.className = "note";

                noteDiv.innerHTML = `
                    <h3>${note.title}</h3>
                    <p>${note.content}</p>

                    <button onclick="updateNote(${note.id})">
                        Update
                    </button>

                    <button onclick="deleteNote(${note.id})">
                        Delete
                    </button>
                `;

                notesList.appendChild(noteDiv);
            });
        })
        .catch(error => {
            console.error("Error:", error);
        });
}


// UPDATE NOTE
function updateNote(id) {

    const newTitle = prompt("Enter new title:");

    if (newTitle === null) {
        return;
    }

    const newContent = prompt("Enter new content:");

    if (newContent === null) {
        return;
    }

    const note = {
        title: newTitle,
        content: newContent
    };

    fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(note)
    })
    .then(response => {

        if (!response.ok) {
            throw new Error("Note not found");
        }

        return response.json();
    })
    .then(data => {

        alert("Note updated successfully!");

        getNotes();
    })
    .catch(error => {

        console.error("Error:", error);

        alert("Failed to update note");
    });
}


// DELETE NOTE
function deleteNote(id) {

    if (!confirm("Are you sure you want to delete this note?")) {
        return;
    }

    fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    })
    .then(response => {

        if (!response.ok) {
            throw new Error("Note not found");
        }

        return response.text();
    })
    .then(message => {

        alert(message);

        getNotes();
    })
    .catch(error => {

        console.error("Error:", error);

        alert("Failed to delete note");
    });
}
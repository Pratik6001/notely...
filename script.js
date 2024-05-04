document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("searchInput");
  const addButton = document.getElementById("addButton");
  const allButton = document.getElementById("allButton");
  const personalButton = document.getElementById("personalButton");
  const homeButton = document.getElementById("homeButton");
  const businessButton = document.getElementById("businessButton");
  const completedOnlyCheckbox = document.getElementById("completedOnly");
  const noteContainer = document.getElementById("noteContainer");
  const noteModal = document.getElementById("noteModal");
  const cancelButton = document.getElementById("cancelButton");
  const noteForm = document.getElementById("noteForm");
  const deleteModal = document.getElementById("deleteModal");
  const cancelDeleteButton = document.getElementById("cancelDeleteButton");
  const confirmDeleteButton = document.getElementById("confirmDeleteButton");
  let notes = JSON.parse(localStorage.getItem("notes")) || [];

  function saveNotes() {
    localStorage.setItem("notes", JSON.stringify(notes));
  }
  function getCategoryClass(category) {
    switch (category) {
      case "Personal":
        return "bg-blue-300 text-blue-700 px-3 rounded-3xl";
      case "Business":
        return "bg-purple-400 text-purple-700 px-3 rounded-3xl";
      case "Home":
        return "bg-yellow-300 text-yellow-700 px-3 rounded-3xl ";
      default:
        return "bg-gray-500 text-white px-3 rounded-3xl";
    }
  }
  function renderEmptyState(message) {
    const emptyState = document.getElementById("emptyState");
    const emptyStateText = document.getElementById("emptyStateText");
    emptyStateText.textContent = message;
    emptyState.classList.remove("hidden");
  }

  function hideEmptyState() {
    const emptyState = document.getElementById("emptyState");
    emptyState.classList.add("hidden");
  }
  function renderNotes(filteredNotes = notes) {
    if (filteredNotes.length === 0) {
      renderEmptyState("No notes found.");
    } else {
      hideEmptyState();
    }
    noteContainer.innerHTML = "";
    filteredNotes.forEach((note) => {
      const noteElement = document.createElement("div");
      noteElement.classList.add(
        "bg-white",
        "flex",
        "flex-col",
        "rounded-lg",
        "p-4",
        "space-y-4",
        "shadow-md"
      );
      noteElement.innerHTML = `
                  <div class="flex item-center justify-between ">
                   <div>
                   <p class="${getCategoryClass(
                     note.category
                   )} font-semibold">${note.category}</p>
                  </div>
                  <div class="">
                  <input type="checkbox" class="note-checkbox w-8 mr-1" data-id="${
                    note.id
                  }" ${note.completed ? "checked" : ""}>
                      <button class="text-gray-500 w-8 mr-2 edit-note" data-id="${
                        note.id
                      }"><i class="fa-solid fa-pen"></i></button>
                      <button class="text-gray-500 w-8 p-2 delete-note" data-id="${
                        note.id
                      }"><i class="fa-solid fa-trash-can"></i></button>
                  </div>      
                  </div>
                  <div class="px-2">
                  <h2 class="text-lg text-gray-600 font-bold">${note.title}</h2>
                  <p class="text-gray-600">${note.description}</p>
                  </div>
                  <div>
                  <p class="text-gray-400 text-end mt-2">${note.date}</p>
                  </div>         
              `;
      if (note.completed) {
        noteElement.classList.add("completed");
      }
      noteContainer.appendChild(noteElement);
    });
  }

  function addNote() {
    const title = document.getElementById("title").value;
    const category = document.getElementById("category").value;
    const description = document.getElementById("description").value;
    const date = new Date().toLocaleDateString();
    const id = document.getElementById("saveButton").dataset.id; // Retrieve the ID from the dataset of the Save button
    const index = notes.findIndex((note) => note.id === id);

    if (index !== -1) {
      notes[index] = { ...notes[index], title, category, description }; // Update the existing note
    } else {
      const newId = Date.now().toString(); // Generate a new ID if it's a new note
      notes.push({
        id: newId,
        title,
        category,
        description,
        date,
        completed: false,
      }); // Add a new note
    }

    saveNotes();
    renderNotes();
    closeNoteModal();
  }

  function deleteNote(id) {
    notes = notes.filter((note) => note.id !== id);
    saveNotes();
    renderNotes();
    closeDeleteModal();
  }

  function closeNoteModal() {
    noteForm.reset();
    noteModal.classList.add("hidden");
  }

  function closeDeleteModal() {
    deleteModal.classList.add("hidden");
  }

  addButton.addEventListener("click", () => {
    noteModal.classList.remove("hidden");
  });

  cancelButton.addEventListener("click", () => {
    closeNoteModal();
  });

  noteForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addNote();
  });

  cancelDeleteButton.addEventListener("click", () => {
    closeDeleteModal();
  });

  confirmDeleteButton.addEventListener("click", () => {
    const id = confirmDeleteButton.dataset.id;
    deleteNote(id);
    closeDeleteModal();
  });

  noteContainer.addEventListener("change", (e) => {
    const id = e.target.dataset.id;
    const note = notes.find((note) => note.id === id);
    note.completed = e.target.checked;
    saveNotes();
    renderNotes();
  });

  noteContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("edit-note")) {
      const id = e.target.dataset.id;
      const note = notes.find((note) => note.id === id);
      document.getElementById("title").value = note.title;
      document.getElementById("category").value = note.category;
      document.getElementById("description").value = note.description;
      document.getElementById("saveButton").dataset.id = id;
      noteModal.classList.remove("hidden");
    } else if (e.target.classList.contains("delete-note")) {
      const id = e.target.dataset.id;
      confirmDeleteButton.dataset.id = id;
      deleteModal.classList.remove("hidden");
    }
  });

  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    const filteredNotes = notes.filter((note) =>
      note.title.toLowerCase().includes(query)
    );
    renderNotes(filteredNotes); // Pass filteredNotes to renderNotes function
  });

  allButton.addEventListener("click", () => {
    renderNotes(notes);
  });

  personalButton.addEventListener("click", () => {
    const personalNotes = notes.filter((note) => note.category === "Personal");
    renderNotes(personalNotes);
  });

  businessButton.addEventListener("click", () => {
    const businessNotes = notes.filter((note) => note.category === "Business");
    renderNotes(businessNotes);
  });
  homeButton.addEventListener("click", () => {
    const HomeNotes = notes.filter((note) => note.category === "Home");
    renderNotes(HomeNotes);
  });
  completedOnlyCheckbox.addEventListener("change", () => {
    if (completedOnlyCheckbox.checked) {
      const completedNotes = notes.filter((note) => note.completed);
      renderNotes(completedNotes);
    } else {
      renderNotes(notes);
    }
  });

  renderNotes();
});

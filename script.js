const addBt = document.querySelector(".add-bt");
const cards = document.querySelectorAll(".card");
const cardsContainer = document.querySelector(".cards");
const note = document.querySelector(".note");
const noteText = document.querySelector("textarea");
const overlay = document.querySelector(".overlay");
const saveBt = document.querySelector(".save-bt");
const cancelBt = document.querySelector(".cancel-bt");
let openCardText = false;

loadFromStorage();
eventsHandler();

function eventsHandler() {
  saveBt.addEventListener("click", saveChanges);
  cancelBt.addEventListener("click", closeOverlay);
  addBt.addEventListener("click", openOverlay);
}

function removeCardEvent(e) {
  e.stopPropagation();
  this.parentElement.remove();
  savetoStorage();
}

function openNote() {
  const cardText = this.querySelector("p");
  openCardText = cardText;
  openOverlay();
  noteText.value = cardText.innerText;
}

function createNoteCard(text) {
  const card = document.createElement("div");
  card.classList.add("card");
  card.setAttribute("draggable", "true");
  const removeBt = document.createElement("i");
  removeBt.classList.add("fa", "fa-trash", "remove");
  removeBt.addEventListener("click", removeCardEvent);
  card.appendChild(removeBt);
  const p = document.createElement("p");
  p.textContent = text;
  card.appendChild(p);
  card.addEventListener("click", openNote);
  cardDragEventsHandler(card);
  return card;
}

function saveChanges() {
  if (openCardText === false) {
    // if there's no card open then add a new card
    const card = createNoteCard(noteText.value);
    cardsContainer.insertBefore(card, cardsContainer.firstElementChild);
  } else {
    //save the changes in the opened card
    openCardText.innerText = noteText.value;
  }
  savetoStorage();
  closeOverlay();
}

function closeOverlay() {
  const hide = setInterval(() => {
    if (note.style.opacity > 0) {
      note.style.opacity = Number(note.style.opacity) - 0.03;
      overlay.style.opacity = Number(overlay.style.opacity) - 0.03;
    } else {
      overlay.classList.add("hide");
      clearInterval(hide);
    }
  }, 1);

  openCardText = false;
  noteText.value = "";
}

function openOverlay() {
  note.style.opacity = 1;
  overlay.style.opacity = 1;
  overlay.classList.remove("hide");
}

function savetoStorage() {
  const cards = document.querySelectorAll(".card > p");
  let notes = [];
  cards.forEach((card) => notes.push(card.innerText));
  localStorage.setItem("notes", JSON.stringify(notes));
}

function loadFromStorage() {
  if (localStorage.getItem("notes") !== null) {
    cardsContainer.innerHTML = "";
    const notes = JSON.parse(localStorage.getItem("notes"));
    notes.forEach((note) => {
      const card = createNoteCard(note);
      cardsContainer.appendChild(card);
    });
  } else {
    cardsContainer.appendChild(createNoteCard("Hello !"));
  }
}

function dragStart(card) {
  card.classList.add("dragging");
  setTimeout(() => {
    card.style.opacity = "0.2";
  }, 1);
}

function dragEnd(card) {
  card.classList.remove("dragging");
  card.style.opacity = "1";
  savetoStorage();
}

function dragOver(e, card) {
  e.preventDefault();
  const draggable = document.querySelector(".dragging");
  if (cardsContainer.lastElementChild === card) {
    cardsContainer.append(draggable);
  } else if (draggable.nextElementSibling === card) {
    cardsContainer.insertBefore(card, draggable);
  } else {
    cardsContainer.insertBefore(draggable, card);
  }
}

function cardDragEventsHandler(card) {
  card.addEventListener("dragstart", () => dragStart(card));
  card.addEventListener("dragend", () => dragEnd(card));
  card.addEventListener("dragover", (e) => dragOver(e, card));
}

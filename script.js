const addBt = document.querySelector(".add-bt");
const cards = document.querySelectorAll(".card");
const cardsContainer = document.querySelector(".cards");
const note = document.querySelector(".note");
const noteText = document.querySelector("textarea");
const overlay = document.querySelector(".overlay");
const saveBt = document.querySelector(".save-bt");
const cancelBt = document.querySelector(".cancel-bt");
let openCardText = false;
function removeCardEvent(e) {
  e.target.parentElement.remove();
  savetoStorage();
}

function openNote(e) {
  if (e.target.classList.contains("remove")) {
    removeCardEvent(e);
  } else {
    const cardText = e.target.classList.contains("card")
      ? e.target.querySelector("p")
      : e.target;
    openCardText = cardText;
    openOverlay();
    noteText.value = cardText.innerText;
  }
}

function saveChanges() {
  if (openCardText === false) {
    const card = document.createElement("div");
    card.addEventListener("click", openNote);
    card.classList.add("card");
    card.innerHTML = `<i class="fa fa-trash remove" aria-hidden="true"></i>
      <p>${noteText.value}</p>`;
    cardsContainer.insertBefore(card, cardsContainer.firstElementChild);
  } else {
    openCardText.innerText = noteText.value;
  }
  savetoStorage();
  closeOverlay();
}

function closeOverlay() {
  const hide = setInterval(() => {
    if (note.style.opacity > 0) {
      note.style.opacity = Number(note.style.opacity) - 0.01;
      overlay.style.opacity = Number(overlay.style.opacity) - 0.01;
    } else {
      overlay.classList.add("hide");
      note.classList.add("hide");
      clearInterval(hide);
    }
  }, 3);

  openCardText = false;
  noteText.value = "";
}
function openOverlay() {
  note.style.opacity = 1;
  overlay.style.opacity = 1;
  overlay.classList.remove("hide");
  note.classList.remove("hide");
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
      const card = document.createElement("div");
      card.addEventListener("click", openNote);
      card.classList.add("card");
      card.innerHTML = `<i class="fa fa-trash remove" aria-hidden="true"></i>
      <p>${note}</p>`;
      cardsContainer.appendChild(card);
    });
  }
}

saveBt.addEventListener("click", saveChanges);

cancelBt.addEventListener("click", closeOverlay);
addBt.addEventListener("click", openOverlay);

cards.forEach((card) => card.addEventListener("click", openNote));

loadFromStorage();

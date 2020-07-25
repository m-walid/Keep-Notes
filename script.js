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
    cardDragEventsHandler(card);
    card.classList.add("card");
    card.setAttribute("draggable", "true");
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
      cardDragEventsHandler(card);
      card.classList.add("card");
      card.setAttribute("draggable", "true");
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
cards.forEach((card) => {
  cardDragEventsHandler(card);
});

function cardDragEventsHandler(card) {
  card.addEventListener("dragstart", () => dragStart(card));
  card.addEventListener("dragend", () => dragEnd(card));
  card.addEventListener("dragover", (e) => dragOver(e, card));
  // card.addEventListener("touchstart", () => dragStart(card));
  // card.addEventListener("touchend", () => dragEnd(card));
  // card.addEventListener("touchmove", (e) => dragOver(e, card));
}

// cardsContainer.addEventListener('dragover', e =>{
//   e.preventDefault();
//   const draggable = document.querySelector('.dragging');
//   const cardAfter = getClosestCard(e.clientX,e.clientY);
//   if(typeof cardAfter.elm != 'undefined'){
//     cardsContainer.insertBefore(draggable,cardAfter.elm);
//   }
//   else{
//     cardsContainer.appendChild(draggable);
//   }

// });

// function getClosestCard(x,y){

//   const cards = document.querySelectorAll('.card');
//   let closest = {x: Number.NEGATIVE_INFINITY, y: Number.POSITIVE_INFINITY};
//   for(card of cards){
//      const boundries = card.getBoundingClientRect();
//      const offset = {x: x - boundries.left - boundries.width / 2 ,  y: Math.abs(y - boundries.top - boundries.height / 2) };
//      if(offset.x < 0 && offset.y < closest.y && offset.x >= closest.x){
//        closest = {offset : offset , elm:card};
//      }
//   }
//   console.log(closest.offset)
//   return closest
// }

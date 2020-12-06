// <⚠️ DONT DELETE THIS ⚠️>
import "./styles.css";
// <⚠️ /DONT DELETE THIS ⚠️>

const PEND_LS = "PENDING";
const FIN_LS = "FINISHED";
const toDoForm = document.querySelector(".js-toDoForm"),
  toDoInput = toDoForm.querySelector("input"),
  pendingList = document.querySelector(".PENDING"),
  finishedList = document.querySelector(".FINISHED");

let idNum = 1;
let pendings = [];
let finished = [];

function saveToDos(pOrF) {
  if (pOrF === PEND_LS) {
    localStorage.setItem(PEND_LS, JSON.stringify(pendings));
  } else if (pOrF === FIN_LS) {
    localStorage.setItem(FIN_LS, JSON.stringify(finished));
  }
}

function paintToDo(pOrF, text) {
  console.log(pOrF);
  const li = document.createElement("li");
  const delBtn = document.createElement("button");
  const changeBtn = document.createElement("button");
  delBtn.innerText = "❌";
  if (pOrF === PEND_LS) {
    changeBtn.innerText = "✅";
  } else if (pOrF === FIN_LS) {
    changeBtn.innerText = "⏩";
  }

  delBtn.addEventListener("click", (event) => deleteToDo(pOrF));
  changeBtn.addEventListener("click", (event) => changeTo(pOrF));
  const span = document.createElement("span");
  const Id = idNum;
  span.innerText = text;
  li.appendChild(span);
  li.appendChild(delBtn);
  li.appendChild(changeBtn);
  li.id = Id;
  const toDoObj = {
    text: text,
    id: Id
  };
  if (pOrF === PEND_LS) {
    pendingList.appendChild(li);
    pendings.push(toDoObj);
  } else if (pOrF === FIN_LS) {
    finishedList.appendChild(li);
    finished.push(toDoObj);
  }

  saveToDos(pOrF);
  idNum++;
}

function pSomething(toDo) {
  paintToDo(PEND_LS, toDo.text);
}

function fSomething(toDo) {
  paintToDo(FIN_LS, toDo.text);
}

function loadToDos() {
  const loadedPendings = localStorage.getItem(PEND_LS),
    loadedFinished = localStorage.getItem(FIN_LS);

  if (loadedPendings !== null || loadedFinished !== null) {
    const parsedPendings = JSON.parse(loadedPendings),
      parsedFinished = JSON.parse(loadedFinished);

    parsedPendings.forEach(pSomething);
    parsedFinished.forEach(fSomething);
  }
}
function handleSubmit(event) {
  event.preventDefault();
  const inputValue = toDoInput.value;
  paintToDo(PEND_LS, inputValue);
  toDoInput.value = "";
}
function init() {
  loadToDos();
  toDoForm.addEventListener("submit", handleSubmit);
}

function deleteToDo(pOrF) {
  const btn = event.target,
    li = btn.parentNode,
    ul = li.parentNode;
  if (ul.getAttribute("class") === PEND_LS) {
    pendingList.removeChild(li);
    const cleanPendings = pendings.filter(function (pending) {
      return pending.id !== parseInt(li.id);
    });
    pendings = cleanPendings;
    saveToDos(PEND_LS);
  } else if (ul.getAttribute("class") === FIN_LS) {
    finishedList.removeChild(li);
    const cleanFinished = finished.filter(function (finishing) {
      return finishing.id !== parseInt(li.id);
    });
    finished = cleanFinished;
    saveToDos(FIN_LS);
  }
}

function changeTo(pOrF) {
  const btn = event.target,
    li = btn.parentNode,
    ul = li.parentNode,
    liId = parseInt(li.id);

  if (ul.getAttribute("class") === PEND_LS) {
    btn.innerText = "⏩";

    if (pendingList.length > 0) {
      pendingList.removeChild(li);
    }
    finishedList.appendChild(li);

    const popPending = pendings.find(function (n) {
      return n.id === liId;
    });
    const cleanPendings = pendings.filter(function (pending) {
      return pending.id !== liId;
    });
    pendings = cleanPendings;
    saveToDos(PEND_LS);
    const newObj = {
      id: liId,
      text: popPending.text
    };
    finished.push(newObj);
    saveToDos(FIN_LS);
  } else if (ul.getAttribute("class") === FIN_LS) {
    btn.innerText = "✅";
    if (pendingList.length > 0) {
      pendingList.removeChild(li);
    }
    pendingList.appendChild(li);

    const popFinished = finished.find(function (n) {
      return n.id === liId;
    });
    const cleanFinished = finished.filter(function (pending) {
      return pending.id !== liId;
    });
    finished = cleanFinished;
    saveToDos(FIN_LS);
    const newObj = {
      id: liId,
      text: popFinished.text
    };
    pendings.push(newObj);
    saveToDos(PEND_LS);
  }
}

init();

const books = [];
const RENDER_EVENT = "render-book";

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    //penambahan storage
    loadDataFromStorage();
  }
});

// function Add Book
function addBook() {
  const title = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const year = document.getElementById("inputBookYear").value;
  const isComplete = document.getElementById("inputBookIsComplete").checked;

  const id = generatedID();
  const bookObjek = generateObject(id, title, author, year, isComplete, false);

  books.push(bookObjek);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// function Generated ID
function generatedID() {
  return +new Date();
}

// Function Generated Objek
function generateObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year: parseInt(year),
    isComplete,
  };
}

document.addEventListener(RENDER_EVENT, function () {
  console.log(books);
});

// Function Make Book
function makeBook(bookObjek) {
  const textTitle = document.createElement("h3");
  textTitle.innerText = bookObjek.title;
  textTitle.style.color = "black";

  const textAuthor = document.createElement("p");
  textAuthor.innerText = `Penulis :${bookObjek.author}`;

  const textYear = document.createElement("p");
  textYear.innerText = `Tahun : ${bookObjek.year}`;

  const textContainer = document.createElement("article");
  textContainer.classList.add("book_item");
  textContainer.append(textTitle, textAuthor, textYear);
  textContainer.setAttribute("id", `${bookObjek.id}`);

  const container = document.createElement("div");
  container.classList.add("item", "shadow");
  container.append(textContainer);
  container.setAttribute("id", `todo-${bookObjek.id}`);

  if (bookObjek.isComplete) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("green");
    undoButton.innerText = "Belum Selesai";

    undoButton.addEventListener("click", function () {
      undoTaskCompleted(bookObjek.id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("Red");
    trashButton.innerText = "Hapus";

    trashButton.addEventListener("click", function () {
      removeCompleted(bookObjek.id);
    });

    const action = document.createElement("div");
    action.classList.add("action");
    action.append(undoButton, trashButton);

    container.append(action);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("green");
    checkButton.innerText = "Selesai Dibaca";

    checkButton.addEventListener("click", function () {
      addTaskCompleted(bookObjek.id);
    });

    const hapusButton = document.createElement("button");
    hapusButton.classList.add("Red");
    hapusButton.innerText = "Hapus";

    hapusButton.addEventListener("click", function () {
      removeCompleted(bookObjek.id);
    });

    const action = document.createElement("div");
    action.classList.add("action");
    action.append(checkButton, hapusButton);
    container.append(action);
  }
  return container;
}

// Menampilkan Data Buku
document.addEventListener(RENDER_EVENT, function () {
  const unCompleted = document.getElementById("incompleteBookshelfList");
  unCompleted.innerHTML = "";

  const completed = document.getElementById("completeBookshelfList");
  completed.innerHTML = "";

  for (const bookItem of books) {
    const bookElements = makeBook(bookItem);
    if (!bookItem.isComplete) {
      unCompleted.append(bookElements);
    } else {
      completed.append(bookElements);
    }
  }
});

// Function Add Task Complate
function addTaskCompleted(bookId) {
  const bookTarget = fintBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// function Find Book
function fintBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

// Function Hapus
function removeCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (window.confirm("Apakah Kamu Yakin Ingin Menghapus Buku Ini")) {
    if (bookTarget === -1) return;
    books.splice(bookTarget, 1);

    document.dispatchEvent(new Event(RENDER_EVENT));
    alert("Buku Berhasil Di Hapus");
    saveData();
  } else {
    alert("Buku Batal Di Hapus");
  }
}

//Function Batal
function undoTaskCompleted(bookId) {
  const bookTarget = fintBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// Function Find Book Index
function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }

  return -1;
}

//searching
document.getElementById("searchSubmit").addEventListener("click", function (e) {
  e.preventDefault();
  const cariBuku = document
    .getElementById("searchBookTitle")
    .value.toLowerCase();
  const listBuku = document.querySelectorAll(".book_item > h3");

  for (dataBuku of listBuku) {
    if (dataBuku.innerText.toLowerCase().includes(cariBuku)) {
      dataBuku.parentElement.parentElement.style.display = "block";
    } else {
      dataBuku.parentElement.parentElement.style.display = "none";
    }
  }
});

// Function Save DAta ke Local Store
function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOK";

function isStorageExist() /* boolean */ {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

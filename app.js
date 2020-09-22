//Book constructor
function Book(title, author, isbn) {
  this.title = title;
  this.author = author;
  this.isbn = isbn;
}

//UI constructor
function UI() {}

//Storage constructor
function Storage() {}

//Get book from Local Storage
Storage.prototype.getBooks = function () {
  let books;
  if (localStorage.getItem('books') == null) {
    books = [];
  } else {
    books = JSON.parse(localStorage.getItem('books'));
  }

  return books;
};

//Add book to Local Storage
Storage.prototype.addBook = function (book) {
  const store = new Storage();

  const books = store.getBooks();
  books.push(book);
  localStorage.setItem('books', JSON.stringify(books));
};

//Display LS books to UI
Storage.prototype.displayBooks = function () {
  const store = new Storage();
  const books = store.getBooks();
  books.forEach((book) => {
    const ui = new UI();
    ui.addBookToList(book);
  });
};

//Delete book from LS
Storage.prototype.deleteBook = function (isbn) {
  const store = new Storage();
  const books = store.getBooks();
  books.forEach(function (book, index) {
    if (book.isbn === isbn) {
      books.splice(index, 1);
    }
  });

  localStorage.setItem('books', JSON.stringify(books));
};

//Add book to list
UI.prototype.addBookToList = function (book) {
  const list = document.getElementById('book-list');

  //Create tr element
  const row = document.createElement('tr');

  row.innerHTML = `
  <td>${book.title}</td>
  <td>${book.author}</td>
  <td>${book.isbn}</td>
  <td><a href="#" class="delete">X</a></td>
  `;

  list.appendChild(row);
};

//Show alert
UI.prototype.showAlert = function (message, className) {
  //Create div
  const div = document.createElement('div');
  //Add classes
  div.className = `alert ${className}`;
  //Add text
  div.appendChild(document.createTextNode(message));
  //Get parent
  const container = document.querySelector('.container');

  //Get form
  const form = document.querySelector('#book-form');

  //Insert Alert
  container.insertBefore(div, form);

  //Timeout after 3 seconds
  setTimeout(function () {
    document.querySelector('.alert').remove();
  }, 3000);
};

//Delete book
UI.prototype.deleteBook = function (target) {
  if (target.className === 'delete') {
    target.parentElement.parentElement.remove();
  }
};

//Clear fields
UI.prototype.clearFields = function () {
  document.getElementById('title').value = '';
  document.getElementById('author').value = '';
  document.getElementById('isbn').value = '';
};

//Event Listeners
//Event Listener to add book
document.getElementById('book-form').addEventListener('submit', function (e) {
  console.log('test');

  //Get form values
  const title = document.getElementById('title').value,
    author = document.getElementById('author').value,
    isbn = document.getElementById('isbn').value;
  console.log(title, author, isbn);

  //Instantiate Book object
  const book = new Book(title, author, isbn);

  //Instantiate UI
  const ui = new UI();

  const store = new Storage();

  //Validate
  if (title === '' || author === '' || isbn === '') {
    //Error alert
    ui.showAlert('Please fill in all firelds', 'error');
  } else {
    //Add book list
    ui.addBookToList(book);

    //Add book to Ls
    store.addBook(book);

    //Show success
    ui.showAlert('Book Added', 'success');

    //clear fields
    ui.clearFields();
  }

  console.log(ui);
  e.preventDefault();
});

//Event listener for delete
document.getElementById('book-list').addEventListener('click', function (e) {
  const ui = new UI();
  const store = new Storage();

  ui.deleteBook(e.target);

  //Remove book from LS
  store.deleteBook(e.target.parentElement.previousElementSibling.textContent);

  //Show alert
  ui.showAlert('Book removed', 'success');
  e.preventDefault();
});

//Event Listener for add book to LS
const store = new Storage();
document.addEventListener('DOMContentLoaded', store.displayBooks);

//Delete from LS

class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {
  constructor() {}
  addBookToList(book) {
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
  }

  showAlert(message, className) {
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
  }

  //Delete book
  deleteBook(target) {
    if (target.className === 'delete') {
      target.parentElement.parentElement.remove();
    }
  }

  //Clear fields
  clearFields() {
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('isbn').value = '';
  }
}

//Local storage class
class Store {
  //Get books from DB
  static getBooks() {
    let books;
    if (localStorage.getItem('books') == null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }
    return books;
  }

  //Display book method
  static displayBooks() {
    const books = Store.getBooks();
    books.forEach(function (book) {
      const ui = new UI();

      //Add book to list
      ui.addBookToList(book);
    });
  }

  //Add book to DB
  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }
  static removeBook(isbn) {
    const books = Store.getBooks();
    books.forEach(function (book, index) {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem('books', JSON.stringify(books));
  }
}

//DOM Load Event, display from DB
document.addEventListener('DOMContentLoaded', Store.displayBooks);

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

  //Validate
  if (title === '' || author === '' || isbn === '') {
    //Error alert
    ui.showAlert('Please fill in all firelds', 'error');
  } else {
    //Add book list
    ui.addBookToList(book);

    //Add book to Local storage
    Store.addBook(book);

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

  //Delete book
  ui.deleteBook(e.target);

  //Remove from Local Storage
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  //Show alert
  ui.showAlert('Book removed', 'success');
  e.preventDefault();
});

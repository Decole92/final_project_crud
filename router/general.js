const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const DoesUserExists = (username) => {
  let usersCheck = users.filter((user) => {
    return user.username === username;
  });
  const check = usersCheck.length > 0 ? true : false;
  return check;
};

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (isValid(username)) {
      if (!DoesUserExists(username)) {
        users.push({ ...users, username: username, password: password });
        return res.status(200).json({
          message: "user " + username + " successfully registered...",
        });
      } else {
        return res.status(303).json({ message: "User Already Exists." });
      }
    }
  }
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  return res.send(books);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const getBook = books[isbn];
  return res.status(200).json({ details: getBook });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  const author = req.params.author.trim().toLowerCase();
  const matchingBooks = [];
  for (const key in books) {
    if (books.hasOwnProperty(key)) {
      const bookAuthor = books[key].author.trim().toLowerCase();
      if (bookAuthor === author) {
        matchingBooks.push(books[key]);
      }
    }
  }

  if (matchingBooks.length === 0) {
    res.json({ error: "No books found for the provided author." });
  } else {
    res.json(matchingBooks);
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  const title = req.params.title.trim().toLowerCase();
  const matchingBook = [];

  for (const key in books) {
    if (books.hasOwnProperty(key)) {
      const bookTitle = books[key].title.trim().toLowerCase();
      if (bookTitle === title) {
        matchingBook.push(books[key]);
      }
    }
  }

  if (matchingBook.length === 0) {
    res.json({ error: "No books found for the provided author." });
  } else {
    res.json(matchingBook);
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const reviews = books[isbn].reviews;
  return res.status(200).json({ reviews });
});

module.exports.general = public_users;

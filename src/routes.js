const {
  addBooksHandler,
  getAllBooks,
  getBooksDetail,
  editBooksDetail,
  deleteBooks,
} = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: (addBooksHandler),
  },
  {
    method: 'GET',
    path: '/books',
    handler: (getAllBooks),
  },
  {
    method: 'GET',
    path: '/books/{id}',
    handler: (getBooksDetail),
  },
  {
    method: 'PUT',
    path: '/books/{id}',
    handler: (editBooksDetail),
  },
  {
    method: 'DELETE',
    path: '/books/{id}',
    handler: (deleteBooks),
  },
];

module.exports = routes;

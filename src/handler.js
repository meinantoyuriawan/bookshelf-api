const { nanoid } = require('nanoid');

const shelf = require('./shelf');

const addBooksHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  // validasi
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  } if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;
  const newShelf = {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    id,
    insertedAt,
    updatedAt,
    finished,
  };

  shelf.push(newShelf);

  const isSuccess = shelf.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBooks = (request, h) => {
  const { reading, finished } = request.query;

  if (reading !== undefined) {
    const bookByQuery = shelf.filter((n) => n.reading === (reading === '1'));
    const listBook = bookByQuery.map((bookData) => ({
      id: bookData.id,
      name: bookData.name,
      publisher: bookData.publisher,
    }));
    const response = h.response({
      status: 'success',
      data: {
        books: listBook,
      },
    });
    response.code(200);
    return response;
  }

  if (finished !== undefined) {
    const bookByQuery = shelf.filter((n) => n.finished === (finished === '1'));
    const listBook = bookByQuery.map((bookData) => ({
      id: bookData.id,
      name: bookData.name,
      publisher: bookData.publisher,
    }));
    const response = h.response({
      status: 'success',
      data: {
        books: listBook,
      },
    });
    response.code(200);
    return response;
  }

  const listBook = shelf.map((bookData) => ({
    id: bookData.id,
    name: bookData.name,
    publisher: bookData.publisher,
  }));

  const response = h.response({
    status: 'success',
    data: {
      books: listBook,
    },
  });
  response.code(200);
  return response;
};

const getBooksDetail = (request, h) => {
  const { id } = request.params;
  // to get the object
  const book = shelf.filter((n) => n.id === id)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBooksDetail = (request, h) => {
  const { id } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  // validasi
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  } if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }
  const finished = pageCount === readPage;
  const updatedAt = new Date().toISOString();
  const index = shelf.findIndex((book) => book.id === id);

  if (index !== -1) {
    shelf[index] = {
      ...shelf[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
      finished,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBooks = (request, h) => {
  const { id } = request.params;

  const index = shelf.findIndex((book) => book.id === id);
  if (index !== -1) {
    shelf.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBooksHandler,
  getAllBooks,
  getBooksDetail,
  editBooksDetail,
  deleteBooks,
};

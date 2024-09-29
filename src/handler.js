const { nanoid } = require('nanoid');
const notes = require('./notes');

const addNoteHandler = (request, h) => {
  const { title, tags, body } = request.payload;

  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const newNote = {
    title,
    tags,
    body,
    id,
    createdAt,
    updatedAt,
  };

  notes.push(newNote);

  // Check if newNote has successfully been saved
  const isSuccess = notes.filter((note) => note.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        noteId: id,
      },
    }).code(201);

    return response;
  }

  // If newNote has failed to be saved
  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal ditambahkan',
  }).code(500);
  return response;
};

const getAllNotesHandler = () => ({
  status: 'success',
  data: {
    notes,
  },
});

const getNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const note = notes.filter((n) => n.id === id)[0];

  // If 'note' is underfined (empty), return 404 not found
  if (!note) {
    const response = h.response({
      status: 'fail',
      message: 'Catatan tidak ditemukan',
    }).code(404);

    return response;
  }

  const response = h.response({
    status: 'success',
    data: {
      note,
    },
  }).code(200);

  return response;
};

const editNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const { title, tags, body } = request.payload;
  const updatedAt = new Date().toISOString();

  // Find the index of the targeted note ID
  const index = notes.findIndex((note) => note.id === id);

  // If index is -1 (not found), return 404
  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui catatan. ID tidak ditemukan',
    }).code(404);

    return response;
  }

  // Update the note if the index is found
  notes[index] = {
    ...notes[index],
    title,
    tags,
    body,
    updatedAt,
  };

  const response = h.response({
    status: 'success',
    message: 'Catatan berhasil diperbarui',
  }).code(200);

  return response;
};

const deleteNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  // Find the index of the targeted note ID
  const index = notes.findIndex((note) => note.id === id);

  // If index is -1 (not found), return 404
  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Catatan gagal dihapus. ID tidak ditemukan',
    }).code(404);

    return response;
  }

  // Delete the note if the index is found
  notes.splice(index, 1);

  const response = h.response({
    status: 'success',
    message: 'Catatan berhasil dihapus',
  }).code(200);

  return response;
};

module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  editNoteByIdHandler,
  deleteNoteByIdHandler,
};
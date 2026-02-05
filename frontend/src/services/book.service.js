import api from "@/lib/api";

// Get all books
export const getAllBooks = async () => {
  const res = await api.get("/api/book");
  return res.data;
};

// Search books
export const searchBooks = async (query) => {
  const res = await api.get(`/api/book/search?q=${query}`);
  return res.data;
};

// Create book
export const createBook = async (data) => {
  const res = await api.post("/api/book/add", data);
  return res.data;
};

// Update quantity
export const updateBookQty = async (id, qty) => {
  const res = await api.put(`/api/book/update/${id}`, { qty });
  return res.data;
};

// Delete book
export const deleteBook = async (id) => {
  const res = await api.delete(`/api/book/remove/${id}`);
  return res.data;
};

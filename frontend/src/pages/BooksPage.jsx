import React, { useEffect, useState } from "react";
import BookList from "../components/books/BookList";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Search } from "lucide-react";
import { toast } from "../components/ui/sonner";
import { getAllBooks, searchBooks } from "@/services/book.service";

const BooksPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [books, setBooks] = useState([]);

  // Load books initially
  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const data = await getAllBooks();
      setBooks(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load books");
    }
  };

  // Search books
  const handleSearch = async () => {
    if (!searchQuery.trim()) return loadBooks();

    try {
      const data = await searchBooks(searchQuery);
      setBooks(data);
    } catch (err) {
      toast.error("Search failed");
    }
  };

  const handleAddToCart = (book) => {
    toast.success(`${book.title} added to cart!`);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Browse Books</h1>

        <div className="flex gap-4 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Button onClick={handleSearch}>Search</Button>
        </div>
      </div>

      <BookList books={books} onAddToCart={handleAddToCart} />
    </div>
  );
};

export default BooksPage;

import DataLoader from "dataloader";
import { authorsById, booksById, type AuthorData, type BookData } from "./mockData";

/**
 * DataLoaders solve the N+1 query problem and redundant data issues.
 * 
 * Benefits:
 * 1. Batch multiple requests for the same resource into a single batch
 * 2. Cache results within a single request, preventing redundant fetches
 * 3. Automatically deduplicate requests for the same ID
 */

/**
 * Creates a DataLoader for authors
 * This batches and caches author lookups, solving:
 * - N+1 queries when fetching authors for multiple books
 * - Redundant data fetching when the same author appears in multiple books
 */
export function createAuthorLoader() {
  return new DataLoader<string, AuthorData | null>(async (authorIds) => {
    // In a real app, this would batch database queries
    // Here we simulate batching by fetching all requested authors at once
    return authorIds.map((id) => authorsById.get(id) || null);
  });
}

/**
 * Creates a DataLoader for books
 */
export function createBookLoader() {
  return new DataLoader<string, BookData | null>(async (bookIds) => {
    return bookIds.map((id) => booksById.get(id) || null);
  });
}

/**
 * Creates a DataLoader for books by author ID
 * This efficiently fetches all books for a set of authors
 */
export function createBooksByAuthorLoader() {
  return new DataLoader<string, BookData[]>(async (authorIds) => {
    // In a real app, this would be a single query: SELECT * FROM books WHERE author_id IN (...)
    const booksByAuthor = authorIds.map((authorId) => {
      const author = authorsById.get(authorId);
      if (!author) return [];
      return author.bookIds
        .map((bookId) => booksById.get(bookId))
        .filter((book): book is BookData => book !== undefined);
    });
    return booksByAuthor;
  });
}

/**
 * Creates a DataLoader for authors by book ID
 * This efficiently fetches all authors for a set of books
 */
export function createAuthorsByBookLoader() {
  return new DataLoader<string, AuthorData[]>(async (bookIds) => {
    // In a real app, this would be a single query with a JOIN
    const authorsByBook = bookIds.map((bookId) => {
      const book = booksById.get(bookId);
      if (!book) return [];
      return book.authorIds
        .map((authorId) => authorsById.get(authorId))
        .filter((author): author is AuthorData => author !== undefined);
    });
    return authorsByBook;
  });
}


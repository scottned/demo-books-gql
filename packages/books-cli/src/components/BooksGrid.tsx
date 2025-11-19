import React from "react";
import { useQuery, gql } from "@apollo/client";

const GET_BOOKS = gql`
  query GetBooks {
    books {
      id
      title
      isbn
      publishedYear
      authors {
        id
        name
      }
    }
  }
`;

interface Author {
  id: string;
  name: string;
}

interface Book {
  id: string;
  title: string;
  isbn?: string;
  publishedYear?: number;
  authors: Author[];
}

interface BooksData {
  books: Book[];
}

function BooksGrid() {
  const { loading, error, data } = useQuery<BooksData>(GET_BOOKS);

  if (loading)
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-lg text-gray-600">Loading books...</div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-lg text-red-600">Error: {error.message}</div>
      </div>
    );

  const books = data?.books || [];

  return (
    <div className="flex flex-wrap gap-6">
      {books.map((book) => (
        <div
          key={book.id}
          className="bg-white rounded-lg shadow-md p-6 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {book.title}
          </h2>
          {book.publishedYear && (
            <p className="text-sm text-gray-600 mb-2">
              Published: {book.publishedYear}
            </p>
          )}
          {book.isbn && (
            <p className="text-xs text-gray-500 mb-3">ISBN: {book.isbn}</p>
          )}
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-1">Authors:</p>
            <div className="flex flex-wrap gap-2">
              {book.authors.map((author) => (
                <span
                  key={author.id}
                  className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
                >
                  {author.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default BooksGrid;

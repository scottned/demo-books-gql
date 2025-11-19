import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";

const GET_BOOKS_PAGINATED = gql`
  query GetBooksPaginated($pagination: PaginationArgs) {
    booksPaginated(pagination: $pagination) {
      edges {
        node {
          id
          title
          isbn
          publishedYear
          authors {
            id
            name
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
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

interface BookEdge {
  node: Book;
  cursor: string;
}

interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
}

interface BooksPaginatedData {
  booksPaginated: {
    edges: BookEdge[];
    pageInfo: PageInfo;
  };
}

function BooksGridPaginated() {
  const [cursorHistory, setCursorHistory] = useState<string[]>([]);
  const pageSize = 9;

  // Current cursor is the last one in history, or null for first page
  const currentCursor =
    cursorHistory.length > 0 ? cursorHistory[cursorHistory.length - 1] : null;

  const { loading, error, data } = useQuery<BooksPaginatedData>(
    GET_BOOKS_PAGINATED,
    {
      variables: {
        pagination: {
          first: pageSize,
          after: currentCursor,
        },
      },
    }
  );

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

  const books = data?.booksPaginated.edges.map((edge) => edge.node) || [];
  const pageInfo = data?.booksPaginated.pageInfo;

  const handleNext = () => {
    if (pageInfo?.hasNextPage && pageInfo.endCursor) {
      setCursorHistory([...cursorHistory, pageInfo.endCursor]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    if (cursorHistory.length > 0) {
      const newHistory = cursorHistory.slice(0, -1);
      setCursorHistory(newHistory);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFirst = () => {
    setCursorHistory([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <div className="flex flex-wrap gap-6 mb-8">
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

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          onClick={handleFirst}
          disabled={cursorHistory.length === 0}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          First
        </button>
        <button
          onClick={handlePrevious}
          disabled={cursorHistory.length === 0}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        <span className="text-sm text-gray-600">
          Page {cursorHistory.length + 1}
        </span>
        <button
          onClick={handleNext}
          disabled={!pageInfo?.hasNextPage}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default BooksGridPaginated;

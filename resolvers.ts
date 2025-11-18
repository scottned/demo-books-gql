import { books, authors, booksById, authorsById } from "./mockData";
import {
  createAuthorLoader,
  createBookLoader,
  createAuthorsByBookLoader,
  createBooksByAuthorLoader,
} from "./dataloaders";
import { paginate, type PaginationArgs } from "./pagination";
import type { GraphQLContext } from "./context";

export const resolvers = {
  Query: {
    /**
     * Simple query - demonstrates redundant data problem
     * When multiple books share authors, the response contains duplicate author data
     */
    books: () => books,

    /**
     * Paginated books query - solves pagination control issues
     */
    booksPaginated: (_: unknown, args: { pagination?: PaginationArgs }) => {
      const paginationArgs = args.pagination || {};
      return paginate(books, paginationArgs);
    },

    book: (_: unknown, args: { id: string }, context: GraphQLContext) => {
      return booksById.get(args.id) || null;
    },

    authors: () => authors,

    author: (_: unknown, args: { id: string }, context: GraphQLContext) => {
      return authorsById.get(args.id) || null;
    },
  },

  Book: {
    /**
     * Resolve authors for a book using DataLoader
     * This solves:
     * - N+1 queries: All author lookups are batched
     * - Redundant data: Same author fetched multiple times is cached
     */
    authors: async (
      book: { id: string },
      _: unknown,
      context: GraphQLContext
    ) => {
      // Use DataLoader to batch and cache author lookups
      const authors = await context.loaders.authorsByBook.load(book.id);
      return authors;
    },
  },

  Author: {
    /**
     * Resolve books for an author using DataLoader
     * This solves N+1 queries when fetching books for multiple authors
     */
    books: async (
      author: { id: string },
      _: unknown,
      context: GraphQLContext
    ) => {
      // Use DataLoader to batch and cache book lookups
      const authorBooks = await context.loaders.booksByAuthor.load(author.id);
      return authorBooks;
    },
  },

  BookConnection: {
    edges: (connection: ReturnType<typeof paginate>) => connection.edges,
    pageInfo: (connection: ReturnType<typeof paginate>) => connection.pageInfo,
  },

  BookEdge: {
    node: (edge: { node: unknown }) => edge.node,
    cursor: (edge: { cursor: string }) => edge.cursor,
  },
};

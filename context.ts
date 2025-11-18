import {
  createAuthorLoader,
  createBookLoader,
  createAuthorsByBookLoader,
  createBooksByAuthorLoader,
} from "./dataloaders";

/**
 * GraphQL context that includes DataLoaders
 * DataLoaders are created per request to ensure proper caching and batching
 */
export interface GraphQLContext {
  loaders: {
    author: ReturnType<typeof createAuthorLoader>;
    book: ReturnType<typeof createBookLoader>;
    authorsByBook: ReturnType<typeof createAuthorsByBookLoader>;
    booksByAuthor: ReturnType<typeof createBooksByAuthorLoader>;
  };
}

/**
 * Creates a new context for each GraphQL request
 * This ensures DataLoaders are fresh for each request (proper caching scope)
 */
export function createContext(): GraphQLContext {
  return {
    loaders: {
      author: createAuthorLoader(),
      book: createBookLoader(),
      authorsByBook: createAuthorsByBookLoader(),
      booksByAuthor: createBooksByAuthorLoader(),
    },
  };
}

import { gql } from "graphql-tag";

export const typeDefs = gql`
  """
  Represents an author of books
  """
  type Author {
    id: ID!
    name: String!
    bio: String
    books: [Book!]!
  }

  """
  Represents a book
  """
  type Book {
    id: ID!
    title: String!
    isbn: String
    publishedYear: Int
    authors: [Author!]!
  }

  """
  Pagination information for cursor-based pagination
  """
  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
    endCursor: String
  }

  """
  A connection for paginated books
  """
  type BookConnection {
    edges: [BookEdge!]!
    pageInfo: PageInfo!
  }

  """
  An edge in a book connection
  """
  type BookEdge {
    node: Book!
    cursor: String!
  }

  """
  A connection for paginated authors (nested pagination)
  """
  type AuthorConnection {
    edges: [AuthorEdge!]!
    pageInfo: PageInfo!
  }

  """
  An edge in an author connection
  """
  type AuthorEdge {
    node: Author!
    cursor: String!
  }

  """
  Pagination arguments for cursor-based pagination
  """
  input PaginationArgs {
    first: Int
    after: String
    last: Int
    before: String
  }

  type Query {
    """
    Get all books (simple query - demonstrates redundant data problem)
    """
    books: [Book!]!

    """
    Get paginated books with cursor-based pagination
    Solves: Pagination control and nested pagination issues
    """
    booksPaginated(pagination: PaginationArgs): BookConnection!

    """
    Get a single book by ID
    """
    book(id: ID!): Book

    """
    Get all authors
    """
    authors: [Author!]!

    """
    Get a single author by ID
    """
    author(id: ID!): Author
  }
`;

/**
 * Mock data for Books and Authors
 * 
 * Designed to demonstrate:
 * - Multiple books sharing the same authors (redundant data problem)
 * - Books with varying numbers of authors (pagination problem)
 * - Deep nesting scenarios
 */

export interface AuthorData {
  id: string;
  name: string;
  bio?: string;
  bookIds: string[]; // Books this author wrote
}

export interface BookData {
  id: string;
  title: string;
  isbn?: string;
  publishedYear?: number;
  authorIds: string[]; // Authors of this book
}

// Create authors first
export const authors: AuthorData[] = [
  {
    id: "author-1",
    name: "J.K. Rowling",
    bio: "British author, best known for the Harry Potter series",
    bookIds: ["book-1", "book-2", "book-3"],
  },
  {
    id: "author-2",
    name: "George R.R. Martin",
    bio: "American novelist and short story writer",
    bookIds: ["book-4", "book-5"],
  },
  {
    id: "author-3",
    name: "J.R.R. Tolkien",
    bio: "English writer and philologist",
    bookIds: ["book-6", "book-7", "book-8"],
  },
  {
    id: "author-4",
    name: "Stephen King",
    bio: "American author of horror, supernatural fiction, suspense, and fantasy novels",
    bookIds: ["book-9", "book-10", "book-11", "book-12"],
  },
  {
    id: "author-5",
    name: "Agatha Christie",
    bio: "English writer known for her detective novels",
    bookIds: ["book-13", "book-14"],
  },
  {
    id: "author-6",
    name: "Isaac Asimov",
    bio: "American writer and professor of biochemistry",
    bookIds: ["book-15"],
  },
  {
    id: "author-7",
    name: "Margaret Atwood",
    bio: "Canadian poet, novelist, and literary critic",
    bookIds: ["book-16"],
  },
  {
    id: "author-8",
    name: "Neil Gaiman",
    bio: "English author of short fiction, novels, comic books, and graphic novels",
    bookIds: ["book-17", "book-18"],
  },
  {
    id: "author-9",
    name: "Terry Pratchett",
    bio: "English humorist, satirist, and author of fantasy novels",
    bookIds: ["book-17"], // Co-author with Neil Gaiman
  },
  {
    id: "author-10",
    name: "Brandon Sanderson",
    bio: "American fantasy and science fiction writer",
    bookIds: ["book-19", "book-20", "book-21", "book-22", "book-23", "book-24"],
  },
];

// Create books with relationships
export const books: BookData[] = [
  {
    id: "book-1",
    title: "Harry Potter and the Philosopher's Stone",
    isbn: "978-0747532699",
    publishedYear: 1997,
    authorIds: ["author-1"],
  },
  {
    id: "book-2",
    title: "Harry Potter and the Chamber of Secrets",
    isbn: "978-0747538496",
    publishedYear: 1998,
    authorIds: ["author-1"],
  },
  {
    id: "book-3",
    title: "Harry Potter and the Prisoner of Azkaban",
    isbn: "978-0747542155",
    publishedYear: 1999,
    authorIds: ["author-1"],
  },
  {
    id: "book-4",
    title: "A Game of Thrones",
    isbn: "978-0553103540",
    publishedYear: 1996,
    authorIds: ["author-2"],
  },
  {
    id: "book-5",
    title: "A Clash of Kings",
    isbn: "978-0553108033",
    publishedYear: 1998,
    authorIds: ["author-2"],
  },
  {
    id: "book-6",
    title: "The Hobbit",
    isbn: "978-0547928227",
    publishedYear: 1937,
    authorIds: ["author-3"],
  },
  {
    id: "book-7",
    title: "The Fellowship of the Ring",
    isbn: "978-0547928210",
    publishedYear: 1954,
    authorIds: ["author-3"],
  },
  {
    id: "book-8",
    title: "The Two Towers",
    isbn: "978-0547928203",
    publishedYear: 1954,
    authorIds: ["author-3"],
  },
  {
    id: "book-9",
    title: "The Shining",
    isbn: "978-0307743657",
    publishedYear: 1977,
    authorIds: ["author-4"],
  },
  {
    id: "book-10",
    title: "It",
    isbn: "978-1501142970",
    publishedYear: 1986,
    authorIds: ["author-4"],
  },
  {
    id: "book-11",
    title: "The Stand",
    isbn: "978-0307743688",
    publishedYear: 1978,
    authorIds: ["author-4"],
  },
  {
    id: "book-12",
    title: "Carrie",
    isbn: "978-0307743664",
    publishedYear: 1974,
    authorIds: ["author-4"],
  },
  {
    id: "book-13",
    title: "Murder on the Orient Express",
    isbn: "978-0062693662",
    publishedYear: 1934,
    authorIds: ["author-5"],
  },
  {
    id: "book-14",
    title: "And Then There Were None",
    isbn: "978-0062073488",
    publishedYear: 1939,
    authorIds: ["author-5"],
  },
  {
    id: "book-15",
    title: "Foundation",
    isbn: "978-0553293357",
    publishedYear: 1951,
    authorIds: ["author-6"],
  },
  {
    id: "book-16",
    title: "The Handmaid's Tale",
    isbn: "978-0385490818",
    publishedYear: 1985,
    authorIds: ["author-7"],
  },
  {
    id: "book-17",
    title: "Good Omens",
    isbn: "978-0060853983",
    publishedYear: 1990,
    authorIds: ["author-8", "author-9"], // Co-authored book
  },
  {
    id: "book-18",
    title: "American Gods",
    isbn: "978-0060558123",
    publishedYear: 2001,
    authorIds: ["author-8"],
  },
  {
    id: "book-19",
    title: "The Way of Kings",
    isbn: "978-0765326355",
    publishedYear: 2010,
    authorIds: ["author-10"],
  },
  {
    id: "book-20",
    title: "Words of Radiance",
    isbn: "978-0765326362",
    publishedYear: 2014,
    authorIds: ["author-10"],
  },
  {
    id: "book-21",
    title: "Oathbringer",
    isbn: "978-0765326379",
    publishedYear: 2017,
    authorIds: ["author-10"],
  },
  {
    id: "book-22",
    title: "Rhythm of War",
    isbn: "978-0765326386",
    publishedYear: 2020,
    authorIds: ["author-10"],
  },
  {
    id: "book-23",
    title: "Mistborn: The Final Empire",
    isbn: "978-0765311788",
    publishedYear: 2006,
    authorIds: ["author-10"],
  },
  {
    id: "book-24",
    title: "The Well of Ascension",
    isbn: "978-0765316882",
    publishedYear: 2007,
    authorIds: ["author-10"],
  },
];

// Helper maps for quick lookups
export const booksById = new Map<string, BookData>(
  books.map((book) => [book.id, book])
);

export const authorsById = new Map<string, AuthorData>(
  authors.map((author) => [author.id, author])
);


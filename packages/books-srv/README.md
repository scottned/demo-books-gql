# graphql-srv

📚 GraphQL Demo - Book & Author Service

This service demonstrates solutions to common GraphQL problems:

1. Redundant Data Problem
    Query: { books { authors { name } } }
    Solution: DataLoader batches and caches author lookups

2. N+1 Query Problem
    Deep queries are optimized with DataLoader batching

3. Pagination Control
    Query: { booksPaginated(pagination: { first: 5 }) { edges { node { title } } pageInfo } }
    Solution: Cursor-based pagination with proper token handling

4. Nested Pagination
    Pagination tokens include parent context for proper resumption

Try these example queries:

# Simple query (shows redundant data in response, but backend is optimized)

```gql
query {
    books {
    title
    authors {
        name
    }
    }
}
```

# Paginated query

```gql
query {
    booksPaginated(pagination: { first: 5 }) {
    edges {
        node {
        title
        authors {
            name
        }
        }
        cursor
    }
    pageInfo {
        hasNextPage
        endCursor
    }
    }
}
```

# Paginated query with cursor

```gql
query {
    booksPaginated(pagination: { first: 3, after: "YOUR_CURSOR_HERE" }) {
    edges {
        node {
        title
        }
        cursor
    }
    pageInfo {
        hasNextPage
        endCursor
    }
    }
}
```

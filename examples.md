# Example GraphQL Queries

These examples demonstrate the solutions to common GraphQL problems.

## 1. Simple Query (Shows Redundant Data Problem)

```graphql
query SimpleBooksQuery {
  books {
    title
    authors {
      name
    }
  }
}
```

**Expected Behavior**: 
- Response contains duplicate author data (e.g., J.K. Rowling appears 3 times)
- Backend uses DataLoader to fetch each author only once per request
- Demonstrates that redundant response data doesn't mean redundant backend queries

## 2. Paginated Query (Solves Pagination Control)

```graphql
query PaginatedBooks {
  booksPaginated(pagination: { first: 5 }) {
    edges {
      node {
        title
        publishedYear
        authors {
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
```

**Benefits**:
- Controls response size at book level
- Provides cursors for efficient pagination
- `pageInfo` indicates if more data is available

## 3. Paginated Query with Cursor (Next Page)

```graphql
query NextPageBooks($cursor: String!) {
  booksPaginated(pagination: { 
    first: 5
    after: $cursor
  }) {
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

**Variables**:
```json
{
  "cursor": "eyJpZCI6ImJvb2stNSJ9"
}
```

**Benefits**:
- Efficient cursor-based pagination
- No offset-based pagination issues
- Proper resumption from any point

## 4. Deep Query (Demonstrates N+1 Solution)

```graphql
query DeepQuery {
  books {
    title
    authors {
      name
      bio
      books {
        title
        authors {
          name
        }
      }
    }
  }
}
```

**Expected Behavior**:
- DataLoader batches all author lookups
- DataLoader batches all book lookups  
- No N+1 query problem despite deep nesting
- Each unique author/book fetched only once

## 5. Single Book Query

```graphql
query SingleBook {
  book(id: "book-17") {
    title
    isbn
    publishedYear
    authors {
      name
      bio
    }
  }
}
```

**Expected Result**: Returns "Good Omens" by Neil Gaiman and Terry Pratchett

## 6. Single Author Query

```graphql
query SingleAuthor {
  author(id: "author-1") {
    name
    bio
    books {
      title
      publishedYear
    }
  }
}
```

**Expected Result**: Returns J.K. Rowling with all her books

## 7. Backward Pagination

```graphql
query PreviousPageBooks($cursor: String!) {
  booksPaginated(pagination: { 
    last: 5
    before: $cursor
  }) {
    edges {
      node {
        title
      }
      cursor
    }
    pageInfo {
      hasPreviousPage
      startCursor
    }
  }
}
```

**Benefits**:
- Supports both forward and backward navigation
- Efficient cursor-based approach
- No performance degradation for later pages

## Testing with curl

```bash
# Simple query
curl -X POST http://localhost:4000 \
  -H "Content-Type: application/json" \
  -d '{
    "query": "{ books { title authors { name } } }"
  }'

# Paginated query
curl -X POST http://localhost:4000 \
  -H "Content-Type: application/json" \
  -d '{
    "query": "{ booksPaginated(pagination: { first: 3 }) { edges { node { title } cursor } pageInfo { hasNextPage endCursor } } }"
  }'
```

## Testing with Apollo Studio

1. Start the server: `bun run index.ts`
2. Open browser to `http://localhost:4000`
3. Use the Apollo Studio interface to run queries
4. Explore the schema documentation


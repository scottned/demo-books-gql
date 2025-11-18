# GraphQL Demo - Book & Author Service

This GraphQL service demonstrates solutions to common GraphQL problems, specifically:

1. **Redundant Data Problem** - When multiple books share the same author
2. **N+1 Query Problem** - Deep queries causing excessive backend requests
3. **Pagination Control** - Managing response size with nested lists
4. **Nested Pagination Complexity** - Handling pagination tokens for nested entities

## Solutions Implemented

### 1. DataLoader Pattern (Solves N+1 and Redundant Data)

**Problem**: When querying `{ books { authors { name } } }`, if multiple books share authors:
- The response contains redundant author data (acceptable)
- BUT the backend might fetch the same author multiple times (inefficient)

**Solution**: DataLoader batches and caches requests within a single GraphQL operation.

- **Batching**: Multiple requests for the same resource are combined into a single batch
- **Caching**: Results are cached per request, preventing duplicate fetches
- **Deduplication**: Multiple requests for the same ID are automatically deduplicated

**Implementation**: See `dataloaders.ts` - creates DataLoaders for:
- Authors by ID
- Books by ID  
- Authors by Book ID (batch lookup)
- Books by Author ID (batch lookup)

### 2. Cursor-Based Pagination (Solves Pagination Control)

**Problem**: 
- Paginating books doesn't help if some books have many authors
- Response size can't be controlled for nested lists
- Pagination tokens need to handle nested scenarios

**Solution**: Cursor-based pagination with proper token encoding.

- **Cursors**: Encode book ID (and optional parent context) in base64
- **PageInfo**: Provides `hasNextPage`, `hasPreviousPage`, and cursors
- **Nested Context**: Cursors can include parent information for nested pagination

**Implementation**: See `pagination.ts` - provides:
- `encodeCursor()` / `decodeCursor()` for token management
- `paginate()` function for generic cursor-based pagination
- Support for forward (`first`/`after`) and backward (`last`/`before`) pagination

### 3. Connection Pattern (GraphQL Best Practice)

Following the [Relay Connection Specification](https://relay.dev/graphql/connections.htm), queries return:
- `edges`: Array of `{ node, cursor }` pairs
- `pageInfo`: Pagination metadata

This pattern:
- Provides consistent pagination interface
- Enables efficient cursor-based navigation
- Supports both forward and backward pagination

## Running the Server

```bash
bun run index.ts
```

The server will start at `http://localhost:4000`

## Example Queries

### Simple Query (Demonstrates Redundant Data in Response)

```graphql
query {
  books {
    title
    authors {
      name
    }
  }
}
```

**Note**: The response will contain duplicate author data (e.g., J.K. Rowling appears 3 times), but the backend uses DataLoader to fetch each author only once.

### Paginated Query

```graphql
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

### Paginated Query with Cursor (Next Page)

```graphql
query {
  booksPaginated(pagination: { 
    first: 3
    after: "eyJpZCI6ImJvb2stMyJ9"  # Use endCursor from previous query
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

### Query Single Book with Authors

```graphql
query {
  book(id: "book-17") {
    title
    authors {
      name
      bio
    }
  }
}
```

### Query Author with Books

```graphql
query {
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

## Architecture

```
index.ts          - Server setup and startup
schema.ts         - GraphQL schema definition
resolvers.ts      - GraphQL resolvers
context.ts        - Request context with DataLoaders
dataloaders.ts    - DataLoader implementations
pagination.ts     - Pagination utilities
mockData.ts       - Mock data (24 books, 10 authors)
```

## Key Features

- ✅ **DataLoader**: Batches and caches database queries
- ✅ **Cursor Pagination**: Proper pagination token handling
- ✅ **Type Safety**: Full TypeScript support
- ✅ **Mock Data**: Realistic relationships (books sharing authors)
- ✅ **Documentation**: Comprehensive schema descriptions

## Problem Scenarios Addressed

### Scenario 1: Simple Query with Redundant Data
**Query**: `{ books { authors { name } } }`

**Problem**: Multiple books share authors → redundant data in response

**Solution**: 
- Response still contains redundant data (unavoidable in GraphQL)
- Backend uses DataLoader to fetch each author only once
- Minimal backend cost despite redundant response data

### Scenario 2: Followup Query with Caching
**Query**: `{ books { authors { name } } }` (repeated)

**Problem**: Long-running app with caching might force extra backend queries

**Solution**:
- DataLoader caches within a single request
- For cross-request caching, add Redis/memory cache layer
- Current implementation optimizes per-request

### Scenario 3: Paginated Books
**Query**: `{ booksPaginated(pagination: { first: 5 }) { ... } }`

**Problem**: Books with many authors can't be paginated at author level

**Solution**:
- Pagination controls book-level response size
- Author lists within books are not paginated (could be extended)
- Cursor tokens encode book ID for proper resumption

### Scenario 4: Nested Pagination Complexity
**Problem**: Paginating nested lists requires complex token handling

**Solution**:
- Cursor encoding supports parent context (`parentId`, `parentType`)
- Enables proper resumption: `[lastBook, lastAuthor]`
- Can be extended to paginate authors within books

## Future Enhancements

- Add nested author pagination: `booksPaginated { edges { node { authorsPaginated { ... } } } }`
- Add Redis caching layer for cross-request caching
- Add database integration (replace mock data)
- Add filtering and sorting capabilities
- Add mutation operations (create/update/delete)

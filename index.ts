import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";
import { createContext } from "./context";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function startServer() {
  const { url } = await startStandaloneServer(server, {
    context: async () => createContext(),
    listen: { port: 4000 },
  });

  console.log(`
    🚀 Server ready at: ${url}
    
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
    query {
      books {
        title
        authors {
          name
        }
      }
    }
    
    # Paginated query
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
    
    # Paginated query with cursor
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
  `);
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});

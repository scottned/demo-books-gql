/**
 * Test script to verify GraphQL queries work correctly
 * Run with: bun run test-queries.ts
 */

const SERVER_URL = "http://localhost:4000";

async function testQuery(query: string, variables?: Record<string, unknown>) {
  try {
    const response = await fetch(SERVER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const result = (await response.json()) as {
      errors?: unknown;
      data?: unknown;
    };

    if (result.errors) {
      console.error("❌ Query failed:", JSON.stringify(result.errors, null, 2));
      return false;
    }

    console.log("✅ Query succeeded");
    console.log(JSON.stringify(result.data, null, 2));
    return true;
  } catch (error) {
    console.error("❌ Request failed:", error);
    return false;
  }
}

async function runTests() {
  console.log("🧪 Testing GraphQL Service\n");

  console.log("1. Testing simple books query...");
  await testQuery(`
    query {
      books {
        title
        authors {
          name
        }
      }
    }
  `);

  console.log("\n2. Testing paginated books query...");
  await testQuery(`
    query {
      booksPaginated(pagination: { first: 3 }) {
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
  `);

  console.log("\n3. Testing single book query...");
  await testQuery(`
    query {
      book(id: "book-17") {
        title
        authors {
          name
          bio
        }
      }
    }
  `);

  console.log("\n4. Testing single author query...");
  await testQuery(`
    query {
      author(id: "author-1") {
        name
        books {
          title
        }
      }
    }
  `);

  console.log("\n✅ All tests completed!");
}

// Wait a bit for server to be ready, then run tests
setTimeout(() => {
  runTests().catch(console.error);
}, 2000);

import React from "react";
import { ApolloProvider } from "@apollo/client";
import { client } from "./apollo-client";
import BooksGrid from "./components/BooksGrid";

import "./index.css";

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Books Library</h1>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BooksGrid />
        </main>
      </div>
    </ApolloProvider>
  );
}

export default App;

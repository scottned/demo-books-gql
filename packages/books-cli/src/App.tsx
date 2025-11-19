import React from "react";
import { ApolloProvider } from "@apollo/client";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { client } from "./apollo-client";
import BooksGrid from "./components/BooksGrid";
import BooksGridPaginated from "./components/BooksGridPaginated";

import "./index.css";

function App() {
  const location = useLocation();

  return (
    <ApolloProvider client={client}>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Books Library
            </h1>
            <nav className="border-b border-gray-200">
              <div className="flex space-x-8">
                <Link
                  to="/"
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    location.pathname === "/"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  All Books
                </Link>
                <Link
                  to="/paginated"
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    location.pathname === "/paginated"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Paginated Books
                </Link>
              </div>
            </nav>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<BooksGrid />} />
            <Route path="/paginated" element={<BooksGridPaginated />} />
          </Routes>
        </main>
      </div>
    </ApolloProvider>
  );
}

export default App;

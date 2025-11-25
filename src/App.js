import React, { useState } from "react";
import "./App.css";

const SITE_ID = "scmq7n";
const BASE_URL = "https://api.searchspring.net/api/search/search.json";

export default function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);

  const searchProducts = async (searchQuery, pageNumber = 1) => {
    if (!searchQuery) return;

    setLoading(true);

    const url = `${BASE_URL}?siteId=${SITE_ID}&resultsFormat=native&q=${encodeURIComponent(
      searchQuery
    )}&page=${pageNumber}`;

    try {
      const res = await fetch(url);
      const json = await res.json();

      setResults(json.results || []);
      setPagination(json.pagination || null);
      setPage(pageNumber);
    } catch (error) {
      console.error("Search error:", error);
    }

    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    searchProducts(query, 1);
  };

  const goToPage = (newPage) => {
    searchProducts(query, newPage);
  };

  return (
    <div className="container">
      <h1 className="title">SearchSpring Product Search</h1>

      {/* SEARCH BAR */}
      <form className="search-bar" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search for products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {/* PAGINATION (TOP) */}
      {pagination && (
        <div className="pagination">
          <button disabled={page <= 1} onClick={() => goToPage(page - 1)}>
            Prev
          </button>

          <span>
            Page {page} / {pagination.totalPages}
          </span>

          <button
            disabled={page >= pagination.totalPages}
            onClick={() => goToPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}

      {/* LOADING */}
      {loading && <p className="loading">Loading...</p>}

      {/* RESULTS */}
      <div className="grid">
        {results.map((product) => (
          <div className="card" key={product.id}>
            <img src={product.thumbnailImageUrl} alt={product.name} />
            <h3>{product.name}</h3>
            <div className="price-row">
              <span className="price">${product.price}</span>
              {product.msrp && product.msrp > product.price && (
                <span className="msrp">${product.msrp}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION (BOTTOM) */}
      {pagination && (
        <div className="pagination">
          <button disabled={page <= 1} onClick={() => goToPage(page - 1)}>
            Prev
          </button>

          <span>
            Page {page} / {pagination.totalPages}
          </span>

          <button
            disabled={page >= pagination.totalPages}
            onClick={() => goToPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}


import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../Components/Sidebar";
import SearchBar from "../Components/SearchBar"; // Corrected path
import Navbar from "../Components/Navbar";


function Dashboard() {
  const [user, setUser] = useState({});
  const [groupedProducts, setGroupedProducts] = useState({}); // Grouped by category
  const [searchResults, setSearchResults] = useState([]); // Search results

  useEffect(() => {
    fetchUserData();
    fetchProducts();
  }, []);

  // Fetch user data for profile
  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/user", { params: { user_id: 1 } });
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Fetch all products grouped by category
  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/products");
      const productsData = response.data;

      // Group products by category
      const grouped = productsData.reduce((acc, product) => {
        if (!acc[product.category]) acc[product.category] = [];
        acc[product.category].push(product);
        return acc;
      }, {});

      setGroupedProducts(grouped);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Handle search query
  const handleSearch = async (query) => {
    try {
      if (!query) {
        // If query is empty, clear search results
        setSearchResults([]);
        return;
      }

      const response = await axios.get(`http://localhost:5000/api/search?q=${query}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  return (
    <div className="dashboard d-flex">
      <Navbar />
      <Sidebar />
      <div className="main-content flex-grow-1 p-4">
        {/* Profile Section */}
        <section className="profile text-center my-4">
          <h2>Welcome, {user.first_name || "User"}</h2>
        </section>

        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} />

        {/* Search Results Section */}
        {searchResults.length > 0 ? (
          <section className="search-results mt-4">
            <h3 className="text-center mb-4">Search Results</h3>
            <div className="row">
              {searchResults.map((product) => (
                <div key={product.id} className="col-md-4 mb-4">
                  <div className="card product-card h-100">
                    <img
                      src={product.images?.[0] ? `http://localhost:5000/uploads/${product.images[0]}` : "/path/to/placeholder.jpg"}
                      className="card-img-top"
                      alt={product.name}
                      style={{ height: "200px", width: "100%", objectFit: "contain", backgroundColor: "#f8f9fa" }}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{product.name}</h5>
                      <p className="card-text text-muted">{product.description}</p>
                      <p className="text-success fw-bold">USD ${product.price}</p>
                      <button className="btn-fav">
                        <i className="bi bi-star-fill"></i> Favorite
                      </button>
                      <button className="btn-cart">
                        <i className="bi bi-cart"></i> Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <p className="text-center text-muted mt-4">....</p>
        )}

        {/* Products Section */}
        <section className="products mt-5">
          <h3 className="text-center mb-4">Explore Our Products</h3>
          {Object.keys(groupedProducts).length > 0 ? (
            Object.keys(groupedProducts).map((category) => (
              <div key={category} className="category-section mb-5">
                <h4 className="category-title  mb-3">{category}</h4>
                <div className="row">
                  {groupedProducts[category].map((product) => (
                    <div key={product.id} className="col-md-4 mb-4">
                      <div className="card product-card h-100">
                        <img
                          src={product.images?.[0] ? `http://localhost:5000/uploads/${product.images[0]}` : "/path/to/placeholder.jpg"}
                          className="card-img-top"
                          alt={product.name}
                          style={{ height: "200px", width: "100%", objectFit: "contain", backgroundColor: "#f8f9fa" }}
                        />
                        <div className="card-body">
                          <h5 className="card-title">{product.name} ({product.color})</h5>
                          <p className="card-text text-muted">{product.description}</p>
                          <p className="text-success fw-bold"><img src="https://img.icons8.com/?size=100&id=21449&format=png&color=000000" className="bi-star-fill"/> USD ${product.price}</p>
                          <button className="btn me-2">
                            <img src="https://img.icons8.com/?size=100&id=ttPVWWAN2Fak&format=png&color=000000" className="bi-star-fill"/> Favorite
                          </button>
                          <button className="btn">
                            <img src="https://img.icons8.com/?size=100&id=114100&format=png&color=000000" className="bi-star-fill"/> Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted">No products available.</p>
          )}
        </section>
      </div>
    </div>
  );
}

export default Dashboard;

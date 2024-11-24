import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm); // Pass the search term to the parent component
  };

  return (
    <div className="search-bar-container">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for products..."
        />
        <button type="submit">Search</button>
      </form>
    </div>
  );
};

export default SearchBar;



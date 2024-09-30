import React from "react";
import { FaSearch } from "react-icons/fa";
import "./Dashboard.css"; // Move inline styles to CSS

const SearchBar = ({ onSearch }) => {
  return (
    <div className="search-bar-container">
      <FaSearch className="search-icon" />
      <input
        type="text"
        placeholder="Search..."
        onChange={(event) => onSearch(event.target.value)}
        className="search-input"
      />
    </div>
  );
};

export default SearchBar;

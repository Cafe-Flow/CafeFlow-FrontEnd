import "./main.css";
import "../App.css";
import React, { useState } from "react";
import { BiSearch } from "react-icons/bi";

function SearchSection({ placeholder, onSearch, options }) {
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState(options[0].value);

  const handleInputChange = (e) => {
    setInput(e.target.value);
    onSearch(e.target.value, filter);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onSearch(input, filter);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(input, filter);
    }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  return (
    <div className="search-box">
      <div className="search-container">
        <form className="search-bar" onSubmit={handleSubmit}>
          {options[0].value !== "" && (
            <select
              className="search-filter"
              value={filter}
              onChange={handleFilterChange}
            >
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
          <input
            type="text"
            className="search-input"
            placeholder={placeholder}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
          />
          <button type="submit" className="search-icon">
            <BiSearch size={28} />
          </button>
        </form>
      </div>
    </div>
  );
}

SearchSection.defaultProps = {
  placeholder: "검색어를 입력해주세요",
  onSearch: () => {},
  options: [{ value: "", label: "" }],
};

export default SearchSection;

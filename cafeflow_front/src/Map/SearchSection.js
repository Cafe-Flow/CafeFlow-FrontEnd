import "../MainPage/main.css";
import "../App.css";
import React, { useState } from "react";
import { BiSearch } from "react-icons/bi";

function SearchSection({
  placeholder,
  onSearch,
  options,
  searchResults,
  onResultClick,
}) {
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState(options[0].value);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && input.trim() !== "") {
      onSearch(input, filter);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() !== "") {
      onSearch(input, filter);
    }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleResultClick = (result) => {
    onResultClick(result);
  };

  return (
    <>
      <div className="search-box">
        <div className="search-container">
          <form className="search-bar" onSubmit={handleSubmit}>
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
      <div>
        {searchResults.length > 0 ? (
          <ul
            className={`search-results-list ${
              searchResults.length > 4 ? "overflow" : ""
            }`}
          >
            {searchResults.map((result, index) => (
              <li key={index} onClick={() => handleResultClick(result)}>
                {result.roadAddress || result.jibunAddress}
              </li>
            ))}
          </ul>
        ) : (
          <p></p>
        )}
      </div>
    </>
  );
}

SearchSection.defaultProps = {
  placeholder: "검색어를 입력해주세요",
  onSearch: () => {},
  options: [{ value: "", label: "" }],
};

export default SearchSection;

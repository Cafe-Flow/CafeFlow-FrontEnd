import './main.css';
import '../App.css'
import React, { useState } from 'react';
import { BiSearch } from "react-icons/bi";

function SearchSection({ placeholder, onSearch }) {
    const [input, setInput] = useState('');

    const handleInputChange = (e) => {
      setInput(e.target.value);
    };
  
    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        onSearch(input);  // Enter를 누르면 검색 실행
      }
    };
  
    const handleSubmit = (e) => {
        e.preventDefault(); 
        if (onSearch) {
            onSearch(input);
        }
    };
  
    return (
        <div className='search-box'>
            <div className="search-container">
                <form className="search-bar" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="search-input"
                        placeholder={placeholder}
                        value={input}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                    />
                    <button type="submit" className="search-icon">
                    <BiSearch size={28}/>
                    </button>
               </form>
            </div>
        </div>
    );
}

SearchSection.defaultProps = {
    placeholder: "키워드로 검색",
    onSearch: () => {}
};

export default SearchSection;
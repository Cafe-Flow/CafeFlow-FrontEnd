import './main.css';
import '../App.css'
import React, { useState } from 'react';
import { BiSearch } from "react-icons/bi";

function SearchSection({ placeholder, onSearch }) {
    const [searchTerm, setSearchTerm] = useState('');
  
    const handleChange = (e) => {
        setSearchTerm(e.target.value);
    };
  
    const handleSubmit = (e) => {
        e.preventDefault(); 
        if (onSearch) {
            onSearch(searchTerm);
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
                        value={searchTerm}
                        onChange={handleChange}
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
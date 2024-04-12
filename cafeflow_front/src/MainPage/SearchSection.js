import './main.css';
import '../App.css'
import React, { useState } from 'react';
import { BiSearch } from "react-icons/bi";

function SearchSection() {
    const [searchTerm, setSearchTerm] = useState('');
  
    const handleChange = (e) => {
        setSearchTerm(e.target.value);
    };
  
    const handleSubmit = (e) => {
        e.preventDefault(); 
    };
  
    return (
        <>
            <p className='Logo-font'>Shop Search</p>
            <div className="search-container">
                <form className="search-bar" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="지역이나 카페 이름을 검색하세요"
                        value={searchTerm}
                        onChange={handleChange}
                    />
                    <button type="submit" className="search-icon">
                    <BiSearch size={28}/>
                    </button>
               </form>
            </div>
        </>
    );
}


export default SearchSection;
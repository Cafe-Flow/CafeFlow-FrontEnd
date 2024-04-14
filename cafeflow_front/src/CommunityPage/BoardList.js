import '../App.css';
import React, { useState } from 'react';
import SearchSection from '../MainPage/SearchSection';
import ListSection from './ListSection.js';

function Boardlist() {
    const handleSearch = (searchTerm) => {
        console.log("검색 실행:", searchTerm);
    };

  return (
    <>
        <SearchSection onSearch={handleSearch}/>
        <ListSection/>
      </>
  );
}

export default Boardlist;
import "../App.css";
import SearchSection from "../MainPage/SearchSection";
import ListSection from "./ListSection.js";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Pagination from "../Pagination.js";

function Boardlist() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchResults, setSearchResults] = useState([]);
  const resultsPerPage = 10; // 페이지 당 10개의 결과
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const userToken = localStorage.getItem("userToken");
      const response = await fetch(
        "http://localhost:8080/api/community/posts",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSearchResults(data);
      console.log(data);
      setTotalResults(data.length);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  };

  const handleSearch = (searchTerm) => {
    console.log("검색 실행:", searchTerm);
  };

  const handleCreatePost = () => {
    navigate("/create-post");
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <SearchSection onSearch={handleSearch} />
      <ListSection posts={searchResults} />
      <Pagination
        resultsPerPage={resultsPerPage}
        totalResults={totalResults}
        paginate={paginate}
      />
    </>
  );
}

export default Boardlist;

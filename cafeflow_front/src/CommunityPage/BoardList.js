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
  const resultsPerPage = 8;
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
      sortPosts("최신순", data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  };

  const sortPosts = (sortType, posts) => {
    let newSortedPosts = [...posts];
    switch (sortType) {
      case "최신순":
        newSortedPosts.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
      case "조회수":
        newSortedPosts.sort((a, b) => b.views - a.views);
        break;
      case "좋아요":
        newSortedPosts.sort((a, b) => b.likesCount - a.likesCount);
        break;
    }
    setSearchResults(newSortedPosts);
    setTotalResults(newSortedPosts.length);
    setCurrentPage(1); // 정렬 후 페이지를 1로 리셋
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

  const indexOfLastPost = currentPage * resultsPerPage;
  const indexOfFirstPost = indexOfLastPost - resultsPerPage;
  const currentPosts = searchResults.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  return (
    <>
      <SearchSection onSearch={handleSearch} />
      <ListSection
        posts={currentPosts}
        sortPosts={(sortType) => sortPosts(sortType, searchResults)}
      />
      <Pagination
        currentPage={currentPage}
        resultsPerPage={resultsPerPage}
        totalResults={totalResults}
        paginate={setCurrentPage}
      />
      <div className="create-post-button" onClick={handleCreatePost}>
        +
      </div>
    </>
  );
}

export default Boardlist;

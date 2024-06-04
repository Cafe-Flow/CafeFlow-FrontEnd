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
  const [originalPosts, setOriginalPosts] = useState([]);
  const resultsPerPage = 8;
  const [totalResults, setTotalResults] = useState(0);

  const options = [
    { value: "title", label: "게시글 제목" },
    { value: "content", label: "게시글 내용" },
    { value: "authorNickname", label: "작성자" },
  ];

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const userToken = localStorage.getItem("userToken");
      const response = await fetch("/api/community/posts", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setOriginalPosts(data);
      sortPosts("최신순", data);
      console.log(data);
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
    setCurrentPage(1);
  };

  const handleSearch = (searchTerm, filter) => {
    if (!searchTerm.trim()) {
      setSearchResults(originalPosts);
      setTotalResults(originalPosts.length);
      setCurrentPage(1);
      return;
    }
    const filteredResults = originalPosts.filter(
      (post) =>
        post[filter] &&
        post[filter].toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(filteredResults);
    setTotalResults(filteredResults.length);
    setCurrentPage(1);
  };

  const handleCreatePost = () => {
    navigate("/create-post");
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastPost = currentPage * resultsPerPage;
  const currentPosts = searchResults.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  return (
    <>
      <SearchSection onSearch={handleSearch} options={options} />
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

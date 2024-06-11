import React, { useState, useEffect } from "react";
import "./community.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useNavigate } from "react-router-dom";
import { timeSince } from "./Time.js";
import { FaRegHeart } from "react-icons/fa6";
import Pagination from "../Pagination.js";

function ListSection({ posts, sortPosts }) {
  const [loading, setLoading] = useState(true);
  const [selectedSort, setSelectedSort] = useState("최신순");
  const [sortedPosts, setSortedPosts] = useState([]);

  useEffect(() => {
    if (posts.length > 0) {
      setLoading(false);
      setSortedPosts(posts);
    }
  }, [posts]);

  const handleSortClick = (sortType) => {
    setSelectedSort(sortType);
    sortPosts(sortType);
  };

  if (loading === false && posts.length === 0) {
    return (
      <>
        <p className="h6-font">일치하는 결과가 없습니다</p>
        <span className="sad-imoji">(｡•́︿•̀｡) 슬퍼요</span>
      </>
    );
  }
  return (
    <>
      <div className="post-sort list-container">
        <p
          className={selectedSort === "최신순" ? "active" : ""}
          onClick={() => handleSortClick("최신순")}
        >
          최신순
        </p>
        <p
          className={selectedSort === "조회수" ? "active" : ""}
          onClick={() => handleSortClick("조회수")}
        >
          조회수
        </p>
        <p
          className={selectedSort === "좋아요" ? "active" : ""}
          onClick={() => handleSortClick("좋아요")}
        >
          좋아요
        </p>
      </div>
      <div className="list-container">
        {loading
          ? Array(8)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="custom-post-container">
                  <Skeleton height={230} width={300} />
                  <Skeleton
                    height={30}
                    width={200}
                    style={{ marginTop: "10px" }}
                  />
                  <Skeleton
                    height={10}
                    width={250}
                    count={2}
                    style={{ marginTop: "10px" }}
                  />
                  <div className="custom-post-footer">
                    <Skeleton height={10} width={50} />
                    <Skeleton height={10} width={50} />
                  </div>
                </div>
              ))
          : sortedPosts.map((post) => <Card key={post.id} {...post} />)}
      </div>
    </>
  );
}

function Card({
  id,
  image,
  title,
  content,
  authorNickname,
  createdAt,
  likesCount,
  views,
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/community/${id}`);
  };

  return (
    <div className="custom-post-container" onClick={handleClick}>
      {image ? (
        <img
          src={`data:image/jpeg;base64,${image}`}
          alt="게시글 이미지"
          className="custom-post-img"
        />
      ) : (
        <img
          src="img/admin.png"
          alt="게시글 이미지"
          className="custom-post-img"
        />
      )}
      <div className="custom-post-body">
        <p className="custom-post-title">{title}</p>
        <p className="custom-post-text">{content}</p>
        <div className="custom-post-footer">
          <span className="custom-post-author">{authorNickname}</span>
          <span className="custom-post-time">{timeSince(createdAt)}</span>
        </div>
        <div className="custom-post-bottom">
          <span className="custom-post-likesCount">
            <FaRegHeart />
            {likesCount}
          </span>
          <span className="custom-post-view">조회 {views}</span>
        </div>
      </div>
    </div>
  );
}

export default ListSection;

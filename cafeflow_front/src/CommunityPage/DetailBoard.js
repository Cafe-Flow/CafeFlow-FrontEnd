import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./community.css";
import CommentSection from "./CommentSection";
import { timeSince } from "./Time";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { FaRegHeart, FaHeart } from "react-icons/fa6";

function DetailBoard() {
  const { postId } = useParams();
  const [post, setPost] = useState({});
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      const userToken = localStorage.getItem("userToken");
      try {
        const response = await fetch(
          `http://localhost:8080/api/community/posts/${postId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setPost(data);
        console.log(data);
        setLiked(data.likedByCurrentUser);
        setLikesCount(data.likesCount);
        setIsLoading(false);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };
    fetchPost();
  }, [postId]);

  const handleLike = async () => {
    const newLikedState = !liked;
    setLiked(newLikedState);
    setLikesCount(newLikedState ? likesCount + 1 : likesCount - 1);

    try {
      const response = await fetch(
        `http://localhost:8080/api/community/posts/${postId}/like`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error("Failed to toggle like on server:", error);
      setLiked(!newLikedState);
      setLikesCount(newLikedState ? likesCount - 1 : likesCount + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="detail-post-container">
        <div className="detail-post-author">
          <Skeleton height={20} width={200} />
        </div>
        <div className="detail-post-top">
          <Skeleton height={30} width={100} />
          <Skeleton height={20} width={100} />
        </div>
        <div className="detail-post-content">
          <Skeleton height={400} width={"100%"} />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="detail-post-container">
        <div className="detail-post-author">
          <p className="name-style">{post.authorNickname}</p>
        </div>
        <div className="detail-post-top">
          <p className="detail-post-title">{post.title}</p>
          <p className="detail-post-time">
            <span className="detail-post-view">조회수 {post.views} </span>
            {"|"} {timeSince(post.createdAt)}
          </p>
        </div>
        <div className="detail-post-content">
          {post.image && (
            <img
              className="detail-post-img"
              src={`data:image/jpeg;base64,${post.image}`}
              alt="Post"
            />
          )}
          <p className="detail-post-content">{post.content}</p>
        </div>
        <div className="detail-post-footer">
          <span onClick={handleLike} className="custom-post-likesCount">
            {liked ? <FaHeart /> : <FaRegHeart />}
            {likesCount}
          </span>
        </div>
      </div>
      <CommentSection comments={post.comments} postId={postId} />
    </>
  );
}

export default DetailBoard;

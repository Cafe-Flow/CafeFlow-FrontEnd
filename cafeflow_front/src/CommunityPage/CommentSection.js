import React, { useState } from "react";
import "./community.css";
import { timeSince } from "./Time";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FaSpinner } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";

function CommentSection({ comments, postId }) {
  const [commentList, setCommentList] = useState(
    [...comments].sort((a, b) => b.id - a.id)
  );
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onDeleteComment = (commentId, parentId) => {
    if (parentId) {
      const updatedList = commentList.map((comment) => {
        if (comment.id === parentId) {
          const filteredReplies = comment.replies.filter(
            (reply) => reply.id !== commentId
          );
          return { ...comment, replies: filteredReplies };
        }
        return comment;
      });
      setCommentList(updatedList);
    } else {
      setCommentList(commentList.filter((comment) => comment.id !== commentId));
    }
  };

  const handleAddComment = async (text) => {
    if (text.trim() !== "") {
      setIsLoading(true);
      const userToken = localStorage.getItem("userToken");
      const requestBody = {
        content: text,
      };
      try {
        const response = await fetch(
          `http://localhost:8080/api/community/posts/${postId}/comments`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
            body: JSON.stringify(requestBody),
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setCommentList([data, ...commentList]);
        setNewComment("");
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        alert("댓글을 추가하는 데 실패했습니다.");
      } finally {
      }
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && newComment.trim()) {
      handleAddComment(newComment);
      setNewComment("");
      event.preventDefault();
    }
  };

  const updateReplies = (newReply, parentId) => {
    const updatedList = commentList.map((comment) => {
      if (comment.id === parentId) {
        return { ...comment, replies: [newReply, ...comment.replies] };
      }
      return comment;
    });
    setCommentList(updatedList);
  };

  return (
    <div className="comment-section">
      <div className="comment-input">
        <img className="profile-img" src="/img/newjeans.png" alt="Profile" />
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="댓글을 입력하세요"
        />
        <button onClick={() => handleAddComment(newComment)}>댓글 추가</button>
      </div>
      {isLoading && (
        <div className="loading-indicator">
          <FaSpinner className="spinner" />
        </div>
      )}
      <div className="comment-list">
        {commentList
          .filter((comment) => !comment.parentCommentId)
          .map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              updateReplies={updateReplies}
              onDeleteComment={onDeleteComment}
              postId={postId}
            ></CommentItem>
          ))}
      </div>
    </div>
  );
}

function CommentItem({
  comment,
  updateReplies,
  onDeleteComment,
  isReply = false,
  postId,
}) {
  const [showReplies, setShowReplies] = useState(false);
  const [newReply, setNewReply] = useState("");
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const userNickname = userInfo.nickname;

  const handleToggleReplies = () => {
    setShowReplies(!showReplies);
  };

  const handleDeleteComment = async (commentId, parentId) => {
    const userToken = localStorage.getItem("userToken");

    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:8080/api/community/comments/${comment.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      onDeleteComment(commentId, parentId);
    } catch (error) {
      console.error("Failed to delete the comment:", error);
      alert("댓글 삭제에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReplyKeyPress = async (event) => {
    if (event.key === "Enter" && newReply.trim()) {
      event.preventDefault();
      setIsLoading(true);
      const userToken = localStorage.getItem("userToken");
      const requestBody = {
        content: newReply,
      };
      try {
        const response = await fetch(
          `http://localhost:8080/api/community/posts/${postId}/comments/${comment.id}/replies`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
            body: JSON.stringify(requestBody),
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        updateReplies(data, comment.id);
        setShowReplyInput(false);
        setNewReply("");
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        alert("답글 추가에 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleReplyInput = () => {
    if (!isReply) {
      setShowReplyInput(!showReplyInput);
    }
  };

  return (
    <>
      <div className="comment-item">
        <img className="profile-img1" src="/img/newjeans.png" alt="Profile" />
        <div className="comment-box">
          <div className="comment-top">
            <span className="comment-text">
              <span className="name-style">{comment.authorNickname}</span>{" "}
              <span className="comment-time">
                {timeSince(comment.createdAt)}
              </span>
            </span>{" "}
            {comment.authorNickname === userNickname && (
              <span
                onClick={() =>
                  handleDeleteComment(comment.id, comment.parentCommentId)
                }
                className="delete-icon"
              >
                <RiDeleteBinLine />
              </span>
            )}
          </div>
          <div className="comment-content">
            <p>{comment.content}</p>
          </div>
          <div className="comment-actions">
            {comment.parentCommentId === null && comment.replies.length > 0 && (
              <span onClick={handleToggleReplies}>
                {showReplies ? <FaChevronUp /> : <FaChevronDown />} 답글 (
                {comment.replies.length})
              </span>
            )}
            {!isReply && <span onClick={toggleReplyInput}>답글 작성</span>}
          </div>
        </div>
      </div>
      {showReplyInput && (
        <div className="reply-input">
          <input
            type="text"
            placeholder="답글을 입력하세요"
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
            onKeyDown={handleReplyKeyPress}
          />
        </div>
      )}
      {showReplies &&
        comment.replies.map((reply) => (
          <div className="comment-reply-comment" key={reply.id}>
            <CommentItem
              key={reply.id}
              comment={reply}
              updateReplies={updateReplies}
              onDeleteComment={onDeleteComment}
              isReply={true}
            />
          </div>
        ))}
      {isLoading && <FaSpinner className="spinner" />}
    </>
  );
}

export default CommentSection;

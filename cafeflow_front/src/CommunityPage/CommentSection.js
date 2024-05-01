import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import "./community.css";

function CommentSection() {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    const handleAddComment = () => {
        if (newComment.trim() !== "") {
            const comment = {
                id: comments.length + 1,
                text: newComment,
                time: "방금 전"
            };
            setComments([...comments, comment]);
            setNewComment("");
        }
    };


    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleAddComment();
            event.preventDefault();  // 엔터키로 인한 form 제출을 방지
        }
    };

    return (
        <div className='comment-section'>
            <div className='comment-input'>
                <img className='profile-img' src="/img/newjeans.png" alt="Profile" />
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="댓글을 입력하세요"
                />
                <button onClick={handleAddComment}>댓글 추가</button>
            </div>
            <div className='comment-list'>
                {comments.map(comment => (
                    <div key={comment.id} className='comment-item'>
                        <img className='profile-img1' src="/img/newjeans.png" alt="Profile" />
                        <p>{comment.text} - <span>{comment.time}</span></p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CommentSection;
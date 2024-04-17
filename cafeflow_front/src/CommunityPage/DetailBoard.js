import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import "./community.css";

function DetailBoard() {
    const { postId } = useParams();
    const [author, setAuthor] = useState("작성자");
    const authorWidth = `${author.length * 25}px`;

    return (
        <>
        <div className='detail-post-container'>       
        <div className='detail-post-author'>       
        <p className='name-style' style={{ width: authorWidth }}>{author}</p>
        </div>  
            <div  className='detail-post-top'>
            <p className='detail-post-title'> 게시물 {postId}번째</p> 
            <p className='detail-post-time'>10분 전</p>
            </div>
            <div className='detail-post-content'>
            <img className='detail-post-img' src='/img/newjeans.png'></img>
            <p>게시물 내용</p>
            </div>
        </div>
        </>
    );
}

export default DetailBoard;

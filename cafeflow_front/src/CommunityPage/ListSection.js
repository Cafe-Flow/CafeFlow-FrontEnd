import React, { useState, useEffect } from 'react';
import './community.css';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useNavigate } from 'react-router-dom';

function ListSection() {
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const [selectedSort, setSelectedSort] = useState('');

    const handleSortClick = (sortType) => {
        setSelectedSort(sortType);
    };

    useEffect(() => {

        const fetchPosts = async () => {
            setLoading(true);

            const fakeData = [
                { id: 1, imageSrc: "/img/newjeans.png", title: "게시글 제목 1", content: "게시글 내용 1", author: "테스트", time: "10분전" },
                { id: 2, imageSrc: "/img/newjeans.png", title: "게시글 제목 2", content: "게시글 내용 2", author: "테스트", time: "10분전" },
                { id: 3, imageSrc: "/img/newjeans.png", title: "게시글 제목 3", content: "게시글 내용 3", author: "테스트", time: "10분전"},
                { id: 4, imageSrc: "/img/newjeans.png", title: "게시글 제목 4", content: "게시글 내용 4", author: "테스트", time: "10분전"},
                { id: 5, imageSrc: "/img/newjeans.png", title: "게시글 제목 5", content: "게시글 내용 5", author: "테스트", time: "10분전"}
            ];
            setTimeout(() => {
                setPosts(fakeData);
                setLoading(false);
            }, 1000);
        };

        fetchPosts();
    }, []);

    return (
        <>
        <div className='post-sort list-container'>
            <p className={selectedSort === '최신순' ? 'active' : ''}
               onClick={() => handleSortClick('최신순')}>최신순</p>
            <p className={selectedSort === '댓글' ? 'active' : ''}
               onClick={() => handleSortClick('댓글')}>댓글</p>
            <p className={selectedSort === '조회수' ? 'active' : ''}
               onClick={() => handleSortClick('조회수')}>조회수</p>
            <p className={selectedSort === '좋아요' ? 'active' : ''}
               onClick={() => handleSortClick('좋아요')}>좋아요</p>
        </div>
        <div className="list-container">
            {loading ? (
                Array(8).fill(0).map((_, index) => (
                    <div key={index} className="custom-post-container">
                        <Skeleton height={230} width={300} />
                        <Skeleton height={30} width={200} style={{ marginTop: '10px' }} />
                        <Skeleton height={10} width={250} count={2} style={{ marginTop: '10px' }} />
                        <div className="custom-post-footer">
                            <Skeleton height={10} width={50} />
                            <Skeleton height={10} width={50} />
                        </div>
                    </div>
                ))
            ) : (
                posts.map(post => (
                    <Card
                        id={post.id}
                        imageSrc={post.imageSrc}
                        title={post.title}
                        content={post.content}
                        author={post.author}
                        time={post.time}
                    />
                ))
            )}
        </div>
        </>
    );
}


function Card({ id, imageSrc, title, content, author, time}) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/community/${id}`);
    };

    return (
        <div className='custom-post-container' onClick={handleClick}>
            <img src={imageSrc} alt="게시글 이미지" className="custom-post-img" />
            <div className="custom-post-body">
                <h5 className="custom-post-title">{title}</h5>
                <p className="custom-post-text">{content}</p>
                <div className="custom-post-footer">
                    <span className="custom-post-author">{author}</span>
                    <span className="custom-post-time">{time}</span>
                </div>
            </div>
        </div>
    );
}

export default ListSection;

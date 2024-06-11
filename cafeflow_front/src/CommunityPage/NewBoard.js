import React, { useState } from "react";
import { Form, Container } from "react-bootstrap";
import { FaRegFileAlt } from "react-icons/fa";
import "./newboard.css";

function NewBoard() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Submitting:", title, content, image);
  };

  return (
    <Container className="detail-post-container">
      <h2>
        <span className="newboard-icon">
          <FaRegFileAlt />
        </span>{" "}
        새 게시글
      </h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="newboard-title" controlId="formPostTitle">
          <Form.Control
            type="text"
            placeholder="제목을 작성해주세요"
            value={title}
            maxLength="30"
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formPostContent">
          <Form.Control
            className="newboard-content-control"
            as="textarea"
            placeholder="내용을 작성해주세요"
            value={content}
            maxLength="300"
            onChange={(e) => setContent(e.target.value)}
          />
          <Form.Label>{content.length} / 300</Form.Label>
        </Form.Group>
        <Form.Group className="newboard-img-control" controlId="formPostImage">
          <Form.Control
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </Form.Group>
        <button className="newboard-submit-button">게시글 작성</button>
      </Form>
    </Container>
  );
}
export default NewBoard;

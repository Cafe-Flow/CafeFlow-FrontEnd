import React, { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
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
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formPostTitle">
          <Form.Label>제목</Form.Label>
          <Form.Control
            type="text"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formPostContent">
          <Form.Label>300 / {content.length}</Form.Label>
          <Form.Control
            as="textarea"
            placeholder="내용을 입력하세요"
            value={content}
            maxLength="299"
            onChange={(e) => setContent(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formPostImage">
          <Form.Label>이미지 업로드</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          게시글 등록
        </Button>
      </Form>
    </Container>
  );
}
export default NewBoard;

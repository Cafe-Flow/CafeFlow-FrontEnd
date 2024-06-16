import React, { useState } from "react";
import { Form, Container, FloatingLabel } from "react-bootstrap";
import { useUser } from "../MainPage/UserContext";
import { useNavigate } from "react-router-dom";
import CustomError from "../Component/CustomError";

import "./newboard.css";

function NewBoard() {
  const [title, setTitle] = useState("");
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [isTitleFocused, setIsTitleFocused] = useState(false);
  const [isContentFocused, setIsContentFocused] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const { userInfo } = useUser();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("boardId", "1");
    formData.append("title", title);
    formData.append("content", content);
    formData.append("stateId", userInfo.stateId);
    formData.append("image", image);

    try {
      const response = await fetch("/api/community/posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
        body: formData,
      });

      if (response.ok) {
        setModalMessage("게시글이 성공적으로 등록되었습니다.");
        setModalShow(true);
      } else {
        setModalMessage(`오류: ${response.statusText}`);
        setModalShow(true);
      }
    } catch (error) {
      setModalMessage(`게시글 등록 중 오류 발생: ${error.message}`);
      setModalShow(true);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleModalClose = () => {
    setModalShow(false);
    if (modalMessage === "게시글이 성공적으로 등록되었습니다.") {
      navigate("/community");
    }
  };

  return (
    <Container className="detail-post-container">
      <h3>게시글 작성</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="newboard-title" controlId="formPostTitle">
          <FloatingLabel
            label={isTitleFocused ? `(${title.length} / 30)` : "제목"}
            className="mb-3"
          >
            <Form.Control
              type="text"
              placeholder="제목을 작성해주세요"
              value={title}
              maxLength="30"
              onChange={(e) => setTitle(e.target.value)}
              onFocus={() => setIsTitleFocused(true)}
              onBlur={() => setIsTitleFocused(false)}
            />
          </FloatingLabel>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formPostContent">
          <FloatingLabel
            label={isContentFocused ? `(${content.length} / 300)` : "내용"}
            className="floating-label"
          >
            <Form.Control
              className="newboard-content-control"
              as="textarea"
              placeholder="내용을 작성해주세요"
              value={content}
              maxLength="300"
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setIsContentFocused(true)}
              onBlur={() => setIsContentFocused(false)}
            />
          </FloatingLabel>
        </Form.Group>
        <Form.Group className="newboard-img-control" controlId="formPostImage">
          <Form.Control type="file" onChange={handleImageChange} />
        </Form.Group>
        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="Selected" />
          </div>
        )}
        <button className="newboard-submit-button">게시글 업로드</button>
      </Form>
      <CustomError
        show={modalShow}
        handleClose={handleModalClose}
        handleConfirm={handleModalClose}
      >
        {modalMessage}
      </CustomError>
    </Container>
  );
}

export default NewBoard;

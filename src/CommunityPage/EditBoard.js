import React, { useEffect, useState } from "react";
import { Form, Container, FloatingLabel } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../MainPage/UserContext";
import CustomError from "../Component/CustomError";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./newboard.css";

function EditBoard() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useUser();
  const [post, setPost] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isTitleFocused, setIsTitleFocused] = useState(false);
  const [isContentFocused, setIsContentFocused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/community/posts/${postId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        });
        const data = await response.json();
        if (data.authorNickname !== userInfo.nickname) {
          navigate("/not-authorized");
        } else {
          setPost(data);
          setTitle(data.title);
          setContent(data.content);
          if (data.image) {
            setImagePreview(`data:image/jpeg;base64,${data.image}`);
          }
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId, userInfo, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("stateId", userInfo.stateId);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await fetch(`/api/community/posts/${postId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
        body: formData,
      });

      if (response.ok) {
        setModalMessage("게시글이 성공적으로 수정되었습니다.");
        setModalShow(true);
      } else {
        setModalMessage(`오류: ${response.statusText}`);
        setModalShow(true);
      }
    } catch (error) {
      setModalMessage(`게시글 수정 중 오류 발생: ${error.message}`);
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
    if (modalMessage === "게시글이 성공적으로 수정되었습니다.") {
      navigate("/community");
    }
  };

  return (
    <Container className="detail-post-container">
      <h3>게시글 수정</h3>
      {loading ? (
        <div>
          <Skeleton height={50} width={`100%`} />
          <Skeleton height={300} width={`100%`} style={{ marginTop: 10 }} />
          <Skeleton height={50} width={`100%`} style={{ marginTop: 10 }} />
        </div>
      ) : (
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
          <Form.Group
            className="newboard-img-control"
            controlId="formPostImage"
          >
            <Form.Control type="file" onChange={handleImageChange} />
          </Form.Group>
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Selected" />
            </div>
          )}
          <button className="newboard-submit-button">게시글 수정</button>
        </Form>
      )}
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
export default EditBoard;

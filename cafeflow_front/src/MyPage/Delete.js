import Sidebar from "./Sidebar";
import { useState } from "react";
import "./mypage.css";
import CustomCheckModal from "../Component/CustomCheckModal";
import { useNavigate } from "react-router-dom";

function Delete() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();
  const handleShowDeleteModal = () => setShowDeleteModal(true);
  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  const handleDelete = async () => {
    const userId = JSON.parse(localStorage.getItem("userInfo")).id;
    try {
      const response = await fetch(`/api/auth/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        localStorage.removeItem("userInfo");
        localStorage.removeItem("userToken");
        navigate("/");
        setShowDeleteModal(false);
      } else {
        throw new Error("회원 탈퇴에 실패했습니다.");
      }
    } catch (error) {
      console.error("회원 탈퇴 처리 중 에러 발생:", error);
    }
  };

  return (
    <>
      <div className="mypage">
        <Sidebar />
        <div className="mypage-card">
          <div className="mypage-header">
            <p className="header-font">회원 탈퇴</p>
            <p className="h6-font">회원님의 안전한 탈퇴를 도와 드릴게요</p>
          </div>
          <div
            onClick={handleShowDeleteModal}
            className="custom-delete-button"
            style={{ marginTop: "100px" }}
          >
            회원 탈퇴
          </div>
        </div>
      </div>
      <CustomCheckModal
        show={showDeleteModal}
        handleClose={handleCloseDeleteModal}
        handleConfirm={handleDelete}
      >
        ☕탈퇴 하시겠습니까?☕
      </CustomCheckModal>
    </>
  );
}

export default Delete;

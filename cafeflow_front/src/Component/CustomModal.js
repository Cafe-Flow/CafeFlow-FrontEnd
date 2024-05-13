import React from "react";
import { Modal, Button } from "react-bootstrap";
import "../App.css";

function CustomModal({ show, handleClose, children, handleConfirm }) {
  return (
    <Modal show={show} onHide={handleClose} className="modal-position">
      <Modal.Header closeButton>
        <Modal.Title className="Logo-font">CafeFlow</Modal.Title>
      </Modal.Header>
      <Modal.Body className="h6-font" style={{ fontSize: "20px" }}>
        {children}
      </Modal.Body>
      <Modal.Footer>
        <Button
          style={{
            backgroundColor: "white",
            color: "black",
            borderColor: "white",
          }}
          onClick={handleConfirm}
        >
          확인
        </Button>
        <Button
          style={{
            backgroundColor: "white",
            color: "black",
            borderColor: "white",
          }}
          onClick={handleClose}
        >
          닫기
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CustomModal;

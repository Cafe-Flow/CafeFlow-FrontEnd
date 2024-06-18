import React from "react";
import { Modal, Button } from "react-bootstrap";

function CustomCheckModal({ show, handleClose, children, handleConfirm }) {
  return (
    <Modal show={show} onHide={handleClose} className="modal-position">
      <Modal.Header closeButton>
        <Modal.Title className="Logo-font">CafeFlow</Modal.Title>
      </Modal.Header>
      <Modal.Body className="h6-font" style={{ fontSize: "18px" }}>
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
          예
        </Button>
        <Button
          style={{
            backgroundColor: "white",
            color: "black",
            borderColor: "white",
          }}
          onClick={handleClose}
        >
          아니오
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CustomCheckModal;

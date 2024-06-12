import React, { useState } from "react";
import { BsPlusSquareFill } from "react-icons/bs";
import "./OrderList.css";
import { FaTimes } from "react-icons/fa";
import axios from "axios";

function AddMenuItemBar({ items, cafeId }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [price, setPrice] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleAddMenuItem = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
    setPrice("");
    setShowModal(false);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "/menus/cafe",
        {
          basicMenuId: selectedItem.id,
          cafeId: cafeId,
          price: price,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      console.log("Menu item added successfully:", response.data);

      handleCloseModal();
    } catch (error) {
      console.error("Error adding menu item:", error);
    }
  };

  return (
    <div className="menu-list">
      {items.map((item) => (
        <div key={item.name} className="menu-item">
          <img
            src={
              item.image
                ? `data:image/jpeg;base64,${item.image}`
                : "/img/default1.jpg"
            }
            alt={item.name}
          />
          <div className="menu-item-bar">
            <p>
              {item.name} {item.price ? `${item.price}원` : ""}
            </p>
            <BsPlusSquareFill onClick={() => handleAddMenuItem(item)} />
          </div>
        </div>
      ))}
      {showModal && (
        <div className="addmenu-modal">
          <FaTimes className="close-modal" onClick={handleCloseModal} />
          <div className="addmenu-modal-top">
            <h4>{selectedItem.name}</h4>
            <img
              src={
                selectedItem.image
                  ? `data:image/jpeg;base64,${selectedItem.image}`
                  : "/img/default1.jpg"
              }
              alt={selectedItem.name}
            />
          </div>
          <div className="addmenu-modal-content">
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="가격을 입력하세요"
            />
            <div className="tag">원</div>
          </div>
          <div className="addmenu-modal-bottom">
            <button onClick={handleSubmit}>추가</button>
            <button onClick={handleCloseModal}>취소</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddMenuItemBar;

import React, { useState } from "react";
import { FaBasketShopping } from "react-icons/fa6";
import "./OrderList.css";

function MenuItemBar({ items, onAddToCart }) {
  const [showQuantity, setShowQuantity] = useState({});
  const [quantities, setQuantities] = useState({});

  const handleBasketClick = (name, e) => {
    setShowQuantity((prevShowQuantity) => ({
      ...prevShowQuantity,
      [name]: !prevShowQuantity[name],
    }));
  };

  const increaseQuantity = (name) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [name]: (prevQuantities[name] || 1) + 1,
    }));
  };

  const decreaseQuantity = (name) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [name]: Math.max(1, (prevQuantities[name] || 1) - 1),
    }));
  };

  const handleAddToCart = (item, e) => {
    const quantity = quantities[item.name] || 1;
    onAddToCart({ ...item, quantity });
    setShowQuantity((prevShowQuantity) => ({
      ...prevShowQuantity,
      [item.name]: false,
    }));
  };

  return (
    <div className="menu-list">
      {items.map((item) => (
        <div key={item.id} className="menu-item">
          <img
            src={
              item.image
                ? `data:image/jpeg;base64,${item.image}`
                : "/img/default1.jpg"
            }
            alt={item.basicMenuName}
          />
          <div className="menu-item-bar">
            <p>
              {item.basicMenuName} {item.price}원
            </p>
            <FaBasketShopping
              onClick={(e) => handleBasketClick(item.basicMenuName, e)}
              style={{ cursor: "pointer" }}
            />
            {showQuantity[item.basicMenuName] && (
              <div
                className="quantity-container"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="quantity-button"
                  onClick={() => decreaseQuantity(item.name)}
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantities[item.name] || 1}
                  readOnly
                  min="1"
                />
                <button
                  className="quantity-button"
                  onClick={() => increaseQuantity(item.name)}
                >
                  +
                </button>
                <p>{item.price * (quantities[item.name] || 1)}원</p>
                <button onClick={(e) => handleAddToCart(item, e)}>추가</button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default MenuItemBar;

import React, { useState } from "react";
import { CiShoppingBasket } from "react-icons/ci";
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

  const handleQuantityChange = (name, value) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [name]: value,
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
        <div key={item.name} className="menu-item">
          <img src={item.image} alt={item.name} />
          <div className="menu-item-bar">
            <p>{item.name}</p>
            <CiShoppingBasket
              onClick={(e) => handleBasketClick(item.name, e)} // name 인자를 전달
              style={{ cursor: "pointer" }}
            />
            {showQuantity[item.name] && (
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

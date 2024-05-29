import React, { useState } from "react";
import "./OrderList.css";
import menuData from "./MenuItem.js";
import MenuItemBar from "./MenuItemBar.js";
import { CiShoppingBasket } from "react-icons/ci";

function OrderList() {
  const [selectedItem, setSelectedItem] = useState("🍹음료");
  const [selectedDetails, setSelectedDetails] = useState({
    전체상품: true,
    카페인: false,
    티: false,
    스무디: false,
    주스: false,
  });

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const handleCartClick = () => {
    setShowCart(!showCart);
  };

  const handleAddToCart = (newItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.name === newItem.name);
      if (existingItem) {
        return prevCart.map((item) =>
          item.name === newItem.name
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      } else {
        return [...prevCart, newItem];
      }
    });
  };

  const handleDetailChange = (detail) => {
    if (detail === "전체상품") {
      setSelectedDetails({
        전체상품: true,
        커피: false,
        디카페인: false,
        라떼: false,
        티: false,
        스무디: false,
        주스: false,
      });
    } else {
      setSelectedDetails((prevDetails) => ({
        ...prevDetails,
        전체상품: false,
        [detail]: !prevDetails[detail],
      }));
    }
  };

  const getSelectedMenuItems = () => {
    if (selectedDetails["전체상품"]) {
      return Object.values(menuData).flat();
    }

    const selectedMenuItems = Object.keys(selectedDetails).reduce(
      (acc, detail) => {
        if (selectedDetails[detail]) {
          return [...acc, ...menuData[detail]];
        }
        return acc;
      },
      []
    );

    console.log("Selected Menu Items: ", selectedMenuItems);
    return selectedMenuItems;
  };

  return (
    <div className="orderlist-page">
      <div className="orderlist-top">
        <h3>{selectedItem}</h3>
        <ul className="orderlist-list">
          {["🍹음료", "🥪푸드", "💬기타"].map((item) => (
            <li
              key={item}
              className={selectedItem === item ? "active" : ""}
              onClick={() => handleItemClick(item)}
            >
              {item}
            </li>
          ))}
        </ul>
        <div className="orderlist-bucket">
          <CiShoppingBasket />
          장바구니
          {cart.length > 0 && <span>{cart.length}</span>}
        </div>
        {showCart && (
          <div className="cart-modal">
            <h2>장바구니</h2>
            <ul>
              {cart.map((item) => (
                <li key={item.name}>
                  {item.name} - {item.quantity}개
                </li>
              ))}
            </ul>
            <button onClick={handleCartClick}>닫기</button>
          </div>
        )}
        {selectedItem === "🍹음료" && (
          <>
            <ul className="orderlist-list-detail">
              {["전체상품", "커피", "라떼", "티", "스무디", "주스"].map(
                (detail) => (
                  <li key={detail}>
                    <input
                      type="checkbox"
                      id={detail}
                      checked={selectedDetails[detail]}
                      onChange={() => handleDetailChange(detail)}
                    />
                    <label htmlFor={detail} style={{ cursor: "pointer" }}>
                      {detail}
                    </label>
                  </li>
                )
              )}
            </ul>
            <div className="orderlist-content">
              <MenuItemBar
                items={getSelectedMenuItems()}
                onAddToCart={handleAddToCart}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default OrderList;

import React, { useState } from "react";
import "./OrderList.css";
import menuData from "./MenuItem.js";
import MenuItemBar from "./MenuItemBar.js";
import { CiShoppingBasket } from "react-icons/ci";
import { FaRegTrashAlt } from "react-icons/fa";

function OrderList() {
  const [selectedItem, setSelectedItem] = useState("음료");
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

  const increaseQuantity = (itemName) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.name === itemName ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (itemName) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.name === itemName
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      )
    );
  };

  const getTotalQuantity = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleRemoveFromCart = (itemName) => {
    setCart((prevCart) => prevCart.filter((item) => item.name !== itemName));
  };

  const getItemPrice = (itemName) => {
    for (const category in menuData) {
      const item = menuData[category].find((i) => i.name === itemName);
      if (item) {
        return item.price;
      }
    }
    return 0;
  };

  const getTotalPrice = () => {
    return cart.reduce(
      (total, item) => total + item.quantity * getItemPrice(item.name),
      0
    );
  };

  return (
    <div className="orderlist-page">
      <div className="orderlist-top">
        <h3>{selectedItem}</h3>
        <ul className="orderlist-list">
          {["음료", "푸드", "기타"].map((item) => (
            <li
              key={item}
              className={selectedItem === item ? "active" : ""}
              onClick={() => handleItemClick(item)}
            >
              {item}
            </li>
          ))}
        </ul>
        <div onClick={handleCartClick} className="orderlist-bucket">
          <CiShoppingBasket />
          장바구니
          {getTotalQuantity() > 0 && (
            <span className="cart-count">{getTotalQuantity()}</span>
          )}
          {showCart && (
            <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
              <span onClick={handleCartClick}>&times;</span>
              <h5>장바구니</h5>
              <ul>
                {cart.map((item) => (
                  <li key={item.name}>
                    {item.name} {item.quantity}잔
                    <button onClick={() => decreaseQuantity(item.name)}>
                      -
                    </button>
                    <button onClick={() => increaseQuantity(item.name)}>
                      +
                    </button>
                    <p>{item.quantity * getItemPrice(item.name)}원</p>
                    <FaRegTrashAlt
                      onClick={() => handleRemoveFromCart(item.name)}
                    />
                  </li>
                ))}
              </ul>
              {getTotalQuantity() > 0 && (
                <div className="cart-modal-bottom">
                  <p>총 금액 : {getTotalPrice()}원</p>
                  <button>주문하기</button>
                </div>
              )}
            </div>
          )}
        </div>
        {selectedItem === "음료" && (
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

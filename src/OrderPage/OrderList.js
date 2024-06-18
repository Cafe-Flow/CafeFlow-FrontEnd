import React, { useState, useEffect } from "react";
import axios from "axios";
import "./OrderList.css";
import { useParams } from "react-router-dom";
import MenuItemBar from "./MenuItemBar.js";
import { CiShoppingBasket } from "react-icons/ci";
import { FaRegTrashAlt } from "react-icons/fa";

function OrderList() {
  const { idx: cafeId } = useParams();
  const [selectedItem, setSelectedItem] = useState("음료");
  const [selectedDetails, setSelectedDetails] = useState({});
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [basicMenu, setBasicMenu] = useState([]);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const [basicMenuResponse, menuItemsResponse] = await Promise.all([
          axios.get("/menus/basic", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
          }),
          axios.get(`/menus/cafe/${cafeId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
          }),
        ]);

        const basicMenuData = basicMenuResponse.data;
        const menuItemsData = menuItemsResponse.data.map((item) => {
          const basicMenuItem = basicMenuData.find(
            (menu) => menu.id === item.basicMenuId
          );
          return {
            ...item,
            type: basicMenuItem ? basicMenuItem.type : "기타",
          };
        });

        setMenuItems(menuItemsData);

        const types = new Set(menuItemsData.map((item) => item.type));
        const details = { 전체상품: true };
        types.forEach((type) => {
          details[type] = false;
        });
        setSelectedDetails(details);
        console.log(menuItems);
      } catch (error) {
        console.error("Error fetching menu data:", error);
      }
    };

    fetchMenus();
  }, [cafeId]);

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const handleCartClick = () => {
    setShowCart(!showCart);
  };

  const handleAddToCart = (newItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.basicMenuName === newItem.basicMenuName
      );
      if (existingItem) {
        return prevCart.map((item) =>
          item.basicMenuName === newItem.basicMenuName
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      } else {
        return [...prevCart, newItem];
      }
    });
  };

  const handleDetailChange = (detail) => {
    setSelectedDetails((prevDetails) => {
      if (detail === "전체상품") {
        const allDetails = Object.keys(prevDetails).reduce((acc, key) => {
          acc[key] = false;
          return acc;
        }, {});
        allDetails["전체상품"] = true;
        return allDetails;
      } else {
        return {
          ...prevDetails,
          전체상품: false,
          [detail]: !prevDetails[detail],
        };
      }
    });
  };

  const getSelectedMenuItems = () => {
    if (selectedDetails["전체상품"]) {
      return menuItems;
    }
    return menuItems.filter((item) => selectedDetails[item.type]);
  };

  const increaseQuantity = (itemName) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.basicMenuName === itemName
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (itemName) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.basicMenuName === itemName
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      )
    );
  };

  const getTotalQuantity = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleRemoveFromCart = (itemName) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.basicMenuName !== itemName)
    );
  };

  const getItemPrice = (itemName) => {
    const item = menuItems.find((i) => i.basicMenuName === itemName);
    return item ? item.price : 0;
  };

  const getTotalPrice = () => {
    return cart.reduce(
      (total, item) => total + item.quantity * getItemPrice(item.basicMenuName),
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
                  <li key={item.basicMenuName}>
                    {item.basicMenuName} {item.quantity}잔
                    <button
                      onClick={() => decreaseQuantity(item.basicMenuName)}
                    >
                      -
                    </button>
                    <button
                      onClick={() => increaseQuantity(item.basicMenuName)}
                    >
                      +
                    </button>
                    <p>{item.quantity * getItemPrice(item.basicMenuName)}원</p>
                    <FaRegTrashAlt
                      onClick={() => handleRemoveFromCart(item.basicMenuName)}
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
              {Object.keys(selectedDetails).map((detail) => (
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
              ))}
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

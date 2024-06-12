import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./OrderList.css";
import AddMenuItemBar from "./AddMenuItemBar";

function AddMenu() {
  const { idx: cafeId } = useParams();
  const [selectedItem, setSelectedItem] = useState("음료");
  const [basicMenu, setBasicMenu] = useState([]);
  const [selectedDetails, setSelectedDetails] = useState({});

  useEffect(() => {
    const fetchBasicMenu = async () => {
      try {
        const response = await axios.get("/menus/basic", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        });
        const menuData = response.data;
        setBasicMenu(response.data);
        const details = {};
        details["전체상품"] = true;
        menuData.forEach((item) => {
          if (!details[item.type]) {
            details[item.type] = false;
          }
        });
        setSelectedDetails(details);
      } catch (error) {
        console.error("Error fetching the basic menu:", error);
      }
    };
    fetchBasicMenu();
  }, []);

  const handleItemClick = (item) => {
    setSelectedItem(item);
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

  const getFilteredMenu = () => {
    if (selectedDetails["전체상품"]) {
      return basicMenu;
    }
    return basicMenu.filter((item) => selectedDetails[item.type]);
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
        <div className="orderlist-content">
          <h4>추가할 메뉴를 선택해주세요</h4>
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
          </>
          <AddMenuItemBar items={getFilteredMenu()} cafeId={cafeId} />
        </div>
      </div>
    </div>
  );
}

export default AddMenu;

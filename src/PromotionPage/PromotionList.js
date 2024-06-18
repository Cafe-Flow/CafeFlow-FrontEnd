import React, { useEffect, useState } from "react";
import "./promotionlist.css";
import axios from "axios";
import DetailPromotion from "./DetailPromotion";
import Pagination from "../Map/Pagination";
import CustomSkeleton from "./skeleton";

function PromotionList() {
  const [selectedItem, setSelectedItem] = useState("진행중인 이벤트");
  const [promotions, setPromotions] = useState([]);
  const [proceedingPromotions, setProceedingPromotions] = useState([]);
  const [upcomingPromotions, setUpcomingPromotions] = useState([]);
  const [endPromotions, setEndPromotions] = useState([]);
  const [cafes, setCafes] = useState({});
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage] = useState(8); 
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

    const fetchPromotions = async (sortBy) => {
      try {
        const response = await axios.get(
          `/api/cafe/promotion?sort-by=${sortBy}`
        );
return response.data;
      } catch (error) {
        console.error(
          `Error fetching promotions with sortBy ${sortBy}:`,
          error
        );
        return [];
      }
    };

    const fetchAllData = async () => {
      setIsLoading(true);
      setProceedingPromotions(await fetchPromotions("proceeding"));
      setUpcomingPromotions(await fetchPromotions("upcoming"));
      setEndPromotions(await fetchPromotions("end"));
      setPromotions(await fetchPromotions("proceeding"));
      setIsLoading(false);
    };

    fetchAllData();
  }, []);

  const handleItemClick = (item) => {
    setSelectedItem(item);

    if (item === "진행중인 이벤트") {
      setPromotions(proceedingPromotions);
    } else if (item === "진행예정인 이벤트") {
      setPromotions(upcomingPromotions);
    } else if (item === "진행 끝난 이벤트") {
      setPromotions(endPromotions);
    }
    setCurrentPage(1);
  };

    const openModal = (promotion) => {
      setSelectedPromotion(promotion);
      setIsModalOpen(true);
    };

    const closeModal = () => {
      setIsModalOpen(false);
      setSelectedPromotion(null);
  };
  

    const indexOfLastResult = currentPage * resultsPerPage;
    const indexOfFirstResult = indexOfLastResult - resultsPerPage;
    const currentPromotions = promotions.slice(
      indexOfFirstResult,
      indexOfLastResult
    );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  

  return (
    <div className="promotion-container">
      <div className="promotion-container-top">
        <h3>이벤트</h3>
      </div>
      <ul className="promotion-list">
        {["진행중인 이벤트", "진행예정인 이벤트", "진행 끝난 이벤트"].map(
          (item) => (
            <li
              key={item}
              className={selectedItem === item ? "active" : ""}
              onClick={() => handleItemClick(item)}
            >
              {item}
            </li>
          )
        )}
      </ul>
      <div className="promotion-container-center">
        {isLoading ? (
          <ul>
            {Array.from({ length: resultsPerPage }).map((_, index) => (
              <li key={index}>
                <CustomSkeleton />
              </li>
            ))}
          </ul>
        ) : (
          <ul>
            {currentPromotions.map((promotion) => {
              const startDate = promotion.startDate.split("T")[0];
              const endDate = promotion.endDate.split("T")[0];
              return (
                <li key={promotion.id} onClick={() => openModal(promotion)}>
                  <div className="image-container">
                    <img
                      src={`data:image/jpeg;base64,${promotion.image}`}
                      alt={promotion.title}
                    />
                  </div>
                  <p>
                    <strong>{promotion.cafeName}</strong>
                  </p>
                  <p>{promotion.description}</p>
                  <p>
                    <strong>
                      {startDate} ~ {endDate}
                    </strong>
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <div className="promotion-container-bottom"></div>
      <Pagination
        resultsPerPage={resultsPerPage}
        totalResults={promotions.length}
        paginate={paginate}
        currentPage={currentPage}
      />
      <DetailPromotion
        isOpen={isModalOpen}
        onClose={closeModal}
        promotion={selectedPromotion}
      />
    </div>
  );
}

export default PromotionList;

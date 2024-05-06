import Sidebar from "./Sidebar";
import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";

function Modify() {
  const [userInfo, setUserInfo] = useState({
    id: "",
    username: "",
    nickname: "",
    email: "",
    gender: "",
    age: "",
    cityId: "",
    stateId: "",
    image: null,
  });

  const [tempUserInfo, setTempUserInfo] = useState({ ...userInfo });

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("/img/default.png");
  const [image, setImage] = useState(null);

  useEffect(() => {
    const storedUserInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (storedUserInfo) {
      setUserInfo(storedUserInfo);
      setTempUserInfo(storedUserInfo);
      setPreviewUrl(`data:image/jpeg;base64,${tempUserInfo.image}`);
      fetchStates(storedUserInfo.stateId);
      fetchStateName(storedUserInfo.stateId);
      fetchCityName(storedUserInfo.stateId, storedUserInfo.cityId);
    }
    fetchStates();
  }, []);

  const fetchStates = async (initialStateId) => {
    const response = await fetch("http://localhost:8080/api/locations/states");
    const data = await response.json();
    setStates(data);
    if (initialStateId) {
      fetchCities(initialStateId);
    }
  };

  const fetchCities = async (stateId) => {
    const response = await fetch(
      `http://localhost:8080/api/locations/states/${stateId}/cities`
    );
    const data = await response.json();
    setCities(data);
    console.log(data);
  };

  const handleStateChange = (event) => {
    const stateId = event.target.value;
    fetchCities(stateId);
    setUserInfo((prev) => ({
      ...prev,
      stateId: stateId,
      cityId: "",
    }));
  };

  const handleCityChange = (event) => {
    const cityId = event.target.value;
    setUserInfo((prev) => ({
      ...prev,
      cityId: cityId,
    }));
  };

  const handleModify = () => {
    setTempUserInfo({ ...userInfo });
    setIsModalOpen(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setTempUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTempUserInfo({ ...userInfo });
    setPreviewUrl(`data:image/jpeg;base64,${userInfo.image}`);
    setImage(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const userToken = localStorage.getItem("userToken");
    const formData = new FormData();

    formData.append("username", tempUserInfo.username);
    formData.append("nickname", tempUserInfo.nickname);
    formData.append("loginId", tempUserInfo.loginId);
    formData.append("email", tempUserInfo.email);
    formData.append("gender", tempUserInfo.gender);
    formData.append("age", tempUserInfo.age);
    formData.append("stateId", tempUserInfo.stateId);
    formData.append("cityId", tempUserInfo.cityId);
    formData.append("userType", tempUserInfo.userType);
    formData.append("image", image);

    try {
      const response = await fetch(
        `http://localhost:8080/api/auth/${userInfo.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setUserInfo(tempUserInfo);
      alert("프로필이 성공적으로 업데이트되었습니다.");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("프로필 업데이트에 실패했습니다.");
    } finally {
      setLoading(false); // 로딩 종료
      setIsModalOpen(false); // 모달 닫기
    }
  };

  const fetchStateName = async (stateId) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8080/api/locations/states`
      );
      const data = await response.json();
      const state = data.find((state) => state.id === stateId);
      setUserInfo((prev) => ({
        ...prev,
        stateName: state ? state.name : "지역 정보 없음",
      }));
    } catch (error) {
      console.error("Failed to fetch state name:", error);
    }
  };

  const fetchCityName = async (stateId, cityId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/locations/states/${stateId}/cities`
      );
      const cities = await response.json();
      const city = cities.find((city) => city.id === cityId);
      setUserInfo((prev) => ({ ...prev, cityName: city.name }));
    } catch (error) {
      console.error("Failed to fetch city name:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
        setImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div className="mypage">
        <Sidebar />
        <div className="mypage-card">
          <div className="mypage-header">
            <p className="header-font">회원정보 수정</p>
            <p className="h6-font">
              회원님의 소중한 개인정보를 위해 회원 정보를 주기적으로
              수정해주세요
            </p>
          </div>
          <div className="mypage-modify-display">
            {userInfo.image && (
              <img
                src={`data:image/jpeg;base64,${userInfo.image}`}
                className="profile-image"
                alt="Profile"
              />
            )}
            <p>
              <span className="nickname-style">{userInfo.nickname}</span>{" "}
              <span
                className={
                  userInfo.userType === "ADMIN" ? "admin-style" : "member-style"
                }
              >
                {userInfo.userType === "ADMIN"
                  ? "카페 관리자"
                  : "서비스 이용자"}
              </span>
            </p>
            <p>이름: {userInfo.username}</p>
            <p>E-Mail: {userInfo.email}</p>
            <p>나이: {userInfo.age}</p>
            {userInfo.gender === "male" ? (
              <img
                src="/img/man.png"
                alt="Male"
                style={{ width: "30px", height: "100px" }}
              />
            ) : (
              <img
                src="/img/woman.png"
                alt="Female"
                style={{ width: "30px", height: "100px" }}
              />
            )}
            <p>
              지역:{" "}
              {loading
                ? "불러오는중.."
                : `${userInfo.stateName} ${userInfo.cityName}`}
            </p>
            <div onClick={handleModify} className="custom-modify-button">
              회원정보 수정
            </div>
          </div>
        </div>
      </div>
      <Modal show={isModalOpen} onHide={handleCloseModal} size="lg">
        <Modal.Header>
          <div className="h6-font">
            <Modal.Title>회원정보 수정</Modal.Title>
          </div>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formProfileImage">
            <Form.Label className="form-label">프로필 이미지</Form.Label>
            <div>
              {userInfo.image && (
                <img
                  src={previewUrl}
                  className="profile-image"
                  alt="Profile Preview"
                />
              )}
              <Form.Control
                type="file"
                name="image/*"
                onChange={handleImageChange}
              />
            </div>
          </Form.Group>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formNickname">
              <Form.Label className="form-label">닉네임</Form.Label>
              <Form.Control
                type="text"
                name="nickname"
                value={tempUserInfo.nickname}
                onChange={handleChange}
                minLength="2"
                maxLength="8"
              />
            </Form.Group>
            <Form.Group controlId="formName">
              <Form.Label className="form-label">이름</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={tempUserInfo.username}
                onChange={handleChange}
                minLength="2"
                maxLength="4"
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label className="form-label">이메일</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={tempUserInfo.email}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formAge">
              <Form.Label className="form-label">나이</Form.Label>
              <Form.Control
                type="number"
                name="age"
                value={tempUserInfo.age}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formGender">
              <Form.Label className="form-label">성별</Form.Label>
              <Form.Select
                name="gender"
                value={tempUserInfo.gender}
                onChange={handleChange}
              >
                <option value="male">남</option>
                <option value="female">여</option>
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="formState">
              <Form.Label className="form-label">지역 (주/도)</Form.Label>
              <Form.Select
                value={tempUserInfo.stateId}
                onChange={handleStateChange}
              >
                {states.map((state) => (
                  <option key={state.id} value={state.id}>
                    {state.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="formCity">
              <Form.Label className="form-label">도시</Form.Label>
              <Form.Select
                value={tempUserInfo.cityId || ""}
                onChange={handleCityChange}
              >
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <div className="form-modify-button" onClick={handleSubmit}>
              정보 저장
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Modify;

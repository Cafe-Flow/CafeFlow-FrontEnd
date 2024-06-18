import React, { useState } from 'react';
import axios from 'axios';
import { Modal, Button, Form, FloatingLabel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './ShopRegister.css';
import useSeatStore from '../SeatPage/SeatStore';
import SeatRegister from '../SeatPage/SeatRegister';
import Dropzone from './dropzone';

function ShopRegister() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');
    const [cafeList, setCafeList] = useState([]);
    const [selectedCafe, setSelectedCafe] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [imageFile, setImageFile] = useState(null); // 이미지 파일 상태 추가
    const seats = useSeatStore((state) => state.seats);
    const setSeats = useSeatStore((state) => state.setSeats);
    const [errors, setErrors] = useState({
        nameError: '',
        addressError: '',
        descriptionError: '',
        regionError: '',
        stateError: '',
        cityError: ''
    });

    const handleCafeSelection = (cafe) => {
        setSelectedCafe(cafe);
    };

    const handleNextButtonClick = () => {
        if (!validateForm()) {
            return;
        }
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
    };

    const handleModalSubmit = async () => {
        try {
            const isAdmin = localStorage.getItem("userInfo");
    
            const userInfo = JSON.parse(isAdmin);
    
            if (userInfo && userInfo.userType === "ADMIN") {
                console.log("Image File:", imageFile); // 확인용 로그
    
                const token = localStorage.getItem("userToken");
    
                const formData = new FormData();
                formData.append('name', name);
                formData.append('address', address);
                formData.append('description', description);
                formData.append('mapx', selectedCafe.mapx);
                formData.append('mapy', selectedCafe.mapy);
                if(imageFile){
                    formData.append('image', imageFile);
                }
                const headers = {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                };
    
                const response = await axios.post('/api/register-cafe', formData, { headers });
    
                console.log('Cafe registered successfully:', response.data);
                const shopid = response.data;
                handleSeatData(seats);
    
                const seatDataForPost = JSON.stringify(seats.map(seat => ({
                    seatHasPlug: seat.plug,
                    seatSize: seat.size,
                    seatNumber: seat.id,
                    seatAngle: seat.orientation === "HORIZONTAL" ? "HORIZONTAL" : "VERTICAL",
                    seatCoordinates: {
                        x: seat.position.x,
                        y: seat.position.y
                    }
                })));
    
                await axios.post(
                    `/api/cafe/${shopid}/seat-register`,
                    seatDataForPost,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        }
                    }
                );
    
                setSeats([]);
    
                setShowModal(false);
                navigate(`/shop/${shopid}`);
            } else {
                console.error('User is not an ADMIN');
            }
        } catch (error) {
            console.error('Error registering cafe:', error);
        }
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = { ...errors };

        if (!description.trim()) {
            newErrors.descriptionError = '카페 설명을 입력하세요.';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSeatData = (data) => {
        setSeats(data);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleSearch = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/register-cafe?search=${searchTerm}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setCafeList(data.items);
            setShowSearchModal(true);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const [showSearchModal, setShowSearchModal] = useState(false);

    const handleSearchModalClose = () => {
        setShowSearchModal(false);
    };

    const handleCompleteSelection = () => {
        if (selectedCafe) {
            setName(selectedCafe.title.replace(/<[^>]+>/g, ''));
            setAddress(selectedCafe.address);
            setSelectedCafe(selectedCafe);
        }
        setShowSearchModal(false);
    };

    const handleImageDrop = (file) => {
        console.log('Image file:', file);
        setImageFile(file);
    };

    return (
        <div className="register-cafe">
            <div className='h2-font'><p>카페등록</p></div>
            <div className="cafe-register-img"><img src='/img/cafe-img.png' alt="카페 등록 이미지" /></div>
            <br />
            <div id="cafe-description">
                <h2>카페 검색 및 선택</h2>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="검색어를 입력하세요"
                    style={{ padding: '10px', width: '420px' }}
                />
                <Button onClick={handleSearch} className="research-button" style={{ background: "black", padding: '10px 20px', marginLeft: '10px' }}>검색</Button>
                {selectedCafe && (
                    <div>
                        <h2 dangerouslySetInnerHTML={{ __html: selectedCafe.title }} />
                        <p>주소: {selectedCafe.address}</p>
                        <p>도로명 주소: {selectedCafe.roadAddress}</p>
                        <a href={selectedCafe.link} target="_blank" rel="noopener noreferrer">
                            웹사이트 방문
                        </a>                        
                    </div>
                )}
                {loading && <p>로딩 중...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
            <div id="cafe-description">
                <FloatingLabel controlId="floatingTextarea" label="카페 설명">
                    <Form.Control
                        as="textarea"
                        placeholder="카페 설명을 입력하세요"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        isInvalid={!!errors.descriptionError}
                    />
                    <Form.Control.Feedback type="invalid">{errors.descriptionError}</Form.Control.Feedback>
                </FloatingLabel>
            </div>
            <Dropzone onDrop={handleImageDrop} />
            <Button onClick={handleNextButtonClick} className="register-button" style={{ background: "black" }}>다음</Button>

            <Modal show={showModal} onHide={handleModalClose} dialogClassName="modal-xl">

                <Modal.Header closeButton>
                    <Modal.Title>좌석 등록</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <SeatRegister existingSeats={seats} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>닫기</Button>
                    <Button variant="primary" onClick={handleModalSubmit}>등록</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showSearchModal} onHide={handleSearchModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>카페 검색 결과</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ul>
                        {cafeList.map((cafe, index) => (
                            <li
                                key={index}
                                style={{
                                    margin: '20px 0',
                                    listStyleType: 'none',
                                    cursor: 'pointer',
                                    backgroundColor: selectedCafe === cafe ? '#e0e0e0' : 'transparent'
                                }}
                                onClick={() => handleCafeSelection(cafe)} // Handle cafe selection
                            >
                                <h2 dangerouslySetInnerHTML={{ __html: cafe.title }} />
                                <p>주소: {cafe.address}</p>
                                <p>도로명 주소: {cafe.roadAddress}</p>
                                <a href={cafe.link} target="_blank" rel="noopener noreferrer">
                                    웹사이트 방문
                                </a>
                            </li>
                        ))}
                    </ul>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleSearchModalClose}>닫기</Button>
                    <Button variant="primary" onClick={handleCompleteSelection}>완료</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ShopRegister;

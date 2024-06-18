import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, Form, FloatingLabel } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import './ShopRegister.css';
import useSeatStore from '../SeatPage/SeatStore';
import SeatRegister from '../SeatPage/SeatRegister';
import Dropzone from './dropzone';

function ShopModify() {
    const { idx } = useParams();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');
    const [selectedCafe, setSelectedCafe] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const seats = useSeatStore((state) => state.seats);
    const setSeats = useSeatStore((state) => state.setSeats);
    const [errors, setErrors] = useState({
        nameError: '',
        addressError: '',
        descriptionError: '',
    });

    const [cafeList, setCafeList] = useState([]);
    const [showSearchModal, setShowSearchModal] = useState(false);

    useEffect(() => {
        const fetchCafeData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`/api/cafe/${idx}`);
                const cafeData = response.data;
                setSelectedCafe(cafeData);
                setName(cafeData.name || '');
                setAddress(cafeData.address || '');
                setDescription(cafeData.description || '');
                setSeats(cafeData.seats || []);
            } catch (error) {
                setError('Failed to fetch cafe data');
            } finally {
                setLoading(false);
            }
        };
        fetchCafeData();
    }, [idx, setSeats]);

    const handleModalClose = () => {
        setShowModal(false);
    };

    const handleNextButtonClick = () => {
        if (!validateForm()) {
            return;
        }
        setShowModal(true);
    };

    const handleModalSubmit = async () => {
        try {
            const isAdmin = localStorage.getItem("userInfo");
            const userInfo = JSON.parse(isAdmin);
    
            if (userInfo && userInfo.userType === "ADMIN") {
                const token = localStorage.getItem("userToken");
                const formData = new FormData();
                formData.append('name', name);
                formData.append('address', address);
                formData.append('description', description);
                formData.append('mapx', selectedCafe.mapx);
                formData.append('mapy', selectedCafe.mapy);
                if (imageFile) {
                    formData.append('image', imageFile);
                }
    
                const headers = {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                };
    
                const response = await axios.put(`/api/cafe/${idx}`, formData, { headers });
    
                console.log('Cafe updated successfully:', response.data);
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
    
                await axios.put(
                    `/api/cafe/${idx}/seat`,
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
                navigate(`/shop/${idx}`);
            } else {
                console.error('User is not an ADMIN');
            }
        } catch (error) {
            console.error('Error updating cafe:', error);
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

    const handleImageDrop = (file) => {
        setImageFile(file);
    };

    const handleSearch = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`/api/register-cafe?search=${searchTerm}`);
            if (response.status !== 200) {
                throw new Error('Network response was not ok');
            }
            const data = response.data;
            setCafeList(data.items);
            setShowSearchModal(true);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleCafeSelection = (cafe) => {
        setSelectedCafe(cafe);
    };

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

    return (
        <div className="register-cafe">
            <div className='h2-font'><p>카페 수정</p></div>
            <div className="cafe-register-img"><img src='/img/cafe-img.png' alt="카페 수정 이미지" /></div>
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
                        <h2 dangerouslySetInnerHTML={{ __html: selectedCafe.title || selectedCafe.name }} />
                        <p>주소: {selectedCafe.address}</p>
                        <p>도로명 주소: {selectedCafe.roadAddress}</p>
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
                    <Modal.Title>좌석 수정</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <SeatRegister existingSeats={seats} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>닫기</Button>
                    <Button variant="primary" onClick={handleModalSubmit}>저장</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showSearchModal} onHide={handleSearchModalClose} dialogClassName="modal-lg">
                <Modal.Header closeButton>
                    <Modal.Title>카페 검색 결과</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {cafeList.map((cafe) => (
                        <div
                            key={cafe.id}
                            onClick={() => handleCafeSelection(cafe)}
                            style={{ padding: '10px', cursor: 'pointer' }}
                        >
                            <h2 dangerouslySetInnerHTML={{ __html: cafe.title }} />
                            <p>주소: {cafe.address}</p>
                            <p>도로명 주소: {cafe.roadAddress}</p>
                        </div>
                    ))}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleSearchModalClose}>닫기</Button>
                    <Button variant="primary" onClick={handleCompleteSelection}>선택 완료</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ShopModify;

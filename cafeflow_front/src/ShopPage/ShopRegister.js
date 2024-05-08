import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form, FloatingLabel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './ShopRegister.css';
import useSeatStore from '../SeatPage/SeatStore';
import SeatRegister from '../SeatPage/SeatRegister';

function ShopRegister() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');
    const [region, setRegion] = useState('');
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [showModal, setShowModal] = useState(false);
    const seats = useSeatStore((state) => state.seats); // Get seats from the store
    const setSeats = useSeatStore((state) => state.setSeats); // Get function to update seats from the store
    const [errors, setErrors] = useState({
        nameError: '',
        addressError: '',
        descriptionError: '',
        regionError: '',
        stateError: '',
        cityError: ''
    });

    useEffect(() => {
        const fetchStates = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/locations/states');
                setStates(response.data);
            } catch (error) { 
                console.error('Error fetching states:', error);
            }
        };

        fetchStates();
    }, []);

    useEffect(() => {
        const fetchCities = async (state) => {
            try {
                const response = await axios.get(`http://localhost:8080/api/locations/states/${state}/cities`);
                setCities(response.data);
            } catch (error) {
                console.error('Error fetching cities:', error);
            }
        };

        if (selectedState) {
            fetchCities(selectedState);
        }
    }, [selectedState]);

    const validateForm = () => {
        let isValid = true;
        const newErrors = { ...errors };

        if (!name.trim()) {
            newErrors.nameError = '카페 이름을 입력하세요.';
            isValid = false;
        }

        if (!address.trim()) {
            newErrors.addressError = '주소를 입력하세요.';
            isValid = false;
        }

        if (!description.trim()) {
            newErrors.descriptionError = '카페 설명을 입력하세요.';
            isValid = false;
        }

        if (!region.trim()) {
            newErrors.regionError = '지역을 입력하세요.';
            isValid = false;
        }

        if (!selectedState) {
            newErrors.stateError = '주/도를 선택하세요.';
            isValid = false;
        }

        if (!selectedCity) {
            newErrors.cityError = '도시를 선택하세요.';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
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
            
            // Parse the userInfo JSON string
            const userInfo = JSON.parse(isAdmin);
            
            // Check if the userType is ADMIN
            if (userInfo && userInfo.userType === "ADMIN") {
                // Proceed with the POST request
                const token = localStorage.getItem("userToken");
                const headers = {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                };
    
                const response = await axios.post('http://localhost:8080/api/register-cafe', {
                    name,
                    address,
                    description,
                    mapx: 123331,
                    mapy: 1111111
                }, { headers });
    
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
    
                // 좌석 정보를 서버에 저장
                await axios.post(`http://localhost:8080/api/cafe/${shopid}/seat-register`, seatDataForPost, { headers });
    
                // Clear the seats data after successful registration
                setSeats([]);
    
                // 모달 닫기 및 페이지 이동
                setShowModal(false);
                navigate(`/shop/${shopid}`);
            } else {
                // Display an error message or handle the case where the user is not an ADMIN
                console.error('User is not an ADMIN');
            }
        } catch (error) {
            console.error('Error registering cafe:', error);
        }
    };
    

    const handleSeatData = (data) => {
        setSeats(data); // 기존의 좌석 데이터 대신 새로운 좌석 데이터로 업데이트
    }; 

    return (
        <div className="register-cafe">
            <div className='h2-font'><p>카페등록</p></div>
            <div class="cafe-register-img"><img src='/img/cafe-img.png'/></div>
            <br />
            <div id="cafe-name">
                <FloatingLabel controlId="floatingInput" label="카페 이름">
                    <Form.Control
                        type="text"
                        placeholder="카페 이름을 입력하세요"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        isInvalid={!!errors.nameError}
                    />
                    <Form.Control.Feedback type="invalid">{errors.nameError}</Form.Control.Feedback>
                </FloatingLabel>
            </div>
            <div id="cafe-address">
                <FloatingLabel controlId="floatingInput" label="주소">
                    <Form.Control
                        type="text"
                        placeholder="주소를 입력하세요"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        isInvalid={!!errors.addressError}
                    />
                    <Form.Control.Feedback type="invalid">{errors.addressError}</Form.Control.Feedback>
                </FloatingLabel>
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
            <div id="cafe-region">
                <FloatingLabel controlId="floatingInput" label="지역">
                    <Form.Control
                        type="text"
                        placeholder="지역을 입력하세요"
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        isInvalid={!!errors.regionError}
                    />
                    <Form.Control.Feedback type="invalid">{errors.regionError}</Form.Control.Feedback>
                </FloatingLabel>
            </div>
            <div id="cafe-state">
                <Form.Select className="mb-3" value={selectedState} onChange={(e) => setSelectedState(e.target.value)} isInvalid={!!errors.stateError}>
                    <option value="">주/도를 선택하세요</option>
                    {states.map(state => (
                        <option key={state.id} value={state.id}>{state.name}</option>
                    ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.stateError}</Form.Control.Feedback>
            </div>
            <div id="cafe-city">
                <Form.Select className="mb-3" value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} isInvalid={!!errors.cityError}>
                    <option value="">도시를 선택하세요</option>
                    {cities.map(city => (
                        <option key={city.id} value={city.id}>{city.name}</option>
                    ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.cityError}</Form.Control.Feedback>
            </div>
            <Button onClick={handleNextButtonClick} className="register-button" style={{background: "black"}}>다음</Button>
            {/* Modal for SeatRegister */}
            <Modal show={showModal} onHide={handleModalClose} dialogClassName="modal-xl">
                <Modal.Header closeButton>
                    <Modal.Title>좌석 등록</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <SeatRegister existingSeats={seats}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>닫기</Button>
                    <Button variant="primary" onClick={handleModalSubmit}>등록</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ShopRegister;

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Modal, Form, FloatingLabel} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Password() {
    const navigate = useNavigate();
    const [focused, setFocused] = useState(false);
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });

    const {currentPassword, newPassword, confirmNewPassword } = passwords;
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showFailModal, setShowFailModal] = useState(false);
    const [apiError, setApiError] = useState('');


    const handleFocus = () => {
        setFocused(true);
    };

    const handleBlur = () => {
        setFocused(false);
    };

    const getPasswordValidationMessage = () => {
        if (newPassword.length > 0 && newPassword.length < 8) {
            return { message: "비밀번호는 8자 이상이어야 합니다. X", isValid: false };
        } else if (newPassword.length >= 8) {
            return { message: "비밀번호는 8자 이상이어야 합니다. O", isValid: true };
        } else if (newPassword.length == 0) {
            return { message: "비밀번호는 8자 이상어야 합니다."}
        }
        return { message: "", isValid: false };
    };

    const { message, isValid } = getPasswordValidationMessage();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPasswords({
            ...passwords,
            [name]: value
        });
    };

    const canSubmit = () => {
        return (
            currentPassword.length > 0 &&
            newPassword.length > 0 &&
            confirmNewPassword.length > 0 &&
            newPassword === confirmNewPassword
        );
    };

    const handleSubmit = async () => {
        const userId = JSON.parse(localStorage.getItem('userInfo')).id; // 사용자 ID 추출
    
        if (canSubmit()) {
            try {
                const response = await fetch(`http://localhost:8080/api/auth/change-password/${userId}`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: new URLSearchParams({
                        currentPassword: passwords.currentPassword,
                        newPassword: passwords.newPassword,
                        confirmPassword: passwords.confirmNewPassword
                    }).toString()
                });

                const responseData = await response.text();

                if (response.ok) {
                    setShowSuccessModal(true);
                    setPasswords({
                        currentPassword: '',
                        newPassword: '',
                        confirmNewPassword: ''
                    });
                } else {
                    setApiError(responseData.message);
                    setShowFailModal(true);
                }
            } catch (error) {
                console.error('비밀번호 변경 요청 중 오류 발생:', error);
                setApiError('서버 오류가 발생했습니다.');
                setShowFailModal(true);
            }
        } else {
            setApiError('입력 조건을 만족하지 못했습니다.');
            setShowFailModal(true);
        }
    };

    return (
        <div className='mypage'>
            <Sidebar />
            <div className="mypage-card">
                <div className='mypage-header'>                
                    <p className='header-font'>비밀번호 변경</p>
                    <p className='h6-font'>비밀번호 재확인을 통해 비밀번호를 변경 해드릴게요</p>
                </div>
                <Form className='password-change-form' onSubmit={handleSubmit}>
                    <FloatingLabel controlId="floatingCurrentPassword" label="현재 비밀번호" className="mb-3">
                        <Form.Control 
                            type="password"
                            placeholder="현재 비밀번호"
                            name="currentPassword"
                            value={currentPassword}
                            onChange={handleInputChange}
                        />
                    </FloatingLabel>
                    <FloatingLabel controlId="floatingNewPassword" label="새 비밀번호" className="mb-3">
                        <Form.Control 
                            type="password"
                            placeholder="새 비밀번호"
                            name="newPassword"
                            value={newPassword}
                            onChange={handleInputChange}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                        />
             {focused && (
                <Form.Text style={{ color: isValid ? 'green' : 'red', fontSize: '15px' }}>
                    {message}
                </Form.Text>
            )}
                   </FloatingLabel>
                    <FloatingLabel controlId="floatingConfirmNewPassword" label="새 비밀번호 확인">
                        <Form.Control 
                            type="password"
                            placeholder="새 비밀번호 확인"
                            name="confirmNewPassword"
                            value={confirmNewPassword}
                            onChange={handleInputChange}
                        />
                    </FloatingLabel>
                    <div className={`custom-change-button ${canSubmit() ? 'button-active' : 'button-inactive'}`} onClick={handleSubmit}>
                        완료
                    </div>
                </Form>
                <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)}  className='modal-position'>
                    <Modal.Header>
                        <Modal.Title className='Logo-font'>CafeFlow</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className='h6-font' style={{fontSize : "20px"}}>☕비밀번호가 성공적으로 변경되었습니다!☕</Modal.Body>
                </Modal>
                <Modal show={showFailModal} onHide={() => setShowFailModal(false)} className='modal-position'>
                    <Modal.Header closeButton>
                        <Modal.Title className='Logo-font'>CafeFlow</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className='h6-font' style={{fontSize : "20px"}}>{apiError}</Modal.Body>
                </Modal>
            </div>
        </div>
    );
}

export default Password;

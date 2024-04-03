import React, { useState } from 'react';
import './Register.css'
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Form, FloatingLabel, Container, Card} from 'react-bootstrap';

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showModal, setShowModal] = useState(false); // 모달 표시 상태

  const validateForm = () => {
    let isValid = true;
    if (!email) {
      setEmailError('아이디를 입력해주세요.');
      isValid = false;
    } else {
      setEmailError('');
    }
    if (!password) {
      setPasswordError('비밀번호를 입력해주세요.');
      isValid = false;
    } else {
      setPasswordError('');
    }
    return isValid;
  };

  const handleSignupTypeSelection = (userType) => {
    setShowModal(false); // 모달 닫기
    if (userType === 'admin') {
      navigate('/adminSignup');
    } else {
      navigate('/userSignup');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateForm()) {
      console.log(email, password);
      navigate('/');
    }
  };

  return (
    <div className='login-container'>
      <Form className='input-box' style={{ display: 'flex', flexDirection: 'column' }} onSubmit={handleSubmit}>
        <div className='h1-font'>
        <p>Cafe-Flow</p>
        </div>
        <div className='h6-font'><p>카페 플로우와 함께 즐거운 시간 되세요</p>
        </div>
        <FloatingLabel controlId="floatingInput" label="아이디" className="mb-3">
          <Form.Control type="text" placeholder="name@example.com" isInvalid={!!emailError}
            onChange={(e) => setEmail(e.target.value)}/>
            <Form.Control.Feedback type="invalid">
              {emailError}
            </Form.Control.Feedback>
          </FloatingLabel>
          <FloatingLabel controlId="floatingPassword" label="비밀번호">
          <Form.Control
            type="password"
            placeholder="Password"
            isInvalid={!!passwordError}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Form.Control.Feedback type="invalid">
            {passwordError}
          </Form.Control.Feedback>
        </FloatingLabel>
          <div style={{ paddingBottom: '10px', paddingTop: '10px', display: 'flex', alignItems: 'center'}}>
            <input type='checkbox' onChange={(e) => setIsChecked(e.target.checked)} checked={isChecked}
              id="checkbox"style={{ margin:"10px" }}/>
              <label htmlFor="checkbox">
                로그인 상태 유지
              </label>
          </div>   
      <Button type="submit" style={{ border: "none", backgroundColor: "black", color: "white", height: "60px"}}>
        로그인
      </Button>
      <div className='new-sign-box'>
      <p><span onClick={() => {console.log(1)}}>아이디/비밀번호 찾기  </span>
      <span onClick={() =>  setShowModal(true)}>|  회원가입</span>
      </p>
      </div>
      </Form> 
      <Modal show={showModal} onHide={() => setShowModal(false)} size='lg'>
        <Modal.Header closeButton>
          <div className="h6-font"> 
          <Modal.Title>회원가입 유형 선택</Modal.Title>
          </div>
        </Modal.Header>
        <Modal.Body className="custom-modal-body">
          <div className='signup-select'>
          <div className='admin-select' onClick={() => handleSignupTypeSelection('admin')}>
          <img src="/관리자1.png" alt="카페 관리자" />
            카페 관리자
          </div>
          <div className='admin-select' onClick={() => handleSignupTypeSelection('user')}>
          <img src="/손님1.png" alt="서비스 이용자" />
            서비스 이용자
          </div>
          </div>
        </Modal.Body>
      </Modal>
      </div>
  );
}

export default LoginPage;


import React, { useState } from 'react';
import './Register.css'
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Form, FloatingLabel} from 'react-bootstrap';

function LoginPage() {
  const navigate = useNavigate();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [loginIdError, setLoginIdError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showModal, setShowModal] = useState(false); 
  const [apiError, setApiError] = useState('');

  const validateForm = () => {
    let isValid = true;
    if (!loginId) {
      setLoginIdError('아이디를 입력해주세요.');
      isValid = false;
    } else {
      setLoginIdError('');
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

  const handleUserInfoFetch = async (token) => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('userInfo', JSON.stringify(data));
      } else {
        throw new Error(data.message || '정보 불러오기 실패');
      }
    } catch (error) {
      console.error('에러', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (validateForm()) {
      const loginUrl = 'http://localhost:8080/api/auth/login';
  
      try {
        const response = await fetch(loginUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            loginId: loginId,
            password: password,
          }),
        });
  
        const responseData = await response.json();
  
        if (response.ok) {
          console.log('로그인 성공:', responseData);
          localStorage.setItem('userToken', responseData.token);
          await handleUserInfoFetch(responseData.token);
          navigate('/');
        } else {
          setApiError(responseData.message)
          console.error('로그인 실패:', responseData);
        }
      } catch (error) {
        setApiError('로그인 요청에 실패 했습니다')
        console.error('로그인 요청 실패:', error);
      }
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
          <Form.Control type="text" placeholder="name@example.com" isInvalid={!!loginIdError}
            onChange={(e) => setLoginId(e.target.value)}/>
            <Form.Control.Feedback type="invalid">
              {loginIdError}
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
      {apiError && <div style={{ color: 'red', marginTop: '10px' }}>{apiError}</div>}
      <div className='new-sign-box'>
      <p>아직 아이디가 없으신가요?<span style = {{color : 'black'}} onClick={() =>  setShowModal(true)}> 회원가입</span>
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
          <img src="/img/admin.png" alt="카페 관리자" />
            카페 관리자
          </div>
          <div className='admin-select' onClick={() => handleSignupTypeSelection('user')}>
          <img src="/img/customer.png" alt="서비스 이용자" />
            서비스 이용자
          </div>
          </div>
        </Modal.Body>
      </Modal>
      </div>
  );
}

export default LoginPage;


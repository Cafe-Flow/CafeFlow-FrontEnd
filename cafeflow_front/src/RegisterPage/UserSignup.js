import React, { useState } from 'react';
import './Register.css'
import { useNavigate } from 'react-router-dom';
import { Button, Form, FloatingLabel, Container} from 'react-bootstrap';

function UserSignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

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
      <p><span onClick={() => {console.log(1)}}>아이디/비밀번호 찾기  </span><span onClick={() => {console.log(1)}}>|  회원가입</span></p>
      </div>
      </Form> 
      </div>
  );
}

export default UserSignupPage;
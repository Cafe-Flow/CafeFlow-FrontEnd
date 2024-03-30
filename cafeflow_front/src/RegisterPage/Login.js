import React, { useState } from 'react';
import './Register.css'
import { useNavigate } from 'react-router-dom';
import { Button, Form, FloatingLabel, Container} from 'react-bootstrap';

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isChecked, setIsChecked] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(email, password);
    navigate('/');
  };

  return (
    <Container className='login-container'>
      <div className='input-box' style={{ display: 'flex', flexDirection: 'column' }}>
      <div className='h1-font'><p>Cafe-Flow</p></div>
      <div className='h6-font'><p>카페 플로우와 함께 즐거운 시간 되세요</p></div>
      <FloatingLabel controlId="floatingInput" label="아이디" className="mb-3">
        <Form.Control type="email" placeholder="name@example.com" />
      </FloatingLabel>
      <FloatingLabel controlId="floatingPassword" label="비밀번호">
        <Form.Control type="password" placeholder="Password" />
      </FloatingLabel>
      <div style={{ paddingBottom: '10px', paddingTop: '10px', display: 'flex', alignItems: 'center'}}>
      <input type='checkbox' onChange={(e) => setIsChecked(e.target.checked)} checked={isChecked}
      id="checkbox"style={{ margin:"10px" }}/>
      <label htmlFor="checkbox">로그인 상태 유지</label>
      </div>   
      <Button type="submit" style={{ border: "none", backgroundColor: "black", color: "white", height: "60px"}}>
        로그인
      </Button>
      </div> 
      </Container>
  );
}

export default LoginPage;
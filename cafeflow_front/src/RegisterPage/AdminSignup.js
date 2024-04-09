import React, { useState } from 'react';
import './Register.css'
import { useNavigate } from 'react-router-dom';
import { Button, Form, FloatingLabel } from 'react-bootstrap';

function AdminSignupPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState(0);
  const [stateId, setStateId] = useState('');
  const [cityId, setCityId] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [nicknameError, setNicknameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loginIdError, setLoginIdError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [genderError, setGenderError] = useState('');
  const [ageError, setAgeError] = useState('');
  const [stateIdError, setStateIdError] = useState('');
  const [cityIdError, setCityIdError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  
  const validateForm = () => {
    let isValid = true;
    setUsernameError('');
    setNicknameError('');
    setEmailError('');
    setPasswordError('');
    setGenderError('');
    setAgeError('');
    setStateIdError('');
    setCityIdError('');
    setConfirmPasswordError('');
  
  if (!username.trim()) {
    setUsernameError('이름을 입력해주세요.');
    isValid = false;
  }
  if (!nickname.trim()) {
    setNicknameError('닉네임을 입력해주세요.');
    isValid = false;
  }
  if (!loginId.trim()) {
    setLoginIdError('로그인 ID를 입력해주세요.');
    isValid = false;
  }
    if (!email) {
      setEmailError('이메일을 입력해주세요.');
      isValid = false;
    }
    if (!password) {
      setPasswordError('비밀번호를 입력해주세요.');
      isValid = false;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError('비밀번호가 일치하지 않습니다.');
      isValid = false;
    } 
    if (!confirmPassword.trim()) {
      setConfirmPasswordError('비밀번호 확인란을 입력해주세요.');
      isValid = false;
    } 
    if (!gender) {
      setGenderError('성별을 선택해주세요.');
      isValid = false;
    }
  if (!age) {
    setAgeError('나이를 입력해주세요.');
    isValid = false;
  }
  if (!stateId.trim()) {
    setStateIdError('주/도를 선택해주세요.');
    isValid = false;
  }
  if (!cityId.trim()) {
    setCityIdError('도시를 선택해주세요.');
    isValid = false;
  }
    return isValid;
  };

  const agreeForm = () => {
    let agreeValid = true;
    if (!isChecked) {
      alert('개인정보 수집 및 이용에 동의해주세요.');
      agreeValid = false;
    }
    return agreeValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const isFormValid = validateForm();
    const isAgreeValid = agreeForm();
    
    if (isFormValid && isAgreeValid) {
      const userData = {
        username: username,
        nickname: nickname,
        loginId: loginId,
        email: email,
        password: password,
        gender: gender,
        age: parseInt(age, 10),
        stateId: stateId,
        cityId: cityId,
        userType: window.location.pathname.includes('adminSignup') ? 'admin' : 'user'
      };
  
      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });
  
        if (!response.ok) {
          throw new Error('Something went wrong');
        }
        
        const responseData = await response.json();
        console.log(responseData);
        navigate('/');
      } catch (error) {
        console.error('Failed to send data:', error);
      }
    }
  };

  return (
    <div className='login-container'>
      <Form className='input-box' style={{ display: 'flex', flexDirection: 'column' }} onSubmit={handleSubmit}>
        <div className='h2-font'><p>회원가입</p>
        </div>
        <img src="/img/admin.png" alt="카페 관리자" className='signup-image'/>
        <div className='h6-font'><p>카페 관리자</p>
        </div>
        <FloatingLabel controlId="floatingInput" label="사용자 이름" className="mb-3">
          <Form.Control
          type="text"
          placeholder="name" 
          isInvalid={!!usernameError}
          onChange={(e) => {
          setUsername(e.target.value);
          setUsernameError('');
          }}/>
          <Form.Control.Feedback type="invalid">{usernameError}</Form.Control.Feedback>
          </FloatingLabel>
        <FloatingLabel controlId="floatingInput" label="닉네임" className="mb-3">
          <Form.Control
          type="text"
          placeholder="nickname" 
          isInvalid={!!nicknameError}
          onChange={(e) => {
          setNickname(e.target.value);
          setNicknameError('');
          }}/>
          <Form.Control.Feedback type="invalid">{nicknameError}</Form.Control.Feedback>
        </FloatingLabel>
        <FloatingLabel controlId="floatingInput" label="이메일" className="mb-3">
          <Form.Control
          type="text" 
          placeholder="name@example.com" 
          isInvalid={!!emailError}
          onChange={(e) => {setEmail(e.target.value);
          setEmailError('');
          }}/>
          <Form.Control.Feedback type="invalid">{emailError}</Form.Control.Feedback>
        </FloatingLabel>
        <FloatingLabel controlId="floatingInput" label="아이디" className="mb-3">
          <Form.Control
          type="text" 
          placeholder="name@example.com" 
          isInvalid={!!loginIdError}
          onChange={(e) => {setLoginId(e.target.value);
          setLoginIdError('');
          }}/>
          <Form.Control.Feedback type="invalid">{loginIdError}</Form.Control.Feedback>
        </FloatingLabel>
        <FloatingLabel controlId="floatingPassword" label="비밀번호" className="mb-3">
          <Form.Control
            type="password"
            placeholder="Password"
            isInvalid={!!passwordError}
            onChange={(e) => {setPassword(e.target.value);
            setPasswordError('');
            }}
          />
          <Form.Control.Feedback type="invalid">{passwordError}</Form.Control.Feedback>
        </FloatingLabel>
        <FloatingLabel controlId="floatingConfirmPassword" label="비밀번호 확인" className="mb-3">
          <Form.Control
            type="password"
            placeholder="Confirm Password"
            isInvalid={!!confirmPasswordError}
            onChange={(e) => {setConfirmPassword(e.target.value);
            setConfirmPasswordError('');
            }}/>
          <Form.Control.Feedback type="invalid">{confirmPasswordError}</Form.Control.Feedback>
        </FloatingLabel>
        <div className="gender-selection">
          <label>
          <img
          src="/img/man.png"
          alt="남"
          className={gender === "남" ? "gender-image selected" : "gender-image"}
          onClick={() => {setGender("남");
        setGenderError('');}}
          />
          </label>
          <label>
          <img
          src="/img/woman.png"
          alt="여"
          className={gender === "여" ? "gender-image selected" : "gender-image"}
          onClick={() => {setGender("여");
        setGenderError('');}}
          />
          </label>
        </div>
        {genderError && <div style={{color: "red"}}>{genderError}</div>}
        <p className='h2-font' style={{fontSize : "30px"}}>남성 여성</p>
        <FloatingLabel controlId="floatingAge" label="나이" className="mb-3">
  <Form.Control
    type="number"
    placeholder="나이"
    value={age}
    isInvalid={!!ageError}
    onChange={(e) => {
      const value = e.target.value;
      if (value.length <= 3) {
        setAge(value);
        setAgeError(''); 
      }
    }}
    min="0"
    max="200"
  />
  <Form.Control.Feedback type="invalid">
    {ageError}
  </Form.Control.Feedback>
</FloatingLabel>
          <div style={{ paddingBottom: '10px', paddingTop: '10px', display: 'flex', alignItems: 'center'}}>
            <input type='checkbox' onChange={(e) => setIsChecked(e.target.checked)} checked={isChecked}
              id="checkbox"style={{ margin:"10px" }}/>
              <label htmlFor="checkbox">
                개인정보 수집 및 이용 동의(필수)
              </label>
          </div>   
      <Button type="submit" style={{ border: "none", backgroundColor: "black", color: "white", height: "60px"}}>
        회원가입
      </Button>
      </Form> 
      </div>
  );
}

export default AdminSignupPage;
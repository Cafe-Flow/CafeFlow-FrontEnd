import React, { useState, useEffect} from 'react';
import './Register.css'
import { useNavigate } from 'react-router-dom';
import { Button, Form, FloatingLabel } from 'react-bootstrap';

function AdminSignupPage() {
  const navigate = useNavigate();
  const [step,setStep] = useState(1);
  const [apiError, setApiError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    nickname: '',
    email: '',
    loginId: '',
    password: '',
    confirmPassword: '',
    gender: '',
    age: 0,
    stateId: '',
    cityId: '',
  });

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  
  const [errors, setErrors] = useState({
    usernameError: '',
    nicknameError: '',
    emailError: '',
    loginIdError: '',
    passwordError: '',
    confirmPasswordError: '',
    genderError: '',
    ageError: '',
    stateIdError: '',
    cityIdError: '',
  });


  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/locations/states');
        if (response.ok) {
          const data = await response.json();
          setStates(data);
        } else {
          console.error('주/도 목록을 불러오는 데 실패했습니다.');
        }
      } catch (error) {
        console.error('주/도 목록을 불러오는 중 오류가 발생했습니다:', error);
      }
    };
    fetchStates();
  }, []);

 const validateStep1 = () => {
    let isValid = true;
    let newErrors = { ...errors};
  
    if (!formData.username.trim()) {
      newErrors.usernameError = '이름을 입력해주세요.';
      isValid = false;
    }
    if (!formData.nickname.trim()) {
      newErrors.nicknameError = '닉네임을 입력해주세요.';
      isValid = false;
    }
    if (!formData.loginId.trim()) {
      newErrors.loginIdError = '로그인 ID를 입력해주세요.';
      isValid = false;
    }
    if (!formData.email) {
      newErrors.emailError = '이메일을 입력해주세요.';
      isValid = false;
    }
    if (!formData.password) {
      newErrors.passwordError = '비밀번호를 입력해주세요.';
      isValid = false;
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPasswordError = '비밀번호가 일치하지 않습니다.';
      isValid = false;
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPasswordError = '비밀번호 확인란을 입력해주세요.';
      isValid = false;
    }
  if (formData.loginId.length < 8 || formData.loginId.length > 15) {
    newErrors.loginIdError = '사용자 아이디는 8자 이상, 15자 이하여야 합니다.';
    isValid = false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(formData.email)) {
    newErrors.emailError = '이메일 형식이 맞지 않습니다.';
    isValid = false;
  }
  if (formData.password.length < 8) {
    newErrors.passwordError = '비밀번호는 8자 이상이어야 합니다.';
    isValid = false;
  }
    setErrors(newErrors);
    return isValid;
  };

  const validateStep2 = () => {
    let isValid = true;
    let newErrors = { ...errors, genderError: '', ageError: ''}; // Step 2 에러만 리셋
  
    if (!formData.gender) {
      newErrors.genderError = '성별을 선택해주세요.';
      isValid = false;
    }
    if (!formData.age) {
      newErrors.ageError = '나이를 입력해주세요.';
      isValid = false;
    }
    setErrors(newErrors); 
    return isValid;
  };

  function handleBack() {
    setStep(step - 1);
  }

  const validateStep3 = () => {
    let isValid = true;
    let newErrors = {...errors, stateIdError: '', cityIdError: ''};

    if (!formData.stateId.trim()) {
      newErrors.stateIdError = '주/도를 선택해주세요.';
      isValid = false;
    }
    if (!formData.cityId.trim()) {
      newErrors.cityIdError = '도시를 선택해주세요.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
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
  
    if (step === 1) {
      const isStep1Valid = validateStep1();
      if (isStep1Valid) {
        setStep(2);
      }
    } else if (step === 2) {
      const isStep2Valid = validateStep2();
      if (isStep2Valid) {
        setStep(3);
      }
    } else if (step === 3) {
      const isStep3Valid = validateStep3();
      if (isStep3Valid) {
        const userData = {
          username: formData.username,
          nickname: formData.nickname,
          loginId: formData.loginId,
          email: formData.email,
          password: formData.password,
          gender: formData.gender,
          age: parseInt(formData.age, 10),
          stateId: formData.stateId,
          cityId: formData.cityId,
          userType: "ADMIN",
        };
  
        try {
          const response = await fetch('http://localhost:8080/api/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
          });

          const responseData = await response.json();
          if (!response.ok) {
            console.log(responseData);
            setApiError(responseData.message);
          }

          localStorage.setItem('userToken', responseData.token);
          await handleUserInfoFetch(responseData.token);
          navigate('/');
        } catch (error) {
          console.error('Failed to send data:', error);
        }
      }
    }
  };

  const FormStep1 = () => (
    <>
      <FloatingLabel controlId="floatingInput" label="사용자 이름" className="mb-3">
        <Form.Control
          type="text"
          placeholder="name" 
          value={formData.username}
          isInvalid={!!errors.usernameError}
          onChange={(e) => {
            setFormData({...formData, username: e.target.value});
            setErrors({...errors, usernameError: ''});
          }}
        />
        <Form.Control.Feedback type="invalid">{errors.usernameError}</Form.Control.Feedback>
      </FloatingLabel>
  
      <FloatingLabel controlId="floatingInput" label="닉네임" className="mb-3">
        <Form.Control
          type="text"
          placeholder="nickname" 
          value={formData.nickname}
          isInvalid={!!errors.nicknameError}
          onChange={(e) => {
            setFormData({...formData, nickname: e.target.value});
            setErrors({...errors, nicknameError: ''});
          }}
        />
        <Form.Control.Feedback type="invalid">{errors.nicknameError}</Form.Control.Feedback>
      </FloatingLabel>
  
      <FloatingLabel controlId="floatingInput" label="이메일" className="mb-3">
        <Form.Control
          type="text" 
          placeholder="name@example.com" 
          value={formData.email}
          isInvalid={!!errors.emailError}
          onChange={(e) => {
            setFormData({...formData, email: e.target.value});
            setErrors({...errors, emailError: ''});
          }}
        />
        <Form.Control.Feedback type="invalid">{errors.emailError}</Form.Control.Feedback>
      </FloatingLabel>
  
      <FloatingLabel controlId="floatingInput" label="아이디" className="mb-3">
        <Form.Control
          type="text" 
          placeholder="loginId" 
          value={formData.loginId}
          isInvalid={!!errors.loginIdError}
          onChange={(e) => {
            setFormData({...formData, loginId: e.target.value});
            setErrors({...errors, loginIdError: ''});
          }}
        />
        <Form.Control.Feedback type="invalid">{errors.loginIdError}</Form.Control.Feedback>
      </FloatingLabel>
  
      <FloatingLabel controlId="floatingPassword" label="비밀번호" className="mb-3">
        <Form.Control
          type="password"
          placeholder="Password"
          value={formData.password}
          isInvalid={!!errors.passwordError}
          onChange={(e) => {
            setFormData({...formData, password: e.target.value});
            setErrors({...errors, passwordError: ''});
          }}
        />
        <Form.Control.Feedback type="invalid">{errors.passwordError}</Form.Control.Feedback>
      </FloatingLabel>
  
      <FloatingLabel controlId="floatingConfirmPassword" label="비밀번호 확인" className="mb-3">
        <Form.Control
          type="password"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          isInvalid={!!errors.confirmPasswordError}
          onChange={(e) => {
            setFormData({...formData, confirmPassword: e.target.value});
            setErrors({...errors, confirmPasswordError: ''});
          }}
        />
        <Form.Control.Feedback type="invalid">{errors.confirmPasswordError}</Form.Control.Feedback>
      </FloatingLabel>
  
      <Button type="button" onClick={() => validateStep1() && setStep(2)}
        style={{ 
          border: "none", 
          backgroundColor: "black",
          color: "white", 
          height: "60px"}}>
        다음
      </Button>
    </>
  );

  const FormStep2 = () => (
    <>
      <Button className='back-button' onClick={handleBack}>이전 단계</Button>
      <div className="gender-selection">
        <label>
          <img
            src="/img/man.png"
            alt="남"
            className={formData.gender === "male" ? "gender-image selected" : "gender-image"}
            onClick={() => setFormData({...formData, gender: "male"})}
          />
        </label>
        <label>
          <img
            src="/img/woman.png"
            alt="여"
            className={formData.gender === "female" ? "gender-image selected" : "gender-image"}
            onClick={() => setFormData({...formData, gender: "female"})}
          />
        </label>
      </div>
      {errors.genderError && <div style={{color: "red"}}>{errors.genderError}</div>}
      <p className='h2-font' style={{fontSize: "30px"}}>성별</p>
      <FloatingLabel controlId="floatingAge" label="나이" className="mb-3">
        <Form.Control
          type="number"
          placeholder="나이"
          value={formData.age}
          isInvalid={!!errors.ageError}
          onChange={(e) => {
            const value = e.target.value;
            setFormData({...formData, age: value});
            setErrors({...errors, ageError: ''});
          }}
          min="0"
          max="200"
        />
        <Form.Control.Feedback type="invalid">
          {errors.ageError}
        </Form.Control.Feedback>
      </FloatingLabel>
      <Button 
        type="button" 
        onClick={() => validateStep2() && setStep(3)}
        style={{ 
          border: "none", 
          backgroundColor: "black",
          color: "white", 
          height: "60px"
        }}
      >
        다음
      </Button>
    </>
  );

  const FormStep3 = () => {

    const handleStateChange = async (e) => {
      const stateId = e.target.value;
      setFormData({ ...formData, stateId });
  
      const response = await fetch(`http://localhost:8080/api/locations/states/${stateId}/cities`);
      const citiesData = await response.json();
      setCities(citiesData);
    };

    const handleCityChange = (e) => {
      const cityId = e.target.value;
      setFormData({ ...formData, cityId });
    };

  return  (
  <>
    <Button className='back-button' onClick={handleBack}>이전 단계</Button>
          <Form.Group controlId="formState">
        <Form.Label>주/도 선택</Form.Label>
        <Form.Control as="select" value={formData.stateId} onChange={handleStateChange}>
          <option>주/도를 선택하세요</option>
          {states.map((state) => (
            <option key={state.id} value={state.id}>{state.name}</option>
          ))}
        </Form.Control>
      </Form.Group>
      <Form.Group controlId="formCity">
        <Form.Label>도시 선택</Form.Label>
        <Form.Control as="select" value={formData.cityId} onChange={handleCityChange}>
          <option>도시를 선택하세요</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>{city.name}</option>
          ))}
        </Form.Control>
      </Form.Group>
    <div style={{ paddingBottom: '10px', paddingTop: '10px', display: 'flex', alignItems: 'center'}}>
      <input 
        type='checkbox' 
        onChange={(e) => setFormData({...formData, isChecked: e.target.checked})} 
        checked={formData.isChecked}
        id="checkbox"
        style={{ margin:"10px" }}
      />
      <label htmlFor="checkbox">
        개인정보 수집 및 이용 동의(필수)
      </label>
    </div>
    <Button 
      type="submit" 
      disabled={!formData.isChecked}
      style={{ 
        border: "none", 
        backgroundColor: formData.isChecked ? "black" : "grey",
        color: "white", 
        height: "60px"
      }}
    >
     회원가입
    </Button>
  </>
);
}

  return (
    <div className='login-container'>
        <div className='h2-font'><p>회원가입</p></div>
        <img src="/img/admin.png" alt="카페 관리자" className='signup-image'/>
        <div className='h6-font'><p>카페 관리자</p></div>
        <p className='h6-font'> {step} / 3 </p>
      <Form className='input-box' style={{ display: 'flex', flexDirection: 'column' }} onSubmit={handleSubmit}>
      {step === 1 ? FormStep1() : step === 2 ? FormStep2() : FormStep3()}
      </Form> 
      {apiError && <div style={{ color: 'red', marginTop: '10px' }}>{apiError}</div>}
      </div>
  );

}


export default AdminSignupPage;
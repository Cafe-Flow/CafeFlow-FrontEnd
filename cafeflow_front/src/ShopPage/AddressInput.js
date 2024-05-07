import React, { useState } from 'react';
import DaumPostcode from 'react-daum-postcode';

function AddressInput() {
    const [modalVisible, setModalVisible] = useState(false);
    const [address, setAddress] = useState('');
    const [zipcode, setZipcode] = useState('');

    const handleComplete = (data) => {
        setAddress(data.address);
        setZipcode(data.zonecode);
        setModalVisible(false);
    };

    return (
        <div>
            <button onClick={() => setModalVisible(true)}>주소 찾기</button>
            <div>
                <label>주소</label>
                <input type="text" value={address} readOnly />
            </div>
            <div>  
                <label>우편번호</label>
                <input type="text" value={zipcode} readOnly />
            </div>
            {modalVisible && (
                <DaumPostcode
                    onComplete={handleComplete}
                    autoClose
                    style={{ position: 'absolute', top: '20px', left: '50%', zIndex: '100', transform: 'translateX(-50%)' }}
                />
            )}
        </div>
    );
}

export default AddressInput;

import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem("userInfo"))
  );

  const login = (userInfo) => {
    setUserInfo(userInfo);
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
  };

  const logout = () => {
    setUserInfo(null);
    localStorage.removeItem("userInfo");
    localStorage.removeItem("userToken");
  };

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo, logout, login }}>
      {children}
    </UserContext.Provider>
  );
};

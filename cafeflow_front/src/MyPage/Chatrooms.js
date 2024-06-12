import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import MainChat from "../Chat/MainChat";
import CustomCheckModal from "../Component/CustomCheckModal";
import "./mypage.css";
import ChatPopup from "../Chat/ChatPopUp";

function Chatrooms() {
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userType, setUserType] = useState("");
  const [userMemberId, setUserMemberID] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false); // 채팅창 열기 상태
  const [selectedReceiverId, setSelectedReceiverId] = useState(null); // 선택된 채팅방의 상대방 ID
  const [selectedName, setSelectedName] = useState(""); // 선택된 채팅방의 상대방 이름
  const [showDeleteModal, setShowDeleteModal] = useState(false); // 삭제 확인 모달 상태
  const [roomIdToDelete, setRoomIdToDelete] = useState(null); // 삭제할 채팅방 ID

  useEffect(() => {
    const updateUserInfo = () => {
      const storedUserInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (storedUserInfo) {
        setUserType(storedUserInfo.userType);
        setUserMemberID(storedUserInfo.id);
      }
    };

    updateUserInfo();
  }, []);

  const fetchChatRooms = async () => {
    try {
      let response;
      const token = localStorage.getItem("userToken");
      const headers = { Authorization: `Bearer ${token}` };

      if (userType === "ADMIN") {
        response = await axios.get(`/chat/rooms/cafeOwner/${userMemberId}`, {
          headers,
        });
      } else if (userType === "USER") {
        response = await axios.get(`/chat/rooms/user/${userMemberId}`, {
          headers,
        });
      }

      if (response && response.data) {
        const rooms = response.data;
        const updatedRooms = await Promise.all(
          rooms.map(async (room) => {
            const unreadMessages = await fetchUnreadMessages(
              room.id,
              userMemberId,
              headers
            );
            return { ...room, unreadMessagesCount: unreadMessages.length };
          })
        );
        setChatRooms(updatedRooms);
      }
    } catch (error) {
      setError("채팅 목록을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userType || !userMemberId) {
      return;
    }

    fetchChatRooms();
  }, [userType, userMemberId]);

  const fetchUnreadMessages = async (roomId, userId, headers) => {
    try {
      const response = await axios.get(
        `/chat/unread-messages/${roomId}?userId=${userId}`,
        { headers }
      );
      return response.data.filter(
        (message) => message.receiverReadStatus === false
      );
    } catch (error) {
      console.error(
        "읽지 않은 메시지를 불러오는 중 오류가 발생했습니다.",
        error
      );
      return [];
    }
  };

  const handleChatClick = (receiverId, name, roomId) => {
    setSelectedReceiverId(receiverId);
    setSelectedName(name);
    setChatRooms((prevChatRooms) =>
      prevChatRooms.map((room) =>
        room.id === roomId ? { ...room, unreadMessagesCount: 0 } : room
      )
    );
    setIsChatOpen(true);
  };

  const handleCloseChat = () => {
    fetchChatRooms();
    setIsChatOpen(false);
  };

  const handleDeleteChatRoom = async () => {
    try {
      const token = localStorage.getItem("userToken");
      const headers = { Authorization: `Bearer ${token}` };

      await axios.delete(`/chat/rooms/${roomIdToDelete}`, { headers });

      setChatRooms(chatRooms.filter((room) => room.id !== roomIdToDelete));
      setShowDeleteModal(false);
    } catch (error) {
      setError("채팅방을 삭제하는 중 오류가 발생했습니다.");
    }
  };

  const openDeleteModal = (roomId) => {
    setRoomIdToDelete(roomId);
    setShowDeleteModal(true);
  };

  return (
    <div className="mypage">
      <Sidebar />
      <div className="mypage-card">
        <div className="mypage-header">
          <p className="header-font">채팅 목록</p>
          <p className="h6-font">진행 중인 채팅을 확인 해보세요</p>
        </div>
        {loading ? (
          <p>채팅 목록을 불러오는 중...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <ul className="chat-list">
            {chatRooms.map((room) => (
              <li key={room.id}>
                {userType === "USER" ? (
                  <>
                    <p>{room.cafeOwnerUsername}</p>
                    {room.unreadMessagesCount > 0 && (
                      <div className="unread-badge">
                        {room.unreadMessagesCount}
                      </div>
                    )}
                    <div className="chat-list-buttons">
                      <span
                        onClick={() =>
                          handleChatClick(
                            room.cafeOwnerId,
                            room.cafeOwnerUsername,
                            room.id
                          )
                        }
                      >
                        채팅방 입장
                      </span>
                      <span onClick={() => openDeleteModal(room.id)}>
                        채팅방 삭제
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <p>{room.userUsername}</p>
                    {room.unreadMessagesCount > 0 && (
                      <div className="unread-badge">
                        {room.unreadMessagesCount}
                      </div>
                    )}
                    <div className="chat-list-buttons">
                      <span
                        onClick={() =>
                          handleChatClick(
                            room.userId,
                            room.userUsername,
                            room.id
                          )
                        }
                      >
                        채팅방 입장
                      </span>
                      <span onClick={() => openDeleteModal(room.id)}>
                        채팅방 삭제
                      </span>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      {isChatOpen && (
        <>
          {userType === "USER" ? (
            <ChatPopup className="chat-list-popup">
              <MainChat
                userId={userMemberId}
                cafeOwnerId={selectedReceiverId}
                name={selectedName}
                isUser={true}
                onClose={handleCloseChat}
              />
            </ChatPopup>
          ) : (
            <ChatPopup className="chat-list-popup">
              <MainChat
                userId={selectedReceiverId}
                cafeOwnerId={userMemberId}
                name={selectedName}
                isUser={false}
                onClose={handleCloseChat}
              />
            </ChatPopup>
          )}
        </>
      )}

      <CustomCheckModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        handleConfirm={handleDeleteChatRoom}
      >
        정말 채팅방을 삭제하시겠습니까?
      </CustomCheckModal>
    </div>
  );
}

export default Chatrooms;

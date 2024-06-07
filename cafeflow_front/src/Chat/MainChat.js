import React, { useState, useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import "./mainchat.css";

function MainChat({ userId, cafeOwnerId, name, isUser, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [client, setClient] = useState(null);
  const [chatRoomId, setChatRoomId] = useState(null);
  const chatWindowRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || !cafeOwnerId) {
      console.error("Chat room info is missing");
      return;
    }

    const token = localStorage.getItem("userToken");
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    console.log(
      "Creating or checking chat room with senderId:",
      userId,
      "and receiverId:",
      cafeOwnerId
    );

    const requestBody = {
      cafeOwnerId: cafeOwnerId,
      userId: userId,
    };

    fetch("/chat/rooms", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Chat room response", data);
        const chatRoomInfo = data;
        setChatRoomId(chatRoomInfo.id);

        fetchChatHistory(chatRoomInfo.id);
        initializeWebSocket(chatRoomInfo.id);
      })
      .catch((error) => {
        console.error("Error creating or checking chat room:", error);
      });

    return () => {
      if (client) {
        client.deactivate();
        console.log("WebSocket client deactivated");
      }
    };
  }, [userId, cafeOwnerId]);

  const fetchChatHistory = (roomId) => {
    const token = localStorage.getItem("userToken");
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    fetch(`/chat/history/${roomId}`, {
      method: "GET",
      headers: headers,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setMessages(data.reverse());
        setTimeout(() => {
          scrollToBottom();
        }, 100);
      })
      .catch((error) => {
        console.error("Error fetching chat history:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const initializeWebSocket = (roomId) => {
    const newClient = new Client({
      brokerURL: "ws://localhost:8080/ws",
      onConnect: () => {
        console.log("Connected to WebSocket");
        newClient.subscribe(`/topic/messages/${roomId}`, (message) => {
          const body = JSON.parse(message.body);
          setMessages((prevMessages) => [body, ...prevMessages]);
          setTimeout(() => {
            scrollToBottom();
          }, 100);
        });
      },
      onDisconnect: () => {
        console.log("Disconnected from WebSocket");
      },
      onStompError: (frame) => {
        console.error(`Broker reported error: ${frame.headers["message"]}`);
        console.error(`Additional details: ${frame.body}`);
      },
    });

    newClient.activate();
    setClient(newClient);
  };

  const sendMessage = () => {
    if (input.trim() && client) {
      const newMessage = {
        senderId: isUser ? userId : cafeOwnerId,
        receiverId: isUser ? cafeOwnerId : userId,
        chatRoomId: chatRoomId,
        content: input,
      };

      client.publish({
        destination: "/app/chat/send",
        body: JSON.stringify(newMessage),
      });

      console.log("보내기");
      setInput("");
      setTimeout(() => {
        scrollToBottom();
      }, 100); // 상태 업데이트 후 스크롤 이동을 보장하기 위해 약간의 지연 추가
    }
  };

  const handleClose = () => {
    if (client) {
      client.deactivate();
      console.log("WebSocket client deactivated");
    }
    onClose();
  };

  const scrollToBottom = () => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="chat-window">
      <div className="chat-window-top">
        <p>{name}</p>{" "}
        <button className="chat-close-button" onClick={handleClose}>
          종료하기
        </button>
      </div>

      <div className="chat-messages" ref={chatWindowRef}>
        {loading ? (
          <span>정보 불러오는중..</span>
        ) : (
          messages.map((message, index) => (
            <div
              className={`message ${
                (isUser && message.senderId === userId) ||
                (!isUser && message.senderId === cafeOwnerId)
                  ? "message-right"
                  : "message-left"
              }`}
              key={index}
            >
              {message.content}
            </div>
          ))
        )}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="메시지를 입력하세요..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <button onClick={sendMessage}>전송</button>
      </div>
    </div>
  );
}

export default MainChat;

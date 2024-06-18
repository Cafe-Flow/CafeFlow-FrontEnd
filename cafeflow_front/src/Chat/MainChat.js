import React, { useState, useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import "./mainchat.css";
import axios from "axios";

function MainChat({ userId, cafeOwnerId, name, isUser, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [client, setClient] = useState(null);
  const [chatRoomId, setChatRoomId] = useState(null);
  const chatWindowRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const clientRef = useRef(null);

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

  const fetchChatHistory = async (roomId) => {
    const token = localStorage.getItem("userToken");
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await fetch(`/chat/history/${roomId}`, {
        method: "GET",
        headers: headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMessages(data.reverse());
      setTimeout(() => {
        scrollToBottom();
      }, 100);

      const unreadMessages = data.filter(
        (message) =>
          (isUser &&
            !message.receiverReadStatus &&
            message.receiverId === userId) ||
          (!isUser &&
            !message.receiverReadStatus &&
            message.receiverId === cafeOwnerId)
      );

      await markMessagesAsRead(unreadMessages.map((message) => message.id));
    } catch (error) {
      console.error("Error fetching chat history:", error);
    } finally {
      setLoading(false);
    }
  };

  const initializeWebSocket = (roomId) => {
    if (clientRef.current) {
      return;
    }

    const newClient = new Client({
      brokerURL: "/ws",
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
    clientRef.current = newClient;
  };

  const sendMessage = () => {
    if (input.trim() && client) {
      const tempId = `temp-${Date.now()}`;
      const newMessage = {
        id: tempId,
        senderId: isUser ? userId : cafeOwnerId,
        receiverId: isUser ? cafeOwnerId : userId,
        chatRoomId: chatRoomId,
        content: input,
        senderReadStatus: true,
        receiverReadStatus: false,
      };

      const backendMessage = {
        senderId: newMessage.senderId,
        receiverId: newMessage.receiverId,
        chatRoomId: newMessage.chatRoomId,
        content: newMessage.content,
      };

      client.publish({
        destination: "/app/chat/send",
        body: JSON.stringify(backendMessage),
      });

      console.log(input);
      setInput("");
      setTimeout(() => {
        scrollToBottom();
      }, 100);
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

  const markMessagesAsRead = async (messageIds) => {
    if (messageIds.length > 0) {
      const token = localStorage.getItem("userToken");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      try {
        const response = await axios.post(
          `/chat/read?userId=${isUser ? userId : cafeOwnerId}`,
          { messageIds },
          { headers }
        );

        console.log("Messages marked as read:", response.data);
        setMessages((prevMessages) =>
          prevMessages.map((message) =>
            messageIds.includes(message.id)
              ? { ...message, receiverReadStatus: true }
              : message
          )
        );
      } catch (error) {
        console.error("Error marking messages as read:", error);
      }
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
            <React.Fragment key={message.id || `temp-${index}`}>
              <div
                className={`message ${
                  (isUser && message.senderId === userId) ||
                  (!isUser && message.senderId === cafeOwnerId)
                    ? "message-right"
                    : "message-left"
                }`}
              >
                {!message.receiverReadStatus && (
                  <p
                    className="unread-indicator"
                    key={`unread-${message.id || `temp-${index}`}`}
                  >
                    읽지 않음
                  </p>
                )}
                {message.content}
              </div>
            </React.Fragment>
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

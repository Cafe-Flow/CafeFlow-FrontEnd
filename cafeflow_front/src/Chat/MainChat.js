import React, { useState, useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import "./mainchat.css";

function MainChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [client, setClient] = useState(null);
  const [chatRoomId, setChatRoomId] = useState(null);
  const [senderId, setSenderId] = useState(null);
  const [receiverId, setReceiverId] = useState(null);
  const chatWindowRef = useRef(null);

  useEffect(() => {
    axios
      .post("/chat/rooms")
      .then((response) => {
        const chatRoomInfo = response.data;
        setChatRoomId(chatRoomInfo.id);
        setSenderId(chatRoomInfo.userId);
        setReceiverId(chatRoomInfo.cafeOwnerId);

        // WebSocket 클라이언트 설정
        const newClient = new Client({
          brokerURL: "ws://localhost:8080/ws",
          onConnect: () => {
            console.log("Connected");
            newClient.subscribe(
              `/topic/messages/${chatRoomInfo.id}`,
              (message) => {
                const body = JSON.parse(message.body);
                setMessages((prevMessages) => [...prevMessages, body]);
                chatWindowRef.current.scrollTop =
                  chatWindowRef.current.scrollHeight;
              }
            );
          },
          onDisconnect: () => {
            console.log("Disconnected");
          },
          onStompError: (frame) => {
            console.error(`Broker reported error: ${frame.headers["message"]}`);
            console.error(`Additional details: ${frame.body}`);
          },
        });

        newClient.activate();
        setClient(newClient);
      })
      .catch((error) => {
        console.error("Error creating chat room:", error);
      });

    return () => {
      if (client) {
        client.deactivate();
      }
    };
  }, []);

  const sendMessage = () => {
    if (input.trim() && client) {
      client.publish({
        destination: "/app/chat/send",
        body: JSON.stringify({
          senderId: senderId,
          receiverId: receiverId,
          chatRoomId: chatRoomId,
          content: input,
        }),
      });
      setInput("");
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-window" ref={chatWindowRef}>
        <div className="chat-messages">
          {messages.map((message, index) => (
            <div className="message" key={index}>
              {message.content}
            </div>
          ))}
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
    </div>
  );
}

export default MainChat;

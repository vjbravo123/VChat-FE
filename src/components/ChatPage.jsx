import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import "../css/chat.css";

const socket = io("http://localhost:5000");

const Chatpage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const currentUserId = currentUser?.id;

  const [msg, setMsg] = useState("");
  const [msgArr, setMsgArr] = useState([]);

  useEffect(() => {
    if (!roomId) return;

    socket.emit("join_room", { roomId });

    socket.on("load_messages", (oldMessages) => setMsgArr(oldMessages));
    socket.on("receive_message", (msg) => {
      setMsgArr((prev) => [...prev, msg]);
    });

    return () => {
      socket.emit("leave_room", roomId);
      socket.off("receive_message");
      socket.off("load_messages");
    };
  }, [roomId]);

  function handleSendMsg() {
    if (msg.trim() === "") return;
    socket.emit("send_message", {
      room: roomId,
      senderId: currentUserId,
      text: msg,
    });
    setMsg("");
  }

  return (
    <div className="chat-wrapper">
      <div className="chat-container">
        {/* Header */}
        <div className="chat-header">
          <button className="back-btn" onClick={() => navigate("/chatlist")}>
            ←
          </button>
          <span className="chat-title">Conversation</span>
        </div>

        {/* Messages */}
        <div className="chat-messages">
          {msgArr.map((ele) => (
            <div
              key={ele._id}
              className={`chat-message ${
                ele.senderId._id === currentUserId ? "own" : "other"
              }`}
            >
              <div className="bubble">
                {ele.text}
                <div className="meta">
                  {new Date(ele.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="chat-input">
          <input
            type="text"
            placeholder="Type a message..."
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMsg()}
          />
          <button onClick={handleSendMsg}>➤</button>
        </div>
      </div>
    </div>
  );
};

export default Chatpage;

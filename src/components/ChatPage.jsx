import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import "../css/chat.css";

const socket = io("http://localhost:5000");

const Chatpage = () => {
  const { roomId } = useParams(); // now this is Conversation._id

  const currentUser = JSON.parse(localStorage.getItem("user")); // contains _id, username
  const currentUserId = currentUser?.id;

  const [msg, setMsg] = useState("");
  const [msgArr, setMsgArr] = useState([]);

  useEffect(() => {
    if (!roomId) return;

    // join the room
    socket.emit("join_room", { roomId });

    // load old messages
    socket.on("load_messages", (oldMessages) => {
      setMsgArr(oldMessages);
    });

    // listen for new messages
    socket.on("receive_message", (msg) => {
      setMsgArr((prev) => [...prev, msg]);
    });

    // cleanup
    return () => {
      socket.emit("leave_room", roomId);
      socket.off("receive_message");
      socket.off("load_messages");
    };
  }, [roomId]);

  function handleSendMsg() {
    if (msg.trim() === "") return;

    const messageData = {
      room: roomId,          // conversationId
      senderId: currentUserId, // ✅ only ObjectId string
      text: msg,
    };

    socket.emit("send_message", messageData);
    setMsg("");
  }

  return (
    <div className="container">
      <div className="centerr">
        <div className="messages">
          <ul>
            {msgArr.map((ele) => (
              <li
                key={ele._id}
                className={ele.senderId._id === currentUserId ? "right" : "left"}
              >
                <span className="msg-text">{ele.text}</span>
                <span className="msg-time">
                  {new Date(ele.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bottom">
          <input
            type="text"
            placeholder="Type a message..."
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
          />
          <button onClick={handleSendMsg}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Chatpage;

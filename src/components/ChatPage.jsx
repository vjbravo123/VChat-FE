import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import "../css/chat.css";

const socket = io("http://localhost:5000");

const Chatpage = () => {
  const { roomId } = useParams(); // e.g. "66ecfc45d5a8e2c0b3a1a91f_66ecfc8dd5a8e2c0b3a1a920"

  // get or generate username
  const [username] = useState(() => {
    const storedName = localStorage.getItem("username");
    if (storedName) return storedName;

    const newName = "User" + Math.floor(Math.random() * 1000);
    localStorage.setItem("username", newName);
    return newName;
  });

  const [msg, setMsg] = useState("");
  const [msgArr, setMsgArr] = useState([]);

  useEffect(() => {
    if (!roomId) return;
    
    // join the room
    socket.emit("join_room", roomId);

    // load old messages (from server/db)
    socket.on("load_messages", (oldMessages) => {
      setMsgArr(oldMessages);
    });

    // listen for new messages
    socket.on("receive_message", (msg) => {
      setMsgArr((prev) => [...prev, msg]);
    });

    // cleanup on unmount
    return () => {
      socket.emit("leave_room", roomId);
      socket.off("receive_message");
      socket.off("load_messages");
    };
  }, [roomId]);

  function handleSendMsg() {
    if (msg.trim() === "") return;

    const messageData = {
      room: roomId,
      sender: username,
      text: msg,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    socket.emit("send_message", messageData);
    setMsg("");
  }

  return (
    <div className="container">
      <div className="centerr">
        <div className="messages">
          <ul>
            {msgArr.map((ele, idx) => (
              <li
                key={idx}
                className={ele.sender === username ? "right" : "left"}
              >
                <span className="msg-text">{ele.text}</span>
                <span className="msg-time">{ele.time}</span>
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

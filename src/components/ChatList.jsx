import React, { useState, useEffect } from 'react';
import "../css/ChatList.css";
import { Link } from "react-router-dom"
const ChatList = () => {
  const [friends, setFriends] = useState([]); // current friends
  const [searchResult, setSearchResult] = useState([]);
  const [username, setUsername] = useState("");
  const [searchtext, setText] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const currentUserId = currentUser.id;

  // Fetch friends from server
  async function fetchFriends() {
    const resp = await fetch(`http://localhost:5000/friends/${currentUserId}`);
    const data = await resp.json();
    setFriends(data.friends);
  }

  // Search users
  async function handleSearch() {
    if (searchtext.trim() === "") return;
    const resp = await fetch(
      `http://localhost:5000/search?username=${searchtext}&currentUserId=${currentUserId}`
    );
    const data = await resp.json();
    setSearchResult(data.users);
  }

  // Add friend directly
  async function handleAddFriend(friendId) {
    await fetch("http://localhost:5000/friend-add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: currentUserId, friendId }),
    });
    fetchFriends(); // refresh friends list
  }

  useEffect(() => {
    setUsername(currentUser.username);
    fetchFriends();
  }, []);

  return (
    <div>
      <h1>👤 {username}</h1>

      {/* Search */}
      <div className='search'>
        <input
          type="text"
          placeholder='Search users here...'
          value={searchtext}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Search results */}
      <div className='users'>
        <ul>
          {searchResult.map((u) => (
            <li key={u._id}>
              <span>{u.username}</span>
              {/* Disable button if already a friend */}
              <button
                disabled={friends.some(f => f._id === u._id)}
                onClick={() => handleAddFriend(u._id)}
              >
                {friends.some(f => f._id === u._id) ? "Friend" : "Add Friend"}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Friends List */}
      <div className='friends'>
        <h3>Your Friends:</h3>

        <ul>
          {friends.map((f) => {
            return <div key={f._id} className="friend">
                <li >👤{f.username}</li>
                <Link to={`/chat/${[currentUserId, f._id].sort().join("_")}`}>
                  <button>Chat 💬</button>
                </Link>
              </div>

          })}
        </ul>

      </div>
    </div>
  );
};

export default ChatList;

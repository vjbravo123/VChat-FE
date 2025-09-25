import React, { useState, useEffect } from "react";
import "../css/ChatList.css";
import { useNavigate } from "react-router-dom";

const ChatList = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [friends, setFriends] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [username, setUsername] = useState("");
  const [searchtext, setText] = useState("");
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const currentUserId = currentUser.id;

  // Fetch friends
  async function fetchFriends() {
    const token = JSON.parse(localStorage.getItem("token")); // get token from localStorage

    const resp = await fetch(`${apiUrl}/api/friend/friends/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${token}`,  // 👈 send token here
      },
    });

    if (!resp.ok) {
      throw new Error("Failed to fetch friends");
    }

    const data = await resp.json();
    setFriends(data.friends);
  }

  // Search users
  async function handleSearch() {
    if (searchtext.trim() === "") return;
    const token = JSON.parse(localStorage.getItem('token'));
    const resp = await fetch(`${apiUrl}/api/friend/search?username=${searchtext}&currentUserId=${currentUserId}` ,{
        headers:{ 
          "Content-Type":"application/json",
          Authorization:`JWT ${token}`
        }
      }
    );
    const data = await resp.json();
    setSearchResult(data.users);
  }

  // Add friend
  async function handleAddFriend(friendId) {
    const token = JSON.parse(localStorage.getItem('token'));
    await fetch(`${apiUrl}/api/friend/friend-add`, {
      method: "POST",
      headers: { "Content-Type": "application/json",
        Authorization:`JWT ${token}`
       },
      body: JSON.stringify({ userId: currentUserId, friendId }),
    });
    fetchFriends();
  }

  // Start chat
  async function handleStartChat(friendId) {
    let token = JSON.parse(localStorage.getItem('token'))
    const resp = await fetch(`${apiUrl}/api/conversation/conversations`, {
      method: "POST",
      headers: { "Content-Type": "application/json",
        Authorization : `JWT ${token}`
       },
      body: JSON.stringify({ userId: currentUserId, friendId }),
    });
    const conversation = await resp.json();
    navigate(`/chat/${conversation._id}`);
  }

  // Remove friend
  async function handleRemoveFriend(friendId) {
    let token = JSON.parse(localStorage.getItem('token'));
    await fetch(`${apiUrl}/api/friend/friend-remove`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${token}`
      },
      body: JSON.stringify({ friendId }),
    });
    fetchFriends();
  }

  // Logout
  function handleLogout() {
    localStorage.removeItem("user");
  localStorage.removeItem("token");
    navigate("/");
  }

  useEffect(() => {
    setUsername(currentUser.username);
    fetchFriends();
  }, []);

  return (
    <div className="chatlist-container">
      {/* Header */}
      <header className="chatlist-header">
        <h1>👋 Welcome, {username}</h1>
        <button className="logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </header>


      {/* Search */}
      <div className="search-box">
        <input
          type="text"
          placeholder="🔍 Search users..."
          value={searchtext}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Search Results */}
      {searchResult.length > 0 && (
        <div className="search-results">
          <h3>🔎 Search Results</h3>
          <div className="card-grid">
            {searchResult.map((u) => (
              <div key={u._id} className="user-card">
                <span className="username">{u.username}</span>
                <button
                  disabled={friends.some((f) => f._id === u._id)}
                  onClick={() => handleAddFriend(u._id)}
                >
                  {friends.some((f) => f._id === u._id)
                    ? "✅ Friend"
                    : "➕ Add Friend"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Friends List */}
      <div className="friends-list">
        <h3>👥 Your Friends</h3>
        {friends.length === 0 ? (
          <p className="empty">You don’t have any friends yet 😢</p>
        ) : (
          <div className="friends-grid">
            {friends.map((f) => (
              <div key={f._id} className="friend-card">
                <div className="friend-info">
                  <div className="avatar">{f.username.charAt(0).toUpperCase()}</div>
                  <span className="username">{f.username}</span>
                </div>
                <div className="actions">
                  <button className="chat-btn" onClick={() => handleStartChat(f._id)}>
                    💬 Chat
                  </button>
                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveFriend(f._id)}
                  >
                    ❌ Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;

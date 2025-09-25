import { Link, useNavigate } from "react-router-dom";
import img from "../assets/logo.png"
import { useState } from "react";
import "../css/login.css"
const Login = () => {
  const navigate = useNavigate();
  const [username , setUsername] = useState("");
  const [password , setPassword] = useState("");
  const apiUrl =import.meta.env.VITE_API_URL;
  async function handleLogin() {
  const resp = await fetch(`${apiUrl}/api/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await resp.json();

  if (data.validUser) {
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", JSON.stringify(data.token));
    navigate("/chatlist");
  } else {
    alert(data.message);
  }
}


  return (
      <>
    <div className="home">
    <div className="login">

      <div className="logo">
        <img src={img} alt="" />
      </div>
      <input type="text" name="username"  placeholder="Username" onChange={(e)=>{setUsername(e.target.value)}}/>
      <input type="password" name="password"  placeholder="Password" onChange={(e)=>{setPassword(e.target.value)}}/>
      <button onClick={handleLogin}>Login</button>

      <div className="or">OR</div>

    <div className="forgot">Forgot password?</div>
    <div className="signup">
      <p>Don't have an account? </p> 
      <Link to={"/signup"}>Sign Up</Link>
    </div>
    </div>
    </div>

    </>
  )
}

export default Login
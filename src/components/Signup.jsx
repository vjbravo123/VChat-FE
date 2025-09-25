import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/signup.css"
const Signup = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [formData , setFormData] = useState({username:"",email:"",password:""});
  const handleChange=(e)=>{setFormData({...formData , [e.target.id]:e.target.value})};
  async function handleSubmit(e){
    e.preventDefault();
    try {
      const resp = await fetch(`${apiUrl}/api/user/signup` , {
        method:'POST' ,
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(formData)
      })
      const data = await resp.json();
      // console.log("Data from the server :" , data);
      if(data.userAdded){
        navigate("/");
      }
    } catch (error) {
      console.log("Errro:",error);
      
    }
  }
  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Create an Account</h2>

        <label htmlFor="username">Full Name</label>
        <input id="username" type="text" placeholder="Enter your name" onChange={handleChange}/>

        <label htmlFor="email">Email</label>
        <input id="email" type="email" placeholder="Enter your email" onChange={handleChange} />

        <label htmlFor="password">Password</label>
        <input id="password" type="password" placeholder="Enter a password" onChange={handleChange} />

        <button type="submit">Register</button>
        <p className="signup-footer">
          Already have an account? <Link to={"/"}>Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;

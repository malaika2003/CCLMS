import React from 'react';
import './Login.css';
// below is the form train image import in the login page
import LoginForm from '../../images/LoginForm.jpg';
import Footer from '../Footer/Footer.js';
import Header from '../Header/Header.js'
import { FaEye } from "react-icons/fa";
import { useState } from 'react';
import { toast } from "react-toastify";


const Login = ({setAuth}) => {
  function toggleVisibility(){
      const password= document.getElementById("password")
      
      if(password.type==="password"){
          password.type = "text" 
      }
      else{
          password.type = "password"
      }
  }
  
  const [inputs, setInputs] = useState({
    email: "",
    password: ""
  })
  
  const {email, password} = inputs

  const onChange = e =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const body = { email, password };
      const response = await fetch("http://localhost:5000/authen/login", {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(body)
      });

      const parseRes = await response.json();

      if (parseRes.jwtToken) {
        localStorage.setItem("token", parseRes.jwtToken);
        setAuth(true);
        toast.success("Logged in Successfully");
      } else {
        setAuth(false);
        toast.error(parseRes);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

    
  return (
    <div className="login-page">
      <Header/>
      <div className="login-container">
        <div className="login-form">
          <img src={LoginForm} alt="Login Form" className="login-form-image" />
          <form onSubmit={onSubmitForm}>
            <div className="input-group">
              <label htmlFor="username">Email</label>
              <input type="email" id="email" name="email" value={email} onChange={e => onChange(e)} required />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div className="Password">
              <input type="password" id="password" name="password" value={password} onChange={e => onChange(e)} required />
              <FaEye className="FaEye" onClick={toggleVisibility}/>
              </div>
            </div>
            <button type="submit" className="login-button">Login</button>
          </form>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default Login;
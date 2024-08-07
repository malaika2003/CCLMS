import './DashboardView.css'
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import profilePic from '../../images/profile-pic.jpg'; 
import Chart from '../chartss.js';

const DashboardView = ({ setAuth }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [divison, setDivison] = useState("");
  const [lobby, setLobby] = useState("");
  const [authority, setAuthority] = useState(0);
  const [designation, setDesignation] = useState("");
  const [open,setOpen] = useState(false);

  const getProfile = async () => {
    try {
      const res = await fetch("https://cclms.onrender.com/dashboard/", {
        method: "POST",
        headers: { jwt_token: localStorage.token }
      });

      const parseData = await res.json();
      setName(parseData.user_name);
      setEmail(parseData.user_email);
      setDivison(parseData.divison);
      setLobby(parseData.lobby);
      setAuthority(parseData.authority);
      setDesignation(parseData.designation);
    
    } catch (err) {
      console.error(err.message);
    }
  };

  const logout = e => {
    e.preventDefault();
    try {
      localStorage.removeItem("token");
      setAuth(false);
      toast.success("Logout successfully");
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <div className='Dashboard'>
      
    <div className="header">
      <div className="header-content">
        <h1>Graphical Representations of CCLMS Optimised Links</h1>
        
        <div className="logout-section">
          <button onClick={e => logout(e)} className="btn btn-primary">
          Logout
          </button>
          <img src={profilePic} alt="Profile" className="profile-pic" onClick={() =>setOpen(!open)} />
        </div>
        
      </div>
      
    </div>
    {
      open && 
      <div className="Details">
            <div className='Box'>
                 <div>Name : {name}</div>
                 <div>Email: {email}</div>
                 <div>Divison : {divison}</div>
                 <div>Lobby : {lobby}</div>
                 <div>Authority : {authority}</div>
                 <div>Designation : {designation}</div>
            </div>
      </div>
    }
    <Chart className="chartsss"/>
    </div>
    
  );
};

export default DashboardView;


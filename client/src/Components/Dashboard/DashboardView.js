import './DashboardView.css'
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import profilePic from '../../images/profile-pic.jpg'; 

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
      const res = await fetch("http://localhost:5000/dashboard/", {
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
      console.log(name,email,divison,lobby,authority,designation);
    } catch (err) {
      console.error(err.message);
    }
  };

  const logout = async e => {
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
        <h1>Reports</h1>
        <div className="logout-section">
          <button onClick={e => logout(e)} className="btn btn-primary">
          Logout
          </button>
          <img src={profilePic} alt="Profile" className="profile-pic" onClick={async () => await setOpen(!open)} />
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
    </div>
  );
};

export default DashboardView;


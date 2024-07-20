import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './chartss.css';

function Chart() {
  const [links, setLinks] = useState([]);
  const [data, setData] = useState([]);
  const [activeLink, setActiveLink] = useState("");


  useEffect(() => {
    axios.get('http://localhost:5000/links').then(response => {
      setLinks(response.data);
    });
  }, []);

  const handleClick = (linkId) => {
    //REST
    setActiveLink(linkId)
    axios.get(`http://localhost:5000/data/${linkId}`).then(response => {
      const formattedData = response.data.map(row => ({
        station: row.to_stn,
        rest_hq: Number(row.hq_rest),
        rest_os: Number(row.os_rest),
        running_duration: Number(row.running_duration),
        duty_duration: Number(row.duty_duration),
      }));
      setData(formattedData);
    });

    console.log(data);

    

  };

  return (
    <div style={{ display: 'flex', overflow: 'hidden'}}>
      <div style={{ width: '150px', borderRight: '3px solid #ccc', padding: '10px', height: 'auto' }}>
        <h3>Links</h3>
        <ul>
          {links.map(link => (
            <li className={`currLink ${activeLink === link.link_id ? 'active' : ''}`} style= {{marginBottom: '20px', hover:{cursor:'pointer'}}} key={link.link_id} onClick={() => handleClick(link.link_id)}>
              {link.link_id}
            </li>
          ))}
        </ul>
      </div>  
      <div style={{ width: '80%', padding: '10px' }}>
        <h1>Data Visualization</h1>
        <h3>Working Time Comparison of Link {activeLink}</h3>
        <div style={{ width: '2000px', padding: '10px', overflow: 'scroll'}}>
        
        <LineChart width={6000} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="station" />
          <YAxis />
          <Tooltip />
          <Legend align="left" verticalAlign="bottom" height={36}/>
          <Line type="monotone" dataKey="running_duration" stroke="#F4CE14" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="duty_duration" stroke="#219C90" />
        </LineChart>
        </div>
        <h3>Rest Comparison of Link {activeLink}</h3>
        <div style={{ width: '2000px', padding: '10px', overflow: 'scroll'}}>
        
        <LineChart width={6000} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="station" />
          <YAxis />
          <Tooltip />
          <Legend align="left" verticalAlign="bottom" height={36}/>
          <Line type="monotone" dataKey="rest_hq" stroke="#FF4C4C" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="rest_os" stroke="#4535C1" />
        </LineChart>
        </div>

        
      </div>
    </div>
  );
}

export default Chart;

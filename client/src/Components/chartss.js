// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,Label} from 'recharts';
// import './chartss.css';

// function Chart() {
//   const [links, setLinks] = useState([]);
//   const [data, setData] = useState([]);
//   const [activeLink, setActiveLink] = useState("");
//   const [selectedLink, setSelectedLink] = useState("");
//   const [stations, setStations] = useState([]);


//   useEffect(() => {
//     axios.get('http://localhost:5000/links').then(response => {
//       setLinks(response.data);
//     });

//     axios.get('http://localhost:5000/stations').then(response => {
      
//       setStations(response.data);
//     });
//   }, []);

//   const handleChange = (event) => {
//     const linkId = event.target.value;
//     setSelectedLink(linkId);
//     setActiveLink(linkId);
//     if (linkId) {
//       axios.get(`http://localhost:5000/data/${linkId}`).then(response => {
//         const formattedData = response.data.map(row => {
//           const station = stations.find(st => st.station_id === row.to_stn);
        
//           return {
//             station: station ? station.station_code : row.to_stn,
//             rest_hq: (Number(row.hq_rest) / 60).toFixed(2),
//             rest_os: (Number(row.os_rest) / 60).toFixed(2),
//             running_duration: (Number(row.running_duration) / 60).toFixed(2),
//             duty_duration: (Number(row.duty_duration) / 60).toFixed(2),
//           };
//         });
//         setData(formattedData);
//       }).catch(error => {
//         console.error("There was an error fetching the data!", error);
//       });
//     } else {
//       setData([]);
//     }
//   };

//   return (
//     <div style={{ display: 'flex', overflow: 'hidden'}}>
//       <div style={{ width: '150px', borderRight: '3px solid #ccc', padding: '10px', height: 'auto' }}>
//         <h3>Links</h3>
//         <select value={selectedLink} onChange={handleChange}>
//           <option value="">Select a Link</option>
//           {links.map(link => (
//             <option key={link.link_id} value={link.link_id}>
//               {link.link_id}
//             </option>
//           ))}
//         </select>
//       </div>  
//       <div style={{ width: '80%', padding: '10px' }}>
//         <h1>Report for Data Visualization of Link {activeLink}</h1>
        
//         <div style={{ width: '2000px', padding: '10px', overflow: 'scroll'}}>
        
//         <LineChart width={6000} height={520} data={data}>
//           <CartesianGrid strokeDasharray="3 3" />
          
//           <XAxis dataKey="station" height={70} >          
//            <Label value="Stations"  style={{ fontSize:'25px'  }} />
//            </XAxis> 

          
//           <YAxis width={70} >
//           <Label angle= '-90' value= 'Time (hours)' position="insideLeft" offset={4} style={{ fontSize:'25px'  }} />
//           </YAxis>

//           <Tooltip />
//           <Legend align="left" verticalAlign="top" height={36}/>
          
//           <Line type="monotone" dataKey="running_duration" stroke="#F4CE14" activeDot={{ r: 8 }} />
//           <Line type="monotone" dataKey="duty_duration" stroke="#219C90" />
//           <Line type="monotone" dataKey="rest_hq" stroke="#FF4C4C" activeDot={{ r: 8 }} />
//           <Line type="monotone" dataKey="rest_os" stroke="#4535C1" />
//         </LineChart>
        
//           </div>
   

        
//       </div>
//     </div>
//   );
// }

// export default Chart;








import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Label } from 'recharts';
import './chartss.css';

function Chart() {
  const [links, setLinks] = useState([]);
  const [data, setData] = useState([]);
  const [activeLink, setActiveLink] = useState("");
  const [selectedLink, setSelectedLink] = useState("");
  const [stations, setStations] = useState([]);
  const [crewNumbers, setCrewNumbers] = useState([]);
  const [selectedCrew, setSelectedCrew] = useState("");

  useEffect(() => {
    axios.get('https://cclms.onrender.com/links').then(response => {
      setLinks(response.data);
    });

    axios.get('https://cclms.onrender.com/stations').then(response => {
      setStations(response.data);
    });
  }, []);

  const handleLinkChange = (event) => {
    const linkId = event.target.value;
    setSelectedLink(linkId);
    setActiveLink(linkId);
    setSelectedCrew("");
    setCrewNumbers([]);
  
    if (linkId) {
      

      axios.get(`https://cclms.onrender.com/data/${linkId}`).then(response => {
        const formattedData = [];
        const uniqueCrew = new Set();
      
        response.data.forEach((row, index) => {
          const fromStation = stations.find(st => st.station_id === row.from_stn);
          const toStation = stations.find(st => st.station_id === row.to_stn);
          
          
          if (!uniqueCrew.has(row.crew_no)) {
            uniqueCrew.add(row.crew_no);

          }
         

          // Departure from the from station
          if (row.departure_time) {
            formattedData.push({
              station: fromStation ? fromStation.station_code+`(${row.from_stn})` : row.from_stn,
              timestamp: row.departure_time,
              rest: 'traveling',
              crew_id: row.crew_id,
            });
          }

          // Arrival at the to station
          if (row.arrival_time) {
            formattedData.push({
              station: toStation ? toStation.station_code+`(${row.to_stn})`: row.to_stn,
              timestamp: row.arrival_time,
              rest: 'traveling',
              crew_id: row.crew_id,
            });
          }

          
        });

        // Sort the data by timestamp
        formattedData.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        setData(formattedData);
      
        setCrewNumbers(Array.from(uniqueCrew));
      }).catch(error => {
        console.error("There was an error fetching the data!", error);
      });
    } else {
      setData([]);
    }
  };

 



  const handleLinkCrewChange = (event) => {
    const linkId = activeLink;
    const crew=event.target.value
    
  
    setSelectedCrew(crew);
  
    if (linkId && crew) {
      

      axios.get(`https://cclms.onrender.com/data/${linkId}/${crew}`).then(response => {
        const formattedData = [];
      
        response.data.forEach((row, index) => {
          const fromStation = stations.find(st => st.station_id === row.from_stn);
          const toStation = stations.find(st => st.station_id === row.to_stn);

          
          if (row.departure_time) {
            formattedData.push({
              station: fromStation ? fromStation.station_code+`(${row.from_stn})` : row.from_stn,
              timestamp: row.departure_time,
              rest: 'traveling',
              crew_id: row.crew_id,
            });
          }

          // Arrival at the to station
          if (row.arrival_time) {
            formattedData.push({
              station: toStation ? toStation.station_code+`(${row.to_stn})` : row.to_stn,
              timestamp: row.arrival_time,
              rest: 'traveling',
              crew_id: row.crew_id,
            });
          }

          
        });

        // Sort the data by timestamp
        formattedData.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        setData(formattedData);
       
      }).catch(error => {
        console.error("There was an error fetching the data!", error);
      });
    } else {
      setData([]);
    }
  };

  const CustomDot = (props) => {
    const { cx, cy } = props;
  
    return (
      <svg x={cx -12 } y={cy - 10} width={20} height={20} viewBox="0 0 1024 1024">
        <path fill="#2E236C" d="M512 192l320 320H192z" transform="rotate(90 512 512)" />
      </svg>
    );
  };



  


  return (
    <div style={{ display: 'flex', overflow: 'hidden' }}>
      <div style={{ width: '150px', borderRight: '3px solid #ccc', padding: '10px', height: 'auto' }}>
        <h3>Links</h3>
        <select value={selectedLink} onChange={handleLinkChange}>
          <option value="">Select a Link</option>
          {links.map(link => (
            <option key={link.link_id} value={link.link_id}>
              {link.link_id}
            </option>
          ))}
        </select>
        
        {selectedLink && crewNumbers.length > 0 && (
          <>
            <h3>Crew</h3>
            
            <select value={selectedCrew} onChange={handleLinkCrewChange}>
              <option value="" >Select a Crew</option>
              {crewNumbers.map(crew => (
                <option key={crew} value={crew}>
                  {crew}
                </option>
              ))}
            </select>
          </>
        )}
      </div>
      <div style={{ width: '85%', padding: '10px' }}>
        <h1>Report for Data Visualization of Link {activeLink}</h1>
        <div className='scale'> 
          <p>X-axis: Stations</p>
          <p>Y-axis: Timestamps (hours)</p>
        </div>
        <div style={{ width: '2000px', padding: '10px', overflow: 'scroll' }}>
          <LineChart
            width={6000}
            height={520}
            data={data}
            margin={{ top: 5, right: 700, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" height={80}>
              <Label value="Time Stamps(hours)" position="insideBottomLeft" style={{ fontSize: '25px'}} />
            </XAxis>
            <YAxis dataKey="station" width={130} type="category">
              <Label angle='-90' value='Stations' position="insideLeft" offset={0} style={{ fontSize: '25px' }} />
            </YAxis>
            <Tooltip />
            {/* <Legend align="left" verticalAlign="top" height={80} /> */}
            
            <Line
              type="linear"
              dataKey="station"
              dot={<CustomDot />}
              activeDot={{ r: 8 }}
              isAnimationActive={false}
              points={data}
              label={false}
              layout="vertical"
              connectNulls
              strokeWidth={5} // Increase this value to make the line thicker
            />
           
          </LineChart>
        </div>
      </div>
    </div>
  );
}

export default Chart;















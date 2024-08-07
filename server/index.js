import express from 'express';
import cors from 'cors';
import authRoute from "./routes/authRoute.js";
import dashboard from "./routes/dashboard.js";
import dotenv from 'dotenv';
import pool from './db.js';
import xlsx from 'xlsx';

//configure env
dotenv.config();

const app = express();
const port=process.env.PORT || 5000
//middleware
app.use(express.json());
app.use(cors());

//ROUTES//
//Register and login routes
app.use("/authen",authRoute)
//dashboard routes
app.use("/dashboard",dashboard)

app.get("/links", async (req, res) => {

    const result = await pool.query('SELECT DISTINCT link_id FROM link_detail');
    res.json(result.rows);
  });
  
  app.get("/data/:link_id", async (req, res) => {
    try {
      const { link_id } = req.params;
      const result = await pool.query('SELECT crew_no, to_stn, from_stn, sign_on_time, departure_time, arrival_time, sign_off_time FROM link_detail WHERE link_id = $1', [link_id]);
      res.json(result.rows);
    } catch (error) {
      console.error(`Error fetching data for link_id ${link_id}:`, error);
      res.status(500).send('Server Error');
    }
  });


  app.get("/data", async (req, res) => {
    try {
      
      const result = await pool.query('SELECT crew_no, to_stn, from_stn, sign_on_time, departure_time, arrival_time, sign_off_time FROM link_detail');
      res.json(result.rows);
    } catch (error) {
      console.error(`Error fetching data for link_id`, error);
      res.status(500).send('Server Error');
    }
  });

  app.get('/data/:link_id/:crew', async(req, res) => {
    try {
      
      const { link_id, crew } = req.params;
      const result = await pool.query('SELECT crew_no, to_stn, from_stn, sign_on_time, departure_time, arrival_time, sign_off_time FROM link_detail WHERE link_id = $1 and crew_no=$2', [link_id,crew]);
      res.json(result.rows);
  
    } catch (error) {
      console.error(`Error fetching data for link_id`, error);
      res.status(500).send('Server Error');
    }
  });


  app.get('/crew/:link_id', async (req, res) => {
    
    try{
    const {link_id} = req.params;
    const result = await pool.query('SELECT crew_no FROM link_detail WHERE link_id = $1', [link_id]);
      res.json(result.rows);
    } catch {
      console.error(`Error fetching data for link_id ${link_id}:`, error);
      res.status(500).send('Server Error');
    }
  });


  app.get('/stations', async (req, res) => {
    const result = await pool.query('SELECT * from station');
    
    res.json(result.rows);
  });

  

  
  


app.listen(port,()=>{
    console.log(`server is running at ${port}`);
})





//Function to format decimal time values to HH:MM:SS
// const formatTime = (decimalTime) => {
//   const totalSeconds = Math.round(decimalTime * 86400);
//   const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
//   const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
//   const seconds = (totalSeconds % 60).toString().padStart(2, '0');
//   return `${hours}:${minutes}:${seconds}`;
// };

// const insertData = async () => {
//   try {
//     await pool.connect();
//     const workbook = xlsx.readFile('Link_Detail_TEN_Lobby.xlsx');
    
//     const linkDetailSheet = workbook.Sheets['Link_Detail'];
//     // const kpiValueSheet = workbook.Sheets['KPI_Value'];
//     // const parameterValueSheet = workbook.Sheets['Parameter_Value'];

//     const linkDetailData = xlsx.utils.sheet_to_json(linkDetailSheet);
//     // const kpiValueData = xlsx.utils.sheet_to_json(kpiValueSheet);
//     // const parameterValueData = xlsx.utils.sheet_to_json(parameterValueSheet);

//     // Insert data into Link_Detail table
//     for (const row of linkDetailData) {
//       const query = `INSERT INTO Link_Detail (
//         LINK_ID, CREW_NO, DAY, TRAIN_ID, FROM_STN, TO_STN, SIGN_ON_TIME, 
//         DEPARTURE_TIME, ARRIVAL_TIME, SIGN_OFF_TIME, EARNED_KM, PERIODIC_REST_FLAG, 
//         SPARE_FLAG, NIGHT_FLAG, SORT_ORDER, DUTY_DURATION, RUNNING_DURATION, 
//         HQ_REST, OS_REST
//       ) VALUES (
//         $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, 
//         $17, $18, $19
//       ) `;
//       const values = [
//         row.LINK_ID, row.CREW_NO, row.DAY, row.TRAIN_ID, row.FROM_STN, row.TO_STN, 
//         formatTime(row.SIGN_ON_TIME), formatTime(row.DEPARTURE_TIME), formatTime(row.ARRIVAL_TIME), formatTime(row.SIGN_OFF_TIME), 
//         row.EARNED_KM, row.PERIODIC_REST_FLAG, row.SPARE_FLAG, row.NIGHT_FLAG, 
//         row.SORT_ORDER, row.DUTY_DURATION, row.RUNNING_DURATION, row.HQ_REST, 
//         row.OS_REST
//       ];
//       await pool.query(query, values);
//     }

//     // // Insert data into KPI_Value table
//     // for (const row of kpiValueData) {
//     //   const query = `INSERT INTO KPI_Value (
//     //     KPI_ID, LINK_ID, VALUE, CREATE_DATE, CREATED_BY, KPI_DESC, UOM
//     //   ) VALUES ($1, $2, $3, $4, $5, $6, $7)`;
//     //   const values = [
//     //     row.KPI_ID, row.LINK_ID, row.VALUE, row.CREATE_DATE, row.CREATED_BY, row.KPI_DESC, row.UOM
//     //   ];
//     //   await pool.query(query, values);
//     // }

//     // // Insert data into Parameter_Value table
//     // for (const row of parameterValueData) {
//     //   const query = `INSERT INTO Parameter_Value (
//     //     PARAMETER_ID, LINK_ID, VALUE, CREATE_DATE, CREATED_BY, PARAMETER_DESC, UOM, GLOBAL_VALUE
//     //   ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
//     //   const values = [
//     //     row.PARAMETER_ID, row.LINK_ID, row.VALUE, row.CREATE_DATE, row.CREATED_BY, row.PARAMETER_DESC, row.UOM, row.GLOBAL_VALUE
//     //   ];
//     //   await pool.query(query, values);
//     // }

//     console.log('Data insertion complete');
//   } catch (error) {
//     console.error('Error inserting data:', error);
//   } finally {
//     await pool.end();
//   }
// };

// insertData();





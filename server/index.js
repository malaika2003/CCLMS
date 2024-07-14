import express from 'express';
import cors from 'cors';
import authRoute from "./routes/authRoute.js";
import dashboard from "./routes/dashboard.js";
import dotenv from 'dotenv';
//configure env
dotenv.config();

const app = express();

//middleware
app.use(express.json());
app.use(cors());

//ROUTES//
//Register and login routes
app.use("/authen",authRoute)
//dashboard routes
app.use("/dashboard",dashboard)


app.listen(5000,()=>{
    console.log("server is running at 5000");
})
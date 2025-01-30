import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import {organizationRouter} from './src/routes/Organization.js';
import {userRouter} from './src/routes/User.js';
import {taskRouter} from './src/routes/Task.js';
import {userTaskRelationRouter} from './src/routes/UserTaskRelation.js';

const PORT = process.env.PORT || 4000;

const app = express();


const corsOptions = {
  origin: true, 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};


app.use(cors(corsOptions));

app.options('*', cors(corsOptions));


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  next();
});

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));

app.use("/api/organization", organizationRouter);
app.use("/api/user", userRouter);
app.use("/api/task", taskRouter);
app.use("/api/userTaskRelation", userTaskRelationRouter);


app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Server is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});


app.use((req, res) => {
  res.status(404).json({success: false, message: '404: Route not found'});
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
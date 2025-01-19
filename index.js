import express from 'express';  
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import { organizationRouter } from './src/routes/Organization.js'; 
import { userRouter } from './src/routes/User.js';
import { taskRouter } from './src/routes/Task.js';
import { userTaskRelationRouter } from './src/routes/UserTaskRelation.js';

const PORT = process.env.PORT || 5000;
const HOST = 'localhost';

const app = express();  

app.use(cors()); 
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 




app.use("/api/organization", organizationRouter);
app.use("/api/user", userRouter);
app.use("/api/task", taskRouter);
app.use("/api/userTaskRelation", userTaskRelationRouter);

app.get('/', (req, res) => {
    res.status(200).json({ message: `Server is running on port ${PORT}`, time: new Date() });
});
app.use((req, res) => {
    res.status(404).json({ success: false, message: '404: Route not found' });
});
app.listen(PORT, HOST, () => {
    console.log(`Server is listening to http://${HOST}:${PORT}`);
});

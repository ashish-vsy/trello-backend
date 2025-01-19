const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const PORT = 3000; 
const HOST = 'localhost'; 

const app = express();

app.use(cors()); 
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 

app.get('/', (req, res) => {
    res.status(200).json({ message: `Server is running on port ${PORT}`, time: new Date() });
});


app.use((req, res) => {
    res.status(404).json({ success: false, message: '404: Route not found' });
});
app.listen(PORT, HOST, () => {
    console.log(`Server is listening to http://${HOST}:${PORT}`);
});

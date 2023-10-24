const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());  // for parsing application/json

app.post('/webhook', (req, res) => {
    console.log('Data received at /webhook endpoint:', req.query);  // Log the received data
    res.sendFile(path.join(__dirname + '/print.html'), { data: req.query });
});

app.listen(80, () => {
    console.log('Server is listening on port 80');
});

// Import the required modules
import express from 'express';
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Calculate the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create an Express application
const app = express();

// Configure Express to handle JSON requests
app.use(express.json());

// Variable to keep track of the listening status
let isListening = false;
let executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

// Define a route handler for POST requests to /webhook
app.post('/webhook', async (req, res) => {
    if (isListening) {
        // Log the received data
        console.log('Data received at /webhook endpoint:', req.query);

        // Build the URL with the required parameters
        const url = `http://localhost/print.html?fname=${req.query.fname}&lname=${req.query.lname}&company=${req.query.company}`;

        // Open the URL with Puppeteer
        await openPage(url);
    } else {
        console.log('Listening is disabled, not processing the webhook.');
    }

    // Respond to the POST request
    res.status(200).send('OK');
});

// Start the server
app.listen(80, () => {
    console.log('Server is listening on port 80');
});

// Configure Express to serve static files from the current directory
app.use(express.static(__dirname));

// Define a route handler for POST requests to /toggleListening
app.post('/toggleListening', (req, res) => {
    isListening = !isListening;
    res.json({ isListening });
});

// Define a route handler for POST requests to /updatePath
app.post('/updatePath', (req, res) => {
    executablePath = req.body.path;
    res.status(200).send('OK');
});

// Define a function to open a page with Puppeteer
async function openPage(url) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--app=' + url],
        executablePath
    });

    // Open a new page
    const page = await browser.newPage();

    // Go to the specified URL
    await page.goto(url);
}

import http from 'http';
import httpProxy from 'http-proxy';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import { initErrorLog, logError, getLatestErrors } from './error-log.js';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize error log
initErrorLog();

// Create a proxy server
const proxy = httpProxy.createProxyServer({});

// Error page path
const errorPagePath = path.join(__dirname, 'public', 'error.html');

// Special endpoint to fetch backend errors
const ERROR_API_PATH = '/api/__errors';

// Start the main server with nodemon and capture its output
const startMainServer = () => {
  console.log('Starting main server with nodemon...');
  
  const nodemon = spawn('npm', ['run', 'dev:server'], {
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: true
  });
  
  // Capture stdout
  nodemon.stdout.on('data', (data) => {
    console.log(`[Main Server]: ${data.toString().trim()}`);
  });
  
  // Capture stderr and log errors
  nodemon.stderr.on('data', (data) => {
    const errorMsg = data.toString().trim();
    console.error(`[Main Server Error]: ${errorMsg}`);
    logError(errorMsg);
  });
  
  nodemon.on('error', (error) => {
    console.error('Failed to start main server:', error);
    logError(error);
  });
  
  return nodemon;
};

// Start the main server
const mainServer = startMainServer();

// Create the server that uses the proxy
const server = http.createServer((req, res) => {
  // Special endpoint to get the latest errors
  if (req.url === ERROR_API_PATH) {
    const errors = getLatestErrors();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ errors }));
    return;
  }
  
  // Try to proxy the request to the target server
  proxy.web(req, res, {
    target: 'http://localhost:3000',
    // Don't crash on errors
    selfHandleResponse: false
  }, (err) => {
    // If there's an error (like the target server is down), serve the error page
    console.log('Main server is down, serving error page');
    logError(`Proxy error: ${err.message}`);
    
    // Read and serve the error page
    fs.readFile(errorPagePath, (readErr, data) => {
      if (readErr) {
        // If we can't read the error page, send a simple message
        res.writeHead(503, { 'Content-Type': 'text/plain' });
        res.end('Service temporarily unavailable. Please try again later.');
        return;
      }
      
      res.writeHead(503, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  });
});

// Listen on port 3000 - this is the port you'll tunnel to
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
  console.log(`Proxying requests to http://localhost:3000`);
  console.log(`When main server is down, will serve error page from ${errorPagePath}`);
  console.log(`Backend errors are available at ${ERROR_API_PATH}`);
});

// Track last error time to avoid spamming logs
let lastErrorTime = 0;
let connectionErrorCount = 0;

// Handle proxy errors
proxy.on('error', (err, req, res) => {
  const now = Date.now();
  
  // Only log connection refused errors once every 10 seconds
  if (err.code === 'ECONNREFUSED') {
    connectionErrorCount++;
    
    // Only log every 10 seconds or every 10th error, whichever comes first
    if (now - lastErrorTime > 10000 || connectionErrorCount % 10 === 0) {
      console.error(`Proxy error: ${err.message} (${connectionErrorCount} connection attempts failed)`);
      logError(`Proxy error: ${err.message}`);
      lastErrorTime = now;
    }
  } else {
    // Always log non-connection errors
    console.error('Proxy error:', err);
    logError(`Proxy error: ${err.message}`);
    lastErrorTime = now;
  }
});


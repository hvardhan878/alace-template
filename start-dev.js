import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Start the proxy server (which will also start the main server)
console.log('Starting development environment with error resilience...');
const proxyServer = spawn('node', [path.join(__dirname, 'proxy-server.js')], {
  stdio: 'inherit',
  shell: true
});


console.log('\n==========================================================');
console.log('Development environment starting!');
console.log('Main server will run on: http://localhost:4000');
console.log('Proxy server running on: http://localhost:3000');
console.log('==========================================================');
console.log('\nIMPORTANT: Tunnel to port 3000 for error resilience');
console.log('When the main server crashes, the proxy will serve a fallback page');
console.log('with detailed backend error information\n');

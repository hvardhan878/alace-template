import { spawn, exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { promisify } from 'util';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const execAsync = promisify(exec);

let serverProcess = null;

console.log('🔨 Building application...');

// Function to build the application
async function buildApp() {
  try {
    console.log('📦 Building frontend and backend...');
    const { stdout, stderr } = await execAsync('npm run build:dev');
    if (stderr && !stderr.includes('Browserslist')) {
      console.error('Build stderr:', stderr);
    }
    console.log('✅ Build completed successfully!');
    return true;
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    return false;
  }
}

// Function to start the server
function startServer() {
  if (serverProcess) {
    console.log('🔄 Restarting server...');
    serverProcess.kill();
  }

  console.log('🚀 Starting built server...');
  serverProcess = spawn('node', ['dist/index.js'], {
    stdio: 'inherit',
    shell: true
  });

  serverProcess.on('error', (error) => {
    console.error('Server error:', error);
  });

  serverProcess.on('exit', (code) => {
    if (code !== null && code !== 0) {
      console.log(`Server exited with code ${code}`);
    }
  });
}

// Function to watch for changes and rebuild
function watchAndRebuild() {
  const chokidar = spawn('npx', ['chokidar', 'client/**/* server/**/* shared/**/*', '--initial', '--command', 'echo "File changed"'], {
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: true
  });

  let isBuilding = false;
  let buildQueued = false;

  chokidar.stdout.on('data', async (data) => {
    const output = data.toString().trim();
    if (output.includes('File changed')) {
      if (isBuilding) {
        buildQueued = true;
        return;
      }

      isBuilding = true;
      console.log('\n📝 Files changed, rebuilding...');
      
      const success = await buildApp();
      if (success) {
        startServer();
      }

      isBuilding = false;

      if (buildQueued) {
        buildQueued = false;
        // Trigger another build if changes were queued
        setTimeout(async () => {
          if (!isBuilding) {
            isBuilding = true;
            console.log('\n📝 Processing queued changes...');
            const success = await buildApp();
            if (success) {
              startServer();
            }
            isBuilding = false;
          }
        }, 1000);
      }
    }
  });

  chokidar.on('error', (error) => {
    console.log('File watcher not available, running without auto-rebuild');
    console.log('Install chokidar-cli globally for auto-rebuild: npm install -g chokidar-cli');
  });
}

// Initial build and start
async function start() {
  const success = await buildApp();
  if (success) {
    startServer();
    
    console.log('\n==========================================================');
    console.log('🎉 Preview server with built app is running!');
    console.log('🌐 Frontend: http://localhost:3000');
    console.log('📚 API: http://localhost:3000/api/users');
    console.log('⚡ Serving optimized production build');
    console.log('👀 Watching for changes to auto-rebuild...');
    console.log('💡 This is like "vite preview" but for your full-stack app');
    console.log('==========================================================\n');

    // Start watching for changes
    watchAndRebuild();
  }
}

// Handle cleanup on exit
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down...');
  if (serverProcess) {
    serverProcess.kill();
  }
  process.exit(0);
});

process.on('SIGTERM', () => {
  if (serverProcess) {
    serverProcess.kill();
  }
  process.exit(0);
});

start(); 
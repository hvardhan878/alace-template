import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the error log file
const errorLogPath = path.join(__dirname, 'server-errors.log');

// Initialize the error log file
export const initErrorLog = () => {
  try {
    // Create an empty error log file or clear existing one
    fs.writeFileSync(errorLogPath, '', 'utf8');
    console.log(`Initialized error log at ${errorLogPath}`);
  } catch (err) {
    console.error('Failed to initialize error log:', err);
  }
};

// Log an error to the file
export const logError = (error) => {
  try {
    // Skip connection refused errors
    const errorMessage = typeof error === 'string' ? error : error.stack || error.message || JSON.stringify(error);
    
    // Don't log connection refused errors
    if (errorMessage.includes('ECONNREFUSED') || errorMessage.includes('connect ECONNREFUSED')) {
      return; // Skip logging this error
    }
    
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${errorMessage}\n\n`;
    
    // Append to the log file
    fs.appendFileSync(errorLogPath, logEntry, 'utf8');
  } catch (err) {
    console.error('Failed to write to error log:', err);
  }
};

// Get the latest errors
export const getLatestErrors = (maxLines = 20) => {
  try {
    if (!fs.existsSync(errorLogPath)) {
      return 'No errors logged yet.';
    }
    
    const content = fs.readFileSync(errorLogPath, 'utf8');
    if (!content.trim()) {
      return 'No errors logged yet.';
    }
    
    // Split by double newlines to get individual error entries
    const entries = content.split('\n\n').filter(entry => entry.trim());
    
    // Return the most recent errors
    return entries.slice(-maxLines).join('\n\n');
  } catch (err) {
    console.error('Failed to read error log:', err);
    return 'Error reading log file.';
  }
};

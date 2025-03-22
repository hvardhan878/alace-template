import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Simple type for DB connection status
interface ConnectionStatus {
  connected: boolean;
  message: string;
}

function App() {
  const [status, setStatus] = useState<ConnectionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check database connection
    const checkConnection = async () => {
      try {
        const response = await axios.get('/api/status');
        setStatus(response.data);
      } catch (err) {
        console.error('Error checking connection:', err);
        setError('Failed to check database connection');
      } finally {
        setIsLoading(false);
      }
    };

    checkConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm p-4">
        <h1 className="text-xl font-bold">Vite + FastAPI Template</h1>
      </header>

      <main className="max-w-4xl mx-auto p-4 mt-8">
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Database Status</h2>
          
          {isLoading && (
            <div className="text-gray-500">Checking database connection...</div>
          )}
          
          {error && (
            <div className="text-red-500">{error}</div>
          )}
          
          {!isLoading && !error && status && (
            <div className={status.connected ? "text-green-600" : "text-red-600"}>
              <p className="text-xl font-medium">{status.connected ? "✓ Connected" : "✗ Not Connected"}</p>
              <p className="mt-2">{status.message}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
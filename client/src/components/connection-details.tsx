import { Check, Info } from 'lucide-react';

export function ConnectionDetails() {
  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Connection Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* API Endpoints */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-medium mb-4">API Endpoints</h3>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded border border-gray-200">
              <div className="flex items-center">
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded mr-2">GET</span>
                <code className="text-sm text-gray-800 font-mono">/api/users</code>
              </div>
              <p className="text-sm text-gray-600 mt-1">Fetch all users</p>
            </div>
            
            <div className="p-3 bg-gray-50 rounded border border-gray-200">
              <div className="flex items-center">
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded mr-2">POST</span>
                <code className="text-sm text-gray-800 font-mono">/api/users</code>
              </div>
              <p className="text-sm text-gray-600 mt-1">Create new user</p>
            </div>
            
            <div className="p-3 bg-gray-50 rounded border border-gray-200">
              <div className="flex items-center">
                <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded mr-2">PUT</span>
                <code className="text-sm text-gray-800 font-mono">/api/users/:id</code>
              </div>
              <p className="text-sm text-gray-600 mt-1">Update a user</p>
            </div>
            
            <div className="p-3 bg-gray-50 rounded border border-gray-200">
              <div className="flex items-center">
                <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded mr-2">DELETE</span>
                <code className="text-sm text-gray-800 font-mono">/api/users/:id</code>
              </div>
              <p className="text-sm text-gray-600 mt-1">Delete a user</p>
            </div>
          </div>
        </div>
        
        {/* Database Schema */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-medium mb-4">Database Schema</h3>
          <div className="bg-[#1E293B] text-white p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <pre>CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);</pre>
          </div>
          
          <h4 className="text-md font-medium mt-6 mb-2">Configuration</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Database Type:</span>
              <span className="font-medium">SQLite3</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Database File:</span>
              <span className="font-mono">./data/database.sqlite</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ORM/Query Builder:</span>
              <span className="font-medium">Drizzle ORM</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

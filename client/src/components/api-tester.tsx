import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const examples = [
  { 
    name: 'GET all users', 
    method: 'GET', 
    url: '/api/users',
    body: ''
  },
  { 
    name: 'GET single user', 
    method: 'GET', 
    url: '/api/users/1',
    body: ''
  },
  { 
    name: 'CREATE new user', 
    method: 'POST', 
    url: '/api/users',
    body: `{
  "name": "Test User",
  "email": "test@example.com"
}`
  },
  { 
    name: 'UPDATE user', 
    method: 'PUT', 
    url: '/api/users/1',
    body: `{
  "name": "Updated User",
  "email": "updated@example.com"
}`
  },
  { 
    name: 'DELETE user', 
    method: 'DELETE', 
    url: '/api/users/1',
    body: ''
  }
];

export function ApiTester() {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('/api/users');
  const [body, setBody] = useState('');
  const [response, setResponse] = useState('// Response will appear here after making a request');
  const [isLoading, setIsLoading] = useState(false);
  
  const loadExample = (example: typeof examples[0]) => {
    setMethod(example.method);
    setUrl(example.url);
    setBody(example.body);
  };
  
  const handleSendRequest = async () => {
    setIsLoading(true);
    setResponse('// Loading...');
    
    try {
      const options: RequestInit = {
        method,
        headers: {},
        credentials: 'include'
      };
      
      if (method !== 'GET' && body.trim()) {
        try {
          const jsonBody = JSON.parse(body);
          options.body = JSON.stringify(jsonBody);
          (options.headers as Record<string, string>)['Content-Type'] = 'application/json';
        } catch (err) {
          setResponse(`// Error parsing JSON body:\n${(err as Error).message}`);
          setIsLoading(false);
          return;
        }
      }
      
      const response = await fetch(url, options);
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        setResponse(`// Status: ${response.status} ${response.statusText} (${method} ${url})\n\n${JSON.stringify(data, null, 2)}`);
      } else {
        const text = await response.text();
        setResponse(`// Status: ${response.status} ${response.statusText} (${method} ${url})\n\n${text}`);
      }
    } catch (err) {
      setResponse(`// Error making request:\n${(err as Error).message}`);
    }
    
    setIsLoading(false);
  };
  
  return (
    <section className="mt-8 bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <h2 className="text-xl font-semibold mb-4">API Tester</h2>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3">
          <div className="flex space-x-2 mb-4">
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
              </SelectContent>
            </Select>
            
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter API endpoint"
              className="flex-1"
            />
            
            <Button onClick={handleSendRequest} disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send'}
            </Button>
          </div>
          
          <div>
            <Label htmlFor="requestBody" className="block text-sm font-medium text-gray-700 mb-1">
              Request Body (JSON)
            </Label>
            <Textarea
              id="requestBody"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={`{
  "name": "Test User",
  "email": "test@example.com"
}`}
              rows={4}
              className="font-mono"
              disabled={method === 'GET'}
            />
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <h4 className="text-sm font-medium text-gray-700 mb-1">Examples</h4>
          <div className="space-y-2">
            {examples.map((example, index) => (
              <button
                key={index}
                onClick={() => loadExample(example)}
                className="w-full text-left text-xs p-2 bg-gray-50 hover:bg-gray-100 rounded"
              >
                {example.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-1">Response</h4>
        <div className="bg-[#1E293B] text-white p-4 rounded-lg font-mono text-sm h-48 overflow-y-auto">
          <pre>{response}</pre>
        </div>
      </div>
    </section>
  );
}

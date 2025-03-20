import React, { useEffect, useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { SalesChart } from './components/SalesChart';
import { fetchChartData } from './api';
import { DataPoint } from './types';

function App() {
  const [data, setData] = useState<DataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const chartData = await fetchChartData();
        setData(chartData);
      } catch (err) {
        setError('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">
                Sales Dashboard
              </span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Sales & Revenue Overview
          </h2>
          <SalesChart
            data={data}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
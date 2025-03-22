import React, { useEffect, useState } from 'react';
import { ListPlus } from 'lucide-react';
import { ItemList } from './components/ItemList';
import { fetchItems } from './api';
import { Item } from './types';

function App() {
  const [items, setItems] = useState<Item[]>([]); // Initialize with empty array
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchItems();
        // Ensure data is an array
        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error loading items:', err);
        setError('Failed to load items');
        setItems([]); // Set empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleItemAdded = (newItem: Item) => {
    setItems(prevItems => [...prevItems, newItem]);
  };

  const handleItemUpdated = (updatedItem: Item) => {
    setItems(prevItems =>
      prevItems.map(item => (item.id === updatedItem.id ? updatedItem : item))
    );
  };

  const handleItemDeleted = (id: number) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <ListPlus className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">
                Item Manager
              </span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Manage Items
          </h2>
          <ItemList 
            items={items}
            isLoading={isLoading}
            error={error}
            onItemAdded={handleItemAdded}
            onItemUpdated={handleItemUpdated}
            onItemDeleted={handleItemDeleted}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
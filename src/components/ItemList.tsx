import React, { useState } from 'react';
import { Item, ItemInput } from '../types';
import { createItem, deleteItem, updateItem } from '../api';

interface Props {
  items: Item[];
  isLoading: boolean;
  error: string | null;
  onItemAdded: (item: Item) => void;
  onItemUpdated: (item: Item) => void;
  onItemDeleted: (id: number) => void;
}

export const ItemList: React.FC<Props> = ({
  items,
  isLoading,
  error,
  onItemAdded,
  onItemUpdated,
  onItemDeleted
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newItem: ItemInput = {
      title,
      description
    };

    try {
      if (editingId !== null) {
        const updated = await updateItem(editingId, newItem);
        onItemUpdated(updated);
        setEditingId(null);
      } else {
        const created = await createItem(newItem);
        onItemAdded(created);
      }
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  const handleEdit = (item: Item) => {
    setTitle(item.title);
    setDescription(item.description);
    setEditingId(item.id);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteItem(id);
      onItemDeleted(id);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const cancelEdit = () => {
    setTitle('');
    setDescription('');
    setEditingId(null);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-64 text-red-500">{error}</div>;
  }

  // Ensure items is an array
  const itemsArray = Array.isArray(items) ? items : [];

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div className="flex space-x-2">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {editingId !== null ? 'Update' : 'Add'} Item
          </button>
          {editingId !== null && (
            <button
              type="button"
              onClick={cancelEdit}
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900">Items</h3>
        <div className="mt-4 divide-y divide-gray-200">
          {itemsArray.length === 0 ? (
            <p className="text-gray-500">No items found. Add your first item above.</p>
          ) : (
            itemsArray.map((item) => (
              <div key={item.id} className="py-4">
                <div className="flex justify-between">
                  <div>
                    <h4 className="text-lg font-bold">{item.title}</h4>
                    <p className="mt-1 text-gray-600">{item.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

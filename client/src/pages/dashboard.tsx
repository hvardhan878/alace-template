import { useState } from 'react';
import { Header } from '@/components/header';
import { SystemOverview } from '@/components/system-overview';
import { DataDisplay } from '@/components/data-display';
import { UserForm } from '@/components/user-form';
import { ConnectionDetails } from '@/components/connection-details';
import { ApiTester } from '@/components/api-tester';
import { User } from '@shared/schema';

export default function Dashboard() {
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleEdit = (user: User) => {
    setEditingUser(user);
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <SystemOverview />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <DataDisplay onEdit={handleEdit} />
          <UserForm editingUser={editingUser} onCancelEdit={handleCancelEdit} />
        </div>
        
        <ConnectionDetails />
        <ApiTester />
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            Vite + Express + SQLite Integration Demo
          </p>
        </div>
      </footer>
    </div>
  );
}

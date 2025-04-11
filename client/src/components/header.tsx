import { Database } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Database className="text-primary h-6 w-6 mr-2" />
              <span className="font-semibold text-xl">Vite + Express + SQLite</span>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <a href="#" className="border-primary text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Dashboard
              </a>
              <a href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Documentation
              </a>
            </div>
          </div>
          <div className="flex items-center">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <span className="h-2 w-2 mr-1.5 bg-green-500 rounded-full"></span>
              Connected
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

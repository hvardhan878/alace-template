import { ReactNode } from 'react';
import { Server, Database } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';

interface OverviewCardProps {
  title: string;
  icon: ReactNode;
  items: { label: string; value: string | ReactNode }[];
}

function OverviewCard({ title, icon, items }: OverviewCardProps) {
  return (
    <Card className="border border-gray-100">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          {icon}
          <h2 className="text-lg font-medium">{title}</h2>
        </div>
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex justify-between">
              <span className="text-gray-600">{item.label}:</span>
              <span className={typeof item.value === 'string' && item.value.includes('Active') ? 'font-medium text-green-600' : ''}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function SystemOverview() {
  const { data: userCount = 0 } = useQuery({
    queryKey: ['/api/users/count'],
    queryFn: async () => {
      const response = await fetch('/api/users');
      const data = await response.json();
      return data.data.length;
    }
  });

  return (
    <section className="mb-8">
      <h1 className="text-2xl font-semibold mb-4">System Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Frontend Card */}
        <OverviewCard 
          title="Frontend (Vite)"
          icon={<svg className="text-primary h-6 w-6 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L22 8.5V15.5L12 22L2 15.5V8.5L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 22V15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M22 8.5L12 15.5L2 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>}
          items={[
            { label: 'Status', value: 'Active' },
            { label: 'Port', value: '5000' },
            { label: 'API Connected', value: 'Yes' }
          ]}
        />

        {/* Backend Card */}
        <OverviewCard 
          title="Backend (Express)"
          icon={<Server className="text-primary h-6 w-6 mr-2" />}
          items={[
            { label: 'Status', value: 'Running' },
            { label: 'Port', value: '8000' },
            { label: 'Endpoints', value: '4 active' }
          ]}
        />

        {/* Database Card */}
        <OverviewCard 
          title="Database (SQLite)"
          icon={<Database className="text-primary h-6 w-6 mr-2" />}
          items={[
            { label: 'Status', value: 'Connected' },
            { label: 'Tables', value: '1' },
            { label: 'Records', value: userCount.toString() }
          ]}
        />
      </div>
    </section>
  );
}

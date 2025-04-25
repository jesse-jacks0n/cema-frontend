import {useEffect, useState} from "react";
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import { clientsApi, programsApi, type Client, type Program } from '../services/api';
import { 
  UserPlusIcon, 
  FolderPlusIcon, 
  UserGroupIcon, 
  ArrowTrendingUpIcon, 
  CalendarIcon, 
  ClipboardDocumentCheckIcon, 
  UsersIcon
} from '@heroicons/react/24/outline';

const StatCard = ({ title, value, icon, color }: { title: string, value: string | number, icon: React.ReactNode, color: string }) => (
  <div className={`bg-white rounded-lg shadow-md shadow-gray-100 border border-gray-100 p-5`}>
    <div className="flex items-start">
      <div className={`flex-shrink-0 rounded-full p-3 ${color}`}>
        {icon}
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [recentClients, setRecentClients] = useState<Client[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsRes, programsRes] = await Promise.all([
          clientsApi.getAll(),
          programsApi.getAll(),
        ]);
        setRecentClients(clientsRes.data.slice(0, 5));
        setPrograms(programsRes.data);
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-3">
          <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <div className="text-lg font-medium text-gray-700">Loading dashboard data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-lg">
        <div className="flex">
          <svg className="h-5 w-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      </div>
    );
  }

  // Calculate some metrics for the dashboard
  const totalClients = recentClients.length;
  const totalPrograms = programs.length;
  const totalEnrollments = recentClients.reduce((acc, client) => acc + client.programs.length, 0);
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Overview</h1>
      </div>
      
      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard 
          title="Total Clients" 
          value={totalClients} 
          icon={<UsersIcon className="h-6 w-6 text-blue-600" />}
          color="bg-blue-50" 
        />
        <StatCard 
          title="Active Programs" 
          value={totalPrograms} 
          icon={<ClipboardDocumentCheckIcon className="h-6 w-6 text-green-600" />}
          color="bg-green-50" 
        />
        <StatCard 
          title="Enrollments" 
          value={totalEnrollments} 
          icon={<CalendarIcon className="h-6 w-6 text-purple-600" />}
          color="bg-purple-50" 
        />
        <StatCard 
          title="Completion Rate" 
          value="87%" 
          icon={<ArrowTrendingUpIcon className="h-6 w-6 text-indigo-600" />}
          color="bg-indigo-50" 
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Client activity card */}
        <div className="lg:col-span-2">
          <Card 
            title="Recent Client Activity" 
            icon={<UserGroupIcon className="h-5 w-5 text-blue-600" />}
            headerBg="bg-blue-50"
            footer={
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Showing {recentClients.length} recent clients</span>
                <Link to="/clients/search" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                  View all clients →
                </Link>
              </div>
            }
          >
            {recentClients.length > 0 ? (
              <div className="divide-y divide-gray-100 -mx-5 max-h-80 overflow-y-auto">
                {recentClients.map((client) => (
                  <Link 
                    key={client.id} 
                    to={`/clients/${client.id}`}
                    className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition duration-150"
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <UserGroupIcon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">{client.name}</p>
                        <p className="text-xs text-gray-500">Last updated: Today</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="bg-blue-50 text-blue-800 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium">
                        {client.programs.length} programs
                      </span>
                      <svg className="ml-2 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No clients registered</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by registering a new client.</p>
                <div className="mt-6">
                  <Link to="/clients/new" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                    <UserPlusIcon className="-ml-1 mr-2 h-5 w-5" />
                    Register Client
                  </Link>
                </div>
              </div>
            )}
          </Card>
        </div>
        
        {/* Program overview */}
        <div>
          <Card 
            title="Active Programs" 
            icon={<FolderPlusIcon className="h-5 w-5 text-green-600" />}
            headerBg="bg-green-50"
            footer={
              <Link to="/programs/new" className="flex items-center justify-center text-sm font-medium text-green-600 hover:text-green-800">
                <FolderPlusIcon className="h-4 w-4 mr-1" />
                Create new program
              </Link>
            }
          >
            {programs.length > 0 ? (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {programs.map((program) => (
                  <div key={program.id} className="flex items-center p-2 rounded-md hover:bg-gray-50">
                    <div className="flex-shrink-0 w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="ml-3 text-sm font-medium text-gray-900">{program.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <FolderPlusIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No programs created</h3>
                <p className="mt-1 text-sm text-gray-500">Create your first program to get started.</p>
              </div>
            )}
          </Card>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/programs/new"
            className="group bg-white p-5 rounded-lg border border-gray-100 shadow-md shadow-gray-100 hover:shadow transition-all duration-200 flex flex-col items-center justify-center text-center"
          >
            <div className="rounded-full bg-blue-50 p-3 mb-3 group-hover:bg-blue-100 transition-colors">
              <FolderPlusIcon className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-base font-medium text-gray-900 group-hover:text-blue-700">Create Program</h3>
            <p className="mt-1 text-sm text-gray-500">Add a new health program</p>
          </Link>

          <Link
            to="/clients/new"
            className="group bg-white p-5 rounded-lg border border-gray-100 shadow-md shadow-gray-100 hover:shadow transition-all duration-200 flex flex-col items-center justify-center text-center"
          >
            <div className="rounded-full bg-green-50 p-3 mb-3 group-hover:bg-green-100 transition-colors">
              <UserPlusIcon className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-base font-medium text-gray-900 group-hover:text-green-700">Register Client</h3>
            <p className="mt-1 text-sm text-gray-500">Add a new client to the system</p>
          </Link>

          <Link
            to="/clients/search"
            className="group bg-white p-5 rounded-lg border border-gray-100 shadow-md shadow-gray-100 hover:shadow transition-all duration-200 flex flex-col items-center justify-center text-center"
          >
            <div className="rounded-full bg-purple-50 p-3 mb-3 group-hover:bg-purple-100 transition-colors">
              <UserGroupIcon className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-base font-medium text-gray-900 group-hover:text-purple-700">Search Clients</h3>
            <p className="mt-1 text-sm text-gray-500">Find and manage existing clients</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
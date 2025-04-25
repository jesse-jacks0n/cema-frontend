import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  UserPlusIcon, 
  FolderPlusIcon, 
  UserGroupIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';
import { UserCircleIcon } from "@heroicons/react/24/solid";

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Create Program', href: '/programs/new', icon: FolderPlusIcon },
  { name: 'Register Client', href: '/clients/new', icon: UserPlusIcon },
  { name: 'Enroll Client', href: '/enrollments/new', icon: UserCircleIcon },
  { name: 'Search Clients', href: '/clients/search', icon: UserGroupIcon },
];

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-white">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-gray-800 bg-opacity-75 transition-opacity lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex min-h-screen w-full">
        {/* Sidebar - fixed on desktop */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-30 w-60 transform bg-white border-r border-gray-100 transition-all duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0
          `}
        >
          {/* Navigation */}
          <nav className="mt-6 flex-1 space-y-1 px-3">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center rounded-md px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon 
                    className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${
                      isActive ? 'text-blue-700' : 'text-gray-500'
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar footer */}
          <div className="border-t border-gray-100 p-4 mt-6">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <UserCircleIcon className="h-8 w-8 text-blue-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content area with padding for sidebar */}
        <div className="flex flex-1 flex-col min-h-screen w-full lg:pl-60">
          {/* Header */}
          <header className="sticky top-0 z-10 w-full bg-white border-b border-gray-100 ">
            <div className="px-4 md:px-6 h-16 flex items-center justify-between w-full">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="rounded-md p-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 lg:hidden"
                >
                  <Bars3Icon className="h-6 w-6" />
                </button>
                <div className="flex items-center space-x-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100">
                    <UserGroupIcon className="h-4 w-4 text-blue-700" />
                  </div>
                  <h1 className="text-2xl font-semibold text-gray-900">Health Information System</h1>
                </div>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 w-full">
            <div className="h-full w-full max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>

          {/* Footer */}
          <footer className="w-full border-t border-gray-100 bg-white">
            <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
              <p className="text-sm text-gray-500">
                © 2025 HealtInfoSys. All rights reserved.
              </p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Layout;
import React from 'react';
import Link from 'next/link';
import { Users, FileText, Download, Eye, BarChart3, Settings } from 'lucide-react';

const AdminDashboard = () => {
  const quickActions = [
    {
      title: 'View Team Details',
      description: 'Browse and manage all team information',
      icon: Eye,
      href: '/dashboard/admin/view_details',
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600'
    },
    {
      title: 'Export Data',
      description: 'Download team data in CSV format',
      icon: Download,
      href: '/dashboard/admin/export_details',
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600'
    }

  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back! Manage teams, export data, and view analytics.
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                href={action.href}
                className="block group"
              >
                <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-200 hover:shadow-lg border-2 border-transparent hover:border-gray-200">
                  <div className="flex items-start">
                    <div className={`${action.color} ${action.hoverColor} p-3 rounded-lg transition-colors`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {action.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Additional Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start">
            <Settings className="h-6 w-6 text-gray-400 mt-1" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Getting Started
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  View all teams and their details in the View Team Details section
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Export team data for analysis and reporting
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

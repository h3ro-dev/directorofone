'use client';

<<<<<<< HEAD
import React from 'react';
import { Container } from '@/components/layout/Container';
import { Heading, Text } from '@/components/ui/Typography';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

// Sample data for the dashboard
const metrics = [
  {
    label: 'Tasks Completed',
    value: '24',
    change: '+12%',
    trend: 'up',
  },
  {
    label: 'Hours Saved',
    value: '16.5',
    change: '+8%',
    trend: 'up',
  },
  {
    label: 'Active Workflows',
    value: '7',
    change: '0%',
    trend: 'neutral',
  },
  {
    label: 'Efficiency Score',
    value: '92%',
    change: '+5%',
    trend: 'up',
  },
];

const recentTasks = [
  { id: 1, title: 'Review Q4 budget proposal', status: 'completed', priority: 'high' },
  { id: 2, title: 'Update team documentation', status: 'in-progress', priority: 'medium' },
  { id: 3, title: 'Schedule stakeholder meetings', status: 'pending', priority: 'high' },
  { id: 4, title: 'Analyze performance metrics', status: 'pending', priority: 'low' },
];

const quickActions = [
  { label: 'Create Task', icon: '➕', action: '/dashboard/tasks/new' },
  { label: 'New Workflow', icon: '⚡', action: '/dashboard/workflows/new' },
  { label: 'View Reports', icon: '📊', action: '/dashboard/analytics' },
  { label: 'Set Priority', icon: '🎯', action: '/dashboard/priorities' },
];

export default function DashboardPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Heading as="h1" className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back, John
        </Heading>
        <Text variant="muted">Here's what's happening in your department today</Text>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader>
              <Text variant="muted" className="text-sm">{metric.label}</Text>
              <div className="flex items-baseline justify-between">
                <CardTitle className="text-3xl font-bold">{metric.value}</CardTitle>
                <span className={`text-sm font-medium ${
                  metric.trend === 'up' ? 'text-green-600' : 
                  metric.trend === 'down' ? 'text-red-600' : 
                  'text-gray-500'
                }`}>
                  {metric.change}
                </span>
              </div>
            </CardHeader>
            <div className={`absolute inset-x-0 bottom-0 h-1 ${
              metric.trend === 'up' ? 'bg-green-500' : 
              metric.trend === 'down' ? 'bg-red-500' : 
              'bg-gray-300'
            }`} />
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Tasks */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Tasks</CardTitle>
              <Button variant="outline" size="sm" onClick={() => window.location.href = '/dashboard/tasks'}>
                View All
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentTasks.map((task) => (
                  <div key={task.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={task.status === 'completed'}
                        className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                        readOnly
                      />
                      <div>
                        <p className={`font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                            task.priority === 'high' ? 'bg-red-100 text-red-800' :
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {task.priority}
                          </span>
                          <span className={`text-xs ${
                            task.status === 'completed' ? 'text-green-600' :
                            task.status === 'in-progress' ? 'text-blue-600' :
                            'text-gray-500'
                          }`}>
                            {task.status.replace('-', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="flex flex-col items-center gap-2 h-auto py-4"
                  onClick={() => window.location.href = action.action}
                >
                  <span className="text-2xl">{action.icon}</span>
                  <span className="text-sm">{action.label}</span>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* AI Assistant Preview */}
          <Card className="mt-6 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-primary-200">
            <CardHeader>
              <CardTitle className="text-primary-700 dark:text-primary-300">AI Assistant</CardTitle>
            </CardHeader>
            <CardContent>
              <Text className="text-sm text-primary-600 dark:text-primary-400 mb-3">
                "Based on your patterns, I suggest prioritizing the stakeholder meetings today. You typically handle these best in the morning."
              </Text>
              <Button size="sm" className="w-full">
                Get More Suggestions
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
=======
import { useAuth, withAuth } from '@/src/contexts/AuthContext';
import Link from 'next/link';

function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold">Director of One</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Welcome, {user?.firstName || user?.username}!
              </span>
              <button
                onClick={logout}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h2>
            
            <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  User Information
                </h3>
                <div className="mt-5">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Full name</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {user?.fullName || 'Not set'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Email address</dt>
                      <dd className="mt-1 text-sm text-gray-900">{user?.email}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Username</dt>
                      <dd className="mt-1 text-sm text-gray-900">{user?.username}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Role</dt>
                      <dd className="mt-1 text-sm text-gray-900 capitalize">{user?.role}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Email Verified</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {user?.isVerified ? (
                          <span className="text-green-600">Verified</span>
                        ) : (
                          <span className="text-yellow-600">Not Verified</span>
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Account Status</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {user?.isActive ? (
                          <span className="text-green-600">Active</span>
                        ) : (
                          <span className="text-red-600">Inactive</span>
                        )}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
              
              <div className="px-4 py-4 sm:px-6">
                <div className="flex space-x-3">
                  <Link
                    href="/profile"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Edit Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Account Settings
                  </Link>
                </div>
              </div>
            </div>

            {!user?.isVerified && (
              <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      Your email address is not verified.{' '}
                      <Link href="/verify-email" className="font-medium underline text-yellow-700 hover:text-yellow-600">
                        Verify your email
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default withAuth(DashboardPage);
>>>>>>> origin/main

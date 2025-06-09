'use client';

import { withAuth } from '@/contexts/AuthContext';
import { Container, Grid, Card, CardHeader, CardTitle, CardDescription, Button, Text, Heading } from '@/components';
import Link from 'next/link';

function DashboardPage() {
  // Mock data for demonstration
  const stats = {
    tasksCompleted: 23,
    hoursThisWeek: 42,
    tasksCount: 47,
    upcomingDeadlines: 3,
    timeSaved: 12.5,
    automationsRun: 156
  };

  const priorityTasks = [
    { id: 1, title: "Q4 Budget Review", deadline: "Today", priority: "high" },
    { id: 2, title: "Team Performance Reports", deadline: "Tomorrow", priority: "high" },
    { id: 3, title: "Vendor Contract Renewal", deadline: "Friday", priority: "medium" }
  ];

  const recentActivity = [
    { id: 1, action: "Automated weekly report sent to CEO", time: "2 hours ago", type: "automation" },
    { id: 2, action: "Budget spreadsheet updated", time: "3 hours ago", type: "task" },
    { id: 3, action: "3 invoices processed automatically", time: "5 hours ago", type: "automation" }
  ];

  return (
    <Container className="py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <Heading as="h1" className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, Director
        </Heading>
        <Text className="text-gray-600">
          Here's your department overview for today
        </Text>
      </div>

      {/* Key Metrics */}
      <Grid cols={4} gap="md" className="mb-8">
        <Card variant="bordered">
          <CardHeader className="text-center">
            <div className="text-3xl font-bold text-primary-600">{stats.hoursThisWeek}</div>
            <CardTitle className="text-sm mt-1">Hours Worked</CardTitle>
            <CardDescription>This week</CardDescription>
          </CardHeader>
        </Card>
        
        <Card variant="bordered">
          <CardHeader className="text-center">
            <div className="text-3xl font-bold text-green-600">{stats.timeSaved}</div>
            <CardTitle className="text-sm mt-1">Hours Saved</CardTitle>
            <CardDescription>Through automation</CardDescription>
          </CardHeader>
        </Card>
        
        <Card variant="bordered">
          <CardHeader className="text-center">
            <div className="text-3xl font-bold text-accent-600">{stats.tasksCompleted}</div>
            <CardTitle className="text-sm mt-1">Tasks Completed</CardTitle>
            <CardDescription>This week</CardDescription>
          </CardHeader>
        </Card>
        
        <Card variant="bordered">
          <CardHeader className="text-center">
            <div className="text-3xl font-bold text-red-600">{stats.upcomingDeadlines}</div>
            <CardTitle className="text-sm mt-1">Urgent Items</CardTitle>
            <CardDescription>Need attention</CardDescription>
          </CardHeader>
        </Card>
      </Grid>

      <Grid cols={2} gap="lg">
        {/* Priority Tasks */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center mb-4">
              <CardTitle>Priority Tasks</CardTitle>
              <Link href="/dashboard/tasks">
                <Button variant="secondary" size="sm">View All</Button>
              </Link>
            </div>
            <div className="space-y-3">
              {priorityTasks.map(task => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <Text className="font-medium">{task.title}</Text>
                    <Text variant="small" className="text-gray-600">Due: {task.deadline}</Text>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    task.priority === 'high' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          </CardHeader>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center mb-4">
              <CardTitle>Recent Activity</CardTitle>
              <Link href="/dashboard/analytics">
                <Button variant="secondary" size="sm">View Analytics</Button>
              </Link>
            </div>
            <div className="space-y-3">
              {recentActivity.map(activity => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                    activity.type === 'automation' ? 'bg-primary-500' : 'bg-gray-400'
                  }`} />
                  <div className="flex-1">
                    <Text variant="small">{activity.action}</Text>
                    <Text variant="small" className="text-gray-500">{activity.time}</Text>
                  </div>
                </div>
              ))}
            </div>
          </CardHeader>
        </Card>
      </Grid>

      {/* Quick Actions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="mb-4">Quick Actions</CardTitle>
          <Grid cols={4} gap="md">
            <Link href="/dashboard/tasks/new">
              <Button variant="secondary" className="w-full">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Task
              </Button>
            </Link>
            <Link href="/dashboard/workflows">
              <Button variant="secondary" className="w-full">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Run Workflow
              </Button>
            </Link>
            <Link href="/dashboard/analytics">
              <Button variant="secondary" className="w-full">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Generate Report
              </Button>
            </Link>
            <Link href="/dashboard/priorities">
              <Button variant="secondary" className="w-full">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Review Priorities
              </Button>
            </Link>
          </Grid>
        </CardHeader>
      </Card>

      {/* AI Insights */}
      <Card className="mt-8 bg-gradient-to-r from-primary-50 to-accent-50">
        <CardHeader>
          <div className="flex items-start space-x-4">
            <div className="text-primary-600">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="flex-1">
              <CardTitle className="text-primary-700">AI Insights</CardTitle>
              <Text className="mt-2">
                Based on your patterns, Wednesday mornings are your most productive time. 
                Consider scheduling deep work sessions then. You have 3 tasks that could be automated, 
                potentially saving 4 hours this week.
              </Text>
              <Button size="sm" className="mt-3">
                View Recommendations
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>
    </Container>
  );
}

export default withAuth(DashboardPage);
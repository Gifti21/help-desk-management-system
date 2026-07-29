'use client';

import React, { useState } from 'react';
import { PageLayout } from '../../../../components/admin/PageLayout';
import { TopBar } from '../../../../components/admin/TopBar';
import { DataTable } from '../../../../components/admin/DataTable';
import { useTheme } from '../../../../components/providers/ThemeProvider';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { fonts } from '@/lib/fonts';
import { BarChart } from '../../../../components/charts/bar-chart';
import { PieChart } from '../../../../components/charts/pie-chart';
import { ReportFilters } from '../../../../components/reports/ReportFilters';
import { ExportButtons } from '../../../../components/reports/ExportButtons';
import { MetricsGrid } from '../../../../components/reports/MetricsGrid';
import { useToast } from '../../../../components/ui/toast';
import {
    RefreshCw,
    User,
    Activity,
    MessageSquare,
    LogIn
} from 'lucide-react';

// Mock user activity data
const userMetrics = [
    {
        id: 'total-users',
        title: 'Total Users',
        value: '156',
        subtitle: 'Active users',
        icon: 'users'
    },
    {
        id: 'daily-logins',
        title: 'Daily Logins',
        value: '89',
        subtitle: 'Average per day',
        trend: '+12% increase',
        trendColor: '#10B981',
        icon: 'activity'
    },
    {
        id: 'most-active',
        title: 'Most Active',
        value: 'Admin User',
        subtitle: '145 logins this month',
        trend: 'Consistent usage',
        trendColor: '#10B981',
        icon: 'target'
    },
    {
        id: 'avg-session',
        title: 'Avg. Session',
        value: '2.3h',
        subtitle: 'Session duration',
        trend: '+15m increase',
        trendColor: '#10B981',
        icon: 'clock'
    }
];

const userActivityData = [
    {
        user: 'Admin User',
        email: 'admin@company.com',
        role: 'Administrator',
        logins: 145,
        ticketsCreated: 28,
        commentsAdded: 89,
        lastActive: '2 minutes ago',
        totalSessions: '8.5h'
    },
    {
        user: 'John Smith',
        email: 'john.smith@company.com',
        role: 'Manager',
        logins: 98,
        ticketsCreated: 42,
        commentsAdded: 67,
        lastActive: '15 minutes ago',
        totalSessions: '6.2h'
    },
    {
        user: 'Mary Jones',
        email: 'mary.jones@company.com',
        role: 'Employee',
        logins: 76,
        ticketsCreated: 35,
        commentsAdded: 54,
        lastActive: '1 hour ago',
        totalSessions: '4.8h'
    },
    {
        user: 'Robert Brown',
        email: 'robert.brown@company.com',
        role: 'Employee',
        logins: 65,
        ticketsCreated: 29,
        commentsAdded: 48,
        lastActive: '2 hours ago',
        totalSessions: '3.9h'
    },
    {
        user: 'Lisa Wilson',
        email: 'lisa.wilson@company.com',
        role: 'Manager',
        logins: 54,
        ticketsCreated: 18,
        commentsAdded: 32,
        lastActive: '3 hours ago',
        totalSessions: '3.2h'
    }
];

const roleDistribution = [
    { name: 'Employees', value: 89, color: '#3B82F6' },
    { name: 'Managers', value: 34, color: '#F59E0B' },
    { name: 'Administrators', value: 12, color: '#10B981' },
    { name: 'Agents', value: 21, color: '#EF4444' }
];

const activityChart = [
    { name: 'Admin', value: 145 },
    { name: 'John', value: 98 },
    { name: 'Mary', value: 76 },
    { name: 'Robert', value: 65 },
    { name: 'Lisa', value: 54 }
];

export default function UserReportsPage() {
    const [dateRange, setDateRange] = useState('Jun 1, 2026 - Jun 30, 2026');
    const [selectedRole, setSelectedRole] = useState('all');
    const [selectedDepartment, setSelectedDepartment] = useState('all');
    const [isLoading, setIsLoading] = useState(false);

    const { toast } = useToast();
    const { colors: theme } = useTheme();

    const handleExportCSV = () => {
        setIsLoading(true);
        setTimeout(() => {
            toast('User activity report exported as CSV.', 'success');
            setIsLoading(false);
        }, 1500);
    };

    const handleExportPDF = () => {
        setIsLoading(true);
        setTimeout(() => {
            toast('User activity report exported as PDF.', 'success');
            setIsLoading(false);
        }, 1500);
    };

    const handleRefreshData = () => {
        setIsLoading(true);
        setTimeout(() => {
            toast('User activity data refreshed.', 'info');
            setIsLoading(false);
        }, 1200);
    };

    const getRoleColor = (role: string) => {
        switch (role.toLowerCase()) {
            case 'administrator': return '#10B981';
            case 'manager': return '#F59E0B';
            case 'employee': return '#3B82F6';
            default: return theme.foregroundMuted;
        }
    };

    const userColumns = [
        {
            key: 'user',
            title: 'User',
            render: (value: string, row: any) => (
                <div>
                    <div className="flex items-center space-x-2">
                        <div
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: theme.primary, color: theme.primaryForeground }}
                        >
                            <span style={{ fontSize: fonts.body.sm.size, fontWeight: fonts.fontWeight.semibold }}>
                                {value.split(' ').map(n => n[0]).join('')}
                            </span>
                        </div>
                        <div>
                            <p
                                style={{
                                    fontSize: fonts.body.sm.size,
                                    fontWeight: fonts.fontWeight.medium,
                                    color: theme.foreground
                                }}
                            >
                                {value}
                            </p>
                            <p
                                style={{
                                    fontSize: fonts.caption.regular.size,
                                    color: theme.foregroundMuted
                                }}
                            >
                                {row.email}
                            </p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            key: 'role',
            title: 'Role',
            render: (value: string) => (
                <span
                    style={{
                        fontSize: fonts.body.sm.size,
                        color: getRoleColor(value),
                        fontWeight: fonts.fontWeight.medium
                    }}
                >
                    {value}
                </span>
            )
        },
        {
            key: 'logins',
            title: 'Logins',
            render: (value: number) => (
                <div className="flex items-center space-x-1">
                    <LogIn className="h-4 w-4" style={{ color: theme.primary }} />
                    <span style={{ fontSize: fonts.body.sm.size, color: theme.foreground }}>
                        {value}
                    </span>
                </div>
            )
        },
        {
            key: 'ticketsCreated',
            title: 'Tickets Created',
            render: (value: number) => (
                <span style={{ fontSize: fonts.body.sm.size, color: theme.foreground }}>
                    {value}
                </span>
            )
        },
        {
            key: 'commentsAdded',
            title: 'Comments',
            render: (value: number) => (
                <div className="flex items-center space-x-1">
                    <MessageSquare className="h-4 w-4" style={{ color: theme.foregroundMuted }} />
                    <span style={{ fontSize: fonts.body.sm.size, color: theme.foregroundMuted }}>
                        {value}
                    </span>
                </div>
            )
        },
        {
            key: 'totalSessions',
            title: 'Total Time',
            render: (value: string) => (
                <span style={{ fontSize: fonts.body.sm.size, color: theme.foregroundMuted }}>
                    {value}
                </span>
            )
        },
        {
            key: 'lastActive',
            title: 'Last Active',
            render: (value: string) => (
                <span style={{ fontSize: fonts.body.sm.size, color: theme.foregroundMuted }}>
                    {value}
                </span>
            )
        }
    ];

    const topBarActions = (
        <>
            <RefreshCw
                className="h-4 w-4 cursor-pointer"
                style={{ color: theme.foregroundMuted }}
                onClick={handleRefreshData}
            />
            <ExportButtons
                onExportCSV={handleExportCSV}
                onExportPDF={handleExportPDF}
                isLoading={isLoading}
            />
        </>
    );

    const reportFilters = [
        {
            id: 'role',
            label: 'User Role',
            value: selectedRole,
            onChange: setSelectedRole,
            options: [
                { label: 'All Roles', value: 'all' },
                { label: 'Administrator', value: 'admin' },
                { label: 'Manager', value: 'manager' },
                { label: 'Employee', value: 'employee' },
                { label: 'Agent', value: 'agent' }
            ]
        },
        {
            id: 'department',
            label: 'Department',
            value: selectedDepartment,
            onChange: setSelectedDepartment,
            options: [
                { label: 'All Departments', value: 'all' },
                { label: 'IT Services', value: 'it' },
                { label: 'Support', value: 'support' },
                { label: 'HR & Operations', value: 'hr' },
                { label: 'Engineering', value: 'engineering' }
            ]
        }
    ];

    return (
        <PageLayout>
            <TopBar
                title="User Activity Reports"
                subtitle="User engagement, login activity, and usage analytics"
                actions={topBarActions}
            />

            <div className="flex flex-col lg:flex-row gap-6 p-6">
                {/* Sidebar Filters */}
                <div className="lg:w-64 flex-shrink-0">
                    <Card
                        className="shadow-sm transition-colors sticky top-6"
                        style={{
                            backgroundColor: 'var(--card)',
                            borderColor: 'var(--card-border)'
                        }}
                    >
                        <CardContent className="p-4">
                            <ReportFilters
                                dateRange={dateRange}
                                onDateRangeChange={setDateRange}
                                filters={reportFilters}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="flex-1 space-y-6">
                    {/* Key Metrics */}
                    <MetricsGrid metrics={userMetrics} />

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card
                            className="shadow-sm transition-colors"
                            style={{
                                backgroundColor: 'var(--card)',
                                borderColor: 'var(--card-border)'
                            }}
                        >
                            <CardHeader>
                                <CardTitle
                                    style={{
                                        fontSize: fonts.heading.sm.size,
                                        fontWeight: fonts.heading.sm.weight,
                                        color: theme.foreground
                                    }}
                                >
                                    Users by Role
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <PieChart data={roleDistribution} />
                            </CardContent>
                        </Card>

                        <Card
                            className="shadow-sm transition-colors"
                            style={{
                                backgroundColor: 'var(--card)',
                                borderColor: 'var(--card-border)'
                            }}
                        >
                            <CardHeader>
                                <CardTitle
                                    style={{
                                        fontSize: fonts.heading.sm.size,
                                        fontWeight: fonts.heading.sm.weight,
                                        color: theme.foreground
                                    }}
                                >
                                    Most Active Users (Logins)
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <BarChart data={activityChart} horizontal />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Detailed Table */}
                    <DataTable
                        title="User Activity Details"
                        columns={userColumns}
                        data={userActivityData}
                        emptyMessage="No user activity data available."
                    />
                </div>
            </div>
        </PageLayout>
    );
}
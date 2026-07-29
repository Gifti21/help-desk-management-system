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
    Building2,
    Users,
    Clock,
    Target
} from 'lucide-react';

// Mock department performance data
const departmentMetrics = [
    {
        id: 'total-departments',
        title: 'Total Departments',
        value: '4',
        subtitle: 'Active departments',
        icon: 'users'
    },
    {
        id: 'avg-resolution',
        title: 'Avg. Resolution Time',
        value: '4.5h',
        subtitle: 'Cross-department',
        trend: '-0.3h improvement',
        trendColor: '#10B981',
        icon: 'clock'
    },
    {
        id: 'best-performer',
        title: 'Best Performer',
        value: 'Engineering',
        subtitle: '95.8% SLA compliance',
        trend: 'Consistent leader',
        trendColor: '#10B981',
        icon: 'target'
    },
    {
        id: 'total-agents',
        title: 'Total Agents',
        value: '24',
        subtitle: 'Across all departments',
        icon: 'users'
    }
];

const departmentData = [
    {
        department: 'IT Services',
        agents: 8,
        totalTickets: 320,
        resolved: 295,
        pending: 25,
        avgResolution: '3.5h',
        sla: 94.2,
        satisfaction: 4.7
    },
    {
        department: 'Support',
        agents: 12,
        totalTickets: 580,
        resolved: 540,
        pending: 40,
        avgResolution: '4.2h',
        sla: 92.1,
        satisfaction: 4.8
    },
    {
        department: 'HR & Operations',
        agents: 3,
        totalTickets: 220,
        resolved: 205,
        pending: 15,
        avgResolution: '5.1h',
        sla: 89.8,
        satisfaction: 4.5
    },
    {
        department: 'Engineering',
        agents: 1,
        totalTickets: 120,
        resolved: 115,
        pending: 5,
        avgResolution: '6.2h',
        sla: 95.8,
        satisfaction: 4.9
    }
];

const ticketDistribution = [
    { name: 'IT Services', value: 320, color: '#2FD9C4' },
    { name: 'Support', value: 580, color: '#3B82F6' },
    { name: 'HR', value: 220, color: '#F59E0B' },
    { name: 'Engineering', value: 120, color: '#10B981' }
];

const performanceChart = [
    { name: 'IT Services', value: 94.2 },
    { name: 'Support', value: 92.1 },
    { name: 'HR', value: 89.8 },
    { name: 'Engineering', value: 95.8 }
];

export default function DepartmentReportsPage() {
    const [dateRange, setDateRange] = useState('Jun 1, 2026 - Jun 30, 2026');
    const [selectedDepartment, setSelectedDepartment] = useState('all');
    const [isLoading, setIsLoading] = useState(false);

    const { toast } = useToast();
    const { colors: theme } = useTheme();

    const handleExportCSV = () => {
        setIsLoading(true);
        setTimeout(() => {
            toast('Department report exported as CSV.', 'success');
            setIsLoading(false);
        }, 1500);
    };

    const handleExportPDF = () => {
        setIsLoading(true);
        setTimeout(() => {
            toast('Department report exported as PDF.', 'success');
            setIsLoading(false);
        }, 1500);
    };

    const handleRefreshData = () => {
        setIsLoading(true);
        setTimeout(() => {
            toast('Department data refreshed.', 'info');
            setIsLoading(false);
        }, 1200);
    };

    const getSlaColor = (percentage: number) => {
        if (percentage >= 95) return '#10B981';
        if (percentage >= 90) return '#F59E0B';
        return '#EF4444';
    };

    const departmentColumns = [
        {
            key: 'department',
            title: 'Department',
            render: (value: string) => (
                <div className="flex items-center space-x-2">
                    <Building2 className="h-4 w-4" style={{ color: theme.primary }} />
                    <span
                        style={{
                            fontSize: fonts.body.sm.size,
                            fontWeight: fonts.fontWeight.medium,
                            color: theme.foreground
                        }}
                    >
                        {value}
                    </span>
                </div>
            )
        },
        {
            key: 'agents',
            title: 'Agents',
            render: (value: number) => (
                <span style={{ fontSize: fonts.body.sm.size, color: theme.foreground }}>
                    {value}
                </span>
            )
        },
        {
            key: 'totalTickets',
            title: 'Total Tickets',
            render: (value: number) => (
                <span style={{ fontSize: fonts.body.sm.size, color: theme.foreground }}>
                    {value}
                </span>
            )
        },
        {
            key: 'resolved',
            title: 'Resolved',
            render: (value: number) => (
                <span style={{ fontSize: fonts.body.sm.size, color: '#10B981' }}>
                    {value}
                </span>
            )
        },
        {
            key: 'pending',
            title: 'Pending',
            render: (value: number) => (
                <span style={{ fontSize: fonts.body.sm.size, color: '#F59E0B' }}>
                    {value}
                </span>
            )
        },
        {
            key: 'avgResolution',
            title: 'Avg. Resolution',
            render: (value: string) => (
                <span style={{ fontSize: fonts.body.sm.size, color: theme.foregroundMuted }}>
                    {value}
                </span>
            )
        },
        {
            key: 'sla',
            title: 'SLA %',
            render: (value: number) => (
                <span
                    style={{
                        fontSize: fonts.body.sm.size,
                        fontWeight: fonts.fontWeight.medium,
                        color: getSlaColor(value)
                    }}
                >
                    {value}%
                </span>
            )
        },
        {
            key: 'satisfaction',
            title: 'Satisfaction',
            render: (value: number) => (
                <span style={{ fontSize: fonts.body.sm.size, color: theme.foreground }}>
                    {value}/5.0
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
                title="Department Performance"
                subtitle="Detailed analytics for department performance and metrics"
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
                    <MetricsGrid metrics={departmentMetrics} />

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
                                    Ticket Distribution
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <PieChart data={ticketDistribution} />
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
                                    SLA Performance
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <BarChart data={performanceChart} horizontal />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Detailed Table */}
                    <DataTable
                        title="Department Performance Details"
                        columns={departmentColumns}
                        data={departmentData}
                        emptyMessage="No department data available."
                    />
                </div>
            </div>
        </PageLayout>
    );
}
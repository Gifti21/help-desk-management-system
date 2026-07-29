'use client';

import React, { useState } from 'react';
import { PageLayout } from '../../../../components/admin/PageLayout';
import { TopBar } from '../../../../components/admin/TopBar';
import { DataTable } from '../../../../components/admin/DataTable';
import { useTheme } from '../../../../components/providers/ThemeProvider';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { fonts } from '@/lib/fonts';
import { BarChart } from '../../../../components/charts/bar-chart';
import { LineChart } from '../../../../components/charts/line-chart';
import { ReportFilters } from '../../../../components/reports/ReportFilters';
import { ExportButtons } from '../../../../components/reports/ExportButtons';
import { MetricsGrid } from '../../../../components/reports/MetricsGrid';
import { useToast } from '../../../../components/ui/toast';
import {
    RefreshCw,
    Star,
    Users,
    Clock,
    Award
} from 'lucide-react';

// Mock agent performance data
const agentMetrics = [
    {
        id: 'total-agents',
        title: 'Total Agents',
        value: '24',
        subtitle: 'Active agents',
        icon: 'users'
    },
    {
        id: 'avg-rating',
        title: 'Avg. Rating',
        value: '4.7',
        subtitle: 'Customer satisfaction',
        trend: '+0.2 improvement',
        trendColor: '#10B981',
        icon: 'star'
    },
    {
        id: 'top-performer',
        title: 'Top Performer',
        value: 'Sarah Johnson',
        subtitle: '4.9/5.0 rating',
        trend: '145 tickets resolved',
        trendColor: '#10B981',
        icon: 'target'
    },
    {
        id: 'avg-response',
        title: 'Avg. Response Time',
        value: '14m',
        subtitle: 'First response',
        trend: '-2m improvement',
        trendColor: '#10B981',
        icon: 'clock'
    }
];

const agentPerformanceData = [
    {
        agent: 'Sarah Johnson',
        department: 'Support',
        tickets: 145,
        resolved: 138,
        avgTime: '3.2h',
        rating: 4.9,
        satisfaction: 96,
        responseTime: '12m'
    },
    {
        agent: 'Mike Chen',
        department: 'IT Services',
        tickets: 132,
        resolved: 125,
        avgTime: '3.8h',
        rating: 4.7,
        satisfaction: 94,
        responseTime: '15m'
    },
    {
        agent: 'Emma Davis',
        department: 'Support',
        tickets: 128,
        resolved: 120,
        avgTime: '4.1h',
        rating: 4.8,
        satisfaction: 95,
        responseTime: '13m'
    },
    {
        agent: 'James Wilson',
        department: 'IT Services',
        tickets: 118,
        resolved: 110,
        avgTime: '4.5h',
        rating: 4.6,
        satisfaction: 92,
        responseTime: '18m'
    },
    {
        agent: 'Lisa Anderson',
        department: 'HR',
        tickets: 115,
        resolved: 108,
        avgTime: '4.2h',
        rating: 4.7,
        satisfaction: 93,
        responseTime: '16m'
    },
    {
        agent: 'David Brown',
        department: 'Engineering',
        tickets: 95,
        resolved: 92,
        avgTime: '5.8h',
        rating: 4.9,
        satisfaction: 97,
        responseTime: '22m'
    }
];

const ticketsResolvedChart = [
    { name: 'Sarah', value: 138 },
    { name: 'Mike', value: 125 },
    { name: 'Emma', value: 120 },
    { name: 'James', value: 110 },
    { name: 'Lisa', value: 108 },
    { name: 'David', value: 92 }
];

const weeklyPerformance = [
    { label: 'Mon', value: 45 },
    { label: 'Tue', value: 52 },
    { label: 'Wed', value: 48 },
    { label: 'Thu', value: 61 },
    { label: 'Fri', value: 55 },
    { label: 'Sat', value: 23 },
    { label: 'Sun', value: 18 }
];

export default function AgentReportsPage() {
    const [dateRange, setDateRange] = useState('Jun 1, 2026 - Jun 30, 2026');
    const [selectedDepartment, setSelectedDepartment] = useState('all');
    const [selectedAgent, setSelectedAgent] = useState('all');
    const [isLoading, setIsLoading] = useState(false);

    const { toast } = useToast();
    const { colors: theme } = useTheme();

    const handleExportCSV = () => {
        setIsLoading(true);
        setTimeout(() => {
            toast('Agent report exported as CSV.', 'success');
            setIsLoading(false);
        }, 1500);
    };

    const handleExportPDF = () => {
        setIsLoading(true);
        setTimeout(() => {
            toast('Agent report exported as PDF.', 'success');
            setIsLoading(false);
        }, 1500);
    };

    const handleRefreshData = () => {
        setIsLoading(true);
        setTimeout(() => {
            toast('Agent data refreshed.', 'info');
            setIsLoading(false);
        }, 1200);
    };

    const getSatisfactionColor = (percentage: number) => {
        if (percentage >= 95) return '#10B981';
        if (percentage >= 90) return '#F59E0B';
        return '#EF4444';
    };

    const agentColumns = [
        {
            key: 'agent',
            title: 'Agent Name',
            render: (value: string) => (
                <div className="flex items-center space-x-2">
                    <div
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: theme.primary, color: theme.primaryForeground }}
                    >
                        <span style={{ fontSize: fonts.body.sm.size, fontWeight: fonts.fontWeight.semibold }}>
                            {value.split(' ').map(n => n[0]).join('')}
                        </span>
                    </div>
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
            key: 'department',
            title: 'Department',
            render: (value: string) => (
                <span style={{ fontSize: fonts.body.sm.size, color: theme.foregroundMuted }}>
                    {value}
                </span>
            )
        },
        {
            key: 'tickets',
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
            key: 'avgTime',
            title: 'Avg. Time',
            render: (value: string) => (
                <span style={{ fontSize: fonts.body.sm.size, color: theme.foregroundMuted }}>
                    {value}
                </span>
            )
        },
        {
            key: 'responseTime',
            title: 'Response Time',
            render: (value: string) => (
                <span style={{ fontSize: fonts.body.sm.size, color: theme.foregroundMuted }}>
                    {value}
                </span>
            )
        },
        {
            key: 'rating',
            title: 'Rating',
            render: (value: number) => (
                <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1" style={{ color: '#F59E0B', fill: '#F59E0B' }} />
                    <span style={{ fontSize: fonts.body.sm.size, color: theme.foreground }}>
                        {value}
                    </span>
                </div>
            )
        },
        {
            key: 'satisfaction',
            title: 'Satisfaction',
            render: (value: number) => (
                <span
                    style={{
                        fontSize: fonts.body.sm.size,
                        fontWeight: fonts.fontWeight.medium,
                        color: getSatisfactionColor(value)
                    }}
                >
                    {value}%
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
        },
        {
            id: 'agent',
            label: 'Agent',
            value: selectedAgent,
            onChange: setSelectedAgent,
            options: [
                { label: 'All Agents', value: 'all' },
                { label: 'Sarah Johnson', value: 'sarah' },
                { label: 'Mike Chen', value: 'mike' },
                { label: 'Emma Davis', value: 'emma' },
                { label: 'James Wilson', value: 'james' }
            ]
        }
    ];

    return (
        <PageLayout>
            <TopBar
                title="Agent Performance"
                subtitle="Individual agent metrics and performance analytics"
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
                    <MetricsGrid metrics={agentMetrics} />

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
                                    Top Performers (Tickets Resolved)
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <BarChart data={ticketsResolvedChart} />
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
                                    Weekly Performance Trend
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <LineChart data={weeklyPerformance} height={250} />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Detailed Table */}
                    <DataTable
                        title="Agent Performance Details"
                        columns={agentColumns}
                        data={agentPerformanceData}
                        emptyMessage="No agent data available."
                    />
                </div>
            </div>
        </PageLayout>
    );
}
'use client';

import React, { useState } from 'react';
import { PageLayout } from '../../components/admin/PageLayout';
import { TopBar } from '../../components/admin/TopBar';
import { StatCard } from '../../components/admin/StatCard';
import { ActionButton } from '../../components/admin/ActionButton';
import { DataTable } from '../../components/admin/DataTable';
import { SearchFilter } from '../../components/admin/SearchFilter';
import { Card } from '../../components/ui/card';
import { useTheme } from '../../components/providers/ThemeProvider';
import { useToast } from '../../components/ui/toast';
import { fonts } from '@/lib/fonts';
import { DonutChart } from '../../components/charts/DonutChart';
import { BarChart } from '../../components/charts/BarChart';
import { LineChart } from '../../components/charts/LineChart';
import {
    Ticket,
    AlertTriangle,
    CheckCircle,
    Clock,
    Download,
    RefreshCw
} from 'lucide-react';

// Mock data
const mockTickets = [
    {
        id: '#TIC-8492',
        title: 'Network Outage in HQ',
        department: 'IT Infrastructure',
        time: '2h ago',
        requester: 'Sarah',
        agent: 'John Doe',
        status: 'Pending',
        priority: 'Urgent',
        date: 'Oct 24, 2023'
    },
    {
        id: '#TIC-8488',
        title: 'Payroll Access Request',
        department: 'Finance',
        time: '3h ago',
        requester: 'Mike Ross',
        agent: 'Alex Smith',
        status: 'Resolved',
        priority: 'Normal',
        date: 'Oct 23, 2023'
    },
    {
        id: '#TIC-8481',
        title: 'Software License Renewal',
        department: 'Procurement',
        time: '1d ago',
        requester: 'Elena Vance',
        agent: 'Kevin Brown',
        status: 'Overdue',
        priority: 'High',
        date: 'Oct 22, 2023'
    }
];

export default function AdminDashboard() {
    const [searchTerm, setSearchTerm] = useState('');
    const { colors: theme, isDark } = useTheme();
    const { toast } = useToast();

    const getStatusBadge = (status: string) => {
        const statusColors: Record<string, { bg: string; text: string }> = {
            'Pending': { bg: theme.accent, text: theme.accentForeground },
            'Resolved': { bg: '#dcfce7', text: '#15803d' },
            'Overdue': { bg: '#fee2e2', text: '#dc2626' }
        };
        const colors_status = statusColors[status] || statusColors['Pending'];

        return (
            <span
                className="px-2 py-1 text-xs font-medium rounded border"
                style={{
                    backgroundColor: colors_status.bg,
                    color: colors_status.text,
                    fontSize: fonts.caption.small.size
                }}
            >
                {status}
            </span>
        );
    };

    const getPriorityBadge = (priority: string) => {
        const priorityColors: Record<string, { bg: string; text: string }> = {
            'Urgent': { bg: '#fee2e2', text: '#dc2626' },
            'High': { bg: '#fed7aa', text: '#ea580c' },
            'Normal': { bg: theme.accent, text: theme.accentForeground },
            'Low': { bg: '#dcfce7', text: '#15803d' }
        };
        const colors_priority = priorityColors[priority] || priorityColors['Normal'];

        return (
            <span
                className="px-2 py-1 text-xs font-medium rounded border"
                style={{
                    backgroundColor: colors_priority.bg,
                    color: colors_priority.text,
                    fontSize: fonts.caption.small.size
                }}
            >
                {priority}
            </span>
        );
    };

    const ticketColumns = [
        {
            key: 'id',
            title: 'Ticket ID',
            render: (value: string) => (
                <span
                    className="font-medium"
                    style={{
                        color: theme.primary,
                        fontSize: fonts.body.sm.size,
                        fontWeight: fonts.fontWeight.medium
                    }}
                >
                    {value}
                </span>
            )
        },
        {
            key: 'title',
            title: 'Title',
            render: (value: string, row: any) => (
                <div>
                    <div
                        className="font-medium"
                        style={{
                            fontSize: fonts.body.regular.size,
                            fontWeight: fonts.fontWeight.medium,
                            color: theme.foreground
                        }}
                    >
                        {value}
                    </div>
                    <div
                        style={{
                            fontSize: fonts.caption.regular.size,
                            color: theme.foregroundMuted
                        }}
                    >
                        {row.department} • {row.time}
                    </div>
                </div>
            )
        },
        {
            key: 'requester',
            title: 'Requester',
            render: (value: string) => (
                <div className="flex items-center">
                    <div
                        className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                        style={{ backgroundColor: theme.accent }}
                    >
                        <span
                            className="font-medium"
                            style={{
                                fontSize: fonts.caption.regular.size,
                                color: theme.accentForeground
                            }}
                        >
                            {value.split(' ').map(n => n[0]).join('')}
                        </span>
                    </div>
                    <span
                        style={{
                            fontSize: fonts.body.sm.size,
                            color: theme.foreground
                        }}
                    >
                        {value}
                    </span>
                </div>
            )
        },
        {
            key: 'agent',
            title: 'Agent',
            render: (value: string) => (
                <div className="flex items-center">
                    <div
                        className="w-6 h-6 rounded-full flex items-center justify-center mr-2"
                        style={{ backgroundColor: theme.accent }}
                    >
                        <span
                            className="font-medium"
                            style={{
                                fontSize: fonts.caption.small.size,
                                color: theme.primary
                            }}
                        >
                            {value.split(' ').map(n => n[0]).join('')}
                        </span>
                    </div>
                    <span
                        style={{
                            fontSize: fonts.body.sm.size,
                            color: theme.foreground
                        }}
                    >
                        {value}
                    </span>
                </div>
            )
        },
        {
            key: 'status',
            title: 'Status',
            render: (value: string) => getStatusBadge(value)
        },
        {
            key: 'priority',
            title: 'Priority',
            render: (value: string) => getPriorityBadge(value)
        },
        {
            key: 'date',
            title: 'Date',
            render: (value: string) => (
                <span
                    style={{
                        fontSize: fonts.body.sm.size,
                        color: theme.foregroundMuted
                    }}
                >
                    {value}
                </span>
            )
        }
    ];

    // Button handlers
    const handleExportData = () => {
        // Export dashboard data as CSV
        const csvData = [
            ['Metric', 'Value'],
            ['Total Tickets', '2,842'],
            ['Open Tickets', '142'],
            ['Closed Today', '64'],
            ['Overdue', '28'],
            ['', ''],
            ['Department', 'Tickets'],
            ['IT Services', '842'],
            ['HR & Ops', '428'],
            ['Finance', '310']
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'dashboard-summary.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleRefresh = () => {
        toast('Refreshing dashboard...', 'info');
        setTimeout(() => {
            window.location.reload();
        }, 1000); // Wait 1 second to show toast before refresh
    };

    const topBarActions = (
        <>
            <ActionButton
                variant="outline"
                size="sm"
                icon={Download}
                onClick={handleExportData}
            >
                Export Data
            </ActionButton>
            <ActionButton
                variant="primary"
                size="sm"
                icon={RefreshCw}
                onClick={handleRefresh}
            >
                Refresh
            </ActionButton>
        </>
    );

    return (
        <PageLayout>
            <TopBar
                title="Admin Command Center"
                subtitle="Real-time oversight of help desk performance and ticket lifecycle."
                actions={topBarActions}
            />

            <div className="p-6 space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Tickets"
                        value="2,842"
                        icon={Ticket}
                    />
                    <StatCard
                        title="Open Tickets"
                        value="142"
                        icon={AlertTriangle}
                        iconColor="#ea580c"
                    />
                    <StatCard
                        title="Closed Today"
                        value="64"
                        icon={CheckCircle}
                        iconColor="#15803d"
                    />
                    <StatCard
                        title="Overdue"
                        value="28"
                        icon={Clock}
                        iconColor="#dc2626"
                    />
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card
                        className="shadow-sm transition-colors"
                        style={{
                            backgroundColor: 'var(--card)',
                            borderColor: 'var(--card-border)'
                        }}
                    >
                        <div className="p-6">
                            <h3
                                className="font-semibold mb-6"
                                style={{
                                    fontSize: fonts.heading.sm.size,
                                    fontWeight: fonts.heading.sm.weight,
                                    color: theme.foreground
                                }}
                            >
                                Tickets by Status
                            </h3>
                            <DonutChart
                                series={[132, 55, 33]}
                                labels={['Resolved', 'Pending', 'Overdue']}
                                colors={[theme.primary, '#f59e0b', '#ef4444']}
                                height={240}
                            />
                            <div className="mt-6 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: theme.primary }} />
                                        <span style={{ fontSize: fonts.body.sm.size, color: theme.foregroundMuted }}>Resolved</span>
                                    </div>
                                    <span style={{ fontSize: fonts.body.sm.size, fontWeight: fonts.fontWeight.semibold, color: theme.foreground }}>60%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2" />
                                        <span style={{ fontSize: fonts.body.sm.size, color: theme.foregroundMuted }}>Pending</span>
                                    </div>
                                    <span style={{ fontSize: fonts.body.sm.size, fontWeight: fonts.fontWeight.semibold, color: theme.foreground }}>25%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 rounded-full bg-red-500 mr-2" />
                                        <span style={{ fontSize: fonts.body.sm.size, color: theme.foregroundMuted }}>Overdue</span>
                                    </div>
                                    <span style={{ fontSize: fonts.body.sm.size, fontWeight: fonts.fontWeight.semibold, color: theme.foreground }}>15%</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card
                        className="shadow-sm transition-colors"
                        style={{
                            backgroundColor: 'var(--card)',
                            borderColor: 'var(--card-border)'
                        }}
                    >
                        <div className="p-6">
                            <h3
                                className="font-semibold mb-6"
                                style={{
                                    fontSize: fonts.heading.sm.size,
                                    fontWeight: fonts.heading.sm.weight,
                                    color: theme.foreground
                                }}
                            >
                                Tickets by Department
                            </h3>
                            <BarChart
                                categories={['IT Services', 'HR & Ops', 'Finance']}
                                series={[{ name: 'Tickets', data: [842, 428, 310] }]}
                                height={240}
                                horizontal={true}
                            />
                        </div>
                    </Card>

                    <Card
                        className="shadow-sm transition-colors"
                        style={{
                            backgroundColor: 'var(--card)',
                            borderColor: 'var(--card-border)'
                        }}
                    >
                        <div className="p-6">
                            <h3
                                className="font-semibold mb-6"
                                style={{
                                    fontSize: fonts.heading.sm.size,
                                    fontWeight: fonts.heading.sm.weight,
                                    color: theme.foreground
                                }}
                            >
                                Tickets by Month
                            </h3>
                            <LineChart
                                categories={['Jun', 'Jul', 'Aug', 'Sep', 'Oct']}
                                series={[{ name: 'Tickets', data: [290, 245, 350, 280, 320] }]}
                                height={240}
                            />
                        </div>
                    </Card>
                </div>

                {/* Search Filter */}
                <SearchFilter
                    searchValue={searchTerm}
                    onSearchChange={setSearchTerm}
                    searchPlaceholder="Search tickets..."
                />

                {/* Global Ticket Log */}
                <DataTable
                    title={`Global Ticket Log (${mockTickets.length})`}
                    columns={ticketColumns}
                    data={mockTickets.filter(ticket =>
                        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        ticket.requester.toLowerCase().includes(searchTerm.toLowerCase())
                    )}
                    emptyMessage="No tickets found matching your search."
                />
            </div>
        </PageLayout>
    );
}
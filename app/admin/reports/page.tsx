'use client';

import React, { useState } from 'react';
import { PageLayout } from '../../../components/admin/PageLayout';
import { TopBar } from '../../../components/admin/TopBar';
import { StatCard } from '../../../components/admin/StatCard';
import { ActionButton } from '../../../components/admin/ActionButton';
import { DataTable } from '../../../components/admin/DataTable';
import { LoadingState } from '../../../components/ui/loading';
import { useToast } from '../../../components/ui/toast';
import { useTheme } from '../../../components/providers/ThemeProvider';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { fonts } from '@/lib/fonts';
import { BarChart, PieChart, LineChart } from '../../../components/charts';
import { ReportFilters } from '../../../components/reports/ReportFilters';
import { ExportButtons } from '../../../components/reports/ExportButtons';
import {
    RefreshCw,
    Ticket,
    Clock,
    Shield,
    Users,
    Star,
    TrendingUp,
    Target,
    Activity,
    Award
} from 'lucide-react';

// Mock data for comprehensive reports
const monthlyTrendData = [
    { label: 'Jan', value: 850 },
    { label: 'Feb', value: 920 },
    { label: 'Mar', value: 1050 },
    { label: 'Apr', value: 1150 },
    { label: 'May', value: 1280 },
    { label: 'Jun', value: 1350 }
];

const departmentPerformanceData = [
    { name: 'IT Services', value: 320, color: '#2FD9C4' },
    { name: 'Support', value: 580, color: '#3B82F6' },
    { name: 'HR', value: 220, color: '#F59E0B' },
    { name: 'Engineering', value: 120, color: '#10B981' }
];

const statusDistributionData = [
    { name: 'Open', value: 145, color: '#3B82F6' },
    { name: 'In Progress', value: 89, color: '#F59E0B' },
    { name: 'Resolved', value: 420, color: '#10B981' },
    { name: 'Closed', value: 630, color: '#64748B' }
];

const priorityDistributionData = [
    { name: 'Low', value: 180 },
    { name: 'Medium', value: 520 },
    { name: 'High', value: 340 },
    { name: 'Critical', value: 105 }
];

const agentPerformanceData = [
    {
        agent: 'Sarah Johnson',
        tickets: 145,
        resolved: 138,
        avgTime: '3.2h',
        rating: 4.9,
        satisfaction: 96
    },
    {
        agent: 'Mike Chen',
        tickets: 132,
        resolved: 125,
        avgTime: '3.8h',
        rating: 4.7,
        satisfaction: 94
    },
    {
        agent: 'Emma Davis',
        tickets: 128,
        resolved: 120,
        avgTime: '4.1h',
        rating: 4.8,
        satisfaction: 95
    },
    {
        agent: 'James Wilson',
        tickets: 118,
        resolved: 110,
        avgTime: '4.5h',
        rating: 4.6,
        satisfaction: 92
    },
    {
        agent: 'Lisa Anderson',
        tickets: 115,
        resolved: 108,
        avgTime: '4.2h',
        rating: 4.7,
        satisfaction: 93
    }
];

// Enhanced department data with category breakdown
const departmentDetailsByCategory = {
    hardware: [
        { department: 'IT Services', totalTickets: 80, resolved: 75, pending: 5, avgResolution: '3.2h', sla: 95.5 },
        { department: 'Support', totalTickets: 145, resolved: 135, pending: 10, avgResolution: '4.0h', sla: 93.2 },
        { department: 'HR & Operations', totalTickets: 35, resolved: 32, pending: 3, avgResolution: '5.5h', sla: 88.5 },
        { department: 'Engineering', totalTickets: 25, resolved: 24, pending: 1, avgResolution: '6.5h', sla: 96.0 }
    ],
    software: [
        { department: 'IT Services', totalTickets: 120, resolved: 112, pending: 8, avgResolution: '3.0h', sla: 94.8 },
        { department: 'Support', totalTickets: 220, resolved: 205, pending: 15, avgResolution: '3.8h', sla: 92.8 },
        { department: 'HR & Operations', totalTickets: 85, resolved: 80, pending: 5, avgResolution: '4.8h', sla: 90.2 },
        { department: 'Engineering', totalTickets: 60, resolved: 58, pending: 2, avgResolution: '5.8h', sla: 96.5 }
    ],
    network: [
        { department: 'IT Services', totalTickets: 75, resolved: 70, pending: 5, avgResolution: '3.8h', sla: 93.5 },
        { department: 'Support', totalTickets: 140, resolved: 130, pending: 10, avgResolution: '4.5h', sla: 91.5 },
        { department: 'HR & Operations', totalTickets: 50, resolved: 46, pending: 4, avgResolution: '5.2h', sla: 89.0 },
        { department: 'Engineering', totalTickets: 25, resolved: 24, pending: 1, avgResolution: '6.0h', sla: 95.5 }
    ],
    access: [
        { department: 'IT Services', totalTickets: 45, resolved: 38, pending: 7, avgResolution: '4.2h', sla: 92.8 },
        { department: 'Support', totalTickets: 75, resolved: 70, pending: 5, avgResolution: '4.8h', sla: 91.0 },
        { department: 'HR & Operations', totalTickets: 50, resolved: 47, pending: 3, avgResolution: '5.0h', sla: 90.5 },
        { department: 'Engineering', totalTickets: 10, resolved: 9, pending: 1, avgResolution: '7.0h', sla: 94.5 }
    ]
};

// Enhanced department data with status breakdown
const departmentDetailsByStatus = {
    open: [
        { department: 'IT Services', totalTickets: 35, resolved: 0, pending: 35, avgResolution: '0h', sla: 0 },
        { department: 'Support', totalTickets: 64, resolved: 0, pending: 64, avgResolution: '0h', sla: 0 },
        { department: 'HR & Operations', totalTickets: 24, resolved: 0, pending: 24, avgResolution: '0h', sla: 0 },
        { department: 'Engineering', totalTickets: 13, resolved: 0, pending: 13, avgResolution: '0h', sla: 0 }
    ],
    in_progress: [
        { department: 'IT Services', totalTickets: 28, resolved: 0, pending: 28, avgResolution: '0h', sla: 0 },
        { department: 'Support', totalTickets: 52, resolved: 0, pending: 52, avgResolution: '0h', sla: 0 },
        { department: 'HR & Operations', totalTickets: 19, resolved: 0, pending: 19, avgResolution: '0h', sla: 0 },
        { department: 'Engineering', totalTickets: 12, resolved: 0, pending: 12, avgResolution: '0h', sla: 0 }
    ],
    resolved: [
        { department: 'IT Services', totalTickets: 135, resolved: 135, pending: 0, avgResolution: '3.2h', sla: 96.5 },
        { department: 'Support', totalTickets: 244, resolved: 244, pending: 0, avgResolution: '3.8h', sla: 94.2 },
        { department: 'HR & Operations', totalTickets: 93, resolved: 93, pending: 0, avgResolution: '4.5h', sla: 91.8 },
        { department: 'Engineering', totalTickets: 51, resolved: 51, pending: 0, avgResolution: '5.5h', sla: 97.0 }
    ],
    closed: [
        { department: 'IT Services', totalTickets: 122, resolved: 122, pending: 0, avgResolution: '3.8h', sla: 95.2 },
        { department: 'Support', totalTickets: 220, resolved: 220, pending: 0, avgResolution: '4.5h', sla: 93.5 },
        { department: 'HR & Operations', totalTickets: 84, resolved: 84, pending: 0, avgResolution: '5.5h', sla: 90.5 },
        { department: 'Engineering', totalTickets: 44, resolved: 44, pending: 0, avgResolution: '6.8h', sla: 96.5 }
    ]
};

// Enhanced department data with priority breakdown
const departmentDetailsByPriority = {
    low: [
        { department: 'IT Services', totalTickets: 45, resolved: 42, pending: 3, avgResolution: '4.5h', sla: 92.0 },
        { department: 'Support', totalTickets: 81, resolved: 76, pending: 5, avgResolution: '5.2h', sla: 90.5 },
        { department: 'HR & Operations', totalTickets: 31, resolved: 29, pending: 2, avgResolution: '6.0h', sla: 88.0 },
        { department: 'Engineering', totalTickets: 17, resolved: 16, pending: 1, avgResolution: '7.5h', sla: 94.0 }
    ],
    medium: [
        { department: 'IT Services', totalTickets: 128, resolved: 118, pending: 10, avgResolution: '3.8h', sla: 94.0 },
        { department: 'Support', totalTickets: 232, resolved: 216, pending: 16, avgResolution: '4.5h', sla: 92.0 },
        { department: 'HR & Operations', totalTickets: 88, resolved: 82, pending: 6, avgResolution: '5.5h', sla: 89.5 },
        { department: 'Engineering', totalTickets: 48, resolved: 46, pending: 2, avgResolution: '6.8h', sla: 95.8 }
    ],
    high: [
        { department: 'IT Services', totalTickets: 109, resolved: 102, pending: 7, avgResolution: '3.0h', sla: 95.5 },
        { department: 'Support', totalTickets: 196, resolved: 183, pending: 13, avgResolution: '3.5h', sla: 93.5 },
        { department: 'HR & Operations', totalTickets: 75, resolved: 70, pending: 5, avgResolution: '4.2h', sla: 91.0 },
        { department: 'Engineering', totalTickets: 41, resolved: 39, pending: 2, avgResolution: '5.2h', sla: 96.5 }
    ],
    critical: [
        { department: 'IT Services', totalTickets: 38, resolved: 33, pending: 5, avgResolution: '2.2h', sla: 97.0 },
        { department: 'Support', totalTickets: 71, resolved: 65, pending: 6, avgResolution: '2.8h', sla: 95.5 },
        { department: 'HR & Operations', totalTickets: 26, resolved: 24, pending: 2, avgResolution: '3.5h', sla: 93.0 },
        { department: 'Engineering', totalTickets: 14, resolved: 14, pending: 0, avgResolution: '4.0h', sla: 98.5 }
    ]
};

const departmentDetailsData = [
    {
        department: 'IT Services',
        totalTickets: 320,
        resolved: 295,
        pending: 25,
        avgResolution: '3.5h',
        sla: 94.2
    },
    {
        department: 'Support',
        totalTickets: 580,
        resolved: 540,
        pending: 40,
        avgResolution: '4.2h',
        sla: 92.1
    },
    {
        department: 'HR & Operations',
        totalTickets: 220,
        resolved: 205,
        pending: 15,
        avgResolution: '5.1h',
        sla: 89.8
    },
    {
        department: 'Engineering',
        totalTickets: 120,
        resolved: 115,
        pending: 5,
        avgResolution: '6.2h',
        sla: 95.8
    }
];

const userActivityData = [
    {
        user: 'Admin User',
        logins: 145,
        ticketsCreated: 28,
        commentsAdded: 89,
        lastActive: '2 minutes ago'
    },
    {
        user: 'John Smith',
        logins: 98,
        ticketsCreated: 42,
        commentsAdded: 67,
        lastActive: '15 minutes ago'
    },
    {
        user: 'Mary Jones',
        logins: 76,
        ticketsCreated: 35,
        commentsAdded: 54,
        lastActive: '1 hour ago'
    },
    {
        user: 'Robert Brown',
        logins: 65,
        ticketsCreated: 29,
        commentsAdded: 48,
        lastActive: '2 hours ago'
    }
];

export default function ReportsPage() {
    const [dateRange, setDateRange] = useState('Jun 1, 2026 - Jun 30, 2026');
    const [selectedDepartment, setSelectedDepartment] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedPriority, setSelectedPriority] = useState('all');
    const [selectedAgent, setSelectedAgent] = useState('all');
    const [isLoading, setIsLoading] = useState(false);

    const { toast } = useToast();
    const { colors: theme } = useTheme();

    // Get data based on ALL selected filters (category, status, priority)
    const getFilteredData = () => {
        let data = departmentDetailsData;

        // Apply category filter
        if (selectedCategory !== 'all') {
            data = departmentDetailsByCategory[selectedCategory as keyof typeof departmentDetailsByCategory] || data;
        }

        // Apply status filter (overrides category if both are set)
        if (selectedStatus !== 'all') {
            data = departmentDetailsByStatus[selectedStatus as keyof typeof departmentDetailsByStatus] || data;
        }

        // Apply priority filter (overrides previous filters if set)
        if (selectedPriority !== 'all') {
            data = departmentDetailsByPriority[selectedPriority as keyof typeof departmentDetailsByPriority] || data;
        }

        return data;
    };

    const currentFilteredData = getFilteredData();

    // Filter department data based on selected department
    const filteredDepartmentData = selectedDepartment === 'all'
        ? currentFilteredData
        : currentFilteredData.filter(dept => {
            const deptMap: Record<string, string> = {
                'it': 'IT Services',
                'support': 'Support',
                'hr': 'HR & Operations',
                'engineering': 'Engineering'
            };
            return dept.department === deptMap[selectedDepartment];
        });

    // Calculate filtered stats
    const calculateFilteredStats = () => {
        const totalTickets = filteredDepartmentData.reduce((sum, dept) => sum + dept.totalTickets, 0);
        const resolvedTickets = filteredDepartmentData.reduce((sum, dept) => sum + dept.resolved, 0);
        const pendingTickets = filteredDepartmentData.reduce((sum, dept) => sum + dept.pending, 0);

        // Calculate weighted average resolution time
        const totalWeightedTime = filteredDepartmentData.reduce((sum, dept) => {
            const hours = parseFloat(dept.avgResolution.replace('h', ''));
            return sum + (hours * dept.totalTickets);
        }, 0);
        const avgResolutionTime = totalTickets > 0 ? (totalWeightedTime / totalTickets).toFixed(1) : '0.0';

        // Calculate average SLA
        const avgSLA = filteredDepartmentData.length > 0
            ? (filteredDepartmentData.reduce((sum, dept) => sum + dept.sla, 0) / filteredDepartmentData.length).toFixed(1)
            : '0.0';

        return {
            totalTickets,
            resolvedTickets,
            pendingTickets,
            avgResolutionTime: `${avgResolutionTime}h`,
            avgSLA: `${avgSLA}%`,
            resolvedPercentage: totalTickets > 0 ? ((resolvedTickets / totalTickets) * 100).toFixed(1) : '0.0'
        };
    };

    const filteredStats = calculateFilteredStats();

    // Filter agent data based on selected agent and scale by category/department filters
    const filteredAgentData = (() => {
        const scaleFactor = filteredStats.totalTickets / 1284; // Scale based on filtered tickets
        const baseData = selectedAgent === 'all'
            ? agentPerformanceData
            : agentPerformanceData.filter(agent => {
                const agentMap: Record<string, string> = {
                    'sarah': 'Sarah Johnson',
                    'mike': 'Mike Chen',
                    'emma': 'Emma Davis',
                    'james': 'James Wilson'
                };
                return agent.agent === agentMap[selectedAgent];
            });

        // Scale agent ticket counts based on filters
        return baseData.map(agent => ({
            ...agent,
            tickets: Math.round(agent.tickets * scaleFactor),
            resolved: Math.round(agent.resolved * scaleFactor)
        }));
    })();

    // Generate dynamic chart data based on ALL filters
    const dynamicDepartmentPerformanceData = filteredDepartmentData.map((dept, index) => ({
        name: dept.department,
        value: dept.totalTickets,
        color: ['#2FD9C4', '#3B82F6', '#F59E0B', '#10B981'][index % 4]
    }));

    // Dynamic status distribution based on filters
    const calculateStatusDistribution = () => {
        const total = filteredStats.totalTickets;
        if (selectedStatus !== 'all') {
            // If status filter is active, show 100% of that status
            return [
                {
                    name: selectedStatus === 'open' ? 'Open' : selectedStatus === 'in_progress' ? 'In Progress' : selectedStatus === 'resolved' ? 'Resolved' : 'Closed',
                    value: total,
                    color: selectedStatus === 'open' ? '#3B82F6' : selectedStatus === 'in_progress' ? '#F59E0B' : selectedStatus === 'resolved' ? '#10B981' : '#64748B'
                }
            ];
        }
        return [
            { name: 'Open', value: Math.round(total * 0.11), color: '#3B82F6' },
            { name: 'In Progress', value: Math.round(total * 0.07), color: '#F59E0B' },
            { name: 'Resolved', value: filteredStats.resolvedTickets, color: '#10B981' },
            { name: 'Closed', value: Math.round(total * 0.49), color: '#64748B' }
        ];
    };

    const dynamicStatusDistributionData = calculateStatusDistribution();

    // Dynamic priority distribution based on filters
    const calculatePriorityDistribution = () => {
        const total = filteredStats.totalTickets;
        if (selectedPriority !== 'all') {
            // If priority filter is active, show 100% of that priority
            return [
                { name: selectedPriority.charAt(0).toUpperCase() + selectedPriority.slice(1), value: total }
            ];
        }
        return [
            { name: 'Low', value: Math.round(total * 0.14) },
            { name: 'Medium', value: Math.round(total * 0.40) },
            { name: 'High', value: Math.round(total * 0.27) },
            { name: 'Critical', value: Math.round(total * 0.08) }
        ];
    };

    const dynamicPriorityDistributionData = calculatePriorityDistribution();

    // Dynamic monthly trend based on filters (scaled proportionally)
    const calculateMonthlyTrend = () => {
        const scaleFactor = filteredStats.totalTickets / 1284; // Original total was 1284
        return [
            { label: 'Jan', value: Math.round(850 * scaleFactor) },
            { label: 'Feb', value: Math.round(920 * scaleFactor) },
            { label: 'Mar', value: Math.round(1050 * scaleFactor) },
            { label: 'Apr', value: Math.round(1150 * scaleFactor) },
            { label: 'May', value: Math.round(1280 * scaleFactor) },
            { label: 'Jun', value: Math.round(1350 * scaleFactor) }
        ];
    };

    const dynamicMonthlyTrendData = calculateMonthlyTrend();

    // Show toast when filters change
    const handleFilterChange = (filterName: string, value: string) => {
        const filterSetters: Record<string, (value: string) => void> = {
            'department': setSelectedDepartment,
            'category': setSelectedCategory,
            'status': setSelectedStatus,
            'priority': setSelectedPriority,
            'agent': setSelectedAgent
        };

        filterSetters[filterName]?.(value);

        if (value !== 'all') {
            toast(`Filter applied: ${filterName} = ${value}`, 'info');
        }
    };

    const handleExportCSV = () => {
        setIsLoading(true);
        setTimeout(() => {
            // Generate comprehensive CSV report
            const headers = [
                'Report Type', 'Department', 'Total Tickets', 'Resolved', 'Pending',
                'Avg Resolution Time', 'SLA %', 'Agent', 'Performance Score'
            ];

            const rows = [
                ['Department Summary', '', '', '', '', '', '', '', ''],
                ...departmentDetailsData.map(dept => [
                    'Department',
                    dept.department,
                    dept.totalTickets,
                    dept.resolved,
                    dept.pending,
                    dept.avgResolution,
                    dept.sla,
                    '',
                    ''
                ]),
                ['', '', '', '', '', '', '', '', ''],
                ['Agent Performance', '', '', '', '', '', '', '', ''],
                ...agentPerformanceData.map(agent => [
                    'Agent',
                    agent.agent,
                    agent.tickets,
                    agent.resolved,
                    '',
                    agent.avgTime,
                    '',
                    '',
                    agent.satisfaction
                ])
            ];

            const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `hdms-report-${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);

            toast('Report exported successfully as CSV', 'success');
            setIsLoading(false);
        }, 800);
    };

    const handleExportPDF = () => {
        setIsLoading(true);
        setTimeout(() => {
            // Generate PDF report content (simplified HTML for PDF generation)
            const pdfContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>HDMS Report - ${dateRange}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        h1 { color: #16332B; border-bottom: 3px solid #2FD9C4; padding-bottom: 10px; }
        h2 { color: #16332B; margin-top: 30px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th { background-color: #2FD9C4; color: white; padding: 12px; text-align: left; }
        td { padding: 10px; border-bottom: 1px solid #ddd; }
        tr:hover { background-color: #f5f5f5; }
        .stats { display: flex; gap: 20px; margin: 20px 0; }
        .stat-card { flex: 1; padding: 20px; background: #f8f9fa; border-radius: 8px; }
        .stat-value { font-size: 32px; font-weight: bold; color: #2FD9C4; }
        .footer { margin-top: 50px; text-align: center; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <h1>Help Desk Management System - Analytics Report</h1>
    <p><strong>Report Period:</strong> ${dateRange}</p>
    <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
    
    <div class="stats">
        <div class="stat-card">
            <div>Total Tickets</div>
            <div class="stat-value">1,284</div>
        </div>
        <div class="stat-card">
            <div>Avg Resolution</div>
            <div class="stat-value">4.2h</div>
        </div>
        <div class="stat-card">
            <div>SLA Compliance</div>
            <div class="stat-value">94.2%</div>
        </div>
        <div class="stat-card">
            <div>Satisfaction</div>
            <div class="stat-value">4.8/5</div>
        </div>
    </div>
    
    <h2>Department Performance</h2>
    <table>
        <tr>
            <th>Department</th>
            <th>Total</th>
            <th>Resolved</th>
            <th>Pending</th>
            <th>Avg Resolution</th>
            <th>SLA %</th>
        </tr>
        ${departmentDetailsData.map(dept => `
        <tr>
            <td>${dept.department}</td>
            <td>${dept.totalTickets}</td>
            <td>${dept.resolved}</td>
            <td>${dept.pending}</td>
            <td>${dept.avgResolution}</td>
            <td>${dept.sla}%</td>
        </tr>
        `).join('')}
    </table>
    
    <h2>Top Agent Performance</h2>
    <table>
        <tr>
            <th>Agent</th>
            <th>Tickets</th>
            <th>Resolved</th>
            <th>Avg Time</th>
            <th>Rating</th>
            <th>Satisfaction</th>
        </tr>
        ${agentPerformanceData.map(agent => `
        <tr>
            <td>${agent.agent}</td>
            <td>${agent.tickets}</td>
            <td>${agent.resolved}</td>
            <td>${agent.avgTime}</td>
            <td>${agent.rating}</td>
            <td>${agent.satisfaction}%</td>
        </tr>
        `).join('')}
    </table>
    
    <div class="footer">
        <p>BESYS TECHNOLOGIES PLC © 2026. All rights reserved.</p>
        <p>Help Desk Management System - Confidential Report</p>
    </div>
</body>
</html>
            `;

            const blob = new Blob([pdfContent], { type: 'text/html' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `hdms-report-${new Date().toISOString().split('T')[0]}.html`;
            a.click();
            window.URL.revokeObjectURL(url);

            toast('Report exported successfully as PDF (HTML format)', 'success');
            setIsLoading(false);
        }, 800);
    };

    const handleRefreshData = () => {
        setIsLoading(true);
        setTimeout(() => {
            toast('Reports refreshed with latest data.', 'info');
            setIsLoading(false);
        }, 1200);
    };

    const getSlaColor = (percentage: number) => {
        if (percentage >= 95) return '#10B981';
        if (percentage >= 90) return '#F59E0B';
        return '#EF4444';
    };

    // Table columns
    const agentColumns = [
        {
            key: 'agent',
            title: 'Agent Name',
            render: (value: string) => (
                <div className="flex items-center space-x-2">
                    <div
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: theme.primary, color: '#FFFFFF' }}
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
                        color: getSlaColor(value)
                    }}
                >
                    {value}%
                </span>
            )
        }
    ];

    const departmentColumns = [
        {
            key: 'department',
            title: 'Department',
            render: (value: string) => (
                <span
                    style={{
                        fontSize: fonts.body.sm.size,
                        fontWeight: fonts.fontWeight.medium,
                        color: theme.foreground
                    }}
                >
                    {value}
                </span>
            )
        },
        {
            key: 'totalTickets',
            title: 'Total',
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
        }
    ];

    const userActivityColumns = [
        {
            key: 'user',
            title: 'User',
            render: (value: string) => (
                <span
                    style={{
                        fontSize: fonts.body.sm.size,
                        fontWeight: fonts.fontWeight.medium,
                        color: theme.foreground
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
                <span style={{ fontSize: fonts.body.sm.size, color: theme.foreground }}>
                    {value}
                </span>
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
            <ActionButton
                variant="outline"
                size="sm"
                icon={RefreshCw}
                onClick={handleRefreshData}
                disabled={isLoading}
            >
                Refresh
            </ActionButton>
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
            id: 'category',
            label: 'Category',
            value: selectedCategory,
            onChange: setSelectedCategory,
            options: [
                { label: 'All Categories', value: 'all' },
                { label: 'Hardware', value: 'hardware' },
                { label: 'Software', value: 'software' },
                { label: 'Network', value: 'network' },
                { label: 'Access', value: 'access' }
            ]
        },
        {
            id: 'status',
            label: 'Status',
            value: selectedStatus,
            onChange: setSelectedStatus,
            options: [
                { label: 'All Statuses', value: 'all' },
                { label: 'Open', value: 'open' },
                { label: 'In Progress', value: 'in_progress' },
                { label: 'Resolved', value: 'resolved' },
                { label: 'Closed', value: 'closed' }
            ]
        },
        {
            id: 'priority',
            label: 'Priority',
            value: selectedPriority,
            onChange: setSelectedPriority,
            options: [
                { label: 'All Priorities', value: 'all' },
                { label: 'Low', value: 'low' },
                { label: 'Medium', value: 'medium' },
                { label: 'High', value: 'high' },
                { label: 'Critical', value: 'critical' }
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

    if (isLoading) {
        return (
            <PageLayout>
                <TopBar
                    title="Analytics & Reports"
                    subtitle="Comprehensive system analytics and performance metrics"
                    actions={topBarActions}
                />
                <div className="p-6">
                    <LoadingState message="Loading report data..." />
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout>
            <TopBar
                title="Analytics & Reports"
                subtitle="Comprehensive system analytics and performance metrics"
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="animate-slideInLeft" style={{ animationDelay: '100ms' }}>
                            <StatCard
                                title="Total Tickets"
                                value={filteredStats.totalTickets.toString()}
                                subtitle={selectedDepartment === 'all' ? 'All departments' : 'Filtered view'}
                                icon={Ticket}
                                iconColor={theme.primary}
                            />
                        </div>
                        <div className="animate-slideInLeft" style={{ animationDelay: '200ms' }}>
                            <StatCard
                                title="Avg. Resolution Time"
                                value={filteredStats.avgResolutionTime}
                                subtitle="Target: 4h"
                                icon={Clock}
                                iconColor="#F59E0B"
                                trend={parseFloat(filteredStats.avgResolutionTime) <= 4 ? 'On target' : 'Needs improvement'}
                                trendColor={parseFloat(filteredStats.avgResolutionTime) <= 4 ? '#10B981' : '#F59E0B'}
                            />
                        </div>
                        <div className="animate-slideInLeft" style={{ animationDelay: '300ms' }}>
                            <StatCard
                                title="SLA Compliance"
                                value={filteredStats.avgSLA}
                                subtitle="Target: 95%"
                                icon={Shield}
                                iconColor="#10B981"
                                trend={parseFloat(filteredStats.avgSLA) >= 95 ? 'Excellent' : 'Near target'}
                                trendColor={parseFloat(filteredStats.avgSLA) >= 95 ? '#10B981' : '#F59E0B'}
                            />
                        </div>
                        <div className="animate-slideInLeft" style={{ animationDelay: '400ms' }}>
                            <StatCard
                                title="Pending Tickets"
                                value={filteredStats.pendingTickets.toString()}
                                subtitle={`${filteredStats.resolvedTickets} resolved`}
                                icon={Activity}
                                iconColor={filteredStats.pendingTickets > 50 ? '#EF4444' : '#F59E0B'}
                                trend={filteredStats.pendingTickets > 50 ? 'High volume' : 'Manageable'}
                                trendColor={filteredStats.pendingTickets > 50 ? '#EF4444' : '#10B981'}
                            />
                        </div>
                    </div>

                    {/* Monthly Trend */}
                    <Card
                        className="shadow-sm transition-colors"
                        style={{
                            backgroundColor: 'var(--card)',
                            borderColor: 'var(--card-border)'
                        }}
                    >
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle
                                    style={{
                                        fontSize: fonts.heading.md.size,
                                        fontWeight: fonts.heading.md.weight,
                                        color: theme.foreground
                                    }}
                                >
                                    Monthly Trend Report
                                </CardTitle>
                                <TrendingUp className="h-5 w-5" style={{ color: theme.primary }} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <LineChart
                                categories={dynamicMonthlyTrendData.map(d => d.label)}
                                series={[{ name: 'Tickets', data: dynamicMonthlyTrendData.map(d => d.value) }]}
                                height={250}
                                xAxisTitle="Months"
                                yAxisTitle="Number of Tickets"
                            />
                        </CardContent>
                    </Card>

                    {/* Status and Priority Distribution */}
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
                                    Status Distribution
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <PieChart
                                    series={dynamicStatusDistributionData.map(d => d.value)}
                                    labels={dynamicStatusDistributionData.map(d => d.name)}
                                    colors={dynamicStatusDistributionData.map(d => d.color)}
                                />
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
                                    Priority Distribution
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <BarChart
                                    categories={dynamicPriorityDistributionData.map(d => d.name)}
                                    series={[{ name: 'Tickets', data: dynamicPriorityDistributionData.map(d => d.value) }]}
                                    horizontal
                                    xAxisTitle="Number of Tickets"
                                    yAxisTitle="Priority"
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Department Performance */}
                    <Card
                        className="shadow-sm transition-colors"
                        style={{
                            backgroundColor: 'var(--card)',
                            borderColor: 'var(--card-border)'
                        }}
                    >
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle
                                    style={{
                                        fontSize: fonts.heading.md.size,
                                        fontWeight: fonts.heading.md.weight,
                                        color: theme.foreground
                                    }}
                                >
                                    Tickets by Department
                                </CardTitle>
                                <Target className="h-5 w-5" style={{ color: theme.primary }} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <BarChart
                                categories={dynamicDepartmentPerformanceData.map(d => d.name)}
                                series={[{ name: 'Tickets', data: dynamicDepartmentPerformanceData.map(d => d.value) }]}
                                height={280}
                                xAxisTitle="Departments"
                                yAxisTitle="Number of Tickets"
                            />
                        </CardContent>
                    </Card>

                    {/* Department Details Table */}
                    <DataTable
                        title={`Department Performance Report${selectedDepartment !== 'all' ? ' (Filtered)' : ''}`}
                        columns={departmentColumns}
                        data={filteredDepartmentData}
                        emptyMessage="No department data available for selected filters."
                    />

                    {/* Agent Performance */}
                    <Card
                        className="shadow-sm transition-colors"
                        style={{
                            backgroundColor: 'var(--card)',
                            borderColor: 'var(--card-border)'
                        }}
                    >
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle
                                    style={{
                                        fontSize: fonts.heading.md.size,
                                        fontWeight: fonts.heading.md.weight,
                                        color: theme.foreground
                                    }}
                                >
                                    Top Agent Performance
                                </CardTitle>
                                <Award className="h-5 w-5" style={{ color: theme.primary }} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <DataTable
                                columns={agentColumns}
                                data={filteredAgentData}
                                emptyMessage="No agent performance data available for selected filters."
                            />
                        </CardContent>
                    </Card>

                    {/* User Activity Report */}
                    <Card
                        className="shadow-sm transition-colors"
                        style={{
                            backgroundColor: 'var(--card)',
                            borderColor: 'var(--card-border)'
                        }}
                    >
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle
                                    style={{
                                        fontSize: fonts.heading.md.size,
                                        fontWeight: fonts.heading.md.weight,
                                        color: theme.foreground
                                    }}
                                >
                                    User Activity Report
                                </CardTitle>
                                <Activity className="h-5 w-5" style={{ color: theme.primary }} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <DataTable
                                columns={userActivityColumns}
                                data={userActivityData}
                                emptyMessage="No user activity data available."
                            />
                        </CardContent>
                    </Card>

                    {/* Performance Indicators */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card
                            className="shadow-sm transition-colors"
                            style={{
                                backgroundColor: 'var(--card)',
                                borderColor: 'var(--card-border)'
                            }}
                        >
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p style={{ fontSize: fonts.caption.regular.size, color: theme.foregroundMuted }}>
                                            First Contact Resolution
                                        </p>
                                        <p
                                            style={{
                                                fontSize: fonts.heading.lg.size,
                                                fontWeight: fonts.heading.lg.weight,
                                                color: theme.foreground,
                                                marginTop: '8px'
                                            }}
                                        >
                                            78.4%
                                        </p>
                                    </div>
                                    <div
                                        className="w-12 h-12 rounded-full flex items-center justify-center"
                                        style={{ backgroundColor: theme.accent }}
                                    >
                                        <Target className="h-6 w-6" style={{ color: theme.primary }} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card
                            className="shadow-sm transition-colors"
                            style={{
                                backgroundColor: 'var(--card)',
                                borderColor: 'var(--card-border)'
                            }}
                        >
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p style={{ fontSize: fonts.caption.regular.size, color: theme.foregroundMuted }}>
                                            Agent Utilization
                                        </p>
                                        <p
                                            style={{
                                                fontSize: fonts.heading.lg.size,
                                                fontWeight: fonts.heading.lg.weight,
                                                color: theme.foreground,
                                                marginTop: '8px'
                                            }}
                                        >
                                            82.3%
                                        </p>
                                    </div>
                                    <div
                                        className="w-12 h-12 rounded-full flex items-center justify-center"
                                        style={{ backgroundColor: theme.accent }}
                                    >
                                        <Users className="h-6 w-6" style={{ color: theme.primary }} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card
                            className="shadow-sm transition-colors"
                            style={{
                                backgroundColor: 'var(--card)',
                                borderColor: 'var(--card-border)'
                            }}
                        >
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p style={{ fontSize: fonts.caption.regular.size, color: theme.foregroundMuted }}>
                                            Active Agents
                                        </p>
                                        <p
                                            style={{
                                                fontSize: fonts.heading.lg.size,
                                                fontWeight: fonts.heading.lg.weight,
                                                color: theme.foreground,
                                                marginTop: '8px'
                                            }}
                                        >
                                            12
                                        </p>
                                    </div>
                                    <div
                                        className="w-12 h-12 rounded-full flex items-center justify-center"
                                        style={{ backgroundColor: theme.accent }}
                                    >
                                        <Activity className="h-6 w-6" style={{ color: theme.primary }} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
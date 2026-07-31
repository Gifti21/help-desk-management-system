'use client';

import React, { useState } from 'react';
import { PageLayout } from '../../../components/admin/PageLayout';
import { TopBar } from '../../../components/admin/TopBar';
import { StatCard } from '../../../components/admin/StatCard';
import { ActionButton } from '../../../components/admin/ActionButton';
import { DataTable } from '../../../components/admin/DataTable';
import { SearchFilter } from '../../../components/admin/SearchFilter';
import { ConfirmationDialog } from '../../../components/ui/confirmation-dialog';
import { useToast } from '../../../components/ui/toast';
import { useTheme } from '../../../components/providers/ThemeProvider';
import { Input } from '../../../components/ui/input';
import { fonts } from '@/lib/fonts';
import {
    Building2,
    Users,
    Activity,
    AlertCircle,
    Plus,
    Edit,
    Trash2,
    Eye,
    Download,
    X,
    Calendar,
    User,
    MoreVertical,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

// Mock department data with Ethiopian names
const mockDepartments = [
    {
        id: 'dept-1',
        name: 'IT Support',
        description: 'Technical support and infrastructure management',
        manager: 'Alemayehu Tadesse',
        status: 'active',
        employeeCount: 24,
        ticketCount: 142,
        createdAt: '2023-01-15',
        updatedAt: '2024-07-20'
    },
    {
        id: 'dept-2',
        name: 'Human Resources',
        description: 'Employee relations and organizational development',
        manager: 'Selam Yohannes',
        status: 'active',
        employeeCount: 8,
        ticketCount: 38,
        createdAt: '2023-01-15',
        updatedAt: '2024-07-18'
    },
    {
        id: 'dept-3',
        name: 'Engineering',
        description: 'Software development and product engineering',
        manager: 'Dawit Hailu',
        status: 'active',
        employeeCount: 156,
        ticketCount: 89,
        createdAt: '2023-01-15',
        updatedAt: '2024-07-19'
    },
    {
        id: 'dept-4',
        name: 'Operations',
        description: 'Business operations and process management',
        manager: 'Tigist Bekele',
        status: 'active',
        employeeCount: 12,
        ticketCount: 15,
        createdAt: '2023-03-10',
        updatedAt: '2024-06-15'
    },
    {
        id: 'dept-5',
        name: 'Finance',
        description: 'Financial planning and accounting services',
        manager: 'Bereket Mekonnen',
        status: 'inactive',
        employeeCount: 6,
        ticketCount: 5,
        createdAt: '2023-02-20',
        updatedAt: '2024-05-10'
    }
];

export default function DepartmentsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All Status');
    const [departments, setDepartments] = useState(mockDepartments);
    const [currentPage, setCurrentPage] = useState(1);
    const [actionsMenuOpen, setActionsMenuOpen] = useState<string | null>(null);
    const itemsPerPage = 4;
    const [addModal, setAddModal] = useState(false);
    const [editModal, setEditModal] = useState<{ isOpen: boolean; department: any }>({ isOpen: false, department: null });
    const [formData, setFormData] = useState({ name: '', description: '', manager: '', status: 'active' });
    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean;
        type: 'delete' | null;
        department: any;
    }>({
        isOpen: false,
        type: null,
        department: null
    });
    const [viewModal, setViewModal] = useState<{ isOpen: boolean; department: any }>({ isOpen: false, department: null });
    const [isLoading, setIsLoading] = useState(false);

    const { colors: theme, isDark } = useTheme();
    const { toast } = useToast();

    // Filter departments
    const filteredDepartments = departments.filter(dept => {
        const matchesSearch = dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dept.manager.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dept.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All Status' || dept.status === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    // Pagination
    const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedDepartments = filteredDepartments.slice(startIndex, endIndex);

    // Reset to page 1 when filters change
    const handleFilterChange = () => {
        setCurrentPage(1);
    };

    // Handle CRUD operations
    const handleCreateDepartment = () => {
        setFormData({ name: '', description: '', manager: '', status: 'active' });
        setAddModal(true);
    };

    const handleEditDepartment = (department: any) => {
        setFormData({
            name: department.name,
            description: department.description,
            manager: department.manager,
            status: department.status
        });
        setEditModal({ isOpen: true, department });
    };

    const handleDeleteDepartment = (department: any) => {
        setConfirmDialog({
            isOpen: true,
            type: 'delete',
            department
        });
    };

    const handleViewDepartment = (department: any) => {
        setViewModal({ isOpen: true, department });
    };

    // Submit CRUD operations
    const handleAddDepartment = () => {
        const newDepartment = {
            id: `dept-${Date.now()}`,
            ...formData,
            employeeCount: 0,
            ticketCount: 0,
            createdAt: new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString().split('T')[0]
        };
        setDepartments(prev => [...prev, newDepartment]);
        setAddModal(false);
        toast(`Department ${newDepartment.name} created successfully`, 'success');
    };

    const handleUpdateDepartment = () => {
        if (!editModal.department) return;
        setDepartments(prev => prev.map(dept =>
            dept.id === editModal.department.id
                ? { ...dept, ...formData, updatedAt: new Date().toISOString().split('T')[0] }
                : dept
        ));
        setEditModal({ isOpen: false, department: null });
        toast(`Department ${formData.name} updated successfully`, 'success');
    };

    const handleConfirmDelete = async () => {
        if (!confirmDialog.department) return;

        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setDepartments(prev => prev.filter(dept => dept.id !== confirmDialog.department.id));

        toast(`${confirmDialog.department.name} has been permanently deleted.`, 'success');

        setIsLoading(false);
        setConfirmDialog({ isOpen: false, type: null, department: null });
    };

    const handleExportData = () => {
        const headers = ['ID', 'Department Name', 'Description', 'Manager', 'Status', 'Employees', 'Active Tickets', 'Created', 'Last Updated'];
        const csvData = filteredDepartments.map(dept => [
            dept.id,
            dept.name,
            dept.description,
            dept.manager,
            dept.status,
            dept.employeeCount,
            dept.ticketCount,
            dept.createdAt,
            dept.updatedAt
        ]);
        const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `departments-export-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        toast('Department data exported successfully', 'success');
    };

    // Table columns
    const getStatusBadge = (status: string) => {
        const isActive = status === 'active';
        return (
            <span
                className="px-2 py-1 text-xs font-medium rounded border"
                style={{
                    backgroundColor: isActive ? theme.success + '20' : theme.backgroundTertiary,
                    color: isActive ? theme.success : theme.foregroundMuted,
                    fontSize: fonts.caption.small.size
                }}
            >
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const departmentColumns = [
        {
            key: 'name',
            title: 'Department',
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
                        className="mt-1"
                        style={{
                            fontSize: fonts.caption.regular.size,
                            color: theme.foregroundSecondary,
                            lineHeight: fonts.caption.regular.lineHeight
                        }}
                    >
                        {row.description}
                    </div>
                </div>
            )
        },
        {
            key: 'manager',
            title: 'Manager',
            render: (value: string) => (
                <div className="flex items-center">
                    <div
                        className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                        style={{ backgroundColor: theme.primary + '20' }}
                    >
                        <span
                            className="font-medium"
                            style={{
                                fontSize: fonts.caption.regular.size,
                                color: theme.primary
                            }}
                        >
                            {value.split(' ').map(n => n[0]).join('')}
                        </span>
                    </div>
                    <span
                        style={{
                            fontSize: fonts.body.regular.size,
                            color: theme.foreground
                        }}
                    >
                        {value}
                    </span>
                </div>
            )
        },
        {
            key: 'employeeCount',
            title: 'Employees',
            render: (value: number) => (
                <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" style={{ color: theme.foregroundMuted }} />
                    <span
                        style={{
                            fontSize: fonts.body.regular.size,
                            color: theme.foreground,
                            fontWeight: fonts.fontWeight.medium
                        }}
                    >
                        {value}
                    </span>
                </div>
            )
        },
        {
            key: 'ticketCount',
            title: 'Active Tickets',
            render: (value: number) => (
                <div className="flex items-center">
                    <Activity className="h-4 w-4 mr-2" style={{ color: theme.foregroundMuted }} />
                    <span
                        style={{
                            fontSize: fonts.body.regular.size,
                            color: theme.foreground,
                            fontWeight: fonts.fontWeight.medium
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
            key: 'updatedAt',
            title: 'Last Updated',
            render: (value: string) => (
                <span
                    style={{
                        fontSize: fonts.body.sm.size,
                        color: theme.foregroundSecondary
                    }}
                >
                    {new Date(value).toLocaleDateString()}
                </span>
            )
        },
        {
            key: 'actions',
            title: 'Actions',
            render: (value: any, row: any) => (
                <div className="relative">
                    <button
                        onClick={() => setActionsMenuOpen(actionsMenuOpen === row.id ? null : row.id)}
                        className="p-2 rounded hover:opacity-70 transition-colors"
                        style={{ color: theme.foreground }}
                    >
                        <MoreVertical className="h-5 w-5" />
                    </button>

                    {actionsMenuOpen === row.id && (
                        <>
                            <div
                                className="fixed inset-0 z-[9997]"
                                onClick={() => setActionsMenuOpen(null)}
                            />
                            <div
                                className="absolute right-0 mt-2 w-48 rounded-lg shadow-xl z-[9998] py-2"
                                style={{
                                    backgroundColor: theme.card,
                                    border: `1px solid ${theme.cardBorder}`
                                }}
                            >
                                <button
                                    onClick={() => { handleViewDepartment(row); setActionsMenuOpen(null); }}
                                    className="w-full px-4 py-2 text-left flex items-center hover:opacity-80 transition-colors"
                                    style={{ color: '#3B82F6' }}
                                >
                                    <Eye className="h-4 w-4 mr-2" />
                                    View
                                </button>

                                <button
                                    onClick={() => { handleEditDepartment(row); setActionsMenuOpen(null); }}
                                    className="w-full px-4 py-2 text-left flex items-center hover:opacity-80 transition-colors"
                                    style={{ color: theme.foreground }}
                                >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                </button>

                                <button
                                    onClick={() => { handleDeleteDepartment(row); setActionsMenuOpen(null); }}
                                    className="w-full px-4 py-2 text-left flex items-center hover:opacity-80 transition-colors"
                                    style={{ color: '#EF4444' }}
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )
        }
    ];

    const topBarActions = (
        <div className="flex gap-2">
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
                icon={Plus}
                onClick={handleCreateDepartment}
            >
                Add Department
            </ActionButton>
        </div>
    );

    const filters = [
        {
            label: 'Status',
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
                { label: 'All Status', value: 'All Status' },
                { label: 'Active', value: 'Active' },
                { label: 'Inactive', value: 'Inactive' }
            ]
        }
    ];

    // Calculate stats
    const totalDepartments = departments.length;
    const activeDepartments = departments.filter(d => d.status === 'active').length;
    const totalEmployees = departments.reduce((sum, d) => sum + d.employeeCount, 0);
    const totalTickets = departments.reduce((sum, d) => sum + d.ticketCount, 0);

    return (
        <PageLayout>
            <TopBar
                title="Department Management"
                subtitle="Organize teams, assign managers, and track departmental performance"
                actions={topBarActions}
            />

            <div className="p-6 space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Departments"
                        value={totalDepartments.toString()}
                        icon={Building2}
                        iconColor={theme.primary}
                    />
                    <StatCard
                        title="Active Departments"
                        value={activeDepartments.toString()}
                        subtitle={`${Math.round((activeDepartments / totalDepartments) * 100)}% active`}
                        icon={Activity}
                        iconColor={theme.success}
                    />
                    <StatCard
                        title="Total Employees"
                        value={totalEmployees.toString()}
                        subtitle="Across all departments"
                        icon={Users}
                        iconColor="#2FD9C4"
                    />
                    <StatCard
                        title="Active Tickets"
                        value={totalTickets.toString()}
                        subtitle="Department tickets"
                        icon={AlertCircle}
                        iconColor={theme.warning}
                    />
                </div>

                {/* Search and Filters */}
                <SearchFilter
                    searchValue={searchTerm}
                    onSearchChange={(value) => { setSearchTerm(value); handleFilterChange(); }}
                    searchPlaceholder="Search departments, managers, descriptions..."
                    filters={filters}
                />

                {/* Departments Table */}
                <DataTable
                    title={`Departments (${filteredDepartments.length})`}
                    columns={departmentColumns}
                    data={paginatedDepartments}
                    emptyMessage="No departments found matching your criteria."
                />

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 rounded-lg" style={{ backgroundColor: theme.card, border: `1px solid ${theme.cardBorder}` }}>
                        <div style={{ fontSize: fonts.body.sm.size, color: theme.foregroundMuted }}>
                            Showing {startIndex + 1} to {Math.min(endIndex, filteredDepartments.length)} of {filteredDepartments.length} departments
                        </div>
                        <div className="flex items-center gap-2">
                            <ActionButton
                                variant="outline"
                                size="sm"
                                icon={ChevronLeft}
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </ActionButton>
                            <div className="flex items-center gap-1">
                                {(() => {
                                    const maxVisiblePages = 4;
                                    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                                    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

                                    if (endPage - startPage < maxVisiblePages - 1) {
                                        startPage = Math.max(1, endPage - maxVisiblePages + 1);
                                    }

                                    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className="w-8 h-8 rounded flex items-center justify-center transition-colors"
                                            style={{
                                                backgroundColor: currentPage === page ? theme.primary : 'transparent',
                                                color: currentPage === page ? (isDark ? '#0F172A' : '#16332B') : theme.foreground,
                                                fontSize: fonts.body.sm.size
                                            }}
                                        >
                                            {page}
                                        </button>
                                    ));
                                })()}
                            </div>
                            <ActionButton
                                variant="outline"
                                size="sm"
                                icon={ChevronRight}
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </ActionButton>
                        </div>
                    </div>
                )}
            </div>

            {/* Add Department Modal */}
            {addModal && (
                <div className="fixed inset-0 z-[9998] flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setAddModal(false)} />
                    <div className="relative rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6" style={{ backgroundColor: theme.card, borderColor: theme.cardBorder, border: '1px solid' }}>
                        <button onClick={() => setAddModal(false)} className="absolute top-4 right-4 p-1 rounded-lg transition-colors" style={{ color: theme.foregroundMuted }}>
                            <X className="w-5 h-5" />
                        </button>
                        <h3 className="text-lg font-bold mb-4 flex items-center" style={{ color: theme.foreground }}>
                            <Building2 className="h-5 w-5 mr-2" />
                            Create Department
                        </h3>
                        <div className="space-y-4 mb-6">
                            <div>
                                <label style={{ fontSize: fonts.body.sm.size, color: theme.foregroundMuted, marginBottom: '8px', display: 'block' }}>Department Name <span style={{ color: '#EF4444' }}>*</span></label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Enter department name"
                                    required
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: fonts.body.sm.size, color: theme.foregroundMuted, marginBottom: '8px', display: 'block' }}>Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Department description..."
                                    rows={3}
                                    className="w-full px-3 py-2 rounded-lg resize-none"
                                    style={{
                                        backgroundColor: theme.card,
                                        color: theme.foreground,
                                        border: `1px solid ${theme.cardBorder}`,
                                        fontSize: fonts.body.regular.size
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: fonts.body.sm.size, color: theme.foregroundMuted, marginBottom: '8px', display: 'block' }}>Department Manager</label>
                                <Input
                                    value={formData.manager}
                                    onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                                    placeholder="Manager name"
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: fonts.body.sm.size, color: theme.foregroundMuted, marginBottom: '8px', display: 'block' }}>Status <span style={{ color: '#EF4444' }}>*</span></label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg"
                                    style={{
                                        backgroundColor: theme.card,
                                        color: theme.foreground,
                                        border: `1px solid ${theme.cardBorder}`,
                                        fontSize: fonts.body.regular.size
                                    }}
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <ActionButton variant="outline" size="md" onClick={() => setAddModal(false)}>
                                Cancel
                            </ActionButton>
                            <ActionButton
                                variant="primary"
                                size="md"
                                onClick={handleAddDepartment}
                                disabled={!formData.name}
                            >
                                Create Department
                            </ActionButton>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Department Modal */}
            {editModal.isOpen && editModal.department && (
                <div className="fixed inset-0 z-[9998] flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setEditModal({ isOpen: false, department: null })} />
                    <div className="relative rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6" style={{ backgroundColor: theme.card, borderColor: theme.cardBorder, border: '1px solid' }}>
                        <button onClick={() => setEditModal({ isOpen: false, department: null })} className="absolute top-4 right-4 p-1 rounded-lg transition-colors" style={{ color: theme.foregroundMuted }}>
                            <X className="w-5 h-5" />
                        </button>
                        <h3 className="text-lg font-bold mb-4 flex items-center" style={{ color: theme.foreground }}>
                            <Edit className="h-5 w-5 mr-2" />
                            Edit Department
                        </h3>
                        <div className="space-y-4 mb-6">
                            <div>
                                <label style={{ fontSize: fonts.body.sm.size, color: theme.foregroundMuted, marginBottom: '8px', display: 'block' }}>Department Name <span style={{ color: '#EF4444' }}>*</span></label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Enter department name"
                                    required
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: fonts.body.sm.size, color: theme.foregroundMuted, marginBottom: '8px', display: 'block' }}>Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Department description..."
                                    rows={3}
                                    className="w-full px-3 py-2 rounded-lg resize-none"
                                    style={{
                                        backgroundColor: theme.card,
                                        color: theme.foreground,
                                        border: `1px solid ${theme.cardBorder}`,
                                        fontSize: fonts.body.regular.size
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: fonts.body.sm.size, color: theme.foregroundMuted, marginBottom: '8px', display: 'block' }}>Department Manager</label>
                                <Input
                                    value={formData.manager}
                                    onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                                    placeholder="Manager name"
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: fonts.body.sm.size, color: theme.foregroundMuted, marginBottom: '8px', display: 'block' }}>Status <span style={{ color: '#EF4444' }}>*</span></label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg"
                                    style={{
                                        backgroundColor: theme.card,
                                        color: theme.foreground,
                                        border: `1px solid ${theme.cardBorder}`,
                                        fontSize: fonts.body.regular.size
                                    }}
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <ActionButton variant="outline" size="md" onClick={() => setEditModal({ isOpen: false, department: null })}>
                                Cancel
                            </ActionButton>
                            <ActionButton
                                variant="primary"
                                size="md"
                                onClick={handleUpdateDepartment}
                                disabled={!formData.name}
                            >
                                Save Changes
                            </ActionButton>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <ConfirmationDialog
                isOpen={confirmDialog.isOpen}
                onClose={() => setConfirmDialog({ isOpen: false, type: null, department: null })}
                onConfirm={handleConfirmDelete}
                variant="danger"
                title="Delete Department"
                message={`Are you sure you want to delete "${confirmDialog.department?.name}"? This action cannot be undone and will affect all associated employees and tickets.`}
                confirmLabel="Delete Department"
            />

            {/* View Department Modal */}
            {
                viewModal.isOpen && viewModal.department && (
                    <div className="fixed inset-0 z-[9998] flex items-center justify-center">
                        <div
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            onClick={() => setViewModal({ isOpen: false, department: null })}
                        />
                        <div
                            className="relative rounded-2xl shadow-2xl w-full max-w-2xl mx-4 p-6"
                            style={{
                                backgroundColor: theme.card,
                                borderColor: theme.cardBorder,
                                border: '1px solid'
                            }}
                        >
                            <button
                                onClick={() => setViewModal({ isOpen: false, department: null })}
                                className="absolute top-4 right-4 p-1 rounded-lg hover:bg-opacity-80 transition-colors"
                                style={{ color: theme.foregroundMuted }}
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="mb-6">
                                <div className="flex items-center mb-4">
                                    <div
                                        className="w-16 h-16 rounded-full flex items-center justify-center mr-4"
                                        style={{ backgroundColor: theme.accent }}
                                    >
                                        <Building2 className="w-8 h-8" style={{ color: theme.primary }} />
                                    </div>
                                    <div>
                                        <h3
                                            className="text-xl font-bold"
                                            style={{ color: theme.foreground }}
                                        >
                                            {viewModal.department.name}
                                        </h3>
                                        <div className="mt-1">
                                            {getStatusBadge(viewModal.department.status)}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <p
                                            style={{
                                                fontSize: fonts.body.sm.size,
                                                color: theme.foregroundMuted,
                                                marginBottom: '8px'
                                            }}
                                        >
                                            Description
                                        </p>
                                        <p
                                            style={{
                                                fontSize: fonts.body.regular.size,
                                                color: theme.foreground
                                            }}
                                        >
                                            {viewModal.department.description}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p
                                                style={{
                                                    fontSize: fonts.body.sm.size,
                                                    color: theme.foregroundMuted,
                                                    marginBottom: '8px'
                                                }}
                                            >
                                                Department Manager
                                            </p>
                                            <div className="flex items-center">
                                                <div
                                                    className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                                                    style={{ backgroundColor: theme.primary + '20' }}
                                                >
                                                    <User className="h-5 w-5" style={{ color: theme.primary }} />
                                                </div>
                                                <span
                                                    style={{
                                                        fontSize: fonts.body.regular.size,
                                                        color: theme.foreground,
                                                        fontWeight: fonts.fontWeight.medium
                                                    }}
                                                >
                                                    {viewModal.department.manager}
                                                </span>
                                            </div>
                                        </div>

                                        <div>
                                            <p
                                                style={{
                                                    fontSize: fonts.body.sm.size,
                                                    color: theme.foregroundMuted,
                                                    marginBottom: '8px'
                                                }}
                                            >
                                                Status
                                            </p>
                                            <p
                                                style={{
                                                    fontSize: fonts.body.regular.size,
                                                    color: theme.foreground
                                                }}
                                            >
                                                {viewModal.department.status === 'active' ? 'Active' : 'Inactive'}
                                            </p>
                                        </div>

                                        <div>
                                            <p
                                                style={{
                                                    fontSize: fonts.body.sm.size,
                                                    color: theme.foregroundMuted,
                                                    marginBottom: '8px'
                                                }}
                                            >
                                                Total Employees
                                            </p>
                                            <div className="flex items-center">
                                                <Users className="h-4 w-4 mr-2" style={{ color: theme.foregroundMuted }} />
                                                <span
                                                    style={{
                                                        fontSize: fonts.body.regular.size,
                                                        color: theme.foreground,
                                                        fontWeight: fonts.fontWeight.semibold
                                                    }}
                                                >
                                                    {viewModal.department.employeeCount}
                                                </span>
                                            </div>
                                        </div>

                                        <div>
                                            <p
                                                style={{
                                                    fontSize: fonts.body.sm.size,
                                                    color: theme.foregroundMuted,
                                                    marginBottom: '8px'
                                                }}
                                            >
                                                Active Tickets
                                            </p>
                                            <div className="flex items-center">
                                                <Activity className="h-4 w-4 mr-2" style={{ color: theme.foregroundMuted }} />
                                                <span
                                                    style={{
                                                        fontSize: fonts.body.regular.size,
                                                        color: theme.foreground,
                                                        fontWeight: fonts.fontWeight.semibold
                                                    }}
                                                >
                                                    {viewModal.department.ticketCount}
                                                </span>
                                            </div>
                                        </div>

                                        <div>
                                            <p
                                                style={{
                                                    fontSize: fonts.body.sm.size,
                                                    color: theme.foregroundMuted,
                                                    marginBottom: '8px'
                                                }}
                                            >
                                                Created Date
                                            </p>
                                            <div className="flex items-center">
                                                <Calendar className="h-4 w-4 mr-2" style={{ color: theme.foregroundMuted }} />
                                                <span
                                                    style={{
                                                        fontSize: fonts.body.regular.size,
                                                        color: theme.foreground
                                                    }}
                                                >
                                                    {new Date(viewModal.department.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>

                                        <div>
                                            <p
                                                style={{
                                                    fontSize: fonts.body.sm.size,
                                                    color: theme.foregroundMuted,
                                                    marginBottom: '8px'
                                                }}
                                            >
                                                Last Updated
                                            </p>
                                            <div className="flex items-center">
                                                <Calendar className="h-4 w-4 mr-2" style={{ color: theme.foregroundMuted }} />
                                                <span
                                                    style={{
                                                        fontSize: fonts.body.regular.size,
                                                        color: theme.foreground
                                                    }}
                                                >
                                                    {new Date(viewModal.department.updatedAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div
                                className="flex justify-end gap-3 pt-4"
                                style={{ borderTop: `1px solid ${theme.cardBorder}` }}
                            >
                                <ActionButton
                                    variant="outline"
                                    size="md"
                                    onClick={() => setViewModal({ isOpen: false, department: null })}
                                >
                                    Close
                                </ActionButton>
                                <ActionButton
                                    variant="primary"
                                    size="md"
                                    icon={Edit}
                                    onClick={() => {
                                        setViewModal({ isOpen: false, department: null });
                                        handleEditDepartment(viewModal.department);
                                    }}
                                >
                                    Edit Department
                                </ActionButton>
                            </div>
                        </div>
                    </div>
                )
            }
        </PageLayout >
    );
}
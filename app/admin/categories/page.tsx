'use client';

import React, { useState } from 'react';
import { PageLayout } from '../../../components/admin/PageLayout';
import { TopBar } from '../../../components/admin/TopBar';
import { StatCard } from '../../../components/admin/StatCard';
import { ActionButton } from '../../../components/admin/ActionButton';
import { DataTable } from '../../../components/admin/DataTable';
import { SearchFilter } from '../../../components/admin/SearchFilter';
import { ConfirmationDialog } from '../../../components/ui/confirmation-dialog';
import { Input } from '../../../components/ui/input';
import { useToast } from '../../../components/ui/toast';
import { useTheme } from '../../../components/providers/ThemeProvider';
import { fonts } from '@/lib/fonts';
import {
    Tag,
    Activity,
    AlertTriangle,
    TrendingUp,
    Plus,
    Edit,
    Trash2,
    Eye,
    Download,
    X,
    Calendar,
    Save,
    MoreVertical,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

// Mock category data with Ethiopian context
const mockCategories = [
    {
        id: 'cat-1',
        name: 'Hardware',
        description: 'Physical equipment issues and maintenance requests',
        priority: 'HIGH',
        status: 'active',
        ticketCount: 89,
        avgResolutionTime: '4.2 hours',
        createdAt: '2023-01-15',
        updatedAt: '2024-07-20'
    },
    {
        id: 'cat-2',
        name: 'Software',
        description: 'Application issues, bugs, and software installation requests',
        priority: 'MEDIUM',
        status: 'active',
        ticketCount: 156,
        avgResolutionTime: '2.8 hours',
        createdAt: '2023-01-15',
        updatedAt: '2024-07-19'
    },
    {
        id: 'cat-3',
        name: 'Network',
        description: 'Connectivity, VPN, and network infrastructure issues',
        priority: 'HIGH',
        status: 'active',
        ticketCount: 73,
        avgResolutionTime: '3.5 hours',
        createdAt: '2023-01-15',
        updatedAt: '2024-07-18'
    },
    {
        id: 'cat-4',
        name: 'Access Control',
        description: 'User permissions, account access, and security requests',
        priority: 'URGENT',
        status: 'active',
        ticketCount: 42,
        avgResolutionTime: '1.2 hours',
        createdAt: '2023-02-10',
        updatedAt: '2024-07-17'
    },
    {
        id: 'cat-5',
        name: 'Training',
        description: 'User training and educational resource requests',
        priority: 'LOW',
        status: 'inactive',
        ticketCount: 8,
        avgResolutionTime: '6.5 hours',
        createdAt: '2023-03-15',
        updatedAt: '2024-06-10'
    }
];

export default function CategoriesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All Status');
    const [priorityFilter, setPriorityFilter] = useState('All Priority');
    const [categories, setCategories] = useState(mockCategories);
    const [currentPage, setCurrentPage] = useState(1);
    const [actionsMenuOpen, setActionsMenuOpen] = useState<string | null>(null);
    const itemsPerPage = 4;
    const [addModal, setAddModal] = useState(false);
    const [editModal, setEditModal] = useState<{ isOpen: boolean; category: any }>({ isOpen: false, category: null });
    const [viewModal, setViewModal] = useState<{ isOpen: boolean; category: any }>({ isOpen: false, category: null });
    const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; category: any }>({ isOpen: false, category: null });
    const [formData, setFormData] = useState({ name: '', description: '', priority: 'MEDIUM', status: 'active' });

    const { colors: theme, isDark } = useTheme();
    const { toast } = useToast();

    // Filter categories
    const filteredCategories = categories.filter(cat => {
        const matchesSearch = cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cat.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All Status' || cat.status === statusFilter.toLowerCase();
        const matchesPriority = priorityFilter === 'All Priority' || cat.priority === priorityFilter.toUpperCase();
        return matchesSearch && matchesStatus && matchesPriority;
    });

    // Pagination
    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedCategories = filteredCategories.slice(startIndex, endIndex);

    // Reset to page 1 when filters change
    const handleFilterChange = () => {
        setCurrentPage(1);
    };

    // Handle CRUD operations
    const handleAddCategory = () => {
        if (!formData.name || !formData.description) {
            toast('Please fill all required fields', 'error');
            return;
        }
        const newCategory = {
            id: `cat-${Date.now()}`,
            ...formData,
            ticketCount: 0,
            avgResolutionTime: '0 hours',
            createdAt: new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString().split('T')[0]
        };
        setCategories(prev => [...prev, newCategory]);
        setAddModal(false);
        setFormData({ name: '', description: '', priority: 'MEDIUM', status: 'active' });
        toast(`Category "${formData.name}" created successfully`, 'success');
    };

    const handleEditCategory = () => {
        if (!editModal.category || !formData.name || !formData.description) {
            toast('Please fill all required fields', 'error');
            return;
        }
        setCategories(prev => prev.map(cat =>
            cat.id === editModal.category.id
                ? { ...cat, ...formData, updatedAt: new Date().toISOString().split('T')[0] }
                : cat
        ));
        setEditModal({ isOpen: false, category: null });
        toast(`Category "${formData.name}" updated successfully`, 'success');
    };

    const handleDeleteCategory = () => {
        if (!deleteDialog.category) return;
        setCategories(prev => prev.filter(cat => cat.id !== deleteDialog.category.id));
        toast(`Category "${deleteDialog.category.name}" deleted successfully`, 'success');
        setDeleteDialog({ isOpen: false, category: null });
    };

    const handleExportData = () => {
        const headers = ['ID', 'Category Name', 'Description', 'Priority', 'Status', 'Ticket Count', 'Avg Resolution Time', 'Created', 'Last Updated'];
        const csvData = filteredCategories.map(cat => [
            cat.id,
            cat.name,
            cat.description,
            cat.priority,
            cat.status,
            cat.ticketCount,
            cat.avgResolutionTime,
            cat.createdAt,
            cat.updatedAt
        ]);
        const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `categories-export-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        toast('Category data exported successfully', 'success');
    };

    const openAddModal = () => {
        setFormData({ name: '', description: '', priority: 'MEDIUM', status: 'active' });
        setAddModal(true);
    };

    const openEditModal = (category: any) => {
        setFormData({ name: category.name, description: category.description, priority: category.priority, status: category.status });
        setEditModal({ isOpen: true, category });
    };

    // Helper functions
    const getStatusBadge = (status: string) => {
        const isActive = status === 'active';
        return (
            <span
                className="px-2 py-1 text-xs font-medium rounded border"
                style={{
                    backgroundColor: isActive ? '#dcfce7' : '#fee2e2',
                    color: isActive ? '#15803d' : '#dc2626',
                    fontSize: fonts.caption.small.size
                }}
            >
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const getPriorityBadge = (priority: string) => {
        const priorityColors: Record<string, { bg: string; text: string }> = {
            'LOW': { bg: '#f3f4f6', text: '#6b7280' },
            'MEDIUM': { bg: '#dbeafe', text: '#1e40af' },
            'HIGH': { bg: '#fed7aa', text: '#c2410c' },
            'URGENT': { bg: '#fee2e2', text: '#dc2626' }
        };
        const color = priorityColors[priority] || priorityColors['MEDIUM'];
        return (
            <span
                className="px-2 py-1 text-xs font-medium rounded border"
                style={{
                    backgroundColor: color.bg,
                    color: color.text,
                    fontSize: fonts.caption.small.size
                }}
            >
                {priority}
            </span>
        );
    };

    // Table columns
    const categoryColumns = [
        {
            key: 'name',
            title: 'Category',
            render: (value: string, row: any) => (
                <div>
                    <div className="font-medium" style={{ fontSize: fonts.body.regular.size, color: theme.foreground }}>
                        {value}
                    </div>
                    <div className="mt-1" style={{ fontSize: fonts.caption.regular.size, color: theme.foregroundSecondary }}>
                        {row.description}
                    </div>
                </div>
            )
        },
        {
            key: 'priority',
            title: 'Priority',
            render: (value: string) => getPriorityBadge(value)
        },
        {
            key: 'ticketCount',
            title: 'Tickets',
            render: (value: number) => (
                <div className="flex items-center">
                    <Activity className="h-4 w-4 mr-2" style={{ color: theme.foregroundMuted }} />
                    <span style={{ fontSize: fonts.body.regular.size, color: theme.foreground, fontWeight: fonts.fontWeight.medium }}>
                        {value}
                    </span>
                </div>
            )
        },
        {
            key: 'avgResolutionTime',
            title: 'Avg Resolution',
            render: (value: string) => (
                <span style={{ fontSize: fonts.body.sm.size, color: theme.foregroundSecondary }}>
                    {value}
                </span>
            )
        },
        {
            key: 'status',
            title: 'Status',
            render: (value: string) => getStatusBadge(value)
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
                                    onClick={() => { setViewModal({ isOpen: true, category: row }); setActionsMenuOpen(null); }}
                                    className="w-full px-4 py-2 text-left flex items-center hover:opacity-80 transition-colors"
                                    style={{ color: '#3B82F6' }}
                                >
                                    <Eye className="h-4 w-4 mr-2" />
                                    View
                                </button>

                                <button
                                    onClick={() => { openEditModal(row); setActionsMenuOpen(null); }}
                                    className="w-full px-4 py-2 text-left flex items-center hover:opacity-80 transition-colors"
                                    style={{ color: theme.foreground }}
                                >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                </button>

                                <button
                                    onClick={() => { setDeleteDialog({ isOpen: true, category: row }); setActionsMenuOpen(null); }}
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
        },
        {
            label: 'Priority',
            value: priorityFilter,
            onChange: setPriorityFilter,
            options: [
                { label: 'All Priority', value: 'All Priority' },
                { label: 'Urgent', value: 'Urgent' },
                { label: 'High', value: 'High' },
                { label: 'Medium', value: 'Medium' },
                { label: 'Low', value: 'Low' }
            ]
        }
    ];

    // Calculate stats
    const totalCategories = categories.length;
    const activeCategories = categories.filter(c => c.status === 'active').length;
    const totalTickets = categories.reduce((sum, c) => sum + c.ticketCount, 0);
    const urgentCategories = categories.filter(c => c.priority === 'URGENT').length;

    return (
        <PageLayout>
            <TopBar
                title="Category Management"
                subtitle="Organize and manage ticket categories for better classification"
                actions={
                    <div className="flex gap-2">
                        <ActionButton variant="outline" size="sm" icon={Download} onClick={handleExportData}>
                            Export Data
                        </ActionButton>
                        <ActionButton variant="primary" size="sm" icon={Plus} onClick={openAddModal}>
                            Add Category
                        </ActionButton>
                    </div>
                }
            />

            <div className="p-6 space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Categories"
                        value={totalCategories.toString()}
                        icon={Tag}
                        iconColor={theme.primary}
                    />
                    <StatCard
                        title="Active Categories"
                        value={activeCategories.toString()}
                        subtitle={`${Math.round((activeCategories / totalCategories) * 100)}% active`}
                        icon={Activity}
                        iconColor={theme.success}
                    />
                    <StatCard
                        title="Total Tickets"
                        value={totalTickets.toString()}
                        subtitle="Across all categories"
                        icon={TrendingUp}
                        iconColor="#2FD9C4"
                    />
                    <StatCard
                        title="Urgent Categories"
                        value={urgentCategories.toString()}
                        subtitle="High priority"
                        icon={AlertTriangle}
                        iconColor={theme.warning}
                    />
                </div>

                {/* Search and Filters */}
                <SearchFilter
                    searchValue={searchTerm}
                    onSearchChange={(value) => { setSearchTerm(value); handleFilterChange(); }}
                    searchPlaceholder="Search categories..."
                    filters={filters}
                />

                {/* Categories Table */}
                <DataTable
                    title={`Categories (${filteredCategories.length})`}
                    columns={categoryColumns}
                    data={paginatedCategories}
                    emptyMessage="No categories found matching your criteria."
                />

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 rounded-lg" style={{ backgroundColor: theme.card, border: `1px solid ${theme.cardBorder}` }}>
                        <div style={{ fontSize: fonts.body.sm.size, color: theme.foregroundMuted }}>
                            Showing {startIndex + 1} to {Math.min(endIndex, filteredCategories.length)} of {filteredCategories.length} categories
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

            {/* Add Category Modal */}
            {addModal && (
                <div className="fixed inset-0 z-[9998] flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setAddModal(false)} />
                    <div className="relative rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6" style={{ backgroundColor: theme.card, borderColor: theme.cardBorder, border: '1px solid' }}>
                        <button onClick={() => setAddModal(false)} className="absolute top-4 right-4 p-1 rounded-lg" style={{ color: theme.foregroundMuted }}>
                            <X className="w-5 h-5" />
                        </button>
                        <h3 className="text-lg font-bold mb-4 flex items-center" style={{ color: theme.foreground }}>
                            <Plus className="h-5 w-5 mr-2" />
                            Add New Category
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block mb-2" style={{ fontSize: fonts.body.sm.size, fontWeight: fonts.fontWeight.medium, color: theme.foregroundMuted }}>
                                    Category Name <span style={{ color: theme.error }}>*</span>
                                </label>
                                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Enter category name" style={{ backgroundColor: theme.background, color: theme.foreground, borderColor: theme.border }} />
                            </div>
                            <div>
                                <label className="block mb-2" style={{ fontSize: fonts.body.sm.size, fontWeight: fonts.fontWeight.medium, color: theme.foregroundMuted }}>
                                    Description <span style={{ color: theme.error }}>*</span>
                                </label>
                                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Enter description" rows={3} className="w-full px-3 py-2 border rounded-md resize-none" style={{ backgroundColor: theme.background, color: theme.foreground, borderColor: theme.border }} />
                            </div>
                            <div>
                                <label className="block mb-2" style={{ fontSize: fonts.body.sm.size, fontWeight: fonts.fontWeight.medium, color: theme.foregroundMuted }}>
                                    Priority <span style={{ color: theme.error }}>*</span>
                                </label>
                                <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} className="w-full px-3 py-2 border rounded-md" style={{ backgroundColor: theme.background, color: theme.foreground, borderColor: theme.border }}>
                                    <option value="LOW">Low</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="HIGH">High</option>
                                    <option value="URGENT">Urgent</option>
                                </select>
                            </div>
                            <div>
                                <label className="block mb-2" style={{ fontSize: fonts.body.sm.size, fontWeight: fonts.fontWeight.medium, color: theme.foregroundMuted }}>
                                    Status <span style={{ color: theme.error }}>*</span>
                                </label>
                                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 border rounded-md" style={{ backgroundColor: theme.background, color: theme.foreground, borderColor: theme.border }}>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <ActionButton variant="outline" size="md" onClick={() => setAddModal(false)}>Cancel</ActionButton>
                            <ActionButton variant="primary" size="md" icon={Save} onClick={handleAddCategory}>Add Category</ActionButton>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Category Modal */}
            {editModal.isOpen && editModal.category && (
                <div className="fixed inset-0 z-[9998] flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setEditModal({ isOpen: false, category: null })} />
                    <div className="relative rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6" style={{ backgroundColor: theme.card, borderColor: theme.cardBorder, border: '1px solid' }}>
                        <button onClick={() => setEditModal({ isOpen: false, category: null })} className="absolute top-4 right-4 p-1 rounded-lg" style={{ color: theme.foregroundMuted }}>
                            <X className="w-5 h-5" />
                        </button>
                        <h3 className="text-lg font-bold mb-4 flex items-center" style={{ color: theme.foreground }}>
                            <Edit className="h-5 w-5 mr-2" />
                            Edit Category
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block mb-2" style={{ fontSize: fonts.body.sm.size, fontWeight: fonts.fontWeight.medium, color: theme.foregroundMuted }}>
                                    Category Name <span style={{ color: theme.error }}>*</span>
                                </label>
                                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ backgroundColor: theme.background, color: theme.foreground, borderColor: theme.border }} />
                            </div>
                            <div>
                                <label className="block mb-2" style={{ fontSize: fonts.body.sm.size, fontWeight: fonts.fontWeight.medium, color: theme.foregroundMuted }}>
                                    Description <span style={{ color: theme.error }}>*</span>
                                </label>
                                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-3 py-2 border rounded-md resize-none" style={{ backgroundColor: theme.background, color: theme.foreground, borderColor: theme.border }} />
                            </div>
                            <div>
                                <label className="block mb-2" style={{ fontSize: fonts.body.sm.size, fontWeight: fonts.fontWeight.medium, color: theme.foregroundMuted }}>
                                    Priority <span style={{ color: theme.error }}>*</span>
                                </label>
                                <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} className="w-full px-3 py-2 border rounded-md" style={{ backgroundColor: theme.background, color: theme.foreground, borderColor: theme.border }}>
                                    <option value="LOW">Low</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="HIGH">High</option>
                                    <option value="URGENT">Urgent</option>
                                </select>
                            </div>
                            <div>
                                <label className="block mb-2" style={{ fontSize: fonts.body.sm.size, fontWeight: fonts.fontWeight.medium, color: theme.foregroundMuted }}>
                                    Status <span style={{ color: theme.error }}>*</span>
                                </label>
                                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 border rounded-md" style={{ backgroundColor: theme.background, color: theme.foreground, borderColor: theme.border }}>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <ActionButton variant="outline" size="md" onClick={() => setEditModal({ isOpen: false, category: null })}>Cancel</ActionButton>
                            <ActionButton variant="primary" size="md" icon={Save} onClick={handleEditCategory}>Save Changes</ActionButton>
                        </div>
                    </div>
                </div>
            )}

            {/* View Category Modal */}
            {viewModal.isOpen && viewModal.category && (
                <div className="fixed inset-0 z-[9998] flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setViewModal({ isOpen: false, category: null })} />
                    <div className="relative rounded-2xl shadow-2xl w-full max-w-2xl mx-4 p-6" style={{ backgroundColor: theme.card, borderColor: theme.cardBorder, border: '1px solid' }}>
                        <button onClick={() => setViewModal({ isOpen: false, category: null })} className="absolute top-4 right-4 p-1 rounded-lg hover:bg-opacity-80 transition-colors" style={{ color: theme.foregroundMuted }}>
                            <X className="w-5 h-5" />
                        </button>
                        <div className="mb-6">
                            <div className="flex items-center mb-4">
                                <div className="w-16 h-16 rounded-full flex items-center justify-center mr-4" style={{ backgroundColor: theme.accent }}>
                                    <Tag className="w-8 h-8" style={{ color: theme.primary }} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold" style={{ color: theme.foreground }}>{viewModal.category.name}</h3>
                                    <div className="flex gap-2 mt-1">
                                        {getStatusBadge(viewModal.category.status)}
                                        {getPriorityBadge(viewModal.category.priority)}
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <p style={{ fontSize: fonts.body.sm.size, color: theme.foregroundMuted, marginBottom: '8px' }}>Description</p>
                                    <p style={{ fontSize: fonts.body.regular.size, color: theme.foreground }}>{viewModal.category.description}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p style={{ fontSize: fonts.body.sm.size, color: theme.foregroundMuted, marginBottom: '8px' }}>Total Tickets</p>
                                        <div className="flex items-center">
                                            <Activity className="h-4 w-4 mr-2" style={{ color: theme.foregroundMuted }} />
                                            <span style={{ fontSize: fonts.body.regular.size, color: theme.foreground, fontWeight: fonts.fontWeight.semibold }}>{viewModal.category.ticketCount}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: fonts.body.sm.size, color: theme.foregroundMuted, marginBottom: '8px' }}>Avg Resolution Time</p>
                                        <span style={{ fontSize: fonts.body.regular.size, color: theme.foreground, fontWeight: fonts.fontWeight.semibold }}>{viewModal.category.avgResolutionTime}</span>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: fonts.body.sm.size, color: theme.foregroundMuted, marginBottom: '8px' }}>Created Date</p>
                                        <div className="flex items-center">
                                            <Calendar className="h-4 w-4 mr-2" style={{ color: theme.foregroundMuted }} />
                                            <span style={{ fontSize: fonts.body.regular.size, color: theme.foreground }}>{new Date(viewModal.category.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: fonts.body.sm.size, color: theme.foregroundMuted, marginBottom: '8px' }}>Last Updated</p>
                                        <div className="flex items-center">
                                            <Calendar className="h-4 w-4 mr-2" style={{ color: theme.foregroundMuted }} />
                                            <span style={{ fontSize: fonts.body.regular.size, color: theme.foreground }}>{new Date(viewModal.category.updatedAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-4" style={{ borderTop: `1px solid ${theme.cardBorder}` }}>
                            <ActionButton variant="outline" size="md" onClick={() => setViewModal({ isOpen: false, category: null })}>Close</ActionButton>
                            <ActionButton variant="primary" size="md" icon={Edit} onClick={() => { setViewModal({ isOpen: false, category: null }); openEditModal(viewModal.category); }}>Edit Category</ActionButton>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <ConfirmationDialog
                isOpen={deleteDialog.isOpen}
                onClose={() => setDeleteDialog({ isOpen: false, category: null })}
                onConfirm={handleDeleteCategory}
                variant="danger"
                title="Delete Category"
                message={`Are you sure you want to delete "${deleteDialog.category?.name}"? This action cannot be undone and will affect all associated tickets.`}
                confirmLabel="Delete Category"
            />
        </PageLayout>
    );
}

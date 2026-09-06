'use client';

import React, { useState, useEffect } from 'react';
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
    Activity,
    Plus,
    Edit,
    Trash2,
    Eye,
    Download,
    X,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    Loader2
} from 'lucide-react';
import {
    getDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    type Department
} from '@/lib/api/departments';

export default function DepartmentsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [departments, setDepartments] = useState<Department[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [actionsMenuOpen, setActionsMenuOpen] = useState<string | null>(null);
    const itemsPerPage = 5; // Consistent pagination: 5 items per page
    const [addModal, setAddModal] = useState(false);
    const [editModal, setEditModal] = useState<{ isOpen: boolean; department: any }>({ isOpen: false, department: null });
    const [formData, setFormData] = useState({ name: '' });
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

    const { colors: theme } = useTheme();
    const { toast } = useToast();

    // Load departments from API on mount
    useEffect(() => {
        loadDepartments();
    }, []);

    const loadDepartments = async () => {
        try {
            setIsLoadingData(true);
            const data = await getDepartments();
            setDepartments(data);
        } catch (error) {
            console.error('Failed to load departments:', error);
            toast('Failed to load departments', 'error');
        } finally {
            setIsLoadingData(false);
        }
    };

    // Filter departments
    const filteredDepartments = departments.filter(dept => {
        const matchesSearch = dept.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
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
        setFormData({ name: '' });
        setAddModal(true);
    };

    const handleEditDepartment = (department: any) => {
        setFormData({ name: department.name });
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
    const handleAddDepartment = async () => {
        try {
            setIsLoading(true);
            const newDepartment = await createDepartment({ name: formData.name });
            setDepartments(prev => [...prev, newDepartment]);
            setAddModal(false);
            toast(`Department "${newDepartment.name}" created successfully`, 'success');
        } catch (error: any) {
            toast(error.message || 'Failed to create department', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateDepartment = async () => {
        if (!editModal.department) return;
        try {
            setIsLoading(true);
            const updated = await updateDepartment(editModal.department.id, { name: formData.name });
            setDepartments(prev => prev.map(dept =>
                dept.id === editModal.department.id ? updated : dept
            ));
            setEditModal({ isOpen: false, department: null });
            toast(`Department "${updated.name}" updated successfully`, 'success');
        } catch (error: any) {
            toast(error.message || 'Failed to update department', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!confirmDialog.department) return;

        try {
            setIsLoading(true);
            await deleteDepartment(confirmDialog.department.id);
            setDepartments(prev => prev.filter(dept => dept.id !== confirmDialog.department.id));
            toast(`${confirmDialog.department.name} has been permanently deleted.`, 'success');
            setConfirmDialog({ isOpen: false, type: null, department: null });
        } catch (error: any) {
            toast(error.message || 'Failed to delete department', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleExportData = () => {
        const headers = ['ID', 'Department Name', 'Created Date'];
        const csvData = filteredDepartments.map(dept => [
            dept.id,
            dept.name,
            new Date(dept.createdAt).toLocaleDateString()
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
    const departmentColumns = [
        {
            key: 'id',
            title: 'Department ID',
            render: (value: string) => (
                <span
                    className="font-mono font-medium"
                    style={{
                        fontSize: fonts.body.sm.size,
                        color: theme.primary,
                        fontWeight: fonts.fontWeight.medium
                    }}
                >
                    {value}
                </span>
            )
        },
        {
            key: 'name',
            title: 'Department Name',
            render: (value: string) => (
                <div
                    className="font-medium"
                    style={{
                        fontSize: fonts.body.lg.size,
                        fontWeight: fonts.fontWeight.semibold,
                        color: theme.foreground
                    }}
                >
                    {value}
                </div>
            )
        },
        {
            key: 'createdAt',
            title: 'Created Date',
            render: (value: string) => (
                <span
                    style={{
                        fontSize: fonts.body.sm.size,
                        color: theme.foregroundMuted
                    }}
                >
                    {new Date(value).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
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

    const filters: any[] = [];

    // Calculate stats
    const totalDepartments = departments.length;

    return (
        <PageLayout>
            <TopBar
                title="Department Management"
                subtitle="Manage organizational departments and their settings"
                actions={topBarActions}
            />

            <div className="p-6 space-y-6">
                {/* Loading State */}
                {isLoadingData ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin" style={{ color: theme.primary }} />
                        <span className="ml-3" style={{ color: theme.foregroundMuted, fontSize: fonts.body.regular.size }}>
                            Loading departments...
                        </span>
                    </div>
                ) : (
                    <>
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                            <div className="animate-slideInLeft" style={{ animationDelay: '100ms' }}>
                                <StatCard
                                    title="Total Departments"
                                    value={totalDepartments.toString()}
                                    icon={Building2}
                                    iconColor={theme.primary}
                                />
                            </div>
                            <div className="animate-slideInLeft" style={{ animationDelay: '200ms' }}>
                                <StatCard
                                    title="Recently Created"
                                    value={departments.filter(d => {
                                        const daysSince = Math.floor((Date.now() - new Date(d.createdAt).getTime()) / (1000 * 60 * 60 * 24));
                                        return daysSince <= 30;
                                    }).length.toString()}
                                    subtitle="Last 30 days"
                                    icon={Activity}
                                    iconColor={theme.success}
                                />
                            </div>
                        </div>

                        {/* Search and Filters */}
                        <SearchFilter
                            searchValue={searchTerm}
                            onSearchChange={(value) => { setSearchTerm(value); handleFilterChange(); }}
                            searchPlaceholder="Search departments..."
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
                                    <span style={{ fontSize: fonts.body.sm.size, color: theme.foreground, fontWeight: fonts.fontWeight.medium, padding: '0 12px' }}>
                                        Page {currentPage} of {totalPages}
                                    </span>
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
                    </>
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
                                    onChange={(e) => setFormData({ name: e.target.value })}
                                    placeholder="e.g., IT Support, Human Resources, Finance"
                                    required
                                />
                                <p style={{ fontSize: fonts.caption.small.size, color: theme.foregroundMuted, marginTop: '4px' }}>
                                    Enter a unique department name
                                </p>
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
                                disabled={!formData.name.trim() || isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        Creating...
                                    </>
                                ) : (
                                    'Create Department'
                                )}
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
                                    onChange={(e) => setFormData({ name: e.target.value })}
                                    placeholder="e.g., IT Support, Human Resources, Finance"
                                    required
                                />
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
                                disabled={!formData.name.trim() || isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        Updating...
                                    </>
                                ) : (
                                    'Update Department'
                                )}
                            </ActionButton>
                        </div>
                    </div>
                </div>
            )}

            {/* View Department Modal */}
            {viewModal.isOpen && viewModal.department && (
                <div className="fixed inset-0 z-[9998] flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setViewModal({ isOpen: false, department: null })} />
                    <div className="relative rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6" style={{ backgroundColor: theme.card, borderColor: theme.cardBorder, border: '1px solid' }}>
                        <button onClick={() => setViewModal({ isOpen: false, department: null })} className="absolute top-4 right-4 p-1 rounded-lg transition-colors" style={{ color: theme.foregroundMuted }}>
                            <X className="w-5 h-5" />
                        </button>
                        <h3 className="text-lg font-bold mb-4 flex items-center" style={{ color: theme.foreground }}>
                            <Eye className="h-5 w-5 mr-2" />
                            Department Details
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <p style={{ fontSize: fonts.body.sm.size, color: theme.foregroundMuted }}>Department Name</p>
                                <p style={{ fontSize: fonts.body.lg.size, fontWeight: fonts.fontWeight.semibold, color: theme.foreground }}>{viewModal.department.name}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: fonts.body.sm.size, color: theme.foregroundMuted }}>Created Date</p>
                                <p style={{ fontSize: fonts.body.regular.size, color: theme.foreground }}>
                                    {new Date(viewModal.department.createdAt).toLocaleString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                        </div>
                        <div className="mt-6">
                            <ActionButton variant="outline" size="md" onClick={() => setViewModal({ isOpen: false, department: null })}>
                                Close
                            </ActionButton>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <ConfirmationDialog
                isOpen={confirmDialog.isOpen && confirmDialog.type === 'delete'}
                onClose={() => setConfirmDialog({ isOpen: false, type: null, department: null })}
                onConfirm={handleConfirmDelete}
                title="Delete Department"
                message={`Are you sure you want to delete "${confirmDialog.department?.name}"? This action cannot be undone.`}
                confirmLabel={isLoading ? "Deleting..." : "Delete"}
                variant="danger"
            />
        </PageLayout>
    );
}

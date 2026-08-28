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

// Mock category data - matching database schema exactly
// Database schema: id, name, createdAt (only these fields exist)
const mockCategories = [
    {
        id: 'cat-1',
        name: 'Hardware',
        createdAt: '2023-01-15T10:00:00Z'
    },
    {
        id: 'cat-2',
        name: 'Software',
        createdAt: '2023-01-15T09:30:00Z'
    },
    {
        id: 'cat-3',
        name: 'Network',
        createdAt: '2023-01-15T11:00:00Z'
    },
    {
        id: 'cat-4',
        name: 'Access Request',
        createdAt: '2023-02-10T14:00:00Z'
    },
    {
        id: 'cat-5',
        name: 'Training',
        createdAt: '2023-03-15T08:30:00Z'
    },
    {
        id: 'cat-6',
        name: 'Maintenance',
        createdAt: '2023-04-01T10:15:00Z'
    },
    {
        id: 'cat-7',
        name: 'Security',
        createdAt: '2023-04-20T09:45:00Z'
    },
    {
        id: 'cat-8',
        name: 'Database',
        createdAt: '2023-05-10T11:20:00Z'
    }
];

export default function CategoriesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [categories, setCategories] = useState(mockCategories);
    const [currentPage, setCurrentPage] = useState(1);
    const [actionsMenuOpen, setActionsMenuOpen] = useState<string | null>(null);
    const itemsPerPage = 5; // Consistent pagination: 5 items per page
    const [addModal, setAddModal] = useState(false);
    const [editModal, setEditModal] = useState<{ isOpen: boolean; category: any }>({ isOpen: false, category: null });
    const [viewModal, setViewModal] = useState<{ isOpen: boolean; category: any }>({ isOpen: false, category: null });
    const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; category: any }>({ isOpen: false, category: null });
    const [formData, setFormData] = useState({ name: '' });

    const { colors: theme } = useTheme();
    const { toast } = useToast();

    // Filter categories
    const filteredCategories = categories.filter(cat => {
        const matchesSearch = cat.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    // Pagination
    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedCategories = filteredCategories.slice(startIndex, endIndex);

    // Handle CRUD operations
    const handleAddCategory = () => {
        if (!formData.name) {
            toast('Please fill the category name', 'error');
            return;
        }
        const newCategory = {
            id: `cat-${Date.now()}`,
            name: formData.name,
            createdAt: new Date().toISOString()
        };
        setCategories(prev => [...prev, newCategory]);
        setAddModal(false);
        setFormData({ name: '' });
        toast(`Category "${formData.name}" created successfully`, 'success');
    };

    const handleEditCategory = () => {
        if (!editModal.category || !formData.name) {
            toast('Please fill the category name', 'error');
            return;
        }
        setCategories(prev => prev.map(cat =>
            cat.id === editModal.category.id
                ? { ...cat, name: formData.name }
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
        const headers = ['ID', 'Category Name', 'Created Date'];
        const csvData = filteredCategories.map(cat => [
            cat.id,
            cat.name,
            new Date(cat.createdAt).toLocaleDateString()
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
        setFormData({ name: '' });
        setAddModal(true);
    };

    const openEditModal = (category: any) => {
        setFormData({ name: category.name });
        setEditModal({ isOpen: true, category });
    };

    // Table columns
    const categoryColumns = [
        {
            key: 'id',
            title: 'ID',
            render: (value: string) => (
                <span className="font-mono font-medium" style={{ color: theme.primary, fontSize: fonts.body.sm.size }}>
                    {value}
                </span>
            )
        },
        {
            key: 'name',
            title: 'Category Name',
            render: (value: string) => (
                <div className="font-medium" style={{ fontSize: fonts.body.regular.size, color: theme.foreground }}>
                    {value}
                </div>
            )
        },
        {
            key: 'createdAt',
            title: 'Created Date',
            render: (value: string) => (
                <span style={{ fontSize: fonts.body.sm.size, color: theme.foregroundMuted }}>
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

    // Calculate stats
    const totalCategories = categories.length;

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
                </div>

                {/* Search */}
                <SearchFilter
                    searchValue={searchTerm}
                    onSearchChange={(value) => { setSearchTerm(value); setCurrentPage(1); }}
                    searchPlaceholder="Search categories..."
                    filters={[]}
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
                                    <p style={{ fontSize: fonts.body.sm.size, color: theme.foregroundMuted, marginTop: '4px' }}>
                                        ID: {viewModal.category.id}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <p style={{ fontSize: fonts.body.sm.size, color: theme.foregroundMuted, marginBottom: '8px' }}>Created Date</p>
                                    <div className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-2" style={{ color: theme.foregroundMuted }} />
                                        <span style={{ fontSize: fonts.body.regular.size, color: theme.foreground }}>
                                            {new Date(viewModal.category.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <ActionButton variant="outline" size="md" onClick={() => setViewModal({ isOpen: false, category: null })}>Close</ActionButton>
                            <ActionButton variant="primary" size="md" icon={Edit} onClick={() => { openEditModal(viewModal.category); setViewModal({ isOpen: false, category: null }); }}>
                                Edit Category
                            </ActionButton>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <ConfirmationDialog
                isOpen={deleteDialog.isOpen}
                title="Delete Category"
                message={`Are you sure you want to delete the category "${deleteDialog.category?.name}"? This action cannot be undone.`}
                confirmLabel="Delete"
                cancelLabel="Cancel"
                onConfirm={handleDeleteCategory}
                onClose={() => setDeleteDialog({ isOpen: false, category: null })}
                variant="danger"
            />
        </PageLayout>
    );
}

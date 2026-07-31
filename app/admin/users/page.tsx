'use client';

import { useState } from 'react';
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
    Users,
    UserCheck,
    UserX,
    Shield,
    Download,
    Eye,
    Edit,
    X,
    Plus,
    MoreVertical,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

// Ethiopian mock user data
const initialMockUsers = [
    {
        id: 'user-1',
        firstName: 'Alemayehu',
        lastName: 'Tadesse',
        email: 'alemayehu.tadesse@besys.com',
        role: 'ADMIN',
        department: 'IT Support',
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z'
    },
    {
        id: 'user-2',
        firstName: 'Selam',
        lastName: 'Yohannes',
        email: 'selam.yohannes@besys.com',
        role: 'AGENT',
        department: 'IT Support',
        isActive: true,
        createdAt: '2024-01-20T09:30:00Z'
    },
    {
        id: 'user-3',
        firstName: 'Dawit',
        lastName: 'Hailu',
        email: 'dawit.hailu@besys.com',
        role: 'AGENT',
        department: 'Operations',
        isActive: true,
        createdAt: '2024-02-10T11:15:00Z'
    },
    {
        id: 'user-4',
        firstName: 'Tigist',
        lastName: 'Bekele',
        email: 'tigist.bekele@besys.com',
        role: 'EMPLOYEE',
        department: 'Operations',
        isActive: true,
        createdAt: '2024-03-05T14:20:00Z'
    },
    {
        id: 'user-5',
        firstName: 'Bereket',
        lastName: 'Mekonnen',
        email: 'bereket.mekonnen@besys.com',
        role: 'EMPLOYEE',
        department: 'IT Support',
        isActive: false,
        createdAt: '2024-02-28T08:45:00Z'
    },
    {
        id: 'user-6',
        firstName: 'Meseret',
        lastName: 'Kebede',
        email: 'meseret.kebede@besys.com',
        role: 'AGENT',
        department: 'HR',
        isActive: true,
        createdAt: '2024-01-25T10:30:00Z'
    },
    {
        id: 'user-7',
        firstName: 'Yonas',
        lastName: 'Desta',
        email: 'yonas.desta@besys.com',
        role: 'EMPLOYEE',
        department: 'Security',
        isActive: true,
        createdAt: '2024-03-12T13:00:00Z'
    }
];

export default function UsersPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');
    const [departmentFilter, setDepartmentFilter] = useState('ALL');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [users, setUsers] = useState(initialMockUsers);
    const [currentPage, setCurrentPage] = useState(1);
    const [actionsMenuOpen, setActionsMenuOpen] = useState<string | null>(null);
    const itemsPerPage = 4;

    // Modals state
    const [viewModal, setViewModal] = useState<{ isOpen: boolean; user: any }>({ isOpen: false, user: null });
    const [editModal, setEditModal] = useState<{ isOpen: boolean; user: any }>({ isOpen: false, user: null });
    const [roleModal, setRoleModal] = useState<{ isOpen: boolean; user: any }>({ isOpen: false, user: null });
    const [disableDialog, setDisableDialog] = useState<{ isOpen: boolean; user: any }>({ isOpen: false, user: null });
    const [enableDialog, setEnableDialog] = useState<{ isOpen: boolean; user: any }>({ isOpen: false, user: null });
    const [addModal, setAddModal] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        role: 'EMPLOYEE',
        department: 'IT Support',
        isActive: true
    });

    const { colors: theme, isDark } = useTheme();
    const { toast } = useToast();

    // Filter users
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
        const matchesDepartment = departmentFilter === 'ALL' || user.department === departmentFilter;
        const matchesStatus = statusFilter === 'ALL' ||
            (statusFilter === 'ACTIVE' && user.isActive) ||
            (statusFilter === 'INACTIVE' && !user.isActive);

        return matchesSearch && matchesRole && matchesDepartment && matchesStatus;
    });

    // Pagination
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    // Reset to page 1 when filters change
    const handleFilterChange = () => {
        setCurrentPage(1);
    };

    // Handler functions
    const handleAddUser = () => {
        const newUser = {
            id: `user-${Date.now()}`,
            ...formData,
            createdAt: new Date().toISOString()
        };
        setUsers(prev => [...prev, newUser]);
        setAddModal(false);
        setFormData({ firstName: '', lastName: '', email: '', role: 'EMPLOYEE', department: 'IT Support', isActive: true });
        toast(`User ${newUser.firstName} ${newUser.lastName} created successfully`, 'success');
    };

    const handleEditUser = () => {
        if (!editModal.user) return;
        setUsers(prev => prev.map(u =>
            u.id === editModal.user.id ? { ...u, ...formData } : u
        ));
        setEditModal({ isOpen: false, user: null });
        toast(`User ${formData.firstName} ${formData.lastName} updated successfully`, 'success');
    };

    const handleRoleChange = (userId: string, newRole: string) => {
        setUsers(prev => prev.map(u =>
            u.id === userId ? { ...u, role: newRole } : u
        ));
        setRoleModal({ isOpen: false, user: null });
        toast(`User role updated to ${newRole}`, 'success');
    };

    const handleDisable = () => {
        if (!disableDialog.user) return;
        setUsers(prev => prev.map(u =>
            u.id === disableDialog.user.id ? { ...u, isActive: false } : u
        ));
        setDisableDialog({ isOpen: false, user: null });
        toast(`User ${disableDialog.user.firstName} ${disableDialog.user.lastName} disabled successfully`, 'success');
    };

    const handleEnable = () => {
        if (!enableDialog.user) return;
        setUsers(prev => prev.map(u =>
            u.id === enableDialog.user.id ? { ...u, isActive: true } : u
        ));
        setEnableDialog({ isOpen: false, user: null });
        toast(`User ${enableDialog.user.firstName} ${enableDialog.user.lastName} enabled successfully`, 'success');
    };

    const handleExport = () => {
        const csvData = [
            ['User ID', 'First Name', 'Last Name', 'Email', 'Role', 'Department', 'Status', 'Created'],
            ...filteredUsers.map(u => [
                u.id, u.firstName, u.lastName, u.email, u.role, u.department,
                u.isActive ? 'Active' : 'Inactive', new Date(u.createdAt).toLocaleDateString()
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'users-export.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getRoleBadge = (role: string) => {
        const roleColors: Record<string, { bg: string; text: string }> = {
            'ADMIN': { bg: '#fee2e2', text: '#dc2626' },
            'AGENT': { bg: '#dbeafe', text: '#1e40af' },
            'EMPLOYEE': { bg: '#dcfce7', text: '#15803d' }
        };
        const roleColor = roleColors[role] || roleColors['EMPLOYEE'];
        return (
            <span className="px-2 py-1 text-xs font-medium rounded border" style={{ backgroundColor: roleColor.bg, color: roleColor.text, fontSize: fonts.caption.small.size }}>
                {role}
            </span>
        );
    };

    const getStatusBadge = (isActive: boolean) => {
        return (
            <span className="px-2 py-1 text-xs font-medium rounded border" style={{
                backgroundColor: isActive ? '#dcfce7' : theme.backgroundTertiary,
                color: isActive ? '#15803d' : theme.foregroundMuted,
                fontSize: fonts.caption.small.size
            }}>
                {isActive ? 'Active' : 'Inactive'}
            </span>
        );
    };

    const userColumns = [
        {
            key: 'id',
            title: 'User ID',
            render: (value: string) => (
                <span className="font-mono font-medium" style={{ color: theme.primary, fontSize: fonts.body.sm.size }}>{value}</span>
            )
        },
        {
            key: 'name',
            title: 'Name',
            render: (_value: string, row: any) => (
                <div>
                    <h3 className="font-medium" style={{ fontSize: fonts.body.regular.size, fontWeight: fonts.fontWeight.medium, color: theme.foreground }}>
                        {row.firstName} {row.lastName}
                    </h3>
                    <div className="mt-1" style={{ fontSize: fonts.caption.regular.size, color: theme.foregroundMuted }}>
                        {row.email}
                    </div>
                </div>
            )
        },
        {
            key: 'role',
            title: 'Role',
            render: (value: string) => getRoleBadge(value)
        },
        {
            key: 'department',
            title: 'Department',
            render: (value: string) => <span style={{ fontSize: fonts.body.sm.size, color: theme.foreground }}>{value}</span>
        },
        {
            key: 'isActive',
            title: 'Status',
            render: (value: boolean) => getStatusBadge(value)
        },
        {
            key: 'createdAt',
            title: 'Created',
            render: (value: string) => (
                <span style={{ fontSize: fonts.body.xs.size, color: theme.foregroundMuted }}>
                    {new Date(value).toLocaleDateString()}
                </span>
            )
        },
        {
            key: 'actions',
            title: 'Actions',
            render: (_value: any, row: any) => (
                <div className="relative">
                    <button
                        onClick={() => setActionsMenuOpen(actionsMenuOpen === row.id ? null : row.id)}
                        className="p-2 rounded hover:opacity-70 transition-colors"
                        style={{ color: theme.foreground }}
                    >
                        <MoreVertical className="h-5 w-5" />
                    </button>

                    {/* Actions Dropdown Menu */}
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
                                    onClick={() => { setViewModal({ isOpen: true, user: row }); setActionsMenuOpen(null); }}
                                    className="w-full px-4 py-2 text-left flex items-center hover:opacity-80 transition-colors"
                                    style={{ color: '#3B82F6' }}
                                >
                                    <Eye className="h-4 w-4 mr-2" />
                                    View
                                </button>

                                <button
                                    onClick={() => {
                                        setFormData({
                                            firstName: row.firstName,
                                            lastName: row.lastName,
                                            email: row.email,
                                            role: row.role,
                                            department: row.department,
                                            isActive: row.isActive
                                        });
                                        setEditModal({ isOpen: true, user: row });
                                        setActionsMenuOpen(null);
                                    }}
                                    className="w-full px-4 py-2 text-left flex items-center hover:opacity-80 transition-colors"
                                    style={{ color: theme.foreground }}
                                >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                </button>

                                <button
                                    onClick={() => { setRoleModal({ isOpen: true, user: row }); setActionsMenuOpen(null); }}
                                    className="w-full px-4 py-2 text-left flex items-center hover:opacity-80 transition-colors"
                                    style={{ color: theme.primary }}
                                >
                                    <Shield className="h-4 w-4 mr-2" />
                                    Change Role
                                </button>

                                {row.isActive ? (
                                    <button
                                        onClick={() => { setDisableDialog({ isOpen: true, user: row }); setActionsMenuOpen(null); }}
                                        className="w-full px-4 py-2 text-left flex items-center hover:opacity-80 transition-colors"
                                        style={{ color: '#F59E0B' }}
                                    >
                                        <UserX className="h-4 w-4 mr-2" />
                                        Disable
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => { setEnableDialog({ isOpen: true, user: row }); setActionsMenuOpen(null); }}
                                        className="w-full px-4 py-2 text-left flex items-center hover:opacity-80 transition-colors"
                                        style={{ color: '#10B981' }}
                                    >
                                        <UserCheck className="h-4 w-4 mr-2" />
                                        Enable
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </div>
            )
        }
    ];

    const filters = [
        {
            label: 'Role',
            value: roleFilter,
            onChange: setRoleFilter,
            options: [
                { label: 'All Roles', value: 'ALL' },
                { label: 'Admin', value: 'ADMIN' },
                { label: 'Agent', value: 'AGENT' },
                { label: 'Employee', value: 'EMPLOYEE' }
            ]
        },
        {
            label: 'Department',
            value: departmentFilter,
            onChange: setDepartmentFilter,
            options: [
                { label: 'All Departments', value: 'ALL' },
                { label: 'IT Support', value: 'IT Support' },
                { label: 'Operations', value: 'Operations' },
                { label: 'HR', value: 'HR' },
                { label: 'Security', value: 'Security' }
            ]
        },
        {
            label: 'Status',
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
                { label: 'All Status', value: 'ALL' },
                { label: 'Active', value: 'ACTIVE' },
                { label: 'Inactive', value: 'INACTIVE' }
            ]
        }
    ];

    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.isActive).length;
    const inactiveUsers = users.filter(u => !u.isActive).length;
    const adminUsers = users.filter(u => u.role === 'ADMIN').length;

    return (
        <PageLayout>
            <TopBar
                title="User Management"
                subtitle="Add, edit, disable, and assign roles to system users"
                actions={
                    <div className="flex gap-2">
                        <ActionButton variant="primary" size="sm" icon={Plus} onClick={() => setAddModal(true)}>
                            Add User
                        </ActionButton>
                        <ActionButton variant="outline" size="sm" icon={Download} onClick={handleExport}>
                            Export
                        </ActionButton>
                    </div>
                }
            />

            <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard title="Total Users" value={totalUsers.toString()} icon={Users} iconColor={theme.primary} />
                    <StatCard title="Active Users" value={activeUsers.toString()} icon={UserCheck} iconColor="#10B981" />
                    <StatCard title="Inactive Users" value={inactiveUsers.toString()} icon={UserX} iconColor="#f59e0b" />
                    <StatCard title="Administrators" value={adminUsers.toString()} icon={Shield} iconColor="#dc2626" />
                </div>

                <SearchFilter
                    searchValue={searchTerm}
                    onSearchChange={(value) => { setSearchTerm(value); handleFilterChange(); }}
                    searchPlaceholder="Search by name or email..."
                    filters={filters}
                />

                <DataTable
                    title={`All Users (${filteredUsers.length})`}
                    columns={userColumns}
                    data={paginatedUsers}
                    emptyMessage="No users found matching your filters."
                />

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 rounded-lg" style={{ backgroundColor: theme.card, border: `1px solid ${theme.cardBorder}` }}>
                        <div style={{ fontSize: fonts.body.sm.size, color: theme.foregroundMuted }}>
                            Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
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

            {/* View User Modal */}
            {viewModal.isOpen && viewModal.user && (
                <div className="fixed inset-0 z-[9998] flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setViewModal({ isOpen: false, user: null })} />
                    <div className="relative rounded-2xl shadow-2xl w-full max-w-2xl mx-4 p-6 max-h-[90vh] overflow-y-auto" style={{ backgroundColor: theme.card, borderColor: theme.cardBorder, border: '1px solid' }}>
                        <button onClick={() => setViewModal({ isOpen: false, user: null })} className="absolute top-4 right-4 p-1 rounded-lg transition-colors" style={{ color: theme.foregroundMuted }}>
                            <X className="w-5 h-5" />
                        </button>
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold" style={{ color: theme.foreground }}>{viewModal.user.firstName} {viewModal.user.lastName}</h3>
                                <div className="flex items-center space-x-2">
                                    {getRoleBadge(viewModal.user.role)}
                                    {getStatusBadge(viewModal.user.isActive)}
                                </div>
                            </div>
                            <div className="space-y-3 mb-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p style={{ fontSize: fonts.body.sm.size, color: theme.foregroundMuted }}>Email</p>
                                        <p style={{ fontSize: fonts.body.regular.size, color: theme.foreground }}>{viewModal.user.email}</p>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: fonts.body.sm.size, color: theme.foregroundMuted }}>Department</p>
                                        <p style={{ fontSize: fonts.body.regular.size, color: theme.foreground }}>{viewModal.user.department}</p>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: fonts.body.sm.size, color: theme.foregroundMuted }}>User ID</p>
                                        <p style={{ fontSize: fonts.body.regular.size, color: theme.foreground }}>{viewModal.user.id}</p>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: fonts.body.sm.size, color: theme.foregroundMuted }}>Created</p>
                                        <p style={{ fontSize: fonts.body.regular.size, color: theme.foreground }}>{new Date(viewModal.user.createdAt).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <ActionButton variant="outline" size="md" icon={Edit} onClick={() => {
                                    setFormData({
                                        firstName: viewModal.user.firstName,
                                        lastName: viewModal.user.lastName,
                                        email: viewModal.user.email,
                                        role: viewModal.user.role,
                                        department: viewModal.user.department,
                                        isActive: viewModal.user.isActive
                                    });
                                    setViewModal({ isOpen: false, user: null });
                                    setEditModal({ isOpen: true, user: viewModal.user });
                                }}>
                                    Edit User
                                </ActionButton>
                                <ActionButton variant="outline" size="md" icon={Shield} onClick={() => {
                                    setViewModal({ isOpen: false, user: null });
                                    setRoleModal({ isOpen: true, user: viewModal.user });
                                }}>
                                    Change Role
                                </ActionButton>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add User Modal */}
            {addModal && (
                <div className="fixed inset-0 z-[9998] flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setAddModal(false)} />
                    <div className="relative rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6" style={{ backgroundColor: theme.card, borderColor: theme.cardBorder, border: '1px solid' }}>
                        <button onClick={() => setAddModal(false)} className="absolute top-4 right-4 p-1 rounded-lg transition-colors" style={{ color: theme.foregroundMuted }}>
                            <X className="w-5 h-5" />
                        </button>
                        <h3 className="text-lg font-bold mb-4 flex items-center" style={{ color: theme.foreground }}>
                            <Plus className="h-5 w-5 mr-2" />
                            Add New User
                        </h3>
                        <div className="space-y-4 mb-6">
                            <Input
                                label="First Name"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                placeholder="Enter first name"
                            />
                            <Input
                                label="Last Name"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                placeholder="Enter last name"
                            />
                            <Input
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="Enter email address"
                            />
                            <div>
                                <label style={{ fontSize: fonts.body.sm.size, color: theme.foregroundMuted, marginBottom: '8px', display: 'block' }}>Role</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg"
                                    style={{
                                        backgroundColor: theme.backgroundSecondary,
                                        color: theme.foreground,
                                        border: `1px solid ${theme.cardBorder}`,
                                        fontSize: fonts.body.regular.size
                                    }}
                                >
                                    <option value="EMPLOYEE">Employee</option>
                                    <option value="AGENT">Agent</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ fontSize: fonts.body.sm.size, color: theme.foregroundMuted, marginBottom: '8px', display: 'block' }}>Department</label>
                                <select
                                    value={formData.department}
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg"
                                    style={{
                                        backgroundColor: theme.backgroundSecondary,
                                        color: theme.foreground,
                                        border: `1px solid ${theme.cardBorder}`,
                                        fontSize: fonts.body.regular.size
                                    }}
                                >
                                    <option value="IT Support">IT Support</option>
                                    <option value="Operations">Operations</option>
                                    <option value="HR">HR</option>
                                    <option value="Security">Security</option>
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
                                onClick={handleAddUser}
                                disabled={!formData.firstName || !formData.lastName || !formData.email}
                            >
                                Add User
                            </ActionButton>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {editModal.isOpen && editModal.user && (
                <div className="fixed inset-0 z-[9998] flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setEditModal({ isOpen: false, user: null })} />
                    <div className="relative rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6" style={{ backgroundColor: theme.card, borderColor: theme.cardBorder, border: '1px solid' }}>
                        <button onClick={() => setEditModal({ isOpen: false, user: null })} className="absolute top-4 right-4 p-1 rounded-lg transition-colors" style={{ color: theme.foregroundMuted }}>
                            <X className="w-5 h-5" />
                        </button>
                        <h3 className="text-lg font-bold mb-4 flex items-center" style={{ color: theme.foreground }}>
                            <Edit className="h-5 w-5 mr-2" />
                            Edit User
                        </h3>
                        <div className="space-y-4 mb-6">
                            <Input
                                label="First Name"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                placeholder="Enter first name"
                            />
                            <Input
                                label="Last Name"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                placeholder="Enter last name"
                            />
                            <Input
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="Enter email address"
                            />
                            <div>
                                <label style={{ fontSize: fonts.body.sm.size, color: theme.foregroundMuted, marginBottom: '8px', display: 'block' }}>Department</label>
                                <select
                                    value={formData.department}
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg"
                                    style={{
                                        backgroundColor: theme.backgroundSecondary,
                                        color: theme.foreground,
                                        border: `1px solid ${theme.cardBorder}`,
                                        fontSize: fonts.body.regular.size
                                    }}
                                >
                                    <option value="IT Support">IT Support</option>
                                    <option value="Operations">Operations</option>
                                    <option value="HR">HR</option>
                                    <option value="Security">Security</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <ActionButton variant="outline" size="md" onClick={() => setEditModal({ isOpen: false, user: null })}>
                                Cancel
                            </ActionButton>
                            <ActionButton
                                variant="primary"
                                size="md"
                                onClick={handleEditUser}
                                disabled={!formData.firstName || !formData.lastName || !formData.email}
                            >
                                Save Changes
                            </ActionButton>
                        </div>
                    </div>
                </div>
            )}

            {/* Change Role Modal */}
            {roleModal.isOpen && roleModal.user && (
                <div className="fixed inset-0 z-[9998] flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setRoleModal({ isOpen: false, user: null })} />
                    <div className="relative rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6" style={{ backgroundColor: theme.card, borderColor: theme.cardBorder, border: '1px solid' }}>
                        <button onClick={() => setRoleModal({ isOpen: false, user: null })} className="absolute top-4 right-4 p-1 rounded-lg transition-colors" style={{ color: theme.foregroundMuted }}>
                            <X className="w-5 h-5" />
                        </button>
                        <h3 className="text-lg font-bold mb-4 flex items-center" style={{ color: theme.foreground }}>
                            <Shield className="h-5 w-5 mr-2" />
                            Change User Role
                        </h3>
                        <p className="mb-6" style={{ fontSize: fonts.body.regular.size, color: theme.foregroundMuted }}>
                            Select a new role for {roleModal.user.firstName} {roleModal.user.lastName}
                        </p>
                        <div className="space-y-3 mb-6">
                            {['ADMIN', 'AGENT', 'EMPLOYEE'].map(role => (
                                <button
                                    key={role}
                                    onClick={() => handleRoleChange(roleModal.user.id, role)}
                                    className="w-full p-3 rounded-lg text-left transition-colors"
                                    style={{
                                        backgroundColor: roleModal.user.role === role ? theme.backgroundSecondary : 'transparent',
                                        border: `1px solid ${roleModal.user.role === role ? theme.primary : theme.cardBorder}`,
                                        color: theme.foreground
                                    }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-medium" style={{ fontSize: fonts.body.regular.size }}>{role}</div>
                                            <div style={{ fontSize: fonts.body.sm.size, color: theme.foregroundMuted }}>
                                                {role === 'ADMIN' && 'Full system access and user management'}
                                                {role === 'AGENT' && 'Handle and resolve support tickets'}
                                                {role === 'EMPLOYEE' && 'Submit and track tickets'}
                                            </div>
                                        </div>
                                        {roleModal.user.role === role && (
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.primary }} />
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Disable User Confirmation */}
            <ConfirmationDialog
                isOpen={disableDialog.isOpen}
                title="Disable User"
                message={disableDialog.user ? `Are you sure you want to disable ${disableDialog.user.firstName} ${disableDialog.user.lastName}? This will prevent them from accessing the system.` : ''}
                confirmText="Disable"
                variant="warning"
                onConfirm={handleDisable}
                onCancel={() => setDisableDialog({ isOpen: false, user: null })}
            />

            {/* Enable User Confirmation */}
            <ConfirmationDialog
                isOpen={enableDialog.isOpen}
                title="Enable User"
                message={enableDialog.user ? `Are you sure you want to enable ${enableDialog.user.firstName} ${enableDialog.user.lastName}? This will allow them to access the system.` : ''}
                confirmText="Enable"
                variant="default"
                onConfirm={handleEnable}
                onCancel={() => setEnableDialog({ isOpen: false, user: null })}
            />
        </PageLayout>
    );
}

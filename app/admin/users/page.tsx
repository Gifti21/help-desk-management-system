'use client';

import { useState, useEffect } from 'react';
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
    ChevronRight,
    Loader2
} from 'lucide-react';
import {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    type User
} from '@/lib/api/users';
import { getDepartments, type Department } from '@/lib/api/departments';

export default function UsersPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');
    const [departmentFilter, setDepartmentFilter] = useState('ALL');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [users, setUsers] = useState<User[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [actionsMenuOpen, setActionsMenuOpen] = useState<string | null>(null);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const itemsPerPage = 5;

    // Modals state
    const [viewModal, setViewModal] = useState<{ isOpen: boolean; user: User | null }>({ isOpen: false, user: null });
    const [editModal, setEditModal] = useState<{ isOpen: boolean; user: User | null }>({ isOpen: false, user: null });
    const [roleModal, setRoleModal] = useState<{ isOpen: boolean; user: User | null }>({ isOpen: false, user: null });
    const [disableDialog, setDisableDialog] = useState<{ isOpen: boolean; user: User | null }>({ isOpen: false, user: null });
    const [enableDialog, setEnableDialog] = useState<{ isOpen: boolean; user: User | null }>({ isOpen: false, user: null });
    const [addModal, setAddModal] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'employee' as 'admin' | 'agent' | 'employee',
        departmentId: '',
        isActive: true
    });

    const { colors: theme } = useTheme();
    const { toast } = useToast();

    // Load data from API on mount
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setIsLoadingData(true);
            const [usersData, deptData] = await Promise.all([
                getUsers(),
                getDepartments()
            ]);
            setUsers(usersData);
            setDepartments(deptData);
            if (deptData.length > 0) {
                setFormData(prev => ({ ...prev, departmentId: deptData[0].id }));
            }
        } catch (error) {
            console.error('Failed to load data:', error);
            toast('Failed to load data', 'error');
        } finally {
            setIsLoadingData(false);
        }
    };

    // Filter users
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
        const matchesDepartment = departmentFilter === 'ALL' || user.department?.name === departmentFilter;
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

    // Handler functions - Connected to Backend API
    const handleAddUser = async () => {
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.departmentId) {
            toast('Please fill in all required fields', 'error');
            return;
        }

        if (formData.password.length < 6) {
            toast('Password must be at least 6 characters', 'error');
            return;
        }

        if (departments.length === 0) {
            toast('Departments not loaded. Please refresh the page.', 'error');
            return;
        }

        try {
            setIsSubmitting(true);
            console.log('Creating user with data:', {
                ...formData,
                password: '[HIDDEN]'
            });

            const newUser = await createUser({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                role: formData.role,
                departmentId: formData.departmentId,
                isActive: formData.isActive
            });

            setUsers(prev => [...prev, newUser]);
            setAddModal(false);
            setFormData({ firstName: '', lastName: '', email: '', password: '', role: 'employee', departmentId: departments[0]?.id || '', isActive: true });
            toast(`User ${newUser.firstName} ${newUser.lastName} registered successfully`, 'success');
        } catch (error: any) {
            console.error('Failed to create user:', error);
            toast(error.message || 'Failed to register user', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditUser = async () => {
        if (!editModal.user) return;

        try {
            setIsSubmitting(true);
            const updateData: any = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                role: formData.role,
                departmentId: formData.departmentId,
                isActive: formData.isActive
            };
            if (formData.password) {
                updateData.password = formData.password;
            }

            const updatedUser = await updateUser(editModal.user.id, updateData);
            setUsers(prev => prev.map(u => u.id === editModal.user!.id ? updatedUser : u));
            setEditModal({ isOpen: false, user: null });
            toast(`User ${updatedUser.firstName} ${updatedUser.lastName} updated successfully`, 'success');
        } catch (error: any) {
            toast(error.message || 'Failed to update user', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRoleChange = async (userId: string, newRole: string) => {
        try {
            setIsSubmitting(true);
            const updatedUser = await updateUser(userId, { role: newRole.toLowerCase() as 'admin' | 'agent' | 'employee' });
            setUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
            setRoleModal({ isOpen: false, user: null });
            toast(`User role updated to ${newRole}`, 'success');
        } catch (error: any) {
            toast(error.message || 'Failed to update role', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDisable = async () => {
        if (!disableDialog.user) return;

        try {
            setIsSubmitting(true);
            const updatedUser = await updateUser(disableDialog.user.id, { isActive: false });
            setUsers(prev => prev.map(u => u.id === disableDialog.user!.id ? updatedUser : u));
            setDisableDialog({ isOpen: false, user: null });
            toast(`User ${updatedUser.firstName} ${updatedUser.lastName} disabled successfully`, 'success');
        } catch (error: any) {
            toast(error.message || 'Failed to disable user', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEnable = async () => {
        if (!enableDialog.user) return;

        try {
            setIsSubmitting(true);
            const updatedUser = await updateUser(enableDialog.user.id, { isActive: true });
            setUsers(prev => prev.map(u => u.id === enableDialog.user!.id ? updatedUser : u));
            setEnableDialog({ isOpen: false, user: null });
            toast(`User ${updatedUser.firstName} ${updatedUser.lastName} enabled successfully`, 'success');
        } catch (error: any) {
            toast(error.message || 'Failed to enable user', 'error');
        } finally {
            setIsSubmitting(false);
        }
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
            render: (value: any, row: any) => <span style={{ fontSize: fonts.body.sm.size, color: theme.foreground }}>{row.department?.name || 'N/A'}</span>
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
                                            password: '',
                                            role: row.role.toLowerCase() as 'admin' | 'agent' | 'employee',
                                            departmentId: row.departmentId,
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
                ...departments.map(dept => ({ label: dept.name, value: dept.name }))
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

    // Show loading state
    if (isLoadingData) {
        return (
            <PageLayout>
                <div className="flex items-center justify-center h-screen">
                    <Loader2 className="h-8 w-8 animate-spin" style={{ color: theme.primary }} />
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout>
            <TopBar
                title="User Management"
                subtitle="Add, edit, disable, and assign roles to system users"
                actions={
                    <div className="flex gap-2">
                        <ActionButton variant="primary" size="sm" icon={Plus} onClick={() => {
                            setFormData({ firstName: '', lastName: '', email: '', password: '', role: 'employee', departmentId: departments[0]?.id || '', isActive: true });
                            setAddModal(true);
                        }}>
                            Register User
                        </ActionButton>
                        <ActionButton variant="outline" size="sm" icon={Download} onClick={handleExport}>
                            Export
                        </ActionButton>
                    </div>
                }
            />

            <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="animate-slideInLeft" style={{ animationDelay: '100ms' }}>
                        <StatCard title="Total Users" value={totalUsers.toString()} icon={Users} iconColor={theme.primary} />
                    </div>
                    <div className="animate-slideInLeft" style={{ animationDelay: '200ms' }}>
                        <StatCard title="Active Users" value={activeUsers.toString()} icon={UserCheck} iconColor="#10B981" />
                    </div>
                    <div className="animate-slideInLeft" style={{ animationDelay: '300ms' }}>
                        <StatCard title="Inactive Users" value={inactiveUsers.toString()} icon={UserX} iconColor="#f59e0b" />
                    </div>
                    <div className="animate-slideInLeft" style={{ animationDelay: '400ms' }}>
                        <StatCard title="Administrators" value={adminUsers.toString()} icon={Shield} iconColor="#dc2626" />
                    </div>
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
                                        <p style={{ fontSize: fonts.body.regular.size, color: theme.foreground }}>{viewModal.user.department?.name || 'N/A'}</p>
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
                                    if (viewModal.user) {
                                        setFormData({
                                            firstName: viewModal.user.firstName,
                                            lastName: viewModal.user.lastName,
                                            email: viewModal.user.email,
                                            password: '',
                                            role: viewModal.user.role.toLowerCase() as 'admin' | 'agent' | 'employee',
                                            departmentId: viewModal.user.departmentId,
                                            isActive: viewModal.user.isActive
                                        });
                                        setViewModal({ isOpen: false, user: null });
                                        setEditModal({ isOpen: true, user: viewModal.user });
                                    }
                                }}>
                                    Edit User
                                </ActionButton>
                                <ActionButton variant="outline" size="md" icon={Shield} onClick={() => {
                                    if (viewModal.user) {
                                        setViewModal({ isOpen: false, user: null });
                                        setRoleModal({ isOpen: true, user: viewModal.user });
                                    }
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
                    <div className="relative rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 max-h-[90vh] overflow-y-auto" style={{ backgroundColor: theme.card, borderColor: theme.cardBorder, border: '1px solid' }}>
                        <button onClick={() => setAddModal(false)} className="absolute top-4 right-4 p-1 rounded-lg transition-colors" style={{ color: theme.foregroundMuted }}>
                            <X className="w-5 h-5" />
                        </button>
                        <h3 className="text-lg font-bold mb-2 flex items-center" style={{ color: theme.foreground }}>
                            <Plus className="h-5 w-5 mr-2" />
                            Register New User
                        </h3>
                        <p className="mb-4" style={{ fontSize: fonts.body.sm.size, color: theme.foregroundMuted }}>
                            Create a new user account with login credentials. The email and password will be used for system login.
                        </p>

                        <div className="space-y-4 mb-6">
                            <Input
                                label="First Name"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                placeholder="Enter first name"
                                required
                            />
                            <Input
                                label="Last Name"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                placeholder="Enter last name"
                                required
                            />

                            {/* Login Credentials Section */}
                            <div className="p-3 rounded-lg" style={{ backgroundColor: theme.backgroundSecondary, border: `1px solid ${theme.cardBorder}` }}>
                                <p className="font-medium mb-2" style={{ fontSize: fonts.body.sm.size, color: theme.foreground }}>
                                    🔐 Login Credentials (Required)
                                </p>
                                <p style={{ fontSize: fonts.body.xs.size, color: theme.foregroundMuted, marginBottom: '12px' }}>
                                    These credentials will be used to log into the system
                                </p>

                                <div className="space-y-3">
                                    <Input
                                        label="Email Address"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="user@besys.com"
                                        required
                                    />
                                    <Input
                                        label="Password"
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        placeholder="Minimum 6 characters"
                                        required
                                    />
                                    {formData.password && formData.password.length < 6 && (
                                        <p style={{ fontSize: fonts.body.xs.size, color: '#EF4444' }}>
                                            Password must be at least 6 characters
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label style={{ fontSize: fonts.body.sm.size, color: theme.foregroundMuted, marginBottom: '8px', display: 'block' }}>Role</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'agent' | 'employee' })}
                                    className="w-full px-3 py-2 rounded-lg"
                                    style={{
                                        backgroundColor: theme.backgroundSecondary,
                                        color: theme.foreground,
                                        border: `1px solid ${theme.cardBorder}`,
                                        fontSize: fonts.body.regular.size
                                    }}
                                >
                                    <option value="employee">Employee - Submit and track tickets</option>
                                    <option value="agent">Agent - Handle and resolve tickets</option>
                                    <option value="admin">Admin - Full system access</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ fontSize: fonts.body.sm.size, color: theme.foregroundMuted, marginBottom: '8px', display: 'block' }}>Department</label>
                                {departments.length === 0 ? (
                                    <div className="p-3 rounded-lg" style={{ backgroundColor: '#FEF3C7', border: '1px solid #F59E0B', color: '#92400E' }}>
                                        <p style={{ fontSize: fonts.body.sm.size }}>⚠️ No departments available. Please refresh the page.</p>
                                    </div>
                                ) : (
                                    <select
                                        value={formData.departmentId}
                                        onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                                        className="w-full px-3 py-2 rounded-lg"
                                        style={{
                                            backgroundColor: theme.backgroundSecondary,
                                            color: theme.foreground,
                                            border: `1px solid ${theme.cardBorder}`,
                                            fontSize: fonts.body.regular.size
                                        }}
                                    >
                                        {departments.map(dept => (
                                            <option key={dept.id} value={dept.id}>{dept.name}</option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            <div className="flex items-center gap-2 p-3 rounded-lg" style={{ backgroundColor: theme.backgroundSecondary }}>
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-4 h-4"
                                    style={{ accentColor: theme.primary }}
                                />
                                <label htmlFor="isActive" style={{ fontSize: fonts.body.sm.size, color: theme.foreground }}>
                                    Active - User can log in immediately
                                </label>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <ActionButton variant="outline" size="md" onClick={() => setAddModal(false)} disabled={isSubmitting}>
                                Cancel
                            </ActionButton>
                            <ActionButton
                                variant="primary"
                                size="md"
                                onClick={handleAddUser}
                                disabled={
                                    isSubmitting ||
                                    !formData.firstName ||
                                    !formData.lastName ||
                                    !formData.email ||
                                    !formData.password ||
                                    formData.password.length < 6 ||
                                    !formData.departmentId ||
                                    departments.length === 0
                                }
                            >
                                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Register User'}
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
                                required
                            />
                            <Input
                                label="Last Name"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                required
                            />
                            <Input
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                            <Input
                                label="Password (leave blank to keep current)"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                            <div>
                                <label style={{ fontSize: fonts.body.sm.size, color: theme.foregroundMuted, display: 'block', marginBottom: '8px' }}>
                                    Role
                                </label>
                                <select
                                    value={formData.role.toLowerCase()}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'agent' | 'employee' })}
                                    className="w-full px-3 py-2 rounded-lg border"
                                    style={{ backgroundColor: theme.background, color: theme.foreground, borderColor: theme.cardBorder }}
                                >
                                    <option value="employee">Employee</option>
                                    <option value="agent">Agent</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ fontSize: fonts.body.sm.size, color: theme.foregroundMuted, display: 'block', marginBottom: '8px' }}>
                                    Department
                                </label>
                                <select
                                    value={formData.departmentId}
                                    onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border"
                                    style={{ backgroundColor: theme.background, color: theme.foreground, borderColor: theme.cardBorder }}
                                >
                                    {departments.map(dept => (
                                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-4 h-4"
                                />
                                <label style={{ fontSize: fonts.body.sm.size, color: theme.foreground }}>
                                    Active User
                                </label>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <ActionButton variant="outline" size="md" onClick={() => setEditModal({ isOpen: false, user: null })} disabled={isSubmitting}>
                                Cancel
                            </ActionButton>
                            <ActionButton variant="primary" size="md" onClick={handleEditUser} disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Changes'}
                            </ActionButton>
                        </div>
                    </div>
                </div>
            )
            }

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
                                    onClick={() => handleRoleChange(roleModal.user!.id, role)}
                                    disabled={isSubmitting}
                                    className="w-full p-3 rounded-lg text-left transition-colors disabled:opacity-50"
                                    style={{
                                        backgroundColor: roleModal.user!.role === role ? theme.backgroundSecondary : 'transparent',
                                        border: `1px solid ${roleModal.user!.role === role ? theme.primary : theme.cardBorder}`,
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
                                        {roleModal.user!.role === role && (
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.primary }} />
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )
            }

            {/* Disable User Confirmation */}
            <ConfirmationDialog
                isOpen={disableDialog.isOpen}
                title="Disable User"
                message={disableDialog.user ? `Are you sure you want to disable ${disableDialog.user.firstName} ${disableDialog.user.lastName}? This will prevent them from accessing the system.` : ''}
                confirmLabel="Disable"
                variant="warning"
                onConfirm={handleDisable}
                onClose={() => setDisableDialog({ isOpen: false, user: null })}
            />

            {/* Enable User Confirmation */}
            <ConfirmationDialog
                isOpen={enableDialog.isOpen}
                title="Enable User"
                message={enableDialog.user ? `Are you sure you want to enable ${enableDialog.user.firstName} ${enableDialog.user.lastName}? This will allow them to access the system.` : ''}
                confirmLabel="Enable"
                variant="default"
                onConfirm={handleEnable}
                onClose={() => setEnableDialog({ isOpen: false, user: null })}
            />
        </PageLayout >
    );
}
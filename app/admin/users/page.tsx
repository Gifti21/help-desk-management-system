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
import { useTheme } from '../../../components/providers/ThemeProvider';
import { useToast } from '../../../components/ui/toast';
import { fonts } from '@/lib/fonts';
import { Users, Shield, UserX, Plus, Eye, Edit2, UserCog, Ban, X, Save, CheckCircle, Trash2, Download } from 'lucide-react';

const initialMockUsers = [
    { id: 'user-1', name: 'Alemayehu Tadesse', email: 'alemayehu.tadesse@besys.com.et', role: 'ADMIN', department: 'IT Support', phone: '+251 91 234 5678', location: 'Addis Ababa, Ethiopia', status: 'active', lastActive: 'Active 2m ago', createdAt: '2024-01-15' },
    { id: 'user-2', name: 'Selam Yohannes', email: 'selam.yohannes@besys.com.et', role: 'AGENT', department: 'Customer Support', phone: '+251 91 345 6789', location: 'Bahir Dar, Ethiopia', status: 'active', lastActive: 'Active 15m ago', createdAt: '2024-02-20' },
    { id: 'user-3', name: 'Dawit Hailu', email: 'dawit.hailu@besys.com.et', role: 'AGENT', department: 'Operations', phone: '+251 91 456 7890', location: 'Hawassa, Ethiopia', status: 'active', lastActive: 'Active 1h ago', createdAt: '2024-03-10' },
    { id: 'user-4', name: 'Tigist Bekele', email: 'tigist.bekele@besys.com.et', role: 'EMPLOYEE', department: 'HR', phone: '+251 91 567 8901', location: 'Mekelle, Ethiopia', status: 'inactive', lastActive: 'Active 2d ago', createdAt: '2024-01-25' },
    { id: 'user-5', name: 'Bereket Mekonnen', email: 'bereket.mekonnen@besys.com.et', role: 'EMPLOYEE', department: 'Finance', phone: '+251 91 678 9012', location: 'Dire Dawa, Ethiopia', status: 'active', lastActive: 'Active 30m ago', createdAt: '2024-04-05' }
];

export default function UsersPage() {
    const { colors: theme } = useTheme();
    const { toast } = useToast();
    const [users, setUsers] = useState(initialMockUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [departmentFilter, setDepartmentFilter] = useState('ALL');
    const [viewModal, setViewModal] = useState<{ isOpen: boolean; user: any }>({ isOpen: false, user: null });
    const [addModal, setAddModal] = useState(false);
    const [editModal, setEditModal] = useState<{ isOpen: boolean; user: any }>({ isOpen: false, user: null });
    const [roleModal, setRoleModal] = useState<{ isOpen: boolean; user: any }>({ isOpen: false, user: null });
    const [disableDialog, setDisableDialog] = useState<{ isOpen: boolean; user: any }>({ isOpen: false, user: null });
    const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; user: any }>({ isOpen: false, user: null });
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', role: 'EMPLOYEE', department: '', location: '', status: 'active' });

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
        const matchesStatus = statusFilter === 'ALL' || user.status === statusFilter;
        const matchesDepartment = departmentFilter === 'ALL' || user.department === departmentFilter;
        return matchesSearch && matchesRole && matchesStatus && matchesDepartment;
    });

    const handleAddUser = () => {
        if (!formData.name || !formData.email || !formData.department || !formData.phone || !formData.location) { toast('Please fill all required fields', 'error'); return; }
        const newUser = { id: `user-${Date.now()}`, name: formData.name, email: formData.email, phone: formData.phone, department: formData.department, location: formData.location, role: 'EMPLOYEE', status: 'active', lastActive: 'Just created', createdAt: new Date().toISOString().split('T')[0] };
        setUsers(prev => [...prev, newUser]);
        setAddModal(false);
        setFormData({ name: '', email: '', phone: '', role: 'EMPLOYEE', department: '', location: '', status: 'active' });
        toast(`User ${formData.name} added successfully`, 'success');
    };

    const handleEditUser = () => {
        if (!editModal.user || !formData.name || !formData.email || !formData.department || !formData.phone || !formData.location) { toast('Please fill all required fields', 'error'); return; }
        setUsers(prev => prev.map(u => u.id === editModal.user.id ? { ...u, name: formData.name, email: formData.email, phone: formData.phone, department: formData.department, location: formData.location, status: formData.status } : u));
        setEditModal({ isOpen: false, user: null });
        toast(`User ${formData.name} updated successfully`, 'success');
    };

    const handleRoleChange = (userId: string, newRole: string) => {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
        setRoleModal({ isOpen: false, user: null });
        toast(`Role updated to ${newRole}`, 'success');
    };

    const handleDisableUser = () => {
        if (!disableDialog.user) return;
        const newStatus = disableDialog.user.status === 'active' ? 'inactive' : 'active';
        setUsers(prev => prev.map(u => u.id === disableDialog.user.id ? { ...u, status: newStatus } : u));
        setDisableDialog({ isOpen: false, user: null });
        toast(`User ${newStatus === 'inactive' ? 'disabled' : 'enabled'} successfully`, 'success');
    };

    const handleDeleteUser = (userId: string) => {
        setUsers(prev => prev.filter(u => u.id !== userId));
        toast('User deleted successfully', 'success');
    };

    const handleExportData = () => {
        const headers = ['ID', 'Name', 'Email', 'Role', 'Department', 'Phone', 'Location', 'Status', 'Last Active', 'Created'];
        const csvData = filteredUsers.map(user => [
            user.id,
            user.name,
            user.email,
            user.role,
            user.department,
            user.phone,
            user.location,
            user.status,
            user.lastActive,
            user.createdAt
        ]);
        const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        toast('User data exported successfully', 'success');
    };

    const openAddModal = () => { setFormData({ name: '', email: '', phone: '', role: 'EMPLOYEE', department: '', location: '', status: 'active' }); setAddModal(true); };
    const openEditModal = (user: any) => { setFormData({ name: user.name, email: user.email, phone: user.phone, role: user.role, department: user.department, location: user.location, status: user.status }); setEditModal({ isOpen: true, user }); };

    const getRoleBadge = (role: string) => {
        const roleColors: Record<string, { bg: string; text: string }> = { 'ADMIN': { bg: '#dbeafe', text: '#1e40af' }, 'AGENT': { bg: '#e0e7ff', text: '#5b21b6' }, 'EMPLOYEE': { bg: '#f3f4f6', text: '#6b7280' } };
        const color = roleColors[role] || roleColors['EMPLOYEE'];
        return <span className="px-2 py-1 text-xs font-medium rounded border" style={{ backgroundColor: color.bg, color: color.text, fontSize: fonts.caption.small.size }}><Shield className="h-3 w-3 inline mr-1" />{role}</span>;
    };

    const getStatusBadge = (status: string) => status === 'active' ? <span className="px-2 py-1 text-xs font-medium rounded border" style={{ backgroundColor: '#dcfce7', color: '#15803d', fontSize: fonts.caption.small.size }}><CheckCircle className="h-3 w-3 inline mr-1" />Active</span> : <span className="px-2 py-1 text-xs font-medium rounded border" style={{ backgroundColor: '#fee2e2', color: '#dc2626', fontSize: fonts.caption.small.size }}><Ban className="h-3 w-3 inline mr-1" />Inactive</span>;

    const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

    const userColumns = [
        { key: 'name', title: 'Name', render: (value: string, row: any) => <div className="flex items-center"><div className="w-10 h-10 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: theme.accent }}><span className="font-semibold" style={{ color: theme.accentForeground, fontSize: fonts.body.sm.size }}>{getInitials(value)}</span></div><div><p className="font-medium" style={{ color: theme.foreground, fontSize: fonts.body.regular.size }}>{value}</p><p style={{ color: theme.foregroundMuted, fontSize: fonts.body.xs.size }}>{row.email}</p></div></div> },
        { key: 'role', title: 'Role', render: (value: string) => getRoleBadge(value) },
        { key: 'department', title: 'Department', render: (value: string) => <span style={{ color: theme.foreground, fontSize: fonts.body.sm.size }}>{value}</span> },
        { key: 'status', title: 'Status', render: (value: string) => getStatusBadge(value) },
        { key: 'lastActive', title: 'Last Active', render: (value: string) => <span style={{ color: theme.foregroundMuted, fontSize: fonts.body.xs.size }}>{value}</span> },
        { key: 'actions', title: 'Actions', render: (_: any, row: any) => <div className="flex items-center space-x-1"><ActionButton variant="ghost" size="sm" icon={Eye} onClick={() => setViewModal({ isOpen: true, user: row })}>View</ActionButton><ActionButton variant="ghost" size="sm" icon={Edit2} onClick={() => openEditModal(row)}>Edit</ActionButton><ActionButton variant="ghost" size="sm" icon={UserCog} onClick={() => setRoleModal({ isOpen: true, user: row })}>Role</ActionButton><ActionButton variant="ghost" size="sm" icon={Ban} onClick={() => setDisableDialog({ isOpen: true, user: row })}>{row.status === 'active' ? 'Disable' : 'Enable'}</ActionButton><ActionButton variant="ghost" size="sm" icon={Trash2} onClick={() => setDeleteDialog({ isOpen: true, user: row })}>Delete</ActionButton></div> }
    ];

    const filters = [
        { label: 'Role', value: roleFilter, onChange: setRoleFilter, options: [{ label: 'All Roles', value: 'ALL' }, { label: 'Admin', value: 'ADMIN' }, { label: 'Agent', value: 'AGENT' }, { label: 'Employee', value: 'EMPLOYEE' }] },
        { label: 'Status', value: statusFilter, onChange: setStatusFilter, options: [{ label: 'All Status', value: 'ALL' }, { label: 'Active', value: 'active' }, { label: 'Inactive', value: 'inactive' }] },
        { label: 'Department', value: departmentFilter, onChange: setDepartmentFilter, options: [{ label: 'All Departments', value: 'ALL' }, { label: 'IT Support', value: 'IT Support' }, { label: 'Customer Support', value: 'Customer Support' }, { label: 'Operations', value: 'Operations' }, { label: 'HR', value: 'HR' }, { label: 'Finance', value: 'Finance' }] }
    ];

    return (
        <PageLayout>
            <TopBar title="User Management" subtitle="Manage user accounts, roles, and permissions" actions={<div className="flex gap-2"><ActionButton variant="outline" size="sm" icon={Download} onClick={handleExportData}>Export Data</ActionButton><ActionButton variant="primary" size="sm" icon={Plus} onClick={openAddModal}>Add User</ActionButton></div>} />
            <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard title="Total Users" value={users.length.toString()} icon={Users} iconColor={theme.primary} />
                    <StatCard title="Active Users" value={users.filter(u => u.status === 'active').length.toString()} icon={CheckCircle} iconColor="#15803d" />
                    <StatCard title="Admins" value={users.filter(u => u.role === 'ADMIN').length.toString()} icon={Shield} iconColor="#2563eb" />
                    <StatCard title="Inactive" value={users.filter(u => u.status === 'inactive').length.toString()} icon={UserX} iconColor="#dc2626" />
                </div>
                <SearchFilter searchValue={searchTerm} onSearchChange={setSearchTerm} searchPlaceholder="Search by name or email..." filters={filters} />
                <DataTable title={`All Users (${filteredUsers.length})`} columns={userColumns} data={filteredUsers} emptyMessage="No users found matching your filters." />
            </div>

            {viewModal.isOpen && viewModal.user && <div className="fixed inset-0 z-[9998] flex items-center justify-center"><div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setViewModal({ isOpen: false, user: null })} /><div className="relative rounded-2xl shadow-2xl w-full max-w-2xl mx-4 p-6" style={{ backgroundColor: theme.card, borderColor: theme.cardBorder, border: '1px solid' }}><button onClick={() => setViewModal({ isOpen: false, user: null })} className="absolute top-4 right-4 p-1 rounded-lg" style={{ color: theme.foregroundMuted }}><X className="w-5 h-5" /></button><div className="mb-6"><div className="flex items-center mb-4"><div className="w-16 h-16 rounded-full flex items-center justify-center mr-4" style={{ backgroundColor: theme.accent }}><span className="text-2xl font-bold" style={{ color: theme.accentForeground }}>{getInitials(viewModal.user.name)}</span></div><div><h3 className="text-xl font-bold" style={{ color: theme.foreground }}>{viewModal.user.name}</h3><p style={{ color: theme.foregroundMuted, fontSize: fonts.body.sm.size }}>{viewModal.user.email}</p></div></div><div className="grid grid-cols-2 gap-4 mb-4"><div><p style={{ fontSize: fonts.body.sm.size, color: theme.foregroundMuted }}>Role</p><div className="mt-1">{getRoleBadge(viewModal.user.role)}</div></div><div><p style={{ fontSize: fonts.body.sm.size, color: theme.foregroundMuted }}>Status</p><div className="mt-1">{getStatusBadge(viewModal.user.status)}</div></div><div><p style={{ fontSize: fonts.body.sm.size, color: theme.foregroundMuted }}>Department</p><p style={{ fontSize: fonts.body.regular.size, color: theme.foreground }}>{viewModal.user.department}</p></div><div><p style={{ fontSize: fonts.body.sm.size, color: theme.foregroundMuted }}>Phone</p><p style={{ fontSize: fonts.body.regular.size, color: theme.foreground }}>{viewModal.user.phone}</p></div><div><p style={{ fontSize: fonts.body.sm.size, color: theme.foregroundMuted }}>Last Active</p><p style={{ fontSize: fonts.body.regular.size, color: theme.foreground }}>{viewModal.user.lastActive}</p></div><div><p style={{ fontSize: fonts.body.sm.size, color: theme.foregroundMuted }}>Created</p><p style={{ fontSize: fonts.body.regular.size, color: theme.foreground }}>{viewModal.user.createdAt}</p></div></div></div></div></div>}
            {addModal && <div className="fixed inset-0 z-[9998] flex items-center justify-center"><div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setAddModal(false)} /><div className="relative rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6" style={{ backgroundColor: theme.card, borderColor: theme.cardBorder, border: '1px solid' }}><button onClick={() => setAddModal(false)} className="absolute top-4 right-4 p-1 rounded-lg" style={{ color: theme.foregroundMuted }}><X className="w-5 h-5" /></button><h3 className="text-lg font-bold mb-4 flex items-center" style={{ color: theme.foreground }}><Plus className="h-5 w-5 mr-2" />Add New User</h3><div className="space-y-4"><div><label className="block mb-2" style={{ fontSize: fonts.body.sm.size, fontWeight: fonts.fontWeight.medium, color: theme.foregroundMuted }}>Full Name <span style={{ color: theme.error }}>*</span></label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Enter full name" style={{ backgroundColor: theme.background, color: theme.foreground, borderColor: theme.border }} /></div><div><label className="block mb-2" style={{ fontSize: fonts.body.sm.size, fontWeight: fonts.fontWeight.medium, color: theme.foregroundMuted }}>Email <span style={{ color: theme.error }}>*</span></label><Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="user@besys.com.et" style={{ backgroundColor: theme.background, color: theme.foreground, borderColor: theme.border }} /></div><div><label className="block mb-2" style={{ fontSize: fonts.body.sm.size, fontWeight: fonts.fontWeight.medium, color: theme.foregroundMuted }}>Phone <span style={{ color: theme.error }}>*</span></label><Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+251 91 234 5678" style={{ backgroundColor: theme.background, color: theme.foreground, borderColor: theme.border }} /></div><div><label className="block mb-2" style={{ fontSize: fonts.body.sm.size, fontWeight: fonts.fontWeight.medium, color: theme.foregroundMuted }}>Location <span style={{ color: theme.error }}>*</span></label><Input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="City, Ethiopia" style={{ backgroundColor: theme.background, color: theme.foreground, borderColor: theme.border }} /></div><div><label className="block mb-2" style={{ fontSize: fonts.body.sm.size, fontWeight: fonts.fontWeight.medium, color: theme.foregroundMuted }}>Department <span style={{ color: theme.error }}>*</span></label><Input value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} placeholder="Enter department" style={{ backgroundColor: theme.background, color: theme.foreground, borderColor: theme.border }} /></div><div className="p-3 rounded-lg" style={{ backgroundColor: theme.backgroundSecondary }}><p style={{ fontSize: fonts.body.sm.size, fontWeight: fonts.fontWeight.medium, color: theme.foregroundMuted, marginBottom: '8px' }}>Default Role</p><div className="flex items-center"><Shield className="h-4 w-4 mr-2" style={{ color: theme.primary }} /><span style={{ fontSize: fonts.body.regular.size, color: theme.foreground }}>EMPLOYEE</span></div><p style={{ fontSize: fonts.body.xs.size, color: theme.foregroundMuted, marginTop: '8px' }}>New users are assigned EMPLOYEE role by default. Use "Assign Role" after creation to change.</p></div></div><div className="flex gap-3 mt-6"><ActionButton variant="outline" size="md" onClick={() => setAddModal(false)}>Cancel</ActionButton><ActionButton variant="primary" size="md" icon={Save} onClick={handleAddUser}>Add User</ActionButton></div></div></div>}
            {editModal.isOpen && editModal.user && <div className="fixed inset-0 z-[9998] flex items-center justify-center"><div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setEditModal({ isOpen: false, user: null })} /><div className="relative rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6" style={{ backgroundColor: theme.card, borderColor: theme.cardBorder, border: '1px solid' }}><button onClick={() => setEditModal({ isOpen: false, user: null })} className="absolute top-4 right-4 p-1 rounded-lg" style={{ color: theme.foregroundMuted }}><X className="w-5 h-5" /></button><h3 className="text-lg font-bold mb-4 flex items-center" style={{ color: theme.foreground }}><Edit2 className="h-5 w-5 mr-2" />Edit User</h3><div className="space-y-4"><div><label className="block mb-2" style={{ fontSize: fonts.body.sm.size, fontWeight: fonts.fontWeight.medium, color: theme.foregroundMuted }}>Full Name <span style={{ color: theme.error }}>*</span></label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ backgroundColor: theme.background, color: theme.foreground, borderColor: theme.border }} /></div><div><label className="block mb-2" style={{ fontSize: fonts.body.sm.size, fontWeight: fonts.fontWeight.medium, color: theme.foregroundMuted }}>Email <span style={{ color: theme.error }}>*</span></label><Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} style={{ backgroundColor: theme.background, color: theme.foreground, borderColor: theme.border }} /></div><div><label className="block mb-2" style={{ fontSize: fonts.body.sm.size, fontWeight: fonts.fontWeight.medium, color: theme.foregroundMuted }}>Phone <span style={{ color: theme.error }}>*</span></label><Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} style={{ backgroundColor: theme.background, color: theme.foreground, borderColor: theme.border }} /></div><div><label className="block mb-2" style={{ fontSize: fonts.body.sm.size, fontWeight: fonts.fontWeight.medium, color: theme.foregroundMuted }}>Location <span style={{ color: theme.error }}>*</span></label><Input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} style={{ backgroundColor: theme.background, color: theme.foreground, borderColor: theme.border }} /></div><div><label className="block mb-2" style={{ fontSize: fonts.body.sm.size, fontWeight: fonts.fontWeight.medium, color: theme.foregroundMuted }}>Department <span style={{ color: theme.error }}>*</span></label><Input value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} style={{ backgroundColor: theme.background, color: theme.foreground, borderColor: theme.border }} /></div><div className="p-3 rounded-lg" style={{ backgroundColor: theme.backgroundSecondary }}><p style={{ fontSize: fonts.body.sm.size, fontWeight: fonts.fontWeight.medium, color: theme.foregroundMuted, marginBottom: '8px' }}>Current Role (Read-Only)</p>{getRoleBadge(editModal.user.role)}<p style={{ fontSize: fonts.body.xs.size, color: theme.foregroundMuted, marginTop: '8px' }}>Role cannot be edited here. Use "Assign Role" button to change user role.</p></div></div><div className="flex gap-3 mt-6"><ActionButton variant="outline" size="md" onClick={() => setEditModal({ isOpen: false, user: null })}>Cancel</ActionButton><ActionButton variant="primary" size="md" icon={Save} onClick={handleEditUser}>Save Changes</ActionButton></div></div></div>}
            {roleModal.isOpen && roleModal.user && <div className="fixed inset-0 z-[9998] flex items-center justify-center"><div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setRoleModal({ isOpen: false, user: null })} /><div className="relative rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6" style={{ backgroundColor: theme.card, borderColor: theme.cardBorder, border: '1px solid' }}><button onClick={() => setRoleModal({ isOpen: false, user: null })} className="absolute top-4 right-4 p-1 rounded-lg" style={{ color: theme.foregroundMuted }}><X className="w-5 h-5" /></button><h3 className="text-lg font-bold mb-4" style={{ color: theme.foreground }}>Assign Role - {roleModal.user.name}</h3><div className="space-y-2">{['ADMIN', 'AGENT', 'EMPLOYEE'].map(role => <button key={role} onClick={() => handleRoleChange(roleModal.user.id, role)} className="w-full p-3 rounded-lg text-left transition-colors flex items-center justify-between" style={{ backgroundColor: roleModal.user.role === role ? theme.accent : theme.backgroundSecondary }}><div className="flex items-center"><Shield className="h-4 w-4 mr-2" style={{ color: theme.foreground }} /><span style={{ color: theme.foreground }}>{role}</span></div>{roleModal.user.role === role && <CheckCircle className="h-4 w-4" style={{ color: theme.primary }} />}</button>)}</div></div></div>}
            <ConfirmationDialog isOpen={disableDialog.isOpen} onClose={() => setDisableDialog({ isOpen: false, user: null })} onConfirm={handleDisableUser} variant={disableDialog.user?.status === 'active' ? 'warning' : 'default'} title={disableDialog.user?.status === 'active' ? 'Disable User' : 'Enable User'} message={disableDialog.user?.status === 'active' ? `Are you sure you want to disable ${disableDialog.user?.name}? They will not be able to access the system.` : `Enable ${disableDialog.user?.name} to restore their access to the system?`} confirmLabel={disableDialog.user?.status === 'active' ? 'Disable User' : 'Enable User'} />
            <ConfirmationDialog isOpen={deleteDialog.isOpen} onClose={() => setDeleteDialog({ isOpen: false, user: null })} onConfirm={() => { if (deleteDialog.user) handleDeleteUser(deleteDialog.user.id); setDeleteDialog({ isOpen: false, user: null }); }} variant="danger" title="Delete User" message={`Are you sure you want to permanently delete ${deleteDialog.user?.name}? This action cannot be undone.`} confirmLabel="Delete User" />
        </PageLayout>
    );
}

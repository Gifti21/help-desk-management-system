'use client';

import React, { useState, useEffect } from 'react';
import { PageLayout } from '../../../components/admin/PageLayout';
import { TopBar } from '../../../components/admin/TopBar';
import { ActionButton } from '../../../components/admin/ActionButton';
import { Input } from '../../../components/ui/input';
import { Card } from '../../../components/ui/card';
import { useTheme } from '../../../components/providers/ThemeProvider';
import { useToast } from '../../../components/ui/toast';
import { fonts } from '@/lib/fonts';
import {
    User, Mail, MapPin, Shield, Edit, Save, Lock, X, Eye, EyeOff, Loader2, Building2
} from 'lucide-react';
import { getProfile, updateProfile, changePassword, type UserProfile } from '@/lib/api/profile';

export default function ProfilePage() {
    const { colors: theme } = useTheme();
    const { toast } = useToast();

    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [originalProfile, setOriginalProfile] = useState<UserProfile | null>(null);
    const [profile, setProfile] = useState({
        firstName: '',
        lastName: '',
        email: '',
        role: 'ADMIN',
        department: '',
    });
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Load profile from backend on mount
    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setIsLoading(true);
            const data = await getProfile();
            setOriginalProfile(data);
            setProfile({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                role: data.role,
                department: data.department?.name || 'N/A',
            });
        } catch (error) {
            console.error('Failed to load profile:', error);
            toast('Failed to load profile', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!profile.firstName.trim()) {
            toast('First name is required', 'error');
            return;
        }
        if (!profile.lastName.trim()) {
            toast('Last name is required', 'error');
            return;
        }
        if (!profile.email.trim()) {
            toast('Email is required', 'error');
            return;
        }
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(profile.email)) {
            toast('Please enter a valid email address', 'error');
            return;
        }

        try {
            setIsSaving(true);
            const updated = await updateProfile({
                firstName: profile.firstName,
                lastName: profile.lastName,
                email: profile.email
            });
            setOriginalProfile(updated);
            setProfile({
                firstName: updated.firstName,
                lastName: updated.lastName,
                email: updated.email,
                role: updated.role,
                department: updated.department?.name || 'N/A',
            });
            setIsEditing(false);
            toast('Profile updated successfully', 'success');
        } catch (error: any) {
            console.error('Failed to update profile:', error);
            toast(error.message || 'Failed to update profile', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        if (originalProfile) {
            setProfile({
                firstName: originalProfile.firstName,
                lastName: originalProfile.lastName,
                email: originalProfile.email,
                role: originalProfile.role,
                department: originalProfile.department?.name || 'N/A',
            });
        }
        setIsEditing(false);
        toast('Changes discarded', 'info');
    };

    const handlePasswordChange = async () => {
        if (!passwordData.currentPassword) {
            toast('Current password is required', 'error');
            return;
        }
        if (!passwordData.newPassword) {
            toast('New password is required', 'error');
            return;
        }
        if (passwordData.newPassword.length < 6) {
            toast('Password must be at least 6 characters', 'error');
            return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast('Passwords do not match', 'error');
            return;
        }

        try {
            setIsChangingPassword(true);
            await changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            setShowPasswordModal(false);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            toast('Password changed successfully', 'success');
        } catch (error: any) {
            console.error('Failed to change password:', error);
            toast(error.message || 'Failed to change password', 'error');
        } finally {
            setIsChangingPassword(false);
        }
    };

    const topBarActions = isEditing ? (
        <>
            <ActionButton variant="outline" size="sm" icon={X} onClick={handleCancel} disabled={isSaving}>Cancel</ActionButton>
            <ActionButton variant="primary" size="sm" icon={Save} onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
            </ActionButton>
        </>
    ) : (
        <ActionButton variant="primary" size="sm" icon={Edit} onClick={() => setIsEditing(true)}>Edit Profile</ActionButton>
    );

    // Show loading state
    if (isLoading) {
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
            <TopBar title="My Profile" subtitle="Manage your account settings and preferences" actions={topBarActions} />
            <div className="p-6 space-y-6">
                {/* Profile Header Card */}
                <Card className="shadow-sm transition-colors" style={{ backgroundColor: theme.card, borderColor: theme.cardBorder }}>
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                            <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ backgroundColor: theme.accent }}>
                                <span className="text-3xl font-bold" style={{ color: theme.accentForeground }}>
                                    {profile.firstName[0]}{profile.lastName[0]}
                                </span>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                    <h2 className="text-2xl font-bold" style={{ fontSize: fonts.heading.lg.size, fontWeight: fonts.heading.lg.weight, color: theme.foreground }}>
                                        {profile.firstName} {profile.lastName}
                                    </h2>
                                    <span className="px-3 py-1 text-sm font-medium rounded-full" style={{ backgroundColor: theme.accent, color: theme.accentForeground, fontSize: fonts.caption.regular.size }}>
                                        <Shield className="h-3 w-3 inline mr-1" />{profile.role}
                                    </span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                                    <span className="flex items-center" style={{ fontSize: fonts.body.sm.size, color: theme.foregroundMuted }}>
                                        <Mail className="h-4 w-4 mr-2" />{profile.email}
                                    </span>
                                    <span className="flex items-center" style={{ fontSize: fonts.body.sm.size, color: theme.foregroundMuted }}>
                                        <Building2 className="h-4 w-4 mr-2" />{profile.department}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
                {/* Personal Information Card */}
                <Card className="shadow-sm transition-colors" style={{ backgroundColor: theme.card, borderColor: theme.cardBorder }}>
                    <div className="p-6">
                        <h3 className="font-semibold mb-6 flex items-center" style={{ fontSize: fonts.heading.sm.size, fontWeight: fonts.heading.sm.weight, color: theme.foreground }}>
                            <User className="h-5 w-5 mr-2" />Personal Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block mb-2" style={{ fontSize: fonts.body.sm.size, fontWeight: fonts.fontWeight.medium, color: theme.foregroundMuted }}>
                                    First Name {isEditing && <span style={{ color: theme.error }}>*</span>}
                                </label>
                                <Input
                                    value={profile.firstName}
                                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                                    disabled={!isEditing}
                                    placeholder="Enter first name"
                                    style={{ backgroundColor: isEditing ? theme.background : theme.backgroundSecondary, color: theme.foreground, borderColor: theme.border }}
                                />
                            </div>
                            <div>
                                <label className="block mb-2" style={{ fontSize: fonts.body.sm.size, fontWeight: fonts.fontWeight.medium, color: theme.foregroundMuted }}>
                                    Last Name {isEditing && <span style={{ color: theme.error }}>*</span>}
                                </label>
                                <Input
                                    value={profile.lastName}
                                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                                    disabled={!isEditing}
                                    placeholder="Enter last name"
                                    style={{ backgroundColor: isEditing ? theme.background : theme.backgroundSecondary, color: theme.foreground, borderColor: theme.border }}
                                />
                            </div>
                            <div>
                                <label className="block mb-2" style={{ fontSize: fonts.body.sm.size, fontWeight: fonts.fontWeight.medium, color: theme.foregroundMuted }}>
                                    Email {isEditing && <span style={{ color: theme.error }}>*</span>}
                                </label>
                                <Input
                                    type="email"
                                    value={profile.email}
                                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                    disabled={!isEditing}
                                    placeholder="email@example.com"
                                    style={{ backgroundColor: isEditing ? theme.background : theme.backgroundSecondary, color: theme.foreground, borderColor: theme.border }}
                                />
                            </div>
                            <div>
                                <label className="block mb-2" style={{ fontSize: fonts.body.sm.size, fontWeight: fonts.fontWeight.medium, color: theme.foregroundMuted }}>
                                    Department <span style={{ color: theme.foregroundSubtle }}>(Read-only)</span>
                                </label>
                                <Input value={profile.department} disabled style={{ backgroundColor: theme.backgroundSecondary, color: theme.foregroundMuted, borderColor: theme.border, cursor: 'not-allowed' }} />
                            </div>
                            <div>
                                <label className="block mb-2" style={{ fontSize: fonts.body.sm.size, fontWeight: fonts.fontWeight.medium, color: theme.foregroundMuted }}>
                                    Role <span style={{ color: theme.foregroundSubtle }}>(Read-only)</span>
                                </label>
                                <Input value={profile.role} disabled style={{ backgroundColor: theme.backgroundSecondary, color: theme.foregroundMuted, borderColor: theme.border, cursor: 'not-allowed' }} />
                            </div>
                        </div>
                    </div>
                </Card>
                <Card className="shadow-sm transition-colors" style={{ backgroundColor: theme.card, borderColor: theme.cardBorder }}>
                    <div className="p-6">
                        <h3 className="font-semibold mb-6 flex items-center" style={{ fontSize: fonts.heading.sm.size, fontWeight: fonts.heading.sm.weight, color: theme.foreground }}>
                            <Lock className="h-5 w-5 mr-2" />Security
                        </h3>
                        <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: theme.backgroundSecondary }}>
                            <div>
                                <p className="font-medium mb-1" style={{ fontSize: fonts.body.regular.size, color: theme.foreground }}>Password</p>
                                <p style={{ fontSize: fonts.body.sm.size, color: theme.foregroundMuted }}>Change your account password</p>
                            </div>
                            <ActionButton variant="outline" size="sm" icon={Lock} onClick={() => setShowPasswordModal(true)}>Change Password</ActionButton>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Password Change Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 z-[9998] flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowPasswordModal(false)} />
                    <div className="relative rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6" style={{ backgroundColor: theme.card, borderColor: theme.cardBorder, border: '1px solid' }}>
                        <button
                            onClick={() => setShowPasswordModal(false)}
                            className="absolute top-4 right-4 p-1 rounded-lg transition-colors"
                            style={{ color: theme.foregroundMuted }}
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <div className="mb-6">
                            <h3 className="text-lg font-bold flex items-center" style={{ color: theme.foreground }}>
                                <Lock className="h-5 w-5 mr-2" />
                                Change Password
                            </h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block mb-2" style={{ fontSize: fonts.body.sm.size, fontWeight: fonts.fontWeight.medium, color: theme.foregroundMuted }}>
                                    Current Password <span style={{ color: theme.error }}>*</span>
                                </label>
                                <div className="relative">
                                    <Input
                                        type={showCurrentPassword ? 'text' : 'password'}
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                        placeholder="Enter current password"
                                        style={{ backgroundColor: theme.background, color: theme.foreground, borderColor: theme.border, paddingRight: '40px' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                        style={{ color: theme.foregroundMuted }}
                                    >
                                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block mb-2" style={{ fontSize: fonts.body.sm.size, fontWeight: fonts.fontWeight.medium, color: theme.foregroundMuted }}>
                                    New Password <span style={{ color: theme.error }}>*</span>
                                </label>
                                <div className="relative">
                                    <Input
                                        type={showNewPassword ? 'text' : 'password'}
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        placeholder="Enter new password (min 8 characters)"
                                        style={{ backgroundColor: theme.background, color: theme.foreground, borderColor: theme.border, paddingRight: '40px' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                        style={{ color: theme.foregroundMuted }}
                                    >
                                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block mb-2" style={{ fontSize: fonts.body.sm.size, fontWeight: fonts.fontWeight.medium, color: theme.foregroundMuted }}>
                                    Confirm Password <span style={{ color: theme.error }}>*</span>
                                </label>
                                <div className="relative">
                                    <Input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        placeholder="Confirm new password"
                                        style={{ backgroundColor: theme.background, color: theme.foreground, borderColor: theme.border, paddingRight: '40px' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                        style={{ color: theme.foregroundMuted }}
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <ActionButton
                                variant="outline"
                                size="md"
                                onClick={() => {
                                    setShowPasswordModal(false);
                                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                                }}
                                disabled={isChangingPassword}
                            >
                                Cancel
                            </ActionButton>
                            <ActionButton
                                variant="primary"
                                size="md"
                                icon={isChangingPassword ? Loader2 : Save}
                                onClick={handlePasswordChange}
                                disabled={isChangingPassword}
                            >
                                {isChangingPassword ? 'Changing...' : 'Change Password'}
                            </ActionButton>
                        </div>
                    </div>
                </div>
            )}
        </PageLayout>
    );
}

'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { PAGE_BACKGROUND, DARK_GREEN, BODY_TEXT_GREY, BORDER_GREY, PRIMARY_TEXT, TEAL_PRIMARY } from '@/lib/colors';
import { FONT_FAMILY, HEADING_LG, HEADING_SM, BODY_REGULAR, BODY_SM } from '@/lib/fonts';
import { User, Mail, Lock, Eye, EyeOff, Loader2, Building2, Shield } from 'lucide-react';
import { getEmployeeProfile, updateEmployeeProfile, changeEmployeePassword } from '@/lib/api/employee';
import { Button } from '@/components/ui/button';

export default function EmployeeProfilePage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        id: '',
        email: '',
        firstName: '',
        lastName: '',
        fullName: '',
        role: 'EMPLOYEE',
        department: '',
        departmentId: null as string | null,
        joinedDate: '',
    });
    const [originalProfile, setOriginalProfile] = useState(profile);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Password modal state
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordError, setPasswordError] = useState('');

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await getEmployeeProfile();
            setProfile(data);
            setOriginalProfile(data);
        } catch (err) {
            console.error('Failed to load profile:', err);
            setError(err instanceof Error ? err.message : 'Failed to load profile');
        } finally {
            setIsLoading(false);
        }
    };

    const showToast = (message: string, type: 'success' | 'error') => {
        if (type === 'success') {
            setSuccessMessage(message);
            setTimeout(() => setSuccessMessage(null), 3000);
        } else {
            setError(message);
            setTimeout(() => setError(null), 3000);
        }
    };

    const handleSave = async () => {
        if (!profile.firstName.trim()) {
            showToast('First name is required', 'error');
            return;
        }
        if (!profile.lastName.trim()) {
            showToast('Last name is required', 'error');
            return;
        }
        if (!profile.email.trim()) {
            showToast('Email is required', 'error');
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(profile.email)) {
            showToast('Please enter a valid email address', 'error');
            return;
        }

        try {
            setIsSaving(true);
            const updated = await updateEmployeeProfile({
                firstName: profile.firstName,
                lastName: profile.lastName,
                email: profile.email,
            });
            setProfile(prev => ({
                ...prev,
                firstName: updated.firstName,
                lastName: updated.lastName,
                email: updated.email,
                fullName: updated.fullName,
            }));
            setOriginalProfile(prev => ({
                ...prev,
                firstName: updated.firstName,
                lastName: updated.lastName,
                email: updated.email,
                fullName: updated.fullName,
            }));
            setIsEditing(false);
            showToast('Profile updated successfully', 'success');
        } catch (err: any) {
            console.error('Failed to update profile:', err);
            showToast(err.message || 'Failed to update profile', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setProfile(originalProfile);
        setIsEditing(false);
        showToast('Changes discarded', 'error');
    };

    const handlePasswordChange = async () => {
        if (!passwordData.currentPassword) {
            setPasswordError('Current password is required');
            return;
        }
        if (!passwordData.newPassword) {
            setPasswordError('New password is required');
            return;
        }
        if (passwordData.newPassword.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError('Passwords do not match');
            return;
        }

        try {
            setIsChangingPassword(true);
            setPasswordError('');
            await changeEmployeePassword(passwordData);
            setShowPasswordModal(false);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            showToast('Password changed successfully', 'success');
        } catch (err: any) {
            console.error('Failed to change password:', err);
            setPasswordError(err.message || 'Failed to change password');
        } finally {
            setIsChangingPassword(false);
        }
    };

    if (isLoading) {
        return (
            <div style={{ backgroundColor: PAGE_BACKGROUND, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Loader2 className="h-8 w-8 animate-spin" style={{ color: TEAL_PRIMARY }} />
            </div>
        );
    }

    const initials = `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase();

    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: PAGE_BACKGROUND }}>
            <Sidebar role="EMPLOYEE" />

            <div className="flex-1 lg:pl-[280px] flex flex-col">
                <DashboardHeader
                    userName={profile.fullName}
                    userInitials={initials}
                    role="EMPLOYEE"
                />

                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {/* Header */}
                    <div className="mb-6 sm:mb-8 flex items-center justify-between">
                        <div>
                            <h1 style={{
                                fontFamily: FONT_FAMILY.primary,
                                fontSize: HEADING_LG.size,
                                lineHeight: HEADING_LG.lineHeight,
                                fontWeight: HEADING_LG.weight,
                                letterSpacing: HEADING_LG.letterSpacing,
                                color: DARK_GREEN,
                            }}>
                                My Profile
                            </h1>
                            <p style={{
                                fontFamily: FONT_FAMILY.primary,
                                fontSize: BODY_REGULAR.size,
                                lineHeight: BODY_REGULAR.lineHeight,
                                fontWeight: BODY_REGULAR.weight,
                                letterSpacing: BODY_REGULAR.letterSpacing,
                                color: BODY_TEXT_GREY,
                            }}>
                                Manage your account settings and preferences
                            </p>
                        </div>
                        <div className="flex gap-3">
                            {isEditing ? (
                                <>
                                    <Button variant="secondary" onClick={handleCancel} disabled={isSaving}>
                                        Cancel
                                    </Button>
                                    <Button onClick={handleSave} disabled={isSaving}>
                                        {isSaving ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </>
                            ) : (
                                <Button onClick={() => setIsEditing(true)}>
                                    Edit Profile
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Success/Error Messages */}
                    {successMessage && (
                        <div className="mb-4 p-4 rounded-xl" style={{ backgroundColor: '#d1fae5', color: '#065f46' }}>
                            {successMessage}
                        </div>
                    )}
                    {error && (
                        <div className="mb-4 p-4 rounded-xl" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>
                            {error}
                        </div>
                    )}

                    <div className="space-y-6">
                        {/* Profile Header Card */}
                        <div className="bg-white rounded-xl p-6 shadow-sm" style={{ borderColor: BORDER_GREY, border: '1px solid' }}>
                            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                                <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ backgroundColor: TEAL_PRIMARY }}>
                                    <span className="text-3xl font-bold text-white">{initials}</span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <h2 style={{
                                            fontFamily: FONT_FAMILY.primary,
                                            fontSize: '24px',
                                            fontWeight: 600,
                                            color: PRIMARY_TEXT,
                                        }}>
                                            {profile.fullName}
                                        </h2>
                                        <span className="px-3 py-1 text-sm font-medium rounded-full" style={{ backgroundColor: '#e0f2fe', color: '#0369a1' }}>
                                            <Shield className="h-3 w-3 inline mr-1" />{profile.role}
                                        </span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                                        <span className="flex items-center" style={{ fontSize: BODY_SM.size, color: BODY_TEXT_GREY }}>
                                            <Mail className="h-4 w-4 mr-2" />{profile.email}
                                        </span>
                                        <span className="flex items-center" style={{ fontSize: BODY_SM.size, color: BODY_TEXT_GREY }}>
                                            <Building2 className="h-4 w-4 mr-2" />{profile.department}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Personal Information Card */}
                        <div className="bg-white rounded-xl p-6 shadow-sm" style={{ borderColor: BORDER_GREY, border: '1px solid' }}>
                            <h3 className="font-semibold mb-6 flex items-center" style={{
                                fontFamily: FONT_FAMILY.primary,
                                fontSize: HEADING_SM.size,
                                fontWeight: HEADING_SM.weight,
                                color: PRIMARY_TEXT,
                            }}>
                                <User className="h-5 w-5 mr-2" />Personal Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block mb-2" style={{
                                        fontFamily: FONT_FAMILY.primary,
                                        fontSize: BODY_SM.size,
                                        fontWeight: 600,
                                        color: PRIMARY_TEXT,
                                    }}>
                                        First Name {isEditing && <span style={{ color: '#dc2626' }}>*</span>}
                                    </label>
                                    <input
                                        type="text"
                                        value={profile.firstName}
                                        onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                                        disabled={!isEditing}
                                        placeholder="Enter first name"
                                        className="w-full px-4 py-3 rounded-xl border outline-none transition"
                                        style={{
                                            fontFamily: FONT_FAMILY.primary,
                                            fontSize: BODY_REGULAR.size,
                                            color: PRIMARY_TEXT,
                                            borderColor: BORDER_GREY,
                                            backgroundColor: isEditing ? 'white' : '#f9fafb',
                                            cursor: isEditing ? 'text' : 'not-allowed',
                                        }}
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2" style={{
                                        fontFamily: FONT_FAMILY.primary,
                                        fontSize: BODY_SM.size,
                                        fontWeight: 600,
                                        color: PRIMARY_TEXT,
                                    }}>
                                        Last Name {isEditing && <span style={{ color: '#dc2626' }}>*</span>}
                                    </label>
                                    <input
                                        type="text"
                                        value={profile.lastName}
                                        onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                                        disabled={!isEditing}
                                        placeholder="Enter last name"
                                        className="w-full px-4 py-3 rounded-xl border outline-none transition"
                                        style={{
                                            fontFamily: FONT_FAMILY.primary,
                                            fontSize: BODY_REGULAR.size,
                                            color: PRIMARY_TEXT,
                                            borderColor: BORDER_GREY,
                                            backgroundColor: isEditing ? 'white' : '#f9fafb',
                                            cursor: isEditing ? 'text' : 'not-allowed',
                                        }}
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2" style={{
                                        fontFamily: FONT_FAMILY.primary,
                                        fontSize: BODY_SM.size,
                                        fontWeight: 600,
                                        color: PRIMARY_TEXT,
                                    }}>
                                        Email {isEditing && <span style={{ color: '#dc2626' }}>*</span>}
                                    </label>
                                    <input
                                        type="email"
                                        value={profile.email}
                                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                        disabled={!isEditing}
                                        placeholder="email@example.com"
                                        className="w-full px-4 py-3 rounded-xl border outline-none transition"
                                        style={{
                                            fontFamily: FONT_FAMILY.primary,
                                            fontSize: BODY_REGULAR.size,
                                            color: PRIMARY_TEXT,
                                            borderColor: BORDER_GREY,
                                            backgroundColor: isEditing ? 'white' : '#f9fafb',
                                            cursor: isEditing ? 'text' : 'not-allowed',
                                        }}
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2" style={{
                                        fontFamily: FONT_FAMILY.primary,
                                        fontSize: BODY_SM.size,
                                        fontWeight: 600,
                                        color: PRIMARY_TEXT,
                                    }}>
                                        Department <span style={{ color: BODY_TEXT_GREY }}>(Read-only)</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={profile.department}
                                        disabled
                                        className="w-full px-4 py-3 rounded-xl border outline-none"
                                        style={{
                                            fontFamily: FONT_FAMILY.primary,
                                            fontSize: BODY_REGULAR.size,
                                            color: BODY_TEXT_GREY,
                                            borderColor: BORDER_GREY,
                                            backgroundColor: '#f9fafb',
                                            cursor: 'not-allowed',
                                        }}
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2" style={{
                                        fontFamily: FONT_FAMILY.primary,
                                        fontSize: BODY_SM.size,
                                        fontWeight: 600,
                                        color: PRIMARY_TEXT,
                                    }}>
                                        Role <span style={{ color: BODY_TEXT_GREY }}>(Read-only)</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={profile.role}
                                        disabled
                                        className="w-full px-4 py-3 rounded-xl border outline-none"
                                        style={{
                                            fontFamily: FONT_FAMILY.primary,
                                            fontSize: BODY_REGULAR.size,
                                            color: BODY_TEXT_GREY,
                                            borderColor: BORDER_GREY,
                                            backgroundColor: '#f9fafb',
                                            cursor: 'not-allowed',
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Security Card */}
                        <div className="bg-white rounded-xl p-6 shadow-sm" style={{ borderColor: BORDER_GREY, border: '1px solid' }}>
                            <h3 className="font-semibold mb-6 flex items-center" style={{
                                fontFamily: FONT_FAMILY.primary,
                                fontSize: HEADING_SM.size,
                                fontWeight: HEADING_SM.weight,
                                color: PRIMARY_TEXT,
                            }}>
                                <Lock className="h-5 w-5 mr-2" />Security
                            </h3>
                            <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: '#f9fafb' }}>
                                <div>
                                    <p className="font-medium mb-1" style={{
                                        fontFamily: FONT_FAMILY.primary,
                                        fontSize: BODY_REGULAR.size,
                                        color: PRIMARY_TEXT,
                                    }}>Password</p>
                                    <p style={{
                                        fontFamily: FONT_FAMILY.primary,
                                        fontSize: BODY_SM.size,
                                        color: BODY_TEXT_GREY,
                                    }}>Change your account password</p>
                                </div>
                                <Button variant="secondary" onClick={() => setShowPasswordModal(true)}>
                                    Change Password
                                </Button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Password Change Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 z-[9998] flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowPasswordModal(false)} />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6" style={{ borderColor: BORDER_GREY, border: '1px solid' }}>
                        <div className="mb-6">
                            <h3 className="text-lg font-bold flex items-center" style={{ color: PRIMARY_TEXT }}>
                                <Lock className="h-5 w-5 mr-2" />
                                Change Password
                            </h3>
                        </div>

                        {passwordError && (
                            <div className="mb-4 p-3 rounded-lg text-sm" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>
                                {passwordError}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block mb-2" style={{ fontSize: BODY_SM.size, fontWeight: 600, color: PRIMARY_TEXT }}>
                                    Current Password <span style={{ color: '#dc2626' }}>*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showCurrentPassword ? 'text' : 'password'}
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                        placeholder="Enter current password"
                                        className="w-full px-4 py-3 rounded-xl border outline-none"
                                        style={{
                                            fontSize: BODY_REGULAR.size,
                                            color: PRIMARY_TEXT,
                                            borderColor: BORDER_GREY,
                                            paddingRight: '40px',
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                        style={{ color: BODY_TEXT_GREY }}
                                    >
                                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block mb-2" style={{ fontSize: BODY_SM.size, fontWeight: 600, color: PRIMARY_TEXT }}>
                                    New Password <span style={{ color: '#dc2626' }}>*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showNewPassword ? 'text' : 'password'}
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        placeholder="Enter new password (min 6 characters)"
                                        className="w-full px-4 py-3 rounded-xl border outline-none"
                                        style={{
                                            fontSize: BODY_REGULAR.size,
                                            color: PRIMARY_TEXT,
                                            borderColor: BORDER_GREY,
                                            paddingRight: '40px',
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                        style={{ color: BODY_TEXT_GREY }}
                                    >
                                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block mb-2" style={{ fontSize: BODY_SM.size, fontWeight: 600, color: PRIMARY_TEXT }}>
                                    Confirm Password <span style={{ color: '#dc2626' }}>*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        placeholder="Confirm new password"
                                        className="w-full px-4 py-3 rounded-xl border outline-none"
                                        style={{
                                            fontSize: BODY_REGULAR.size,
                                            color: PRIMARY_TEXT,
                                            borderColor: BORDER_GREY,
                                            paddingRight: '40px',
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                        style={{ color: BODY_TEXT_GREY }}
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    setShowPasswordModal(false);
                                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                                    setPasswordError('');
                                }}
                                disabled={isChangingPassword}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handlePasswordChange}
                                disabled={isChangingPassword}
                                className="flex-1"
                            >
                                {isChangingPassword ? 'Changing...' : 'Change Password'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

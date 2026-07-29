'use client';

import React, { useState, useRef } from 'react';
import { PageLayout } from '../../../components/admin/PageLayout';
import { TopBar } from '../../../components/admin/TopBar';
import { ActionButton } from '../../../components/admin/ActionButton';
import { Input } from '../../../components/ui/input';
import { Card } from '../../../components/ui/card';
import { useTheme } from '../../../components/providers/ThemeProvider';
import { useToast } from '../../../components/ui/toast';
import { fonts } from '@/lib/fonts';
import {
    User, Mail, MapPin, Shield, Edit, Save, Camera, Lock, X, Eye, EyeOff
} from 'lucide-react';

export default function ProfilePage() {
    const { colors: theme } = useTheme();
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isEditing, setIsEditing] = useState(false);
    const [profilePicture, setProfilePicture] = useState<string | null>(null);
    const [originalProfile, setOriginalProfile] = useState({
        firstName: 'Abebe',
        lastName: 'Kebede',
        email: 'abebe.kebede@besys.com.et',
        role: 'ADMIN',
        phone: '+251 91 123 4567',
        location: 'Addis Ababa, Ethiopia'
    });
    const [profile, setProfile] = useState({ ...originalProfile });
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Load saved profile and photo from localStorage on mount
    React.useEffect(() => {
        const savedProfile = localStorage.getItem('adminProfile');
        const savedPhoto = localStorage.getItem('adminProfilePhoto');

        if (savedProfile) {
            try {
                const parsed = JSON.parse(savedProfile);
                setProfile(parsed);
                setOriginalProfile(parsed);
            } catch (e) {
                console.error('Failed to load profile:', e);
            }
        }

        if (savedPhoto) {
            setProfilePicture(savedPhoto);
        }
    }, []);

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast('File size must be less than 5MB', 'error');
                return;
            }
            if (!file.type.startsWith('image/')) {
                toast('Please upload an image file', 'error');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                const imageData = reader.result as string;
                setProfilePicture(imageData);
                localStorage.setItem('adminProfilePhoto', imageData);
                toast('Profile picture updated successfully', 'success');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        if (!profile.phone.trim()) {
            toast('Phone number is required', 'error');
            return;
        }
        if (!profile.location.trim()) {
            toast('Location is required', 'error');
            return;
        }
        setOriginalProfile({ ...profile });
        localStorage.setItem('adminProfile', JSON.stringify(profile));
        setIsEditing(false);
        toast('Profile updated successfully', 'success');
    };

    const handleCancel = () => {
        setProfile({ ...originalProfile });
        setIsEditing(false);
        toast('Changes discarded', 'info');
    };

    const handlePasswordChange = () => {
        if (!passwordData.currentPassword) {
            toast('Current password is required', 'error');
            return;
        }
        if (!passwordData.newPassword) {
            toast('New password is required', 'error');
            return;
        }
        if (passwordData.newPassword.length < 8) {
            toast('Password must be at least 8 characters', 'error');
            return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast('Passwords do not match', 'error');
            return;
        }
        setShowPasswordModal(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        toast('Password changed successfully', 'success');
    };

    const topBarActions = isEditing ? (
        <>
            <ActionButton variant="outline" size="sm" icon={X} onClick={handleCancel}>Cancel</ActionButton>
            <ActionButton variant="primary" size="sm" icon={Save} onClick={handleSave}>Save Changes</ActionButton>
        </>
    ) : (
        <ActionButton variant="primary" size="sm" icon={Edit} onClick={() => setIsEditing(true)}>Edit Profile</ActionButton>
    );

    return (
        <PageLayout>
            <TopBar title="My Profile" subtitle="Manage your account settings and preferences" actions={topBarActions} />
            <div className="p-6 space-y-6">
                <Card className="shadow-sm transition-colors" style={{ backgroundColor: theme.card, borderColor: theme.cardBorder }}>
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                            <div className="relative">
                                {profilePicture ? (
                                    <img src={profilePicture} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
                                ) : (
                                    <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ backgroundColor: theme.accent }}>
                                        <span className="text-2xl font-bold" style={{ color: theme.accentForeground }}>
                                            {profile.firstName[0]}{profile.lastName[0]}
                                        </span>
                                    </div>
                                )}
                                <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                                <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:opacity-80" style={{ backgroundColor: theme.primary, color: theme.primaryForeground }} title="Change photo">
                                    <Camera className="h-4 w-4" />
                                </button>
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
                                        <MapPin className="h-4 w-4 mr-2" />{profile.location}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
                <Card className="shadow-sm transition-colors" style={{ backgroundColor: theme.card, borderColor: theme.cardBorder }}>
                    <div className="p-6">
                        <h3 className="font-semibold mb-6 flex items-center" style={{ fontSize: fonts.heading.sm.size, fontWeight: fonts.heading.sm.weight, color: theme.foreground }}>
                            <User className="h-5 w-5 mr-2" />Personal Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block mb-2" style={{ fontSize: fonts.body.sm.size, fontWeight: fonts.fontWeight.medium, color: theme.foregroundMuted }}>
                                    First Name <span style={{ color: theme.foregroundSubtle }}>(Read-only)</span>
                                </label>
                                <Input value={profile.firstName} disabled style={{ backgroundColor: theme.backgroundTertiary, color: theme.foregroundMuted, borderColor: theme.border, cursor: 'not-allowed' }} />
                            </div>
                            <div>
                                <label className="block mb-2" style={{ fontSize: fonts.body.sm.size, fontWeight: fonts.fontWeight.medium, color: theme.foregroundMuted }}>
                                    Last Name <span style={{ color: theme.foregroundSubtle }}>(Read-only)</span>
                                </label>
                                <Input value={profile.lastName} disabled style={{ backgroundColor: theme.backgroundTertiary, color: theme.foregroundMuted, borderColor: theme.border, cursor: 'not-allowed' }} />
                            </div>
                            <div>
                                <label className="block mb-2" style={{ fontSize: fonts.body.sm.size, fontWeight: fonts.fontWeight.medium, color: theme.foregroundMuted }}>
                                    Company Email <span style={{ color: theme.foregroundSubtle }}>(Read-only)</span>
                                </label>
                                <Input type="email" value={profile.email} disabled style={{ backgroundColor: theme.backgroundTertiary, color: theme.foregroundMuted, borderColor: theme.border, cursor: 'not-allowed' }} />
                            </div>
                            <div>
                                <label className="block mb-2" style={{ fontSize: fonts.body.sm.size, fontWeight: fonts.fontWeight.medium, color: theme.foregroundMuted }}>
                                    Role <span style={{ color: theme.foregroundSubtle }}>(Read-only)</span>
                                </label>
                                <Input value={profile.role} disabled style={{ backgroundColor: theme.backgroundTertiary, color: theme.foregroundMuted, borderColor: theme.border, cursor: 'not-allowed' }} />
                            </div>
                            <div>
                                <label className="block mb-2" style={{ fontSize: fonts.body.sm.size, fontWeight: fonts.fontWeight.medium, color: theme.foregroundMuted }}>
                                    Phone Number {isEditing && <span style={{ color: theme.error }}>*</span>}
                                </label>
                                <Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} disabled={!isEditing} placeholder="+1 (555) 000-0000" style={{ backgroundColor: isEditing ? theme.background : theme.backgroundTertiary, color: theme.foreground, borderColor: theme.border }} />
                            </div>
                            <div>
                                <label className="block mb-2" style={{ fontSize: fonts.body.sm.size, fontWeight: fonts.fontWeight.medium, color: theme.foregroundMuted }}>
                                    Location {isEditing && <span style={{ color: theme.error }}>*</span>}
                                </label>
                                <Input value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} disabled={!isEditing} placeholder="City, State/Country" style={{ backgroundColor: isEditing ? theme.background : theme.backgroundTertiary, color: theme.foreground, borderColor: theme.border }} />
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
                                <p style={{ fontSize: fonts.body.sm.size, color: theme.foregroundMuted }}>Last changed 3 months ago</p>
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
                            >
                                Cancel
                            </ActionButton>
                            <ActionButton
                                variant="primary"
                                size="md"
                                icon={Save}
                                onClick={handlePasswordChange}
                            >
                                Change Password
                            </ActionButton>
                        </div>
                    </div>
                </div>
            )}
        </PageLayout>
    );
}

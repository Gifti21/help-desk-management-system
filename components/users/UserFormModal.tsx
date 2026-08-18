'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
    X,
    User,
    Mail,
    Phone,
    Building2,
    Shield,
    Camera,
    Save,
    AlertTriangle
} from 'lucide-react';

interface User {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: 'ADMIN' | 'AGENT' | 'EMPLOYEE';
    department: string;
    isActive: boolean;
    avatar?: string;
}

interface UserFormModalProps {
    user?: User;
    isOpen: boolean;
    onClose: () => void;
    onSave: (userData: User) => void;
    departments: Array<{ id: string; name: string; }>;
}

export default function UserFormModal({
    user,
    isOpen,
    onClose,
    onSave,
    departments = []
}: UserFormModalProps) {
    const [formData, setFormData] = useState<User>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: 'EMPLOYEE',
        department: '',
        isActive: true
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isEditing = !!user?.id;

    useEffect(() => {
        if (user) {
            setFormData(user);
        } else {
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                role: 'EMPLOYEE',
                department: '',
                isActive: true
            });
        }
        setErrors({});
    }, [user, isOpen]);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.department) {
            newErrors.department = 'Department is required';
        }

        if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
            newErrors.phone = 'Please enter a valid phone number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            await onSave(formData);
            onClose();
        } catch (error) {
            console.error('Error saving user:', error);
            setErrors({ submit: 'Failed to save user. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (field: keyof User, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'ADMIN': return 'text-blue-600 bg-blue-100';
            case 'AGENT': return 'text-purple-600 bg-purple-100';
            case 'EMPLOYEE': return 'text-gray-600 bg-gray-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getInitials = () => {
        return `${formData.firstName.charAt(0)}${formData.lastName.charAt(0)}`.toUpperCase();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-8 mx-auto p-0 border w-full max-w-2xl shadow-lg rounded-lg bg-white mb-8">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            {isEditing ? 'Edit User' : 'Add New User'}
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            {isEditing ? 'Update user information and permissions' : 'Create a new user account'}
                        </p>
                    </div>
                    <Button
                        onClick={onClose}
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-6">
                        {/* Profile Section */}
                        <div className="flex items-center space-x-6 pb-6 border-b border-gray-200">
                            {/* Avatar */}
                            <div className="relative">
                                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                                    <span className="text-2xl font-bold text-white">
                                        {getInitials() || 'NN'}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border border-gray-200 hover:bg-gray-50"
                                    title="Change avatar"
                                >
                                    <Camera className="w-3 h-3 text-gray-600" />
                                </button>
                            </div>

                            {/* Basic Info Preview */}
                            <div className="flex-1">
                                <div className="text-lg font-semibold text-gray-900">
                                    {formData.firstName} {formData.lastName}
                                </div>
                                <div className="text-gray-600">{formData.email}</div>
                                {formData.role && (
                                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full mt-2 ${getRoleColor(formData.role)}`}>
                                        {formData.role}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Personal Information */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                <User className="w-5 h-5 mr-2 text-gray-600" />
                                Personal Information
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        First Name *
                                    </label>
                                    <Input
                                        value={formData.firstName}
                                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                                        className={errors.firstName ? 'border-red-300' : ''}
                                        placeholder="Enter first name"
                                    />
                                    {errors.firstName && (
                                        <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Last Name *
                                    </label>
                                    <Input
                                        value={formData.lastName}
                                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                                        className={errors.lastName ? 'border-red-300' : ''}
                                        placeholder="Enter last name"
                                    />
                                    {errors.lastName && (
                                        <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                        <Mail className="w-4 h-4 mr-1" />
                                        Email Address *
                                    </label>
                                    <Input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className={errors.email ? 'border-red-300' : ''}
                                        placeholder="user@company.com"
                                        disabled={isEditing} // Email usually can't be changed
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                                    )}
                                    {isEditing && (
                                        <p className="text-gray-500 text-xs mt-1">Email cannot be changed after creation</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                        <Phone className="w-4 h-4 mr-1" />
                                        Phone Number
                                    </label>
                                    <Input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        className={errors.phone ? 'border-red-300' : ''}
                                        placeholder="+1 (555) 123-4567"
                                    />
                                    {errors.phone && (
                                        <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Role and Permissions */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                <Shield className="w-5 h-5 mr-2 text-gray-600" />
                                Role & Permissions
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Role *
                                    </label>
                                    <select
                                        value={formData.role}
                                        onChange={(e) => handleInputChange('role', e.target.value as User['role'])}
                                        className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    >
                                        <option value="EMPLOYEE">Employee</option>
                                        <option value="AGENT">Agent</option>
                                        <option value="ADMIN">Administrator</option>
                                    </select>
                                    <p className="text-gray-500 text-xs mt-1">
                                        {formData.role === 'ADMIN' && 'Full system access and user management'}
                                        {formData.role === 'AGENT' && 'Can manage and resolve tickets'}
                                        {formData.role === 'EMPLOYEE' && 'Can create and view own tickets'}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                        <Building2 className="w-4 h-4 mr-1" />
                                        Department *
                                    </label>
                                    <select
                                        value={formData.department}
                                        onChange={(e) => handleInputChange('department', e.target.value)}
                                        className={`w-full border rounded-md px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.department ? 'border-red-300' : 'border-gray-200'}`}
                                    >
                                        <option value="">Select Department</option>
                                        {departments.map((dept) => (
                                            <option key={dept.id} value={dept.name}>
                                                {dept.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.department && (
                                        <p className="text-red-500 text-xs mt-1">{errors.department}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Account Status */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Account Status</h3>
                            <div className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={(e) => handleInputChange('isActive', e.target.checked)}
                                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                />
                                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                                    Active Account
                                </label>
                                <p className="text-xs text-gray-500">
                                    {formData.isActive ? 'User can log in and access the system' : 'User account is disabled'}
                                </p>
                            </div>
                        </div>

                        {/* Error Message */}
                        {errors.submit && (
                            <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-md">
                                <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                                <p className="text-red-700 text-sm">{errors.submit}</p>
                            </div>
                        )}
                    </div>

                    {/* Form Actions */}
                    <div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="border-gray-300"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                    {isEditing ? 'Updating...' : 'Creating...'}
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    {isEditing ? 'Update User' : 'Create User'}
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
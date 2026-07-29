'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '../providers/ThemeProvider';
import { useToast } from '../ui/toast';
import { ActionButton } from './ActionButton';
import { Input } from '../ui/input';
import { fonts } from '@/lib/fonts';
import { X, Save, UserPlus, Building, Tag, FileText } from 'lucide-react';

interface Field {
    key: string;
    label: string;
    type: 'text' | 'email' | 'select' | 'textarea';
    required?: boolean;
    options?: { label: string; value: string }[];
    placeholder?: string;
    validation?: (value: string) => string | null;
}

interface CrudModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
    type: 'user' | 'department' | 'category' | 'ticket';
    mode: 'create' | 'edit';
    initialData?: any;
    title?: string;
}

const fieldConfigurations = {
    user: [
        { key: 'name', label: 'Full Name', type: 'text' as const, required: true, placeholder: 'Enter full name' },
        { key: 'email', label: 'Email Address', type: 'email' as const, required: true, placeholder: 'user@company.com' },
        {
            key: 'role',
            label: 'Role',
            type: 'select' as const,
            required: true,
            options: [
                { label: 'Admin', value: 'ADMIN' },
                { label: 'Agent', value: 'AGENT' },
                { label: 'Employee', value: 'EMPLOYEE' }
            ]
        },
        {
            key: 'department',
            label: 'Department',
            type: 'select' as const,
            required: true,
            options: [
                { label: 'IT Support', value: 'IT_SUPPORT' },
                { label: 'Human Resources', value: 'HR' },
                { label: 'Engineering', value: 'ENGINEERING' },
                { label: 'Operations', value: 'OPERATIONS' }
            ]
        },
        {
            key: 'status',
            label: 'Status',
            type: 'select' as const,
            required: true,
            options: [
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' }
            ]
        }
    ],
    department: [
        { key: 'name', label: 'Department Name', type: 'text' as const, required: true, placeholder: 'Enter department name' },
        { key: 'description', label: 'Description', type: 'textarea' as const, placeholder: 'Department description...' },
        { key: 'manager', label: 'Department Manager', type: 'text' as const, placeholder: 'Manager name' },
        {
            key: 'status',
            label: 'Status',
            type: 'select' as const,
            required: true,
            options: [
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' }
            ]
        }
    ],
    category: [
        { key: 'name', label: 'Category Name', type: 'text' as const, required: true, placeholder: 'Enter category name' },
        { key: 'description', label: 'Description', type: 'textarea' as const, placeholder: 'Category description...' },
        {
            key: 'priority',
            label: 'Default Priority',
            type: 'select' as const,
            required: true,
            options: [
                { label: 'Low', value: 'LOW' },
                { label: 'Medium', value: 'MEDIUM' },
                { label: 'High', value: 'HIGH' },
                { label: 'Urgent', value: 'URGENT' }
            ]
        },
        {
            key: 'status',
            label: 'Status',
            type: 'select' as const,
            required: true,
            options: [
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' }
            ]
        }
    ],
    ticket: [
        { key: 'title', label: 'Title', type: 'text' as const, required: true, placeholder: 'Enter ticket title' },
        { key: 'description', label: 'Description', type: 'textarea' as const, required: true, placeholder: 'Detailed description...' },
        {
            key: 'priority',
            label: 'Priority',
            type: 'select' as const,
            required: true,
            options: [
                { label: 'Low', value: 'LOW' },
                { label: 'Medium', value: 'MEDIUM' },
                { label: 'High', value: 'HIGH' },
                { label: 'Urgent', value: 'URGENT' }
            ]
        },
        {
            key: 'category',
            label: 'Category',
            type: 'select' as const,
            required: true,
            options: [
                { label: 'Hardware', value: 'HARDWARE' },
                { label: 'Software', value: 'SOFTWARE' },
                { label: 'Network', value: 'NETWORK' },
                { label: 'Access', value: 'ACCESS' }
            ]
        },
        {
            key: 'assignee',
            label: 'Assignee',
            type: 'select' as const,
            options: [
                { label: 'Unassigned', value: '' },
                { label: 'John Doe', value: 'john.doe' },
                { label: 'Sarah Chen', value: 'sarah.chen' },
                { label: 'David Miller', value: 'david.miller' }
            ]
        }
    ]
};

const typeIcons = {
    user: UserPlus,
    department: Building,
    category: Tag,
    ticket: FileText
};

export function CrudModal({
    isOpen,
    onClose,
    onSubmit,
    type,
    mode,
    initialData = {},
    title
}: CrudModalProps) {
    const { colors: theme } = useTheme();
    const { addToast } = useToast();
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);

    const fields = fieldConfigurations[type];
    const Icon = typeIcons[type];
    const modalTitle = title || `${mode === 'create' ? 'Create' : 'Edit'} ${type.charAt(0).toUpperCase() + type.slice(1)}`;

    // Initialize form data
    useEffect(() => {
        if (isOpen) {
            setFormData(initialData);
            setErrors({});
        }
    }, [isOpen, initialData]);

    // Handle input changes
    const handleInputChange = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
        if (errors[key]) {
            setErrors(prev => ({ ...prev, [key]: '' }));
        }
    };

    // Validate form
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        fields.forEach(field => {
            const value = formData[field.key] || '';

            if (field.required && !value.trim()) {
                newErrors[field.key] = `${field.label} is required`;
            }

            if (field.type === 'email' && value && !value.includes('@')) {
                newErrors[field.key] = 'Please enter a valid email address';
            }

            if (field.validation) {
                const validationError = field.validation(value);
                if (validationError) {
                    newErrors[field.key] = validationError;
                }
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!validateForm()) {
            addToast({
                type: 'error',
                title: 'Validation Error',
                message: 'Please fix the errors below and try again.'
            });
            return;
        }

        setIsLoading(true);

        try {
            await onSubmit(formData);
            addToast({
                type: 'success',
                title: mode === 'create' ? 'Created Successfully' : 'Updated Successfully',
                message: `${type.charAt(0).toUpperCase() + type.slice(1)} has been ${mode === 'create' ? 'created' : 'updated'} successfully.`
            });
            onClose();
        } catch (error) {
            addToast({
                type: 'error',
                title: 'Error',
                message: `Failed to ${mode} ${type}. Please try again.`
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div
                className="rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto transition-colors"
                style={{
                    backgroundColor: theme.card,
                    fontFamily: fonts.fontFamily.primary
                }}
            >
                {/* Header */}
                <div
                    className="flex items-center justify-between p-6 pb-4 transition-colors"
                    style={{ borderBottom: `1px solid ${theme.cardBorder}` }}
                >
                    <div className="flex items-center">
                        <div
                            className="w-10 h-10 rounded-full flex items-center justify-center mr-3 transition-colors"
                            style={{ backgroundColor: theme.accent }}
                        >
                            <Icon className="h-5 w-5" style={{ color: theme.primary }} />
                        </div>
                        <h2
                            style={{
                                fontSize: fonts.heading.sm.size,
                                fontWeight: fonts.heading.sm.weight,
                                color: theme.foreground
                            }}
                        >
                            {modalTitle}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded hover:bg-opacity-80 transition-colors"
                        style={{ backgroundColor: theme.backgroundTertiary }}
                        disabled={isLoading}
                    >
                        <X className="h-5 w-5" style={{ color: theme.foregroundSecondary }} />
                    </button>
                </div>

                {/* Form */}
                <div className="p-6 space-y-4">
                    {fields.map(field => (
                        <div key={field.key}>
                            <label
                                className="block mb-2"
                                style={{
                                    fontSize: fonts.body.sm.size,
                                    fontWeight: fonts.fontWeight.medium,
                                    color: theme.foregroundMuted
                                }}
                            >
                                {field.label}
                                {field.required && <span style={{ color: theme.error }}> *</span>}
                            </label>

                            {field.type === 'select' ? (
                                <select
                                    value={formData[field.key] || ''}
                                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md"
                                    style={{
                                        fontSize: fonts.body.regular.size,
                                        borderColor: errors[field.key] ? theme.error : theme.border,
                                        backgroundColor: theme.backgroundSecondary,
                                        color: theme.foreground
                                    }}
                                    disabled={isLoading}
                                >
                                    <option value="">Select {field.label}</option>
                                    {field.options?.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            ) : field.type === 'textarea' ? (
                                <textarea
                                    value={formData[field.key] || ''}
                                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                                    placeholder={field.placeholder}
                                    rows={3}
                                    className="w-full px-3 py-2 border rounded-md resize-none"
                                    style={{
                                        fontSize: fonts.body.regular.size,
                                        borderColor: errors[field.key] ? theme.error : theme.border,
                                        backgroundColor: theme.backgroundSecondary,
                                        color: theme.foreground
                                    }}
                                    disabled={isLoading}
                                />
                            ) : (
                                <Input
                                    type={field.type}
                                    value={formData[field.key] || ''}
                                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                                    placeholder={field.placeholder}
                                    disabled={isLoading}
                                    style={{
                                        borderColor: errors[field.key] ? theme.error : theme.border
                                    }}
                                />
                            )}

                            {errors[field.key] && (
                                <p
                                    className="mt-1"
                                    style={{
                                        fontSize: fonts.body.xs.size,
                                        color: theme.error
                                    }}
                                >
                                    {errors[field.key]}
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div
                    className="flex justify-end space-x-3 p-6 pt-4"
                    style={{ borderTop: `1px solid ${theme.cardBorder}` }}
                >
                    <ActionButton
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Cancel
                    </ActionButton>
                    <ActionButton
                        variant="primary"
                        onClick={handleSubmit}
                        disabled={isLoading}
                        icon={Save}
                    >
                        {isLoading ? 'Saving...' : (mode === 'create' ? 'Create' : 'Update')}
                    </ActionButton>
                </div>
            </div>
        </div>
    );
}
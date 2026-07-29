'use client';

import React from 'react';
import { ResponsiveLayout } from '@/components/admin/ResponsiveLayout';

export function AdminShell({
    children,
    role,
    userName,
}: {
    children: React.ReactNode;
    role: string;
    userName: string;
}) {
    return (
        <ResponsiveLayout userRole={role} userName={userName}>
            {children}
        </ResponsiveLayout>
    );
}

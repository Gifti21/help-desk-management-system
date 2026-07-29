'use client';

import React from 'react';
import { ResponsiveNavigation } from './ResponsiveNavigation';
import { Footer } from './Footer';
import { useTheme } from '../providers/ThemeProvider';
import { fonts } from '@/lib/fonts';
import { darkModeColors } from '@/lib/dark-mode-color';

interface ResponsiveLayoutProps {
    children: React.ReactNode;
    userRole?: string;
    userName?: string;
}

export function ResponsiveLayout({ children, userRole = 'ADMIN', userName = 'Admin User' }: ResponsiveLayoutProps) {
    const { isDark, colors } = useTheme();

    return (
        <div
            className="min-h-screen flex flex-col"
            style={{
                backgroundColor: isDark ? darkModeColors.background.primary : colors.background,
                color: isDark ? darkModeColors.text.primary : colors.foreground,
                fontFamily: fonts.fontFamily.primary
            }}
        >
            {/* Responsive Navigation */}
            <ResponsiveNavigation userRole={userRole} userName={userName} />

            {/* Main Content Area */}
            <div className="lg:pl-64 flex-1 flex flex-col pb-[52px]">
                <div className="flex-1">
                    {children}
                </div>
            </div>

            {/* Full-width Footer - fixed at bottom, spans entire width */}
            <div className="fixed bottom-0 left-0 right-0 z-40">
                <Footer />
            </div>
        </div>
    );
}
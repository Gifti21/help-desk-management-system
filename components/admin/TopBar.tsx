'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { SimpleThemeToggle } from '../ui/theme-toggle';
import { useTheme } from '../providers/ThemeProvider';
import { useToast } from '../ui/toast';
import { fonts } from '@/lib/fonts';
import { Bell, User } from 'lucide-react';

interface TopBarProps {
    title: string;
    subtitle: string;
    actions?: React.ReactNode;
}

export function TopBar({ title, subtitle, actions }: TopBarProps) {
    const { colors } = useTheme();
    const { toast } = useToast();
    const router = useRouter();

    const handleNotifications = () => {
        toast('No new notifications', 'info');
    };

    const handleUserProfile = () => {
        router.push('/admin/profile');
    };

    return (
        <div
            className="px-4 py-4 md:px-6 border-b transition-colors"
            style={{
                backgroundColor: colors.card,
                borderBottomColor: colors.cardBorder
            }}
        >
            <div className="flex items-center justify-between">
                <div>
                    <h1
                        className="font-semibold"
                        style={{
                            fontSize: fonts.heading.md.size,
                            fontWeight: fonts.heading.md.weight,
                            color: colors.cardForeground,
                            lineHeight: fonts.heading.md.lineHeight
                        }}
                    >
                        {title}
                    </h1>
                    <p
                        className="mt-1 hidden sm:block"
                        style={{
                            fontSize: fonts.body.sm.size,
                            color: colors.foregroundMuted,
                            lineHeight: fonts.body.sm.lineHeight
                        }}
                    >
                        {subtitle}
                    </p>
                </div>

                <div className="flex items-center space-x-2 md:space-x-3">
                    {/* Responsive actions - stack on mobile */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        {actions}
                    </div>

                    {/* Theme toggle and user controls */}
                    <div className="flex items-center space-x-2">
                        <SimpleThemeToggle />

                        <div className="hidden md:flex items-center space-x-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleNotifications}
                                style={{ color: colors.foregroundMuted, cursor: 'pointer' }}
                                title="Notifications"
                            >
                                <Bell className="h-5 w-5" />
                            </Button>

                            <button
                                onClick={handleUserProfile}
                                className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:opacity-80"
                                style={{ backgroundColor: colors.accent, cursor: 'pointer' }}
                                title="User Profile"
                            >
                                <User className="h-4 w-4" style={{ color: colors.accentForeground }} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
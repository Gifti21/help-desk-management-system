'use client';

import Image from 'next/image';
import { useTheme } from '../providers/ThemeProvider';
import { colors } from '@/lib/colors';
import { darkModeColors } from '@/lib/dark-mode-color';

export function Footer() {
    const { isDark } = useTheme();

    return (
        <footer
            className="border-t py-3 px-4 transition-colors"
            style={{
                backgroundColor: isDark ? darkModeColors.sidebar.background : colors.darkGreen,
                borderColor: isDark ? darkModeColors.sidebar.border : 'rgba(47, 217, 196, 0.2)',
            }}
        >
            <div className="flex items-center justify-between">
                {/* Logo and Company Name */}
                <div className="flex items-center space-x-2">
                    <Image
                        src="/besys_logo.webp"
                        alt="BESYS Logo"
                        width={20}
                        height={20}
                        className="rounded"
                    />
                    <span
                        className="font-semibold text-sm"
                        style={{
                            color: isDark ? darkModeColors.accent.primary : colors.tealPrimary
                        }}
                    >
                        BESYS TECHNOLOGIES PLC
                    </span>
                </div>

                {/* Copyright */}
                <div
                    className="text-xs"
                    style={{
                        color: isDark ? darkModeColors.text.secondary : 'rgba(255, 255, 255, 0.7)'
                    }}
                >
                    © 2026. All rights reserved.
                </div>
            </div>
        </footer>
    );
}

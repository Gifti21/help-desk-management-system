'use client';

import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Search, Bell, Download, RefreshCw, User } from 'lucide-react';

interface HeaderProps {
    title: string;
    subtitle?: string;
    showExportButton?: boolean;
    showRefreshButton?: boolean;
    onExport?: () => void;
    onRefresh?: () => void;
}

export function Header({
    title,
    subtitle,
    showExportButton = false,
    showRefreshButton = false,
    onExport,
    onRefresh
}: HeaderProps) {
    return (
        <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
                    {subtitle && (
                        <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
                    )}
                </div>

                <div className="flex items-center space-x-4">
                    {/* Export Button */}
                    {showExportButton && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onExport}
                            className="flex items-center"
                        >
                            <Download className="h-4 w-4 mr-2" />
                            Export Data
                        </Button>
                    )}

                    {/* Refresh Button */}
                    {showRefreshButton && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onRefresh}
                            className="flex items-center bg-green-600 text-white hover:bg-green-700"
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Refresh
                        </Button>
                    )}

                    {/* Notifications */}
                    <Button variant="ghost" size="icon">
                        <Bell className="h-5 w-5" />
                    </Button>

                    {/* User Profile */}
                    <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-600" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
"use client";

import React from "react";
import { Button } from "./ui/button";
import { Bell, Download, RefreshCw, User } from "lucide-react";

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
  onRefresh,
}: HeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="wrap-break-word text-xl font-semibold text-gray-900 sm:text-2xl">
            {title}
          </h1>
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>

        <div className="ml-auto flex max-w-full flex-wrap items-center justify-end gap-2 sm:space-x-4">
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
          <button
            type="button"
            aria-label="Notifications"
            className="rounded-lg p-2 text-gray-700 transition hover:bg-gray-100"
          >
            <Bell className="h-5 w-5" />
          </button>

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

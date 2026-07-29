'use client';

import React from 'react';
import { ActionButton } from '../admin/ActionButton';
import { Download, FileText } from 'lucide-react';

interface ExportButtonsProps {
    onExportCSV: () => void;
    onExportPDF: () => void;
    isLoading?: boolean;
}

export function ExportButtons({ onExportCSV, onExportPDF, isLoading = false }: ExportButtonsProps) {
    return (
        <div className="flex items-center space-x-2">
            <ActionButton
                variant="outline"
                size="sm"
                icon={Download}
                onClick={onExportCSV}
                disabled={isLoading}
            >
                Export CSV
            </ActionButton>
            <ActionButton
                variant="primary"
                size="sm"
                icon={FileText}
                onClick={onExportPDF}
                disabled={isLoading}
            >
                Export PDF
            </ActionButton>
        </div>
    );
}

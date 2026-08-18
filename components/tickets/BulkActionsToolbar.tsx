'use client';

import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
    CheckSquare,
    Square,
    UserPlus,
    Settings,
    Trash2,
    X,
    ChevronDown,
    Users,
    Flag,
    AlertTriangle
} from 'lucide-react';

interface BulkActionsToolbarProps {
    selectedCount: number;
    totalCount: number;
    selectedTicketIds: string[];
    onSelectAll: () => void;
    onClearSelection: () => void;
    onBulkAssign: (agentId: string) => void;
    onBulkStatusChange: (status: string) => void;
    onBulkPriorityChange: (priority: string) => void;
    onBulkDelete: () => void;
    availableAgents?: Array<{ id: string; name: string; department: string; }>;
}

export default function BulkActionsToolbar({
    selectedCount,
    totalCount,
    selectedTicketIds,
    onSelectAll,
    onClearSelection,
    onBulkAssign,
    onBulkStatusChange,
    onBulkPriorityChange,
    onBulkDelete,
    availableAgents = []
}: BulkActionsToolbarProps) {
    const [showAssignDropdown, setShowAssignDropdown] = useState(false);
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);

    const isAllSelected = selectedCount === totalCount && totalCount > 0;
    const isSomeSelected = selectedCount > 0 && selectedCount < totalCount;
    const isNoneSelected = selectedCount === 0;

    const handleBulkDelete = () => {
        const confirmed = window.confirm(
            `Are you sure you want to delete ${selectedCount} selected ticket${selectedCount > 1 ? 's' : ''}? This action cannot be undone.`
        );
        if (confirmed) {
            onBulkDelete();
        }
    };

    const statusOptions = [
        { value: 'OPEN', label: 'Open', color: 'text-orange-600' },
        { value: 'IN_PROGRESS', label: 'In Progress', color: 'text-blue-600' },
        { value: 'RESOLVED', label: 'Resolved', color: 'text-green-600' },
        { value: 'CLOSED', label: 'Closed', color: 'text-gray-600' }
    ];

    const priorityOptions = [
        { value: 'CRITICAL', label: 'Critical', color: 'text-red-600' },
        { value: 'HIGH', label: 'High', color: 'text-orange-600' },
        { value: 'MEDIUM', label: 'Medium', color: 'text-blue-600' },
        { value: 'LOW', label: 'Low', color: 'text-green-600' }
    ];

    if (isNoneSelected) {
        return (
            <div className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                    <button
                        onClick={onSelectAll}
                        className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                    >
                        <Square className="w-4 h-4 mr-2" />
                        Select all {totalCount} tickets
                    </button>
                </div>
                <div className="text-sm text-gray-500">
                    {totalCount} ticket{totalCount !== 1 ? 's' : ''} total
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-between p-3 bg-blue-50 border-b border-blue-200">
            <div className="flex items-center space-x-4">
                {/* Selection Indicator */}
                <div className="flex items-center space-x-2">
                    <button
                        onClick={isAllSelected ? onClearSelection : onSelectAll}
                        className="flex items-center"
                    >
                        {isAllSelected ? (
                            <CheckSquare className="w-4 h-4 text-blue-600" />
                        ) : isSomeSelected ? (
                            <div className="w-4 h-4 bg-blue-600 rounded-sm flex items-center justify-center">
                                <div className="w-2 h-0.5 bg-white rounded" />
                            </div>
                        ) : (
                            <Square className="w-4 h-4 text-gray-400" />
                        )}
                    </button>
                    <span className="text-sm font-medium text-blue-900">
                        {selectedCount} ticket{selectedCount !== 1 ? 's' : ''} selected
                    </span>
                    {selectedCount < totalCount && (
                        <button
                            onClick={onSelectAll}
                            className="text-sm text-blue-600 hover:text-blue-700 underline"
                        >
                            Select all {totalCount}
                        </button>
                    )}
                </div>

                {/* Bulk Actions */}
                <div className="flex items-center space-x-2">
                    {/* Bulk Assign */}
                    <div className="relative">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                                setShowAssignDropdown(!showAssignDropdown);
                                setShowStatusDropdown(false);
                                setShowPriorityDropdown(false);
                            }}
                            className="border-blue-300 text-blue-700 hover:bg-blue-100"
                        >
                            <UserPlus className="w-4 h-4 mr-1" />
                            Assign
                            <ChevronDown className="w-3 h-3 ml-1" />
                        </Button>

                        {showAssignDropdown && (
                            <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                                <div className="p-2 border-b border-gray-100">
                                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Assign to Agent
                                    </div>
                                </div>
                                <div className="max-h-48 overflow-y-auto">
                                    <button
                                        onClick={() => {
                                            onBulkAssign('');
                                            setShowAssignDropdown(false);
                                        }}
                                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                                                <X className="w-4 h-4 text-gray-400" />
                                            </div>
                                            <span className="italic">Unassign</span>
                                        </div>
                                    </button>
                                    {availableAgents.map((agent) => (
                                        <button
                                            key={agent.id}
                                            onClick={() => {
                                                onBulkAssign(agent.id);
                                                setShowAssignDropdown(false);
                                            }}
                                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mr-3">
                                                    <span className="text-xs font-semibold text-white">
                                                        {agent.name.split(' ').map(n => n[0]).join('')}
                                                    </span>
                                                </div>
                                                <div>
                                                    <div className="font-medium">{agent.name}</div>
                                                    <div className="text-xs text-gray-500">{agent.department}</div>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Bulk Status Change */}
                    <div className="relative">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                                setShowStatusDropdown(!showStatusDropdown);
                                setShowAssignDropdown(false);
                                setShowPriorityDropdown(false);
                            }}
                            className="border-blue-300 text-blue-700 hover:bg-blue-100"
                        >
                            <Settings className="w-4 h-4 mr-1" />
                            Status
                            <ChevronDown className="w-3 h-3 ml-1" />
                        </Button>

                        {showStatusDropdown && (
                            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                                <div className="p-2 border-b border-gray-100">
                                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Change Status
                                    </div>
                                </div>
                                <div className="p-1">
                                    {statusOptions.map((status) => (
                                        <button
                                            key={status.value}
                                            onClick={() => {
                                                onBulkStatusChange(status.value);
                                                setShowStatusDropdown(false);
                                            }}
                                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                                        >
                                            <span className={`font-medium ${status.color}`}>
                                                {status.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Bulk Priority Change */}
                    <div className="relative">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                                setShowPriorityDropdown(!showPriorityDropdown);
                                setShowAssignDropdown(false);
                                setShowStatusDropdown(false);
                            }}
                            className="border-blue-300 text-blue-700 hover:bg-blue-100"
                        >
                            <Flag className="w-4 h-4 mr-1" />
                            Priority
                            <ChevronDown className="w-3 h-3 ml-1" />
                        </Button>

                        {showPriorityDropdown && (
                            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                                <div className="p-2 border-b border-gray-100">
                                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Change Priority
                                    </div>
                                </div>
                                <div className="p-1">
                                    {priorityOptions.map((priority) => (
                                        <button
                                            key={priority.value}
                                            onClick={() => {
                                                onBulkPriorityChange(priority.value);
                                                setShowPriorityDropdown(false);
                                            }}
                                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                                        >
                                            <span className={`font-medium ${priority.color}`}>
                                                {priority.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Bulk Delete */}
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleBulkDelete}
                        className="border-red-300 text-red-700 hover:bg-red-50"
                    >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                    </Button>
                </div>
            </div>

            {/* Clear Selection */}
            <Button
                size="sm"
                variant="ghost"
                onClick={onClearSelection}
                className="text-blue-700 hover:text-blue-800 hover:bg-blue-100"
            >
                <X className="w-4 h-4 mr-1" />
                Clear Selection
            </Button>

            {/* Close dropdowns when clicking outside */}
            {(showAssignDropdown || showStatusDropdown || showPriorityDropdown) && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => {
                        setShowAssignDropdown(false);
                        setShowStatusDropdown(false);
                        setShowPriorityDropdown(false);
                    }}
                />
            )}
        </div>
    );
}
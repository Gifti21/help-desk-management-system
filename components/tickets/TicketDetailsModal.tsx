'use client';

import React, { useState } from 'react';
import { Button } from '../ui/button';
import TicketCommentsSection from './TicketCommentsSection';
import TicketTimeline from './TicketTimeline';
import {
    X,
    Edit,
    UserPlus,
    Trash2,
    Calendar,
    User,
    Building2,
    FolderOpen,
    Flag,
    Clock,
    ExternalLink,
    Copy,
    Share
} from 'lucide-react';

interface Ticket {
    id: string;
    title: string;
    description: string;
    status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'OVERDUE' | 'CLOSED';
    priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    category: string;
    department: string;
    requester: {
        id: string;
        name: string;
        email: string;
        avatar?: string;
    };
    assignee: {
        id: string;
        name: string;
        email: string;
        avatar?: string;
    } | null;
    createdAt: string;
    updatedAt: string;
    closedAt?: string;
}

interface Comment {
    id: string;
    content: string;
    authorId: string;
    authorName: string;
    authorRole: 'ADMIN' | 'AGENT' | 'EMPLOYEE';
    createdAt: string;
    updatedAt?: string;
    isInternal: boolean;
}

interface TicketEvent {
    id: string;
    type: 'status_change' | 'priority_change' | 'assignment' | 'comment' | 'edit' | 'created' | 'reopened' | 'deleted';
    description: string;
    performedBy: string;
    performedByRole: 'ADMIN' | 'AGENT' | 'EMPLOYEE' | 'SYSTEM';
    timestamp: string;
    oldValue?: string;
    newValue?: string;
    metadata?: Record<string, any>;
}

interface TicketDetailsModalProps {
    ticket: Ticket;
    comments: Comment[];
    events: TicketEvent[];
    isOpen: boolean;
    onClose: () => void;
    onEdit: (ticket: Ticket) => void;
    onAssign: (ticket: Ticket) => void;
    onDelete: (ticketId: string) => void;
    onAddComment: (content: string, isInternal: boolean) => void;
    onEditComment: (commentId: string, content: string) => void;
    onDeleteComment: (commentId: string) => void;
    currentUserId: string;
    currentUserRole: 'ADMIN' | 'AGENT' | 'EMPLOYEE';
}

export default function TicketDetailsModal({
    ticket,
    comments,
    events,
    isOpen,
    onClose,
    onEdit,
    onAssign,
    onDelete,
    onAddComment,
    onEditComment,
    onDeleteComment,
    currentUserId,
    currentUserRole
}: TicketDetailsModalProps) {
    const [activeTab, setActiveTab] = useState<'details' | 'comments' | 'timeline'>('details');

    if (!isOpen) return null;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'OPEN': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'IN_PROGRESS': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'RESOLVED': return 'bg-green-100 text-green-700 border-green-200';
            case 'OVERDUE': return 'bg-red-100 text-red-700 border-red-200';
            case 'CLOSED': return 'bg-gray-100 text-gray-700 border-gray-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'CRITICAL': return 'bg-red-100 text-red-700 border-red-200';
            case 'HIGH': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'MEDIUM': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'LOW': return 'bg-green-100 text-green-700 border-green-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    const copyTicketId = () => {
        navigator.clipboard.writeText(ticket.id);
        // You could add a toast notification here
    };

    const handleDeleteConfirm = () => {
        if (window.confirm('Are you sure you want to delete this ticket? This action cannot be undone.')) {
            onDelete(ticket.id);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-4 mx-auto p-0 border w-full max-w-6xl shadow-lg rounded-lg bg-white mb-8">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-4">
                        <div>
                            <div className="flex items-center space-x-2">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {ticket.title}
                                </h2>
                                <button
                                    onClick={copyTicketId}
                                    className="flex items-center text-sm text-blue-600 hover:text-blue-700"
                                    title="Copy ticket ID"
                                >
                                    {ticket.id}
                                    <Copy className="w-3 h-3 ml-1" />
                                </button>
                            </div>
                            <div className="flex items-center space-x-4 mt-2">
                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(ticket.status)}`}>
                                    {ticket.status.replace('_', ' ')}
                                </span>
                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(ticket.priority)}`}>
                                    {ticket.priority}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        {/* Action Buttons */}
                        <Button
                            onClick={() => onEdit(ticket)}
                            variant="outline"
                            size="sm"
                            className="border-gray-300"
                        >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                        </Button>
                        <Button
                            onClick={() => onAssign(ticket)}
                            variant="outline"
                            size="sm"
                            className="border-gray-300"
                        >
                            <UserPlus className="w-4 h-4 mr-1" />
                            Assign
                        </Button>
                        {currentUserRole === 'ADMIN' && (
                            <Button
                                onClick={handleDeleteConfirm}
                                variant="outline"
                                size="sm"
                                className="border-red-300 text-red-600 hover:bg-red-50"
                            >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Delete
                            </Button>
                        )}
                        <Button
                            onClick={onClose}
                            variant="ghost"
                            size="icon"
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 px-6">
                        <button
                            onClick={() => setActiveTab('details')}
                            className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'details'
                                ? 'border-green-500 text-green-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Details
                        </button>
                        <button
                            onClick={() => setActiveTab('comments')}
                            className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'comments'
                                ? 'border-green-500 text-green-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Comments
                            {comments.length > 0 && (
                                <span className="ml-2 bg-gray-100 text-gray-600 text-xs rounded-full px-2 py-1">
                                    {comments.length}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('timeline')}
                            className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'timeline'
                                ? 'border-green-500 text-green-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Timeline
                            {events.length > 0 && (
                                <span className="ml-2 bg-gray-100 text-gray-600 text-xs rounded-full px-2 py-1">
                                    {events.length}
                                </span>
                            )}
                        </button>
                    </nav>
                </div>

                {/* Content */}
                <div className="p-6 max-h-96 overflow-y-auto">
                    {activeTab === 'details' && (
                        <div className="space-y-6">
                            {/* Ticket Information Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Column */}
                                <div className="space-y-4">
                                    {/* Description */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Description
                                        </label>
                                        <div className="p-3 bg-gray-50 rounded-md text-sm text-gray-900 whitespace-pre-wrap">
                                            {ticket.description}
                                        </div>
                                    </div>

                                    {/* Requester */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <User className="w-4 h-4 inline mr-1" />
                                            Requested By
                                        </label>
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                                                <span className="text-sm font-semibold text-white">
                                                    {getInitials(ticket.requester.name)}
                                                </span>
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {ticket.requester.name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {ticket.requester.email}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Assignee */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <UserPlus className="w-4 h-4 inline mr-1" />
                                            Assigned To
                                        </label>
                                        {ticket.assignee ? (
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                                                    <span className="text-sm font-semibold text-white">
                                                        {getInitials(ticket.assignee.name)}
                                                    </span>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {ticket.assignee.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {ticket.assignee.email}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-sm text-gray-500 italic">
                                                Not assigned
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-4">
                                    {/* Category & Department */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <FolderOpen className="w-4 h-4 inline mr-1" />
                                                Category
                                            </label>
                                            <div className="text-sm text-gray-900">
                                                {ticket.category}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <Building2 className="w-4 h-4 inline mr-1" />
                                                Department
                                            </label>
                                            <div className="text-sm text-gray-900">
                                                {ticket.department}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Timestamps */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Calendar className="w-4 h-4 inline mr-1" />
                                            Timestamps
                                        </label>
                                        <div className="space-y-1 text-sm">
                                            <div>
                                                <span className="text-gray-600">Created:</span>
                                                <span className="ml-2 text-gray-900">
                                                    {formatDate(ticket.createdAt)}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Updated:</span>
                                                <span className="ml-2 text-gray-900">
                                                    {formatDate(ticket.updatedAt)}
                                                </span>
                                            </div>
                                            {ticket.closedAt && (
                                                <div>
                                                    <span className="text-gray-600">Closed:</span>
                                                    <span className="ml-2 text-gray-900">
                                                        {formatDate(ticket.closedAt)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'comments' && (
                        <TicketCommentsSection
                            ticketId={ticket.id}
                            comments={comments}
                            onAddComment={onAddComment}
                            onEditComment={onEditComment}
                            onDeleteComment={onDeleteComment}
                            currentUserId={currentUserId}
                            currentUserRole={currentUserRole}
                        />
                    )}

                    {activeTab === 'timeline' && (
                        <TicketTimeline
                            ticketId={ticket.id}
                            events={events}
                            showAllEvents={false}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
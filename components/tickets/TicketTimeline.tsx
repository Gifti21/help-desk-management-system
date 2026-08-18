'use client';

import React from 'react';
import {
    Clock,
    User,
    AlertTriangle,
    CheckCircle,
    UserPlus,
    Edit,
    MessageSquare,
    Settings,
    Flag,
    ArrowUpCircle,
    ArrowDownCircle,
    RotateCcw,
    Trash2,
    FileText
} from 'lucide-react';

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

interface TicketTimelineProps {
    ticketId: string;
    events: TicketEvent[];
    showAllEvents?: boolean;
}

interface TimelineEventItemProps {
    event: TicketEvent;
    isFirst: boolean;
    isLast: boolean;
}

function TimelineEventItem({ event, isFirst, isLast }: TimelineEventItemProps) {
    const getEventIcon = (type: string) => {
        switch (type) {
            case 'created': return { icon: FileText, color: 'bg-blue-500' };
            case 'status_change': return { icon: Settings, color: 'bg-purple-500' };
            case 'priority_change': return { icon: Flag, color: 'bg-orange-500' };
            case 'assignment': return { icon: UserPlus, color: 'bg-green-500' };
            case 'comment': return { icon: MessageSquare, color: 'bg-blue-500' };
            case 'edit': return { icon: Edit, color: 'bg-gray-500' };
            case 'reopened': return { icon: RotateCcw, color: 'bg-yellow-500' };
            case 'deleted': return { icon: Trash2, color: 'bg-red-500' };
            default: return { icon: Clock, color: 'bg-gray-400' };
        }
    };

    const getValueChangeDisplay = (type: string, oldValue?: string, newValue?: string) => {
        if (!oldValue && !newValue) return null;

        const getStatusColor = (status: string) => {
            switch (status?.toLowerCase()) {
                case 'open': return 'bg-orange-100 text-orange-700';
                case 'in_progress': return 'bg-blue-100 text-blue-700';
                case 'resolved': return 'bg-green-100 text-green-700';
                case 'closed': return 'bg-gray-100 text-gray-700';
                case 'overdue': return 'bg-red-100 text-red-700';
                default: return 'bg-gray-100 text-gray-700';
            }
        };

        const getPriorityColor = (priority: string) => {
            switch (priority?.toLowerCase()) {
                case 'critical': return 'bg-red-100 text-red-700';
                case 'high': return 'bg-orange-100 text-orange-700';
                case 'medium': return 'bg-blue-100 text-blue-700';
                case 'low': return 'bg-green-100 text-green-700';
                default: return 'bg-gray-100 text-gray-700';
            }
        };

        const renderValueBadge = (value: string, type: string) => {
            const colorClass = type === 'status' ? getStatusColor(value) :
                type === 'priority' ? getPriorityColor(value) :
                    'bg-gray-100 text-gray-700';

            return (
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${colorClass}`}>
                    {value}
                </span>
            );
        };

        return (
            <div className="flex items-center space-x-2 mt-1">
                {oldValue && (
                    <>
                        {renderValueBadge(oldValue, type)}
                        <ArrowRightIcon />
                    </>
                )}
                {newValue && renderValueBadge(newValue, type)}
            </div>
        );
    };

    const ArrowRightIcon = () => (
        <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
    );

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        return {
            date: date.toLocaleDateString(),
            time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'ADMIN': return 'text-blue-600';
            case 'AGENT': return 'text-purple-600';
            case 'EMPLOYEE': return 'text-gray-600';
            case 'SYSTEM': return 'text-green-600';
            default: return 'text-gray-600';
        }
    };

    const { icon: EventIcon, color } = getEventIcon(event.type);
    const { date, time } = formatTimestamp(event.timestamp);

    return (
        <div className="relative flex items-start space-x-4 pb-6">
            {/* Timeline Line */}
            {!isLast && (
                <div className="absolute left-4 top-8 w-0.5 h-full bg-gray-200" />
            )}

            {/* Event Icon */}
            <div className={`flex-shrink-0 w-8 h-8 rounded-full ${color} flex items-center justify-center`}>
                <EventIcon className="w-4 h-4 text-white" />
            </div>

            {/* Event Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        {/* Event Description */}
                        <p className="text-sm text-gray-900 font-medium">
                            {event.description}
                        </p>

                        {/* Value Changes */}
                        {(event.type === 'status_change' || event.type === 'priority_change') && (
                            <div className="mt-2">
                                {getValueChangeDisplay(
                                    event.type.split('_')[0],
                                    event.oldValue,
                                    event.newValue
                                )}
                            </div>
                        )}

                        {/* Assignment Changes */}
                        {event.type === 'assignment' && (
                            <div className="mt-2 flex items-center space-x-2 text-sm">
                                {event.oldValue && (
                                    <>
                                        <span className="text-gray-600">From:</span>
                                        <span className="font-medium">{event.oldValue}</span>
                                        <ArrowRightIcon />
                                    </>
                                )}
                                <span className="text-gray-600">To:</span>
                                <span className="font-medium">{event.newValue || 'Unassigned'}</span>
                            </div>
                        )}

                        {/* Performed By */}
                        <div className="flex items-center space-x-2 mt-2">
                            <User className="w-3 h-3 text-gray-400" />
                            <span className={`text-xs font-medium ${getRoleColor(event.performedByRole)}`}>
                                {event.performedBy}
                            </span>
                            <span className="text-xs text-gray-500">
                                ({event.performedByRole.toLowerCase()})
                            </span>
                        </div>
                    </div>

                    {/* Timestamp */}
                    <div className="flex-shrink-0 text-right">
                        <div className="text-xs text-gray-500 font-medium">{time}</div>
                        <div className="text-xs text-gray-400">{date}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function TicketTimeline({
    ticketId,
    events,
    showAllEvents = false
}: TicketTimelineProps) {
    const [showAll, setShowAll] = React.useState(showAllEvents);

    // Sort events by timestamp (newest first for timeline)
    const sortedEvents = [...events].sort((a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Show only last 5 events by default, unless showAll is true
    const displayEvents = showAll ? sortedEvents : sortedEvents.slice(0, 5);
    const hasMoreEvents = sortedEvents.length > 5;

    if (events.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No activity yet</p>
                <p className="text-xs">Ticket activity will appear here</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                        Activity Timeline
                    </h3>
                    <span className="text-sm text-gray-500">
                        ({events.length} {events.length === 1 ? 'event' : 'events'})
                    </span>
                </div>

                {/* Show All Toggle */}
                {hasMoreEvents && (
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                        {showAll ? 'Show Recent' : `Show All (${events.length})`}
                    </button>
                )}
            </div>

            {/* Timeline Events */}
            <div className="space-y-0">
                {displayEvents.map((event, index) => (
                    <TimelineEventItem
                        key={event.id}
                        event={event}
                        isFirst={index === 0}
                        isLast={index === displayEvents.length - 1}
                    />
                ))}
            </div>

            {/* Show More Button */}
            {!showAll && hasMoreEvents && (
                <div className="text-center pt-4 border-t border-gray-100">
                    <button
                        onClick={() => setShowAll(true)}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center mx-auto"
                    >
                        <ArrowDownCircle className="w-4 h-4 mr-1" />
                        Show {sortedEvents.length - 5} more events
                    </button>
                </div>
            )}

            {/* Collapse Button */}
            {showAll && hasMoreEvents && (
                <div className="text-center pt-4 border-t border-gray-100">
                    <button
                        onClick={() => setShowAll(false)}
                        className="text-sm text-gray-600 hover:text-gray-700 font-medium flex items-center mx-auto"
                    >
                        <ArrowUpCircle className="w-4 h-4 mr-1" />
                        Show less
                    </button>
                </div>
            )}
        </div>
    );
}
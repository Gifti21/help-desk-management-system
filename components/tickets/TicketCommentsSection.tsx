'use client';

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
    MessageSquare,
    Send,
    Clock,
    Shield,
    Eye,
    EyeOff,
    Edit,
    Trash2,
    User
} from 'lucide-react';

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

interface TicketCommentsSectionProps {
    ticketId: string;
    comments: Comment[];
    onAddComment: (content: string, isInternal: boolean) => void;
    onEditComment: (commentId: string, content: string) => void;
    onDeleteComment: (commentId: string) => void;
    currentUserId: string;
    currentUserRole: 'ADMIN' | 'AGENT' | 'EMPLOYEE';
}

interface CommentItemProps {
    comment: Comment;
    onEdit: (commentId: string, content: string) => void;
    onDelete: (commentId: string) => void;
    canEdit: boolean;
    canDelete: boolean;
}

function CommentItem({ comment, onEdit, onDelete, canEdit, canDelete }: CommentItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);

    const handleSaveEdit = () => {
        if (editContent.trim()) {
            onEdit(comment.id, editContent);
            setIsEditing(false);
        }
    };

    const handleCancelEdit = () => {
        setEditContent(comment.content);
        setIsEditing(false);
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'ADMIN': return 'text-blue-600 bg-blue-100';
            case 'AGENT': return 'text-purple-600 bg-purple-100';
            case 'EMPLOYEE': return 'text-gray-600 bg-gray-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className={`flex space-x-3 p-4 rounded-lg border ${comment.isInternal ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-200'}`}>
            {/* Avatar */}
            <div className="flex-shrink-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${getRoleColor(comment.authorRole)}`}>
                    {getInitials(comment.authorName)}
                </div>
            </div>

            {/* Comment Content */}
            <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900 text-sm">
                            {comment.authorName}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(comment.authorRole)}`}>
                            {comment.authorRole}
                        </span>
                        {comment.isInternal && (
                            <span className="flex items-center text-xs text-amber-600">
                                <EyeOff className="h-3 w-3 mr-1" />
                                Internal
                            </span>
                        )}
                    </div>

                    <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatTimestamp(comment.createdAt)}
                        </span>

                        {/* Actions */}
                        {(canEdit || canDelete) && !isEditing && (
                            <div className="flex items-center space-x-1">
                                {canEdit && (
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => setIsEditing(true)}
                                        className="h-6 w-6 text-gray-400 hover:text-gray-600"
                                    >
                                        <Edit className="h-3 w-3" />
                                    </Button>
                                )}
                                {canDelete && (
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => onDelete(comment.id)}
                                        className="h-6 w-6 text-gray-400 hover:text-red-600"
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Content */}
                {isEditing ? (
                    <div className="space-y-3">
                        <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full p-3 text-sm border border-gray-200 rounded-md resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            rows={3}
                            placeholder="Edit your comment..."
                        />
                        <div className="flex items-center space-x-2">
                            <Button
                                size="sm"
                                onClick={handleSaveEdit}
                                className="bg-green-600 hover:bg-green-700 text-white"
                                disabled={!editContent.trim()}
                            >
                                Save
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={handleCancelEdit}
                                className="border-gray-300"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="text-sm text-gray-700 whitespace-pre-wrap">
                        {comment.content}
                    </div>
                )}

                {comment.updatedAt && comment.updatedAt !== comment.createdAt && !isEditing && (
                    <div className="text-xs text-gray-500 mt-2">
                        Edited {formatTimestamp(comment.updatedAt)}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function TicketCommentsSection({
    ticketId,
    comments,
    onAddComment,
    onEditComment,
    onDeleteComment,
    currentUserId,
    currentUserRole
}: TicketCommentsSectionProps) {
    const [newComment, setNewComment] = useState('');
    const [isInternal, setIsInternal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmitComment = async () => {
        if (!newComment.trim()) return;

        setIsSubmitting(true);
        try {
            await onAddComment(newComment.trim(), isInternal);
            setNewComment('');
            setIsInternal(false);
        } catch (error) {
            console.error('Error adding comment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            handleSubmitComment();
        }
    };

    const sortedComments = [...comments].sort((a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <div className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5 text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                        Comments ({comments.length})
                    </h3>
                </div>

                {/* Legend */}
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        Public
                    </div>
                    <div className="flex items-center">
                        <EyeOff className="h-3 w-3 mr-1" />
                        Internal
                    </div>
                </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4 max-h-96 overflow-y-auto">
                {sortedComments.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-sm">No comments yet</p>
                        <p className="text-xs">Be the first to add a comment</p>
                    </div>
                ) : (
                    sortedComments.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            onEdit={onEditComment}
                            onDelete={onDeleteComment}
                            canEdit={comment.authorId === currentUserId || currentUserRole === 'ADMIN'}
                            canDelete={comment.authorId === currentUserId || currentUserRole === 'ADMIN'}
                        />
                    ))
                )}
            </div>

            {/* Add Comment Form */}
            <div className="border-t border-gray-200 pt-4">
                <div className="space-y-3">
                    {/* Comment Input */}
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Add a comment... (Ctrl+Enter to submit)"
                        className="w-full p-3 text-sm border border-gray-200 rounded-md resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        rows={3}
                        disabled={isSubmitting}
                    />

                    {/* Form Actions */}
                    <div className="flex items-center justify-between">
                        {/* Internal Comment Toggle - Only for Admin/Agent */}
                        {(currentUserRole === 'ADMIN' || currentUserRole === 'AGENT') && (
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="internal-comment"
                                    checked={isInternal}
                                    onChange={(e) => setIsInternal(e.target.checked)}
                                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                />
                                <label htmlFor="internal-comment" className="text-sm text-gray-600 flex items-center">
                                    <Shield className="h-4 w-4 mr-1 text-amber-500" />
                                    Internal comment (staff only)
                                </label>
                            </div>
                        )}

                        <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">
                                Ctrl+Enter to submit
                            </span>
                            <Button
                                onClick={handleSubmitComment}
                                disabled={!newComment.trim() || isSubmitting}
                                className="bg-green-600 hover:bg-green-700 text-white"
                                size="sm"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                        Posting...
                                    </>
                                ) : (
                                    <>
                                        <Send className="h-4 w-4 mr-2" />
                                        Comment
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
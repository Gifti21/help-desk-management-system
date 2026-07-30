'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Comment, CreateCommentPayload } from '@/types/comment';

type UseCommentsResult = {
  comments: Comment[];
  loading: boolean;
  submitting: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  addComment: (payload: CreateCommentPayload) => Promise<boolean>;
};

export function useComments(ticketId: string): UseCommentsResult {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!ticketId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/tickets/${ticketId}/comments`);
      if (!response.ok) {
        throw new Error('Failed to load comments');
      }

      const data = await response.json();
      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load comments');
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  const addComment = useCallback(
    async (payload: CreateCommentPayload) => {
      if (!ticketId || !payload.content.trim()) return false;

      setSubmitting(true);
      setError(null);

      try {
        const response = await fetch(`/api/tickets/${ticketId}/comments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error('Failed to add comment');
        }

        const created = await response.json();
        setComments((current) => [...current, created]);
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to add comment');
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [ticketId]
  );

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    comments,
    loading,
    submitting,
    error,
    refresh,
    addComment,
  };
}

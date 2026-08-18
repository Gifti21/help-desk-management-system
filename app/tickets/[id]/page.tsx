'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { CommentThread } from '@/components/dashboard/CommentThread';
import { TicketSummaryCard } from '@/components/dashboard/TicketSummaryCard';
import { CommentForm } from '@/components/forms/CommentForm';
import { StatusUpdateForm } from '@/components/forms/StatusUpdateForm';
import { TicketActionBar } from '@/components/forms/TicketActionBar';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAuth } from '@/hooks/useAuth';
import { useComments } from '@/hooks/useComments';
import { useTicketDetails } from '@/hooks/useTicketDetails';
import { BODY_TEXT_GREY, PAGE_BACKGROUND, PRIMARY_TEXT } from '@/lib/colors';
import { FONT_FAMILY, BODY_SM } from '@/lib/fonts';
import type { TicketStatus } from '@/types/ticket';

type TicketDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default function TicketDetailPage({ params }: TicketDetailPageProps) {
  const { id } = use(params);
  const { canManageTicket } = useAuth();
  const { ticket, loading, error, updateStatus, closeTicket } = useTicketDetails(id);
  const { comments, loading: commentsLoading, submitting, addComment } = useComments(id);
  const [statusLoading, setStatusLoading] = useState(false);
  const [closing, setClosing] = useState(false);

  const canManage = ticket ? canManageTicket(ticket) : false;

  const handleStatusUpdate = async (status: TicketStatus) => {
    setStatusLoading(true);
    await updateStatus(status);
    setStatusLoading(false);
  };

  const handleCloseTicket = async () => {
    setClosing(true);
    await closeTicket();
    setClosing(false);
  };

  const handleAddComment = async (content: string) => {
    await addComment({ content });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: PAGE_BACKGROUND, fontFamily: FONT_FAMILY.primary }}>
      <main className="mx-auto w-full max-w-[1100px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/tickets">
            <Button variant="ghost" className="px-0">
              <ArrowLeft size={16} />
              Back to tickets
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner className="h-10 w-10" />
          </div>
        ) : error || !ticket ? (
          <EmptyState
            title="Ticket unavailable"
            description={error ?? 'The requested ticket could not be found.'}
          />
        ) : (
          <div className="space-y-6">
            <TicketSummaryCard ticket={ticket} />

            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-6">
                <CommentThread comments={comments} loading={commentsLoading} />
                <CommentForm
                  disabled={ticket.status === 'CLOSED'}
                  loading={submitting}
                  onSubmit={handleAddComment}
                />
              </div>

              <div className="space-y-6">
                <StatusUpdateForm
                  currentStatus={ticket.status}
                  disabled={!canManage}
                  loading={statusLoading}
                  onSubmit={handleStatusUpdate}
                />

                <TicketActionBar
                  canManage={canManage}
                  isClosed={ticket.status === 'CLOSED'}
                  closing={closing}
                  onCloseTicket={handleCloseTicket}
                />

                {!canManage ? (
                  <p style={{ color: BODY_TEXT_GREY, fontSize: BODY_SM.size }}>
                    Status changes and ticket closure are restricted to the assigned support agent.
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

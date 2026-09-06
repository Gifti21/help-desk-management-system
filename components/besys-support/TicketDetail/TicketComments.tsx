import { useEffect, useState } from "react";
import { Send } from "lucide-react";
import {
  DARK_GREEN,
  BORDER_GREY,
  BODY_TEXT_GREY,
  PRIMARY_TEXT,
  PAGE_BACKGROUND,
  INPUT_BORDER,
  TEAL_PRIMARY,
} from "@/lib/colors";
import {
  HEADING_LG,
  BODY_REGULAR,
  BODY_SM,
  INPUT_REGULAR,
  FONT_FAMILY,
  FONT_WEIGHT,
} from "@/lib/fonts";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import type { Ticket, Comment } from "@/lib/types/ticket";

interface TicketCommentsProps {
  ticket: Ticket;
}

export function TicketComments({ ticket }: TicketCommentsProps) {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(ticket.comments);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setComments(ticket.comments);
  }, [ticket.comments]);

  const handleAddComment = async () => {
    if (newComment.trim() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        const response = await fetch(`/api/tickets/${ticket.id}/comments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ content: newComment.trim() }),
        });

        if (!response.ok) {
          const result = await response.json();
          throw new Error(result.error || "Failed to post comment");
        }

        const comment = await response.json();
        const authorName = comment.author
          ? `${comment.author.firstName} ${comment.author.lastName}`
          : "You";
        setComments((current) => [
          ...current,
          {
            id: comment.id,
            author: authorName,
            initials: authorName
              .split(" ")
              .map((name: string) => name[0])
              .join("")
              .slice(0, 2)
              .toUpperCase(),
            role: "Employee",
            timestamp: new Date(comment.createdAt).toLocaleString(),
            message: comment.content,
          },
        ]);
        setNewComment("");
        toast("Comment posted successfully!", "success");
      } catch (error) {
        toast(
          error instanceof Error ? error.message : "Failed to post comment",
          "error",
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Card
      variant="elevated"
      className="p-6"
      style={{ borderColor: BORDER_GREY }}
    >
      <h2
        className="mb-6"
        style={{
          fontFamily: FONT_FAMILY.primary,
          fontSize: HEADING_LG.size,
          lineHeight: HEADING_LG.lineHeight,
          fontWeight: HEADING_LG.weight,
          letterSpacing: HEADING_LG.letterSpacing,
          color: DARK_GREEN,
        }}
      >
        Comments ({comments.length})
      </h2>

      <div className="space-y-6 mb-6">
        {comments.map((comment: Comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>

      {/* Comment Input */}
      <div className="pt-6 border-t" style={{ borderColor: BORDER_GREY }}>
        <div className="flex gap-4">
          <Avatar initials="JS" size="md" />
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              rows={3}
              className="w-full rounded-2xl border px-4 py-3 outline-none transition focus:ring-2 resize-none mb-3"
              style={
                {
                  fontFamily: FONT_FAMILY.primary,
                  fontSize: INPUT_REGULAR.size,
                  lineHeight: INPUT_REGULAR.lineHeight,
                  fontWeight: INPUT_REGULAR.weight,
                  letterSpacing: INPUT_REGULAR.letterSpacing,
                  color: PRIMARY_TEXT,
                  borderColor: INPUT_BORDER,
                  backgroundColor: PAGE_BACKGROUND,
                  "--tw-ring-color": TEAL_PRIMARY,
                  "--tw-ring-color-light": "rgba(47, 217, 196, 0.2)",
                } as React.CSSProperties
              }
            />
            <div className="flex justify-end">
              <Button
                variant="primary"
                size="md"
                onClick={handleAddComment}
                disabled={!newComment.trim() || isSubmitting}
              >
                <Send className="h-4 w-4 mr-2" />
                Post Comment
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

interface CommentItemProps {
  comment: Comment;
}

function CommentItem({ comment }: CommentItemProps) {
  return (
    <div className="flex gap-4">
      <Avatar initials={comment.initials} size="md" />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span
            style={{
              fontFamily: FONT_FAMILY.primary,
              fontSize: BODY_REGULAR.size,
              lineHeight: BODY_REGULAR.lineHeight,
              fontWeight: FONT_WEIGHT.semibold,
              letterSpacing: BODY_REGULAR.letterSpacing,
              color: DARK_GREEN,
            }}
          >
            {comment.author}
          </span>
          <span
            className="px-2 py-0.5 rounded text-xs"
            style={{
              fontFamily: FONT_FAMILY.primary,
              fontSize: BODY_SM.size,
              lineHeight: BODY_SM.lineHeight,
              fontWeight: FONT_WEIGHT.medium,
              letterSpacing: BODY_SM.letterSpacing,
              color: BODY_TEXT_GREY,
              backgroundColor: PAGE_BACKGROUND,
              border: `1px solid ${BORDER_GREY}`,
            }}
          >
            {comment.role}
          </span>
          <span
            className="text-sm"
            style={{
              fontFamily: FONT_FAMILY.primary,
              fontSize: BODY_SM.size,
              lineHeight: BODY_SM.lineHeight,
              fontWeight: BODY_SM.weight,
              letterSpacing: BODY_SM.letterSpacing,
              color: BODY_TEXT_GREY,
            }}
          >
            • {comment.timestamp}
          </span>
        </div>
        <p
          style={{
            fontFamily: FONT_FAMILY.primary,
            fontSize: BODY_REGULAR.size,
            lineHeight: BODY_REGULAR.lineHeight,
            fontWeight: BODY_REGULAR.weight,
            letterSpacing: BODY_REGULAR.letterSpacing,
            color: PRIMARY_TEXT,
          }}
        >
          {comment.message}
        </p>
      </div>
    </div>
  );
}

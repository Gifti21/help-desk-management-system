'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/Textarea';
import { BODY_TEXT_GREY, PRIMARY_TEXT } from '@/lib/colors';
import { BODY_SM, FONT_FAMILY, HEADING_SM } from '@/lib/fonts';

interface CommentFormProps {
  disabled?: boolean;
  loading?: boolean;
  onSubmit: (content: string) => Promise<void> | void;
}

export function CommentForm({
  disabled = false,
  loading = false,
  onSubmit,
}: CommentFormProps) {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!content.trim()) {
      setError('Please enter a comment.');
      return;
    }

    setError('');
    await onSubmit(content.trim());
    setContent('');
  };

  return (
    <Card>
      <div className="space-y-4">
        <div>
          <h2
            style={{
              color: PRIMARY_TEXT,
              fontFamily: FONT_FAMILY.primary,
              fontSize: HEADING_SM.size,
              fontWeight: HEADING_SM.weight,
            }}
          >
            Add Comment
          </h2>
          <p style={{ color: BODY_TEXT_GREY, fontSize: BODY_SM.size }}>
            Share an update with the requester and support team.
          </p>
        </div>

        <Textarea
          label="Comment"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          rows={4}
          maxLength={1000}
          disabled={disabled || loading}
          error={error}
          placeholder="Write your update here..."
        />

        <div className="flex justify-end">
          <Button loading={loading} disabled={disabled} onClick={() => void handleSubmit()}>
            Post Comment
          </Button>
        </div>
      </div>
    </Card>
  );
}

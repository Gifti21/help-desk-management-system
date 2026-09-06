import {
  DARK_GREEN,
  TEAL_PRIMARY,
  BORDER_GREY,
  BODY_TEXT_GREY,
  PRIMARY_TEXT,
  INPUT_BORDER,
  PAGE_BACKGROUND,
} from "@/lib/colors";
import {
  BODY_REGULAR,
  FONT_FAMILY,
  FONT_WEIGHT,
  INPUT_REGULAR,
} from "@/lib/fonts";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/button";
import type { TicketPriority } from "@/lib/types/ticket";

interface TicketFormProps {
  title: string;
  description: string;
  categoryId: string;
  priority: TicketPriority;
  isSubmitting: boolean;
  isFormReady: boolean;
  isLoadingFormData: boolean;
  formData: {
    categories: Array<{ id: string; name: string }>;
  };
  error: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onPriorityChange: (value: TicketPriority) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function TicketForm({
  title,
  description,
  categoryId,
  priority,
  isSubmitting,
  isFormReady,
  isLoadingFormData,
  formData,
  error,
  onTitleChange,
  onDescriptionChange,
  onCategoryChange,
  onPriorityChange,
  onSubmit,
  onCancel,
}: TicketFormProps) {
  return (
    <Card
      variant="elevated"
      className="p-8"
      style={{ borderColor: BORDER_GREY }}
    >
      {error && (
        <div
          className="mb-6 p-4 rounded-2xl border"
          style={{
            borderColor: '#ef4444',
            backgroundColor: '#fef2f2',
            color: '#dc2626',
          }}
        >
          <p style={{ fontFamily: FONT_FAMILY.primary, fontSize: BODY_REGULAR.size }}>
            {error}
          </p>
        </div>
      )}

      {isLoadingFormData ? (
        <div className="text-center py-8">
          <p
            style={{
              fontFamily: FONT_FAMILY.primary,
              fontSize: BODY_REGULAR.size,
              color: BODY_TEXT_GREY,
            }}
          >
            Loading form data...
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="mb-2 block font-semibold"
              style={{
                fontFamily: FONT_FAMILY.primary,
                fontSize: BODY_REGULAR.size,
                lineHeight: BODY_REGULAR.lineHeight,
                fontWeight: FONT_WEIGHT.semibold,
                letterSpacing: BODY_REGULAR.letterSpacing,
                color: DARK_GREEN,
              }}
            >
              Title *
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Brief summary of the issue"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-2 block font-semibold"
              style={{
                fontFamily: FONT_FAMILY.primary,
                fontSize: BODY_REGULAR.size,
                lineHeight: BODY_REGULAR.lineHeight,
                fontWeight: FONT_WEIGHT.semibold,
                letterSpacing: BODY_REGULAR.letterSpacing,
                color: DARK_GREEN,
              }}
            >
              Description *
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="Provide detailed information about the issue"
              rows={6}
              className="w-full rounded-2xl border px-4 py-3 outline-none transition focus:ring-2 resize-none"
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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="category"
                className="mb-2 block font-semibold"
                style={{
                  fontFamily: FONT_FAMILY.primary,
                  fontSize: BODY_REGULAR.size,
                  lineHeight: BODY_REGULAR.lineHeight,
                  fontWeight: FONT_WEIGHT.semibold,
                  letterSpacing: BODY_REGULAR.letterSpacing,
                  color: DARK_GREEN,
                }}
              >
                Category *
              </label>
              <Select
                id="category"
                value={categoryId}
                onChange={(e) => onCategoryChange(e.target.value)}
              >
                <option value="">Select a category...</option>
                {formData.categories.length > 0 ? (
                  formData.categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))
                ) : (
                  <option disabled>No categories available</option>
                )}
              </Select>
            </div>

            <div>
              <label
                htmlFor="priority"
                className="mb-2 block font-semibold"
                style={{
                  fontFamily: FONT_FAMILY.primary,
                  fontSize: BODY_REGULAR.size,
                  lineHeight: BODY_REGULAR.lineHeight,
                  fontWeight: FONT_WEIGHT.semibold,
                  letterSpacing: BODY_REGULAR.letterSpacing,
                  color: DARK_GREEN,
                }}
              >
                Priority
              </label>
              <Select
                id="priority"
                value={priority}
                onChange={(e) =>
                  onPriorityChange(e.target.value as TicketPriority)
                }
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </Select>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
            <Button
              type="submit"
              disabled={!isFormReady || isSubmitting}
              size="md"
              variant="primary"
              className="w-full sm:w-auto"
            >
              {isSubmitting ? "Creating..." : "Create Ticket"}
            </Button>
            <button
              type="button"
              onClick={onCancel}
              className="w-full rounded-2xl border px-6 py-3 transition focus-visible:outline-none focus-visible:ring-2 sm:w-auto"
              style={
                {
                  fontFamily: FONT_FAMILY.primary,
                  fontSize: BODY_REGULAR.size,
                  lineHeight: BODY_REGULAR.lineHeight,
                  fontWeight: FONT_WEIGHT.semibold,
                  letterSpacing: BODY_REGULAR.letterSpacing,
                  color: BODY_TEXT_GREY,
                  borderColor: BORDER_GREY,
                  backgroundColor: PAGE_BACKGROUND,
                  "--tw-ring-color": TEAL_PRIMARY,
                } as React.CSSProperties
              }
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = PAGE_BACKGROUND)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = PAGE_BACKGROUND)
              }
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </Card>
  );
}

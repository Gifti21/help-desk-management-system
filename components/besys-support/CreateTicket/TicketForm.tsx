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
import type { TicketCategory, TicketPriority } from "@/lib/types/ticket";

interface TicketFormProps {
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  isSubmitting: boolean;
  isFormReady: boolean;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onCategoryChange: (value: TicketCategory) => void;
  onPriorityChange: (value: TicketPriority) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function TicketForm({
  title,
  description,
  category,
  priority,
  isSubmitting,
  isFormReady,
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
              Category
            </label>
            <Select
              id="category"
              value={category}
              onChange={(e) =>
                onCategoryChange(e.target.value as TicketCategory)
              }
            >
              <option value="Hardware">Hardware</option>
              <option value="Software">Software</option>
              <option value="Network">Network</option>
              <option value="Account Access">Account Access</option>
              <option value="Other">Other</option>
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
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </Select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button
            type="submit"
            disabled={!isFormReady || isSubmitting}
            fullWidth
            size="md"
            variant="primary"
          >
            {isSubmitting ? "Creating..." : "Create Ticket"}
          </Button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-2xl border transition focus-visible:outline-none focus-visible:ring-2"
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
    </Card>
  );
}

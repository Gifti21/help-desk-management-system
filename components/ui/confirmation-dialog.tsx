"use client";

import React, { useEffect, useRef } from "react";
import { AlertTriangle, X } from "lucide-react";
import { useTheme } from "../providers/ThemeProvider";
import { colors } from "@/lib/colors";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "default";
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
}: ConfirmationDialogProps) {
  const { colors: theme } = useTheme();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();

      if (event.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    dialogRef.current?.querySelector<HTMLElement>("button")?.focus();
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          iconBg: "#FEE2E2",
          iconColor: "#DC2626",
          buttonBg: "#EF4444",
          buttonText: "#FFFFFF",
        };
      case "warning":
        return {
          iconBg: "#FEF3C7",
          iconColor: "#D97706",
          buttonBg: "#F59E0B",
          buttonText: "#000000",
        };
      case "default":
        return {
          iconBg: "#DBEAFE",
          iconColor: colors.tealPrimary,
          buttonBg: colors.tealPrimary,
          buttonText: "#16332B",
        };
      default:
        return {
          iconBg: "#FEE2E2",
          iconColor: "#DC2626",
          buttonBg: "#EF4444",
          buttonText: "#FFFFFF",
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        className="relative rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 animate-[scaleIn_0.2s_ease-out]"
        style={{
          backgroundColor: theme.card,
          borderColor: theme.cardBorder,
          border: "1px solid",
        }}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirmation-dialog-title"
        aria-describedby="confirmation-dialog-message"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg hover:opacity-80 transition-colors"
          style={{
            color: colors.bodyTextGrey,
          }}
          aria-label="Close confirmation dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
            style={{
              backgroundColor: styles.iconBg,
              color: styles.iconColor,
            }}
          >
            <AlertTriangle className="w-7 h-7" />
          </div>

          <h3
            id="confirmation-dialog-title"
            className="text-lg font-bold mb-2"
            style={{ color: theme.foreground }}
          >
            {title}
          </h3>
          <p
            id="confirmation-dialog-message"
            className="text-sm mb-6 max-w-sm"
            style={{ color: colors.bodyTextGrey }}
          >
            {message}
          </p>

          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-medium rounded-xl transition-colors"
              style={{
                backgroundColor: colors.lightTealBg,
                color: theme.foreground,
              }}
            >
              {cancelLabel}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 px-4 py-2.5 text-sm font-medium rounded-xl transition-colors hover:opacity-90"
              style={{
                backgroundColor: styles.buttonBg,
                color: styles.buttonText,
              }}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

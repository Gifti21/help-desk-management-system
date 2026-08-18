"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { DARK_GREEN, BORDER_GREY, BODY_TEXT_GREY, PRIMARY_TEXT, PAGE_BACKGROUND, TEAL_PRIMARY } from "@/lib/colors";
import { FONT_FAMILY } from "@/lib/fonts";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChangePassword: (currentPassword: string, newPassword: string, confirmPassword: string) => void;
}

export function ChangePasswordModal({ isOpen, onClose, onChangePassword }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    setError("");
    onChangePassword(currentPassword, newPassword, confirmPassword);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    onClose();
  };

  const handleClose = () => {
    setError("");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Change Password">
      <div className="space-y-4">
        {error && (
          <div
            className="px-4 py-2 rounded-lg text-sm"
            style={{
              backgroundColor: "#FFF5F3",
              color: "#9F3D37",
              border: "1px solid #F1B8B4",
            }}
          >
            {error}
          </div>
        )}

        <div>
          <label
            className="block mb-2"
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: "14px",
              fontWeight: 600,
              color: "#1a1d1c",
            }}
          >
            Current Password
          </label>
          <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="w-full px-4 py-3 rounded-xl border outline-none transition focus:ring-2"
              style={{
                fontFamily: "system-ui, -apple-system, sans-serif",
                fontSize: "15px",
                fontWeight: 400,
                color: PRIMARY_TEXT,
                borderColor: BORDER_GREY,
                backgroundColor: PAGE_BACKGROUND,
                "--tw-ring-color": TEAL_PRIMARY,
              } as React.CSSProperties}
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: BODY_TEXT_GREY }}
            >
              {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div>
          <label
            className="block mb-2"
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: "14px",
              fontWeight: 600,
              color: "#1a1d1c",
            }}
          >
            New Password
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password (min. 8 characters)"
              className="w-full px-4 py-3 rounded-xl border outline-none transition focus:ring-2"
              style={{
                fontFamily: "system-ui, -apple-system, sans-serif",
                fontSize: "15px",
                fontWeight: 400,
                color: PRIMARY_TEXT,
                borderColor: BORDER_GREY,
                backgroundColor: PAGE_BACKGROUND,
                "--tw-ring-color": TEAL_PRIMARY,
              } as React.CSSProperties}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: BODY_TEXT_GREY }}
            >
              {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div>
          <label
            className="block mb-2"
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: "14px",
              fontWeight: 600,
              color: "#1a1d1c",
            }}
          >
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full px-4 py-3 rounded-xl border outline-none transition focus:ring-2"
              style={{
                fontFamily: "system-ui, -apple-system, sans-serif",
                fontSize: "15px",
                fontWeight: 400,
                color: PRIMARY_TEXT,
                borderColor: BORDER_GREY,
                backgroundColor: PAGE_BACKGROUND,
                "--tw-ring-color": TEAL_PRIMARY,
              } as React.CSSProperties}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: BODY_TEXT_GREY }}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="secondary" onClick={handleClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="flex-1">
            Update Password
          </Button>
        </div>
      </div>
    </Modal>
  );
}

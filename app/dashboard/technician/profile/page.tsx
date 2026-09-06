"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Button } from "@/components/ui/button";
import {
  PAGE_BACKGROUND,
  DARK_GREEN,
  BODY_TEXT_GREY,
  BORDER_GREY,
  PRIMARY_TEXT,
  TEAL_PRIMARY,
} from "@/lib/colors";
import { FONT_FAMILY, HEADING_LG, BODY_REGULAR, BODY_SM } from "@/lib/fonts";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Shield,
  Building2,
} from "lucide-react";
import {
  getAgentProfile,
  updateAgentProfile,
  changeAgentPassword,
} from "@/lib/api/agent";

export default function TechnicianProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [profile, setProfile] = useState({
    id: "",
    email: "",
    firstName: "",
    lastName: "",
    fullName: "",
    role: "AGENT",
    department: "No department",
  });

  const [originalProfile, setOriginalProfile] = useState(profile);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    void loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAgentProfile();
      const normalized = {
        id: data.id,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        fullName: `${data.firstName} ${data.lastName}`,
        role: "AGENT",
        department: "Support Team",
      };
      setProfile(normalized);
      setOriginalProfile(normalized);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (message: string, type: "success" | "error") => {
    if (type === "success") {
      setSuccessMessage(message);
      setTimeout(() => setSuccessMessage(null), 3000);
    } else {
      setError(message);
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleSave = async () => {
    if (!profile.firstName.trim()) {
      showToast("First name is required", "error");
      return;
    }
    if (!profile.lastName.trim()) {
      showToast("Last name is required", "error");
      return;
    }
    if (!profile.email.trim()) {
      showToast("Email is required", "error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profile.email)) {
      showToast("Please enter a valid email address", "error");
      return;
    }

    try {
      setIsSaving(true);
      const updated = await updateAgentProfile({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
      });

      const nextProfile = {
        id: updated.id,
        email: updated.email,
        firstName: updated.firstName,
        lastName: updated.lastName,
        fullName: `${updated.firstName} ${updated.lastName}`,
        role: "AGENT",
        department: "Support Team",
      };

      setProfile(nextProfile);
      setOriginalProfile(nextProfile);
      setIsEditing(false);
      showToast("Profile updated successfully", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to update profile", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setProfile(originalProfile);
    setIsEditing(false);
    showToast("Changes discarded", "error");
  };

  const handlePasswordChange = async () => {
    if (!passwordData.currentPassword) {
      setPasswordError("Current password is required");
      return;
    }
    if (!passwordData.newPassword) {
      setPasswordError("New password is required");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    try {
      setIsChangingPassword(true);
      setPasswordError("");
      await changeAgentPassword(passwordData);
      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      showToast("Password changed successfully", "success");
    } catch (err: any) {
      setPasswordError(err.message || "Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: PAGE_BACKGROUND }}
      >
        <Loader2
          className="h-8 w-8 animate-spin"
          style={{ color: TEAL_PRIMARY }}
        />
      </div>
    );
  }

  const initials =
    `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase();

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: PAGE_BACKGROUND }}
    >
      <Sidebar role="TECHNICIAN" />

      <div className="flex-1 lg:pl-64 flex flex-col">
        <DashboardHeader
          userName={profile.fullName || "Support Agent"}
          userInitials={initials || "SA"}
          role="TECHNICIAN"
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mb-6 sm:mb-8 flex items-center justify-between">
            <div>
              <h1
                style={{
                  fontFamily: FONT_FAMILY.primary,
                  fontSize: HEADING_LG.size,
                  lineHeight: HEADING_LG.lineHeight,
                  fontWeight: HEADING_LG.weight,
                  letterSpacing: HEADING_LG.letterSpacing,
                  color: DARK_GREEN,
                }}
              >
                My Profile
              </h1>
              <p
                style={{
                  fontFamily: FONT_FAMILY.primary,
                  fontSize: BODY_REGULAR.size,
                  lineHeight: BODY_REGULAR.lineHeight,
                  fontWeight: BODY_REGULAR.weight,
                  letterSpacing: BODY_REGULAR.letterSpacing,
                  color: BODY_TEXT_GREY,
                }}
              >
                Manage your account and support workspace preferences
              </p>
            </div>

            <div className="flex gap-3">
              {isEditing ? (
                <>
                  <Button
                    variant="secondary"
                    onClick={handleCancel}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
              )}
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {successMessage}
            </div>
          )}

          <div
            className="rounded-2xl border p-6 mb-6"
            style={{
              backgroundColor: "#ffffff",
              borderColor: BORDER_GREY,
              boxShadow: "0 1px 3px rgba(15, 23, 42, 0.05)",
            }}
          >
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div
                className="flex h-24 w-24 items-center justify-center rounded-full text-2xl font-bold"
                style={{ backgroundColor: TEAL_PRIMARY, color: DARK_GREEN }}
              >
                {initials}
              </div>

              <div className="flex-1">
                <div className="mb-2 flex items-center gap-3">
                  <h2
                    className="text-2xl font-bold"
                    style={{
                      color: PRIMARY_TEXT,
                      fontFamily: FONT_FAMILY.primary,
                    }}
                  >
                    {profile.fullName}
                  </h2>
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium"
                    style={{ backgroundColor: "#ecfeff", color: "#0f766e" }}
                  >
                    <Shield className="h-3.5 w-3.5" />
                    {profile.role}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm">
                  <span
                    className="flex items-center gap-2"
                    style={{ color: BODY_TEXT_GREY }}
                  >
                    <Mail className="h-4 w-4" />
                    {profile.email}
                  </span>
                  <span
                    className="flex items-center gap-2"
                    style={{ color: BODY_TEXT_GREY }}
                  >
                    <Building2 className="h-4 w-4" />
                    {profile.department}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div
            className="rounded-2xl border p-6"
            style={{
              backgroundColor: "#ffffff",
              borderColor: BORDER_GREY,
              boxShadow: "0 1px 3px rgba(15, 23, 42, 0.05)",
            }}
          >
            <div className="mb-4 flex items-center gap-2">
              <User className="h-5 w-5" style={{ color: TEAL_PRIMARY }} />
              <h3
                className="text-lg font-semibold"
                style={{ color: PRIMARY_TEXT, fontFamily: FONT_FAMILY.primary }}
              >
                Personal Information
              </h3>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label
                  className="mb-2 block text-[11px] font-mono uppercase tracking-wider"
                  style={{ color: BODY_TEXT_GREY }}
                >
                  First Name
                </label>
                <input
                  type="text"
                  value={profile.firstName}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      firstName: e.target.value,
                    }))
                  }
                  disabled={!isEditing}
                  className="w-full rounded-xl border px-4 py-3 text-sm outline-none disabled:bg-slate-100"
                  style={{
                    borderColor: BORDER_GREY,
                    color: PRIMARY_TEXT,
                    backgroundColor: isEditing ? "#ffffff" : "#f8fafc",
                  }}
                />
              </div>

              <div>
                <label
                  className="mb-2 block text-[11px] font-mono uppercase tracking-wider"
                  style={{ color: BODY_TEXT_GREY }}
                >
                  Last Name
                </label>
                <input
                  type="text"
                  value={profile.lastName}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      lastName: e.target.value,
                    }))
                  }
                  disabled={!isEditing}
                  className="w-full rounded-xl border px-4 py-3 text-sm outline-none disabled:bg-slate-100"
                  style={{
                    borderColor: BORDER_GREY,
                    color: PRIMARY_TEXT,
                    backgroundColor: isEditing ? "#ffffff" : "#f8fafc",
                  }}
                />
              </div>

              <div className="md:col-span-2">
                <label
                  className="mb-2 block text-[11px] font-mono uppercase tracking-wider"
                  style={{ color: BODY_TEXT_GREY }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, email: e.target.value }))
                  }
                  disabled={!isEditing}
                  className="w-full rounded-xl border px-4 py-3 text-sm outline-none disabled:bg-slate-100"
                  style={{
                    borderColor: BORDER_GREY,
                    color: PRIMARY_TEXT,
                    backgroundColor: isEditing ? "#ffffff" : "#f8fafc",
                  }}
                />
              </div>
            </div>

            <div
              className="mt-6 border-t pt-5"
              style={{ borderColor: BORDER_GREY }}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Lock className="h-5 w-5" style={{ color: TEAL_PRIMARY }} />
                  <h3
                    className="text-lg font-semibold"
                    style={{
                      color: PRIMARY_TEXT,
                      fontFamily: FONT_FAMILY.primary,
                    }}
                  >
                    Password
                  </h3>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => setShowPasswordModal(true)}
                >
                  Change Password
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div
            className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-xl"
            style={{ borderColor: BORDER_GREY }}
          >
            <h3
              className="mb-4 text-lg font-semibold"
              style={{ color: PRIMARY_TEXT }}
            >
              Change Password
            </h3>

            <div className="space-y-4">
              <div>
                <label
                  className="mb-2 block text-[11px] font-mono uppercase tracking-wider"
                  style={{ color: BODY_TEXT_GREY }}
                >
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        currentPassword: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border px-4 py-3 pr-10 text-sm outline-none"
                    style={{ borderColor: BORDER_GREY, color: PRIMARY_TEXT }}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                    onClick={() => setShowCurrentPassword((prev) => !prev)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label
                  className="mb-2 block text-[11px] font-mono uppercase tracking-wider"
                  style={{ color: BODY_TEXT_GREY }}
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border px-4 py-3 pr-10 text-sm outline-none"
                    style={{ borderColor: BORDER_GREY, color: PRIMARY_TEXT }}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label
                  className="mb-2 block text-[11px] font-mono uppercase tracking-wider"
                  style={{ color: BODY_TEXT_GREY }}
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border px-4 py-3 pr-10 text-sm outline-none"
                    style={{ borderColor: BORDER_GREY, color: PRIMARY_TEXT }}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {passwordError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                  {passwordError}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="secondary"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handlePasswordChange}
                  disabled={isChangingPassword}
                >
                  {isChangingPassword ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

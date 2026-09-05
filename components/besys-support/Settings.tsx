"use client";

import { useState, useEffect } from "react";
import { DARK_GREEN, PAGE_BACKGROUND, BODY_TEXT_GREY } from "@/lib/colors";
import { HEADING_LG, BODY_REGULAR, FONT_FAMILY } from "@/lib/fonts";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { ProfileSection } from "./Settings/ProfileSection";
import { NotificationSettings } from "./Settings/NotificationSettings";
import { QuickActions } from "./Settings/QuickActions";
import { ChangePasswordModal } from "./Settings/ChangePasswordModal";
import { NotificationPreferencesModal } from "./Settings/NotificationPreferencesModal";
import { SuccessToast } from "./Settings/SuccessToast";
import {
  getEmployeeProfile,
  updateEmployeeProfile,
  changeEmployeePassword,
} from "@/lib/api/employee";

export function Settings() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] =
    useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load profile data on mount
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const profile = await getEmployeeProfile();
      setFirstName(profile.firstName);
      setLastName(profile.lastName);
      setFullName(profile.fullName);
      setEmail(profile.email);
    } catch (err) {
      console.error("Failed to load profile:", err);
      setError(err instanceof Error ? err.message : "Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  const showSuccessToast = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleSaveProfile = async () => {
    try {
      setError(null);
      await updateEmployeeProfile({
        firstName,
        lastName,
        email,
      });
      setFullName(`${firstName} ${lastName}`);
      showSuccessToast("Profile updated successfully");
    } catch (err) {
      console.error("Failed to update profile:", err);
      setError(err instanceof Error ? err.message : "Failed to update profile");
    }
  };

  const handleChangePassword = async (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
  ) => {
    try {
      setError(null);
      await changeEmployeePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });
      setIsPasswordModalOpen(false);
      showSuccessToast("Password changed successfully");
    } catch (err) {
      console.error("Failed to change password:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to change password";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const handleSaveNotificationPreferences = (preferences: any) => {
    // Notification preferences - placeholder for future implementation
    showSuccessToast("Notification preferences saved");
  };

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: PAGE_BACKGROUND }}
      >
        <p
          style={{
            fontFamily: FONT_FAMILY.primary,
            fontSize: BODY_REGULAR.size,
            color: BODY_TEXT_GREY,
          }}
        >
          Loading profile...
        </p>
      </div>
    );
  }

  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: PAGE_BACKGROUND }}
    >
      <Sidebar role="EMPLOYEE" />

      <div className="flex-1 lg:pl-[280px] flex flex-col">
        <DashboardHeader
          userName={fullName}
          userInitials={initials}
          role="EMPLOYEE"
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mb-6 sm:mb-8">
            <h1
              className="mb-2"
              style={{
                fontFamily: FONT_FAMILY.primary,
                fontSize: HEADING_LG.size,
                lineHeight: HEADING_LG.lineHeight,
                fontWeight: HEADING_LG.weight,
                letterSpacing: HEADING_LG.letterSpacing,
                color: DARK_GREEN,
              }}
            >
              Settings
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
              Manage your account settings and preferences.
            </p>
          </div>

          {error && (
            <div
              className="mb-4 p-4 rounded"
              style={{ backgroundColor: "#fee", color: "#c00" }}
            >
              {error}
            </div>
          )}

          <ProfileSection
            name={`${firstName} ${lastName}`}
            email={email}
            onNameChange={(name) => {
              const [first, ...rest] = name.split(" ");
              setFirstName(first || "");
              setLastName(rest.join(" ") || "");
            }}
            onEmailChange={setEmail}
            onSave={handleSaveProfile}
          />

          <NotificationSettings
            notificationsEnabled={notificationsEnabled}
            onToggle={() => setNotificationsEnabled(!notificationsEnabled)}
          />

          <QuickActions
            onChangePassword={() => setIsPasswordModalOpen(true)}
            onNotificationPreferences={() => setIsNotificationsModalOpen(true)}
          />

          {successMessage && <SuccessToast message={successMessage} />}
        </main>
      </div>

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onChangePassword={handleChangePassword}
      />

      <NotificationPreferencesModal
        isOpen={isNotificationsModalOpen}
        onClose={() => setIsNotificationsModalOpen(false)}
        onSave={handleSaveNotificationPreferences}
      />
    </div>
  );
}

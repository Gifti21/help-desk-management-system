"use client";

import { useState } from "react";
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

export function Settings() {
  const [name, setName] = useState("Jamie Smith");
  const [email, setEmail] = useState("jamie.smith@besys.com");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Modal states
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const showSuccessToast = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleSaveProfile = () => {
    // TODO: connect to backend endpoint
    showSuccessToast("Profile updated successfully");
  };

  const handleChangePassword = (currentPassword: string, newPassword: string, confirmPassword: string) => {
    // TODO: connect to backend endpoint
    showSuccessToast("Password updated successfully");
  };

  const handleSaveNotificationPreferences = (preferences: any) => {
    // TODO: connect to backend endpoint
    showSuccessToast("Notification preferences saved");
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: PAGE_BACKGROUND }}>
      <Sidebar />
      
      <div className="flex-1 lg:ml-[280px]">
        <DashboardHeader userName="Jamie Smith" userInitials="JS" />
        
        <main className="p-4 sm:p-6 lg:p-8">
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

          <ProfileSection
            name={name}
            email={email}
            onNameChange={setName}
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

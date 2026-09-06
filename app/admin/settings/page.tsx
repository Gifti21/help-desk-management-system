"use client";

import { useState, useEffect } from "react";
import { PageLayout } from "../../../components/admin/PageLayout";
import { TopBar } from "../../../components/admin/TopBar";
import { ActionButton } from "../../../components/admin/ActionButton";
import { ConfirmationDialog } from "../../../components/ui/confirmation-dialog";
import { useToast } from "../../../components/ui/toast";
import { useTheme } from "../../../components/providers/ThemeProvider";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { fonts } from "@/lib/fonts";
import {
  Globe,
  Database,
  Shield,
  Save,
  RotateCcw,
  Loader2,
} from "lucide-react";
import {
  getSettings,
  updateAdminProfile,
  type SettingsData,
} from "@/lib/api/settings";

export default function SettingsPage() {
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "Help Desk Management System",
    siteUrl: "https://helpdesk.company.com",
    adminEmail: "admin@company.com",
    timezone: "UTC",
    language: "English",
  });

  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeout: "30",
    passwordExpiry: "90",
    maxLoginAttempts: "5",
    twoFactorAuth: true,
  });

  const [resetDialog, setResetDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [settingsData, setSettingsData] = useState<SettingsData | null>(null);

  const { toast } = useToast();
  const { colors: theme } = useTheme();

  // Load settings data on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsFetchingData(true);
      const data = await getSettings();
      setSettingsData(data);

      // Update admin email from current user
      setGeneralSettings((prev) => ({
        ...prev,
        adminEmail: data.currentAdmin.email,
      }));
    } catch (error) {
      console.error("Failed to load settings:", error);
      toast("Failed to load system information", "error");
    } finally {
      setIsFetchingData(false);
    }
  };
  const fieldStyle = {
    backgroundColor: "#f3f4f6",
    color: "#111827",
    borderColor: "#d1d5db",
  };

  // Show loading state while fetching initial data
  if (isFetchingData) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-screen">
          <Loader2
            className="h-8 w-8 animate-spin"
            style={{ color: theme.primary }}
          />
        </div>
      </PageLayout>
    );
  }

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      await updateAdminProfile({ email: generalSettings.adminEmail });
      toast("All system settings have been updated successfully.", "success");
    } catch (error) {
      toast(
        error instanceof Error ? error.message : "Failed to update settings",
        "error",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSettings = async () => {
    setIsLoading(true);

    try {
      setGeneralSettings({
        siteName: "Help Desk Management System",
        siteUrl: "https://helpdesk.company.com",
        adminEmail: "admin@company.com",
        timezone: "UTC",
        language: "English",
      });
      setSecuritySettings({
        sessionTimeout: "30",
        passwordExpiry: "90",
        maxLoginAttempts: "5",
        twoFactorAuth: true,
      });

      toast("All settings have been restored to default values.", "info");
    } finally {
      setIsLoading(false);
      setResetDialog(false);
    }
  };

  const topBarActions = (
    <>
      <ActionButton
        variant="outline"
        size="sm"
        icon={RotateCcw}
        onClick={() => setResetDialog(true)}
        disabled={isLoading}
      >
        Reset to Defaults
      </ActionButton>
      <ActionButton
        variant="primary"
        size="sm"
        icon={Save}
        onClick={handleSaveSettings}
        disabled={isLoading}
      >
        {isLoading ? "Saving..." : "Save Changes"}
      </ActionButton>
    </>
  );

  return (
    <PageLayout>
      <TopBar
        title="System Settings"
        subtitle="Configure system preferences and security settings"
        actions={topBarActions}
      />

      <div className="p-6 space-y-6">
        {/* General Settings */}
        <Card
          className="shadow-sm transition-colors"
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--card-border)",
          }}
        >
          <CardHeader>
            <CardTitle
              className="flex items-center"
              style={{
                fontSize: fonts.heading.sm.size,
                fontWeight: fonts.heading.sm.weight,
                color: theme.foreground,
              }}
            >
              <Globe
                className="h-5 w-5 mr-2"
                style={{ color: theme.primary }}
              />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  className="block mb-2"
                  style={{
                    fontSize: fonts.body.sm.size,
                    fontWeight: fonts.fontWeight.medium,
                    color: theme.foreground,
                  }}
                >
                  Site Name
                </label>
                <Input
                  value={generalSettings.siteName}
                  onChange={(e) =>
                    setGeneralSettings({
                      ...generalSettings,
                      siteName: e.target.value,
                    })
                  }
                  style={fieldStyle}
                />
              </div>
              <div>
                <label
                  className="block mb-2"
                  style={{
                    fontSize: fonts.body.sm.size,
                    fontWeight: fonts.fontWeight.medium,
                    color: theme.foreground,
                  }}
                >
                  Site URL
                </label>
                <Input
                  value={generalSettings.siteUrl}
                  onChange={(e) =>
                    setGeneralSettings({
                      ...generalSettings,
                      siteUrl: e.target.value,
                    })
                  }
                  style={fieldStyle}
                />
              </div>
              <div>
                <label
                  className="block mb-2"
                  style={{
                    fontSize: fonts.body.sm.size,
                    fontWeight: fonts.fontWeight.medium,
                    color: theme.foreground,
                  }}
                >
                  Admin Email
                </label>
                <Input
                  type="email"
                  value={generalSettings.adminEmail}
                  onChange={(e) =>
                    setGeneralSettings({
                      ...generalSettings,
                      adminEmail: e.target.value,
                    })
                  }
                  style={fieldStyle}
                />
              </div>
              <div>
                <label
                  className="block mb-2"
                  style={{
                    fontSize: fonts.body.sm.size,
                    fontWeight: fonts.fontWeight.medium,
                    color: theme.foreground,
                  }}
                >
                  Timezone
                </label>
                <select
                  value={generalSettings.timezone}
                  onChange={(e) =>
                    setGeneralSettings({
                      ...generalSettings,
                      timezone: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded-md transition-colors"
                  style={{
                    fontSize: fonts.body.regular.size,
                    backgroundColor: "#f3f4f6",
                    color: "#111827",
                    borderColor: "#d1d5db",
                  }}
                >
                  <option value="UTC">UTC</option>
                  <option value="EST">Eastern Time</option>
                  <option value="PST">Pacific Time</option>
                  <option value="GMT">Greenwich Mean Time</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card
          className="shadow-sm transition-colors"
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--card-border)",
          }}
        >
          <CardHeader>
            <CardTitle
              className="flex items-center"
              style={{
                fontSize: fonts.heading.sm.size,
                fontWeight: fonts.heading.sm.weight,
                color: theme.foreground,
              }}
            >
              <Shield className="h-5 w-5 mr-2" style={{ color: "#dc2626" }} />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  className="block mb-2"
                  style={{
                    fontSize: fonts.body.sm.size,
                    fontWeight: fonts.fontWeight.medium,
                    color: theme.foreground,
                  }}
                >
                  Session Timeout (minutes)
                </label>
                <Input
                  type="number"
                  value={securitySettings.sessionTimeout}
                  onChange={(e) =>
                    setSecuritySettings({
                      ...securitySettings,
                      sessionTimeout: e.target.value,
                    })
                  }
                  style={fieldStyle}
                />
              </div>
              <div>
                <label
                  className="block mb-2"
                  style={{
                    fontSize: fonts.body.sm.size,
                    fontWeight: fonts.fontWeight.medium,
                    color: theme.foreground,
                  }}
                >
                  Password Expiry (days)
                </label>
                <Input
                  type="number"
                  value={securitySettings.passwordExpiry}
                  onChange={(e) =>
                    setSecuritySettings({
                      ...securitySettings,
                      passwordExpiry: e.target.value,
                    })
                  }
                  style={fieldStyle}
                />
              </div>
              <div>
                <label
                  className="block mb-2"
                  style={{
                    fontSize: fonts.body.sm.size,
                    fontWeight: fonts.fontWeight.medium,
                    color: theme.foreground,
                  }}
                >
                  Max Login Attempts
                </label>
                <Input
                  type="number"
                  value={securitySettings.maxLoginAttempts}
                  onChange={(e) =>
                    setSecuritySettings({
                      ...securitySettings,
                      maxLoginAttempts: e.target.value,
                    })
                  }
                  style={fieldStyle}
                />
              </div>
              <div className="flex items-center space-x-3 pt-6">
                <div
                  className="w-10 h-6 rounded-full relative transition-colors cursor-pointer"
                  style={{
                    backgroundColor: securitySettings.twoFactorAuth
                      ? theme.primary
                      : theme.foregroundMuted,
                  }}
                  onClick={() =>
                    setSecuritySettings({
                      ...securitySettings,
                      twoFactorAuth: !securitySettings.twoFactorAuth,
                    })
                  }
                >
                  <div
                    className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
                    style={{
                      transform: securitySettings.twoFactorAuth
                        ? "translateX(16px)"
                        : "translateX(2px)",
                    }}
                  />
                </div>
                <label
                  className="cursor-pointer"
                  style={{
                    fontSize: fonts.body.sm.size,
                    fontWeight: fonts.fontWeight.medium,
                    color: theme.foreground,
                  }}
                  onClick={() =>
                    setSecuritySettings({
                      ...securitySettings,
                      twoFactorAuth: !securitySettings.twoFactorAuth,
                    })
                  }
                >
                  Enable Two-Factor Authentication
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Information */}
        <Card
          className="shadow-sm transition-colors"
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--card-border)",
          }}
        >
          <CardHeader>
            <CardTitle
              className="flex items-center"
              style={{
                fontSize: fonts.heading.sm.size,
                fontWeight: fonts.heading.sm.weight,
                color: theme.foreground,
              }}
            >
              <Database
                className="h-5 w-5 mr-2"
                style={{ color: theme.foregroundMuted }}
              />
              System Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isFetchingData ? (
              <div className="flex items-center justify-center py-8">
                <Loader2
                  className="h-6 w-6 animate-spin"
                  style={{ color: theme.primary }}
                />
              </div>
            ) : settingsData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span
                      style={{
                        fontSize: fonts.body.sm.size,
                        color: theme.foregroundMuted,
                      }}
                    >
                      System Version:
                    </span>
                    <span
                      style={{
                        fontSize: fonts.body.sm.size,
                        fontWeight: fonts.fontWeight.medium,
                        color: theme.foreground,
                      }}
                    >
                      {settingsData.systemInfo.version}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span
                      style={{
                        fontSize: fonts.body.sm.size,
                        color: theme.foregroundMuted,
                      }}
                    >
                      Database Status:
                    </span>
                    <span
                      style={{
                        fontSize: fonts.body.sm.size,
                        fontWeight: fonts.fontWeight.medium,
                        color:
                          settingsData.systemInfo.dbStatus === "Connected"
                            ? "#15803d"
                            : "#dc2626",
                      }}
                    >
                      {settingsData.systemInfo.dbStatus}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span
                      style={{
                        fontSize: fonts.body.sm.size,
                        color: theme.foregroundMuted,
                      }}
                    >
                      Environment:
                    </span>
                    <span
                      style={{
                        fontSize: fonts.body.sm.size,
                        fontWeight: fonts.fontWeight.medium,
                        color: theme.foreground,
                      }}
                    >
                      {settingsData.systemInfo.environment}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span
                      style={{
                        fontSize: fonts.body.sm.size,
                        color: theme.foregroundMuted,
                      }}
                    >
                      Total Users:
                    </span>
                    <span
                      style={{
                        fontSize: fonts.body.sm.size,
                        fontWeight: fonts.fontWeight.medium,
                        color: theme.foreground,
                      }}
                    >
                      {settingsData.systemInfo.totalUsers}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span
                      style={{
                        fontSize: fonts.body.sm.size,
                        color: theme.foregroundMuted,
                      }}
                    >
                      Active Users:
                    </span>
                    <span
                      style={{
                        fontSize: fonts.body.sm.size,
                        fontWeight: fonts.fontWeight.medium,
                        color: theme.foreground,
                      }}
                    >
                      {settingsData.systemInfo.activeUsers}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span
                      style={{
                        fontSize: fonts.body.sm.size,
                        color: theme.foregroundMuted,
                      }}
                    >
                      Total Tickets:
                    </span>
                    <span
                      style={{
                        fontSize: fonts.body.sm.size,
                        fontWeight: fonts.fontWeight.medium,
                        color: theme.foreground,
                      }}
                    >
                      {settingsData.systemInfo.totalTickets}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="text-center py-8"
                style={{ color: theme.foregroundMuted }}
              >
                Failed to load system information
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Reset Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={resetDialog}
        onClose={() => setResetDialog(false)}
        onConfirm={handleResetSettings}
        variant="warning"
        title="Reset Settings"
        message="This will restore all settings to their default values. Are you sure you want to continue?"
        confirmLabel="Reset Settings"
      />
    </PageLayout>
  );
}

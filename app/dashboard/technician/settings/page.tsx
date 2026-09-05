"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, BellRing, Save, Check, Shield, Lock, Mail } from "lucide-react";
import {
  changeAgentPassword,
  getAgentProfile,
  updateAgentProfile,
} from "@/lib/api/agent";

export default function SettingsPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [autoRefreshQueue, setAutoRefreshQueue] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(false);
  const [agentStatus, setAgentStatus] = useState("AVAILABLE");
  const [defaultView, setDefaultView] = useState("ALL");

  // Profile security state fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load the database profile and browser-only queue preferences.
  useEffect(() => {
    void getAgentProfile()
      .then((profile) => {
        setFirstName(profile.firstName);
        setLastName(profile.lastName);
        setEmail(profile.email);
      })
      .catch((error) => console.error("Failed to load agent profile:", error));

    try {
      const savedSettings = localStorage.getItem("hdms_agent_settings");
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        if (parsed.firstName) setFirstName(parsed.firstName);
        if (parsed.lastName) setLastName(parsed.lastName);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.autoRefreshQueue !== undefined)
          setAutoRefreshQueue(parsed.autoRefreshQueue);
        if (parsed.soundAlerts !== undefined)
          setSoundAlerts(parsed.soundAlerts);
        if (parsed.agentStatus) setAgentStatus(parsed.agentStatus);
        if (parsed.defaultView) setDefaultView(parsed.defaultView);
      }
    } catch (error) {
      console.error("Failed to load agent preferences:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    // Validate password change if any password field is filled
    if (newPassword || confirmPassword || currentPassword) {
      if (!currentPassword) {
        setPasswordError("Current password is required to set a new password.");
        return;
      }
      if (newPassword !== confirmPassword) {
        setPasswordError("New passwords do not match.");
        return;
      }
      if (newPassword.length < 6) {
        setPasswordError("New password must be at least 6 characters long.");
        return;
      }
    }

    try {
      await updateAgentProfile({ firstName, lastName, email });
      if (newPassword) {
        await changeAgentPassword({
          currentPassword,
          newPassword,
          confirmPassword,
        });
      }
    } catch (error) {
      setPasswordError(
        error instanceof Error
          ? error.message
          : "Failed to save account settings",
      );
      return;
    }

    const settingsPayload = {
      firstName,
      lastName,
      email,
      autoRefreshQueue,
      soundAlerts,
      agentStatus,
      defaultView,
      updatedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(
        "hdms_agent_settings",
        JSON.stringify(settingsPayload),
      );

      if (newPassword) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (error) {
      console.error("Failed to save preferences:", error);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500 dark:text-slate-400">
        Loading workspace preferences...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-4xl mx-auto transition-colors">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Workspace Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your account preferences, contact info, security parameters,
          and support workstation configurations.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile & Availability */}
        <Card className="p-6 space-y-4 bg-white dark:bg-[#0C1815] border-slate-200 dark:border-[#1E3E35] shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-[#1E3E35] pb-3">
            <User className="w-5 h-5 text-emerald-600 dark:text-[#2FD9C4]" />
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Profile & Availability
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider block">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
                className="w-full bg-slate-50 dark:bg-[#060D0B] border border-slate-200 dark:border-[#1E3E35] rounded-lg px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 dark:focus:border-[#2FD9C4]"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider block">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
                className="w-full bg-slate-50 dark:bg-[#060D0B] border border-slate-200 dark:border-[#1E3E35] rounded-lg px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 dark:focus:border-[#2FD9C4]"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-600 dark:text-[#2FD9C4]" />
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="agent@example.com"
                className="w-full bg-slate-50 dark:bg-[#060D0B] border border-slate-200 dark:border-[#1E3E35] rounded-lg px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 dark:focus:border-[#2FD9C4]"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider block">
                Agent Work Status
              </label>
              <select
                value={agentStatus}
                onChange={(e) => setAgentStatus(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#060D0B] border border-slate-200 dark:border-[#1E3E35] rounded-lg px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 dark:focus:border-[#2FD9C4]"
              >
                <option value="AVAILABLE">Available</option>
                <option value="NOT AVAILABLE">Not Available</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Security & Password Update */}
        <Card className="p-6 space-y-4 bg-white dark:bg-[#0C1815] border-slate-200 dark:border-[#1E3E35] shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-[#1E3E35] pb-3">
            <Lock className="w-5 h-5 text-emerald-600 dark:text-[#2FD9C4]" />
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Security & Password
            </h2>
          </div>

          {passwordError && (
            <div className="p-3 text-xs rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 font-medium">
              {passwordError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider block">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 dark:bg-[#060D0B] border border-slate-200 dark:border-[#1E3E35] rounded-lg px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 dark:focus:border-[#2FD9C4]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider block">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 dark:bg-[#060D0B] border border-slate-200 dark:border-[#1E3E35] rounded-lg px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 dark:focus:border-[#2FD9C4]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider block">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 dark:bg-[#060D0B] border border-slate-200 dark:border-[#1E3E35] rounded-lg px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 dark:focus:border-[#2FD9C4]"
              />
            </div>
          </div>
        </Card>

        {/* Queue & Alert Automation */}
        <Card className="p-6 space-y-4 bg-white dark:bg-[#0C1815] border-slate-200 dark:border-[#1E3E35] shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-[#1E3E35] pb-3">
            <BellRing className="w-5 h-5 text-emerald-600 dark:text-[#2FD9C4]" />
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Queue & Alert Automation
            </h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[11px] text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider block">
                Default Queue Filter
              </label>
              <select
                value={defaultView}
                onChange={(e) => setDefaultView(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#060D0B] border border-slate-200 dark:border-[#1E3E35] rounded-lg px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 dark:focus:border-[#2FD9C4]"
              >
                <option value="ALL">Show All Assigned Tickets</option>
                <option value="OPEN">Open & In-Progress Only</option>
                <option value="CRITICAL">
                  Critical & Overdue Priority Only
                </option>
              </select>
            </div>

            <div className="pt-2 space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200 block">
                    Auto-Refresh Assigned Queue
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Poll live database changes in the background every 30
                    seconds.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={autoRefreshQueue}
                  onChange={(e) => setAutoRefreshQueue(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 dark:accent-[#2FD9C4] rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-slate-100 dark:border-[#1E3E35]/60">
                <div>
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200 block">
                    Critical Audio Chime
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Play an alert chime when high-priority tickets are assigned.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={soundAlerts}
                  onChange={(e) => setSoundAlerts(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 dark:accent-[#2FD9C4] rounded cursor-pointer"
                />
              </label>
            </div>
          </div>
        </Card>

        {/* System & Workspace Info */}
        <Card className="p-6 space-y-3 bg-slate-50 dark:bg-[#060D0B] border-slate-200 dark:border-[#1E3E35] text-xs">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-mono">
            <Shield className="w-4 h-4 text-emerald-600 dark:text-[#2FD9C4]" />
            <span>
              Besys Technologies HDMS v2.4.0 — Secure Workspace Session
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-500">
            Connected via secure corporate node. All preference modifications
            are logged for auditing purposes.
          </p>
        </Card>

        {/* Action Toolbar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {saved && (
            <span className="text-xs text-emerald-600 dark:text-[#2FD9C4] flex items-center gap-1 font-medium animate-pulse">
              <Check className="w-4 h-4" />
              Settings updated successfully!
            </span>
          )}
          <Button
            type="submit"
            variant="primary"
            className="bg-emerald-600 hover:bg-emerald-700 dark:bg-[#2FD9C4] dark:hover:bg-[#25bca9] text-white dark:text-[#0C1815] font-bold text-xs px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-sm"
          >
            <Save className="w-4 h-4" />
            Save Preferences
          </Button>
        </div>
      </form>
    </div>
  );
}

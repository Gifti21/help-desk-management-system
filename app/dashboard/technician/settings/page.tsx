"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { User, BellRing, Save, Check, Shield } from "lucide-react";

export default function SettingsPage() {
  const [displayName, setDisplayName] = useState("Bontu");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [autoRefreshQueue, setAutoRefreshQueue] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(false);
  const [agentStatus, setAgentStatus] = useState("AVAILABLE");
  const [defaultView, setDefaultView] = useState("ALL");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load saved preferences from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem("hdms_agent_settings");
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        if (parsed.displayName) setDisplayName(parsed.displayName);
        if (parsed.emailNotifications !== undefined) setEmailNotifications(parsed.emailNotifications);
        if (parsed.autoRefreshQueue !== undefined) setAutoRefreshQueue(parsed.autoRefreshQueue);
        if (parsed.soundAlerts !== undefined) setSoundAlerts(parsed.soundAlerts);
        if (parsed.agentStatus) setAgentStatus(parsed.agentStatus);
        if (parsed.defaultView) setDefaultView(parsed.defaultView);
      }
    } catch (error) {
      console.error("Failed to load agent preferences:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    const settingsPayload = {
      displayName,
      emailNotifications,
      autoRefreshQueue,
      soundAlerts,
      agentStatus,
      defaultView,
      updatedAt: new Date().toISOString(),
    };

    try {
      // Persist to localStorage (can be swapped out for a fetch() call to a backend API route)
      localStorage.setItem("hdms_agent_settings", JSON.stringify(settingsPayload));
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
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Workspace Settings</h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your account preferences, notification parameters, and support workstation configurations.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile & Availability */}
        <Card className="p-6 space-y-4 bg-white dark:bg-[#0C1815] border-slate-200 dark:border-[#1E3E35] shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-[#1E3E35] pb-3">
            <User className="w-5 h-5 text-emerald-600 dark:text-[#2FD9C4]" />
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">Profile & Availability</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider block">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#060D0B] border border-slate-200 dark:border-[#1E3E35] rounded-lg px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 dark:focus:border-[#2FD9C4]"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider block">Agent Work Status</label>
              <select
                value={agentStatus}
                onChange={(e) => setAgentStatus(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#060D0B] border border-slate-200 dark:border-[#1E3E35] rounded-lg px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 dark:focus:border-[#2FD9C4]"
              >
                <option value="AVAILABLE">Available (Taking Queues)</option>
                <option value="BUSY">Busy (In Resolution)</option>
                <option value="AWAY">Away / On Break</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Queue & Alert Automation */}
        <Card className="p-6 space-y-4 bg-white dark:bg-[#0C1815] border-slate-200 dark:border-[#1E3E35] shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-[#1E3E35] pb-3">
            <BellRing className="w-5 h-5 text-emerald-600 dark:text-[#2FD9C4]" />
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">Queue & Alert Automation</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[11px] text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider block">Default Queue Filter</label>
              <select
                value={defaultView}
                onChange={(e) => setDefaultView(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#060D0B] border border-slate-200 dark:border-[#1E3E35] rounded-lg px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 dark:focus:border-[#2FD9C4]"
              >
                <option value="ALL">Show All Assigned Tickets</option>
                <option value="OPEN">Open & In-Progress Only</option>
                <option value="CRITICAL">Critical & Overdue Priority Only</option>
              </select>
            </div>

            <div className="pt-2 space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200 block">Email Alerts on Escalations</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Receive instant notifications when assigned tickets breach SLA.</span>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 dark:accent-[#2FD9C4] rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-slate-100 dark:border-[#1E3E35]/60">
                <div>
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200 block">Auto-Refresh Assigned Queue</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Poll live database changes in the background every 30 seconds.</span>
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
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200 block">Critical Audio Chime</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Play an alert chime when high-priority tickets are assigned.</span>
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
            <span>Besys Technologies HDMS v2.4.0 — Secure Workspace Session</span>
          </div>
          <p className="text-slate-500 dark:text-slate-500">
            Connected via secure corporate node. All preference modifications are logged for auditing purposes.
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
          <Button type="submit" variant="primary" className="bg-emerald-600 hover:bg-emerald-700 dark:bg-[#2FD9C4] dark:hover:bg-[#25bca9] text-white dark:text-[#0C1815] font-bold text-xs px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-sm">
            <Save className="w-4 h-4" />
            Save Preferences
          </Button>
        </div>
      </form>
    </div>
  );
}
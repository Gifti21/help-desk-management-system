'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';

export function AgentShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-besys-lightBg dark:bg-besys-darkBg text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
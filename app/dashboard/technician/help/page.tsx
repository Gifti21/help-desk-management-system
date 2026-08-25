"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { BookOpen, ShieldAlert, ArrowUpRight, X, FileText, CheckCircle2 } from "lucide-react";

interface DocItem {
  title: string;
  category: string;
  description: string;
  content: string[];
}

export default function HelpCenterPage() {
  const [selectedDoc, setSelectedDoc] = useState<DocItem | null>(null);

  const docs: DocItem[] = [
    {
      title: "VPN & Network Troubleshooting SOP",
      category: "Standard Operating Procedures",
      description: "Steps for resetting certificates, clearing DNS caches, and re-issuing tokens.",
      content: [
        "1. Verify active network adapter connections and test local gateway ping response.",
        "2. Clear local DNS cache using command prompt (ipconfig /flushdns).",
        "3. Re-issue authentication tokens via the internal security gateway portal.",
        "4. If certificate errors persist, reinstall the corporate root security certificate profile."
      ]
    },
    {
      title: "Software Access Provisioning Matrix",
      category: "Access Control",
      description: "Guidelines on supervisor approvals required for Figma, GitHub, and AWS access.",
      content: [
        "1. Submit internal ticket specifying tool requirements (Figma, GitHub, AWS).",
        "2. Attach written department manager approval confirmation.",
        "3. IT security reviews role-based permission criteria (RBAC).",
        "4. Credentials and repository invites are dispatched within 24 business hours."
      ]
    },
    {
      title: "Hardware Replacement Workflows",
      category: "Asset Management",
      description: "How to log device handovers, manage dock replacements, and issue loaner laptops.",
      content: [
        "1. Log hardware incident ticket with asset serial number.",
        "2. Complete physical damage or malfunction inspection checklist.",
        "3. Issue temporary loaner device and log sign-off agreement.",
        "4. Route damaged unit to infrastructure repair queue."
      ]
    },
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8 max-w-6xl mx-auto transition-colors">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Technician Help Center</h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Guides and documentation for managing technical workflows.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-3 bg-white dark:bg-[#0C1815] border-slate-200 dark:border-[#1E3E35] shadow-sm">
          <div className="p-3 bg-slate-100 dark:bg-[#16332B] rounded-xl text-emerald-600 dark:text-[#2FD9C4] w-fit">
            <BookOpen className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Internal Knowledge Base</h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Review standard operating procedures, technical escalation trees, and database resolution scripts.
          </p>
        </Card>

        <Card className="p-6 space-y-3 bg-white dark:bg-[#0C1815] border-slate-200 dark:border-[#1E3E35] shadow-sm">
          <div className="p-3 bg-slate-100 dark:bg-[#16332B] rounded-xl text-emerald-600 dark:text-[#2FD9C4] w-fit">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Support Escalation Path</h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Direct channels to notify infrastructure leads or system supervisors during critical outage blockers.
          </p>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Featured Knowledge Base Articles</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {docs.map((doc, idx) => (
            <Card
              key={idx}
              onClick={() => setSelectedDoc(doc)}
              className="p-5 flex flex-col justify-between bg-white dark:bg-[#0C1815] border-slate-200 dark:border-[#1E3E35] hover:border-emerald-500/50 dark:hover:border-[#2FD9C4]/50 transition-colors cursor-pointer group shadow-sm"
            >
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-[#2FD9C4] uppercase tracking-wider">
                  {doc.category}
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-[#2FD9C4] transition-colors flex items-center justify-between">
                  {doc.title}
                  <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-600 dark:text-[#2FD9C4]" />
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{doc.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0C1815] border border-slate-200 dark:border-[#1E3E35] w-full max-w-lg rounded-xl p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setSelectedDoc(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-[#2FD9C4] uppercase tracking-wider">
                {selectedDoc.category}
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600 dark:text-[#2FD9C4]" />
                {selectedDoc.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{selectedDoc.description}</p>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-[#1E3E35]">
              <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Step-by-Step Procedure:</h4>
              <div className="space-y-2">
                {selectedDoc.content.map((step, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-[#16332B]/50 p-2.5 rounded-lg border border-slate-100 dark:border-[#1E3E35]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#2FD9C4] shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-2 bg-emerald-600 dark:bg-[#2FD9C4] text-white dark:text-[#0C1815] text-xs font-bold rounded-lg hover:bg-emerald-700 dark:hover:bg-[#25bca9] transition-colors"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
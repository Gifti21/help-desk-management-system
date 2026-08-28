"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Search, Filter, MoreHorizontal } from "lucide-react";

interface Ticket {
  id: string;
  title: string;
  requester: string;
  agent?: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  date: string;
}

interface TicketTableProps {
  tickets: Ticket[];
}

export function TicketTable({ tickets }: TicketTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.requester.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-blue-100 text-blue-800";
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-800";
      case "RESOLVED":
        return "bg-green-100 text-green-800";
      case "CLOSED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "CRITICAL":
        return "bg-red-100 text-red-800";
      case "HIGH":
        return "bg-orange-100 text-orange-800";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800";
      case "LOW":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Global Ticket Log</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm uppercase tracking-wider">
                  Ticket ID
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm uppercase tracking-wider">
                  Title
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm uppercase tracking-wider">
                  Requester
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm uppercase tracking-wider">
                  Agent
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm uppercase tracking-wider">
                  Priority
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm uppercase tracking-wider">
                  Date
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="border-b border-gray-100 hover:bg-[#dcfce7]"
                >
                  <td className="py-3 px-4 text-sm text-gray-900">
                    #{ticket.id.slice(-6)}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900 font-medium">
                    {ticket.title}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {ticket.requester}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {ticket.agent || "Unassigned"}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)}`}
                    >
                      {ticket.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}
                    >
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {ticket.date}
                  </td>
                  <td className="py-3 px-4">
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

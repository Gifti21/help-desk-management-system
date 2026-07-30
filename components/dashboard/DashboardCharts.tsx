'use client';

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import type { ReactNode } from 'react';
import {
  DARK_GREEN,
  TEAL_PRIMARY,
  TEAL_HOVER,
  LIGHT_TEAL_BG,
  LIGHT_TEAL_BG_ALT,
  BODY_TEXT_GREY,
  PRIMARY_TEXT,
  PAGE_BACKGROUND,
  BORDER_GREY,
  MUTED_GREY_GREEN,
} from '@/lib/colors';
import { FONT_FAMILY, HEADING_SM, BODY_SM, CAPTION_REGULAR } from '@/lib/fonts';

type TicketStatusItem = {
  name: 'Open' | 'In Progress' | 'Resolved' | 'Closed' | string;
  value: number;
};

type PriorityItem = {
  name: 'Critical' | 'High' | 'Medium' | 'Low' | string;
  value: number;
};

type DashboardChartsProps = {
  ticketStatusData: TicketStatusItem[];
  priorityData: PriorityItem[];
  loading?: boolean;
};

const statusColors = ['#2FD9C4', '#24C3B0', '#9BB0AB', '#16332B'];
const priorityColors = ['#16332B', '#2FD9C4', '#24C3B0', '#AEECE4'];

function ChartCard({
  title,
  description,
  children,
  loading,
  empty,
}: {
  title: string;
  description: string;
  children: ReactNode;
  loading?: boolean;
  empty?: boolean;
}) {
  return (
    <section
      className="flex h-full flex-col rounded-2xl border p-5 shadow-xs transition hover:shadow-md bg-white border-slate-200"
    >
      <div className="mb-5">
        <h3
          className="text-slate-900 font-extrabold"
          style={{
            fontFamily: FONT_FAMILY.primary,
            fontSize: HEADING_SM.size,
          }}
        >
          {title}
        </h3>
        <p
          className="mt-1 text-slate-600"
          style={{
            fontFamily: FONT_FAMILY.primary,
            fontSize: BODY_SM.size,
          }}
        >
          {description}
        </p>
      </div>

      <div className="min-h-[280px] flex-1">
        {loading ? (
          <div
            className="flex h-[280px] w-full animate-pulse items-center justify-center rounded-xl bg-slate-100"
          >
            <div
              className="h-24 w-24 rounded-full bg-slate-200"
            />
          </div>
        ) : empty ? (
          <div
            className="flex h-[280px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-slate-500 text-xs"
          >
            No chart data available.
          </div>
        ) : (
          children
        )}
      </div>
    </section>
  );
}

export default function DashboardCharts({
  ticketStatusData,
  priorityData,
  loading = false,
}: DashboardChartsProps) {
  const hasTicketData = ticketStatusData?.some((item) => item.value > 0);
  const hasPriorityData = priorityData?.some((item) => item.value > 0);

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <ChartCard
        title="Ticket Status"
        description="Current distribution of support tickets across all workflow stages."
        loading={loading}
        empty={!loading && !hasTicketData}
      >
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                borderColor: '#E2E8F0',
                borderRadius: 12,
                color: '#0F172A',
                fontFamily: 'Inter, sans-serif',
              }}
              formatter={(value: any) => [`${value ?? 0}`, 'Tickets']}
            />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              formatter={(value) => (
                <span
                  style={{
                    color: BODY_TEXT_GREY,
                    fontFamily: FONT_FAMILY.primary,
                    fontSize: CAPTION_REGULAR.size,
                  }}
                >
                  {value}
                </span>
              )}
            />
            <Pie
              data={ticketStatusData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="45%"
              innerRadius={65}
              outerRadius={95}
              paddingAngle={3}
              stroke="#FFFFFF"
              strokeWidth={2}
            >
              {ticketStatusData.map((entry, index) => (
                <Cell key={`ticket-${entry.name}-${index}`} fill={statusColors[index % statusColors.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title="Priority Distribution"
        description="Ticket volume grouped by urgency level for operational visibility."
        loading={loading}
        empty={!loading && !hasPriorityData}
      >
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={priorityData} margin={{ top: 10, right: 12, left: -12, bottom: 0 }}>
            <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={{ stroke: '#E2E8F0' }}
              tick={{
                fill: '#64748B',
                fontFamily: 'Inter, sans-serif',
                fontSize: 12,
              }}
            />
            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={{ stroke: '#E2E8F0' }}
              tick={{
                fill: '#64748B',
                fontFamily: 'Inter, sans-serif',
                fontSize: 12,
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                borderColor: '#E2E8F0',
                borderRadius: 12,
                color: '#0F172A',
                fontFamily: 'Inter, sans-serif',
              }}
              formatter={(value: any) => [`${value ?? 0}`, 'Tickets']}
            />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              formatter={(value) => (
                <span
                  style={{
                    color: BODY_TEXT_GREY,
                    fontFamily: FONT_FAMILY.primary,
                    fontSize: CAPTION_REGULAR.size,
                  }}
                >
                  {value}
                </span>
              )}
            />
            <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={36}>
              {priorityData.map((entry, index) => (
                <Cell key={`priority-${entry.name}-${index}`} fill={priorityColors[index % priorityColors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
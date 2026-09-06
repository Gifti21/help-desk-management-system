"use client";

import React, { useEffect, useState } from "react";
import { PageLayout } from "../../../../components/admin/PageLayout";
import { TopBar } from "../../../../components/admin/TopBar";
import { DataTable } from "../../../../components/admin/DataTable";
import { useTheme } from "../../../../components/providers/ThemeProvider";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { fonts } from "@/lib/fonts";
import { BarChart } from "../../../../components/charts/BarChart";
import { ReportFilters } from "../../../../components/reports/ReportFilters";
import { ExportButtons } from "../../../../components/reports/ExportButtons";
import { MetricsGrid } from "../../../../components/reports/MetricsGrid";
import { useToast } from "../../../../components/ui/toast";
import { getDepartments, type Department } from "@/lib/api/departments";
import { exportToCSV, exportToPDF } from "@/lib/export-utils";
import { RefreshCw } from "lucide-react";

export default function DepartmentReportsPage() {
  const [dateRange, setDateRange] = useState("Jun 1, 2026 - Jun 30, 2026");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [departmentData, setDepartmentData] = useState<Department[]>([]);

  const { toast } = useToast();
  const { colors: theme } = useTheme();

  const loadDepartments = async () => {
    setIsLoading(true);
    try {
      setDepartmentData(await getDepartments());
    } catch (error) {
      toast(
        error instanceof Error ? error.message : "Failed to load departments",
        "error",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadDepartments();
  }, []);

  // Metrics based on REAL database data
  const sortedDepartments = [...departmentData].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
  const departmentMetrics = [
    {
      id: "total-departments",
      title: "Total Departments",
      value: departmentData.length.toString(),
      subtitle: "In system",
      icon: "building",
    },
    {
      id: "oldest-department",
      title: "Oldest Department",
      value: sortedDepartments[0]?.name || "N/A",
      subtitle: "Established first",
      icon: "calendar",
    },
    {
      id: "newest-department",
      title: "Newest Department",
      value: sortedDepartments[sortedDepartments.length - 1]?.name || "N/A",
      subtitle: "Most recent",
      icon: "plus",
    },
    {
      id: "active-departments",
      title: "Active",
      value: departmentData.length.toString(),
      subtitle: "All operational",
      icon: "check",
    },
  ];

  const handleExportCSV = () => {
    exportToCSV(departmentData, "department-report", [
      { key: "id", title: "ID" },
      { key: "name", title: "Department" },
      { key: "createdAt", title: "Created" },
    ]);
    toast("Department report exported as CSV.", "success");
  };

  const handleExportPDF = () => {
    exportToPDF(departmentData, "department-report", "Department Report", [
      { key: "id", title: "ID" },
      { key: "name", title: "Department" },
      { key: "createdAt", title: "Created" },
    ]);
    toast("Department report exported as PDF.", "success");
  };

  const handleRefreshData = () => {
    void loadDepartments();
    toast("Department data refreshed.", "info");
  };

  // Table columns showing ONLY real database fields
  const departmentColumns = [
    {
      key: "name",
      title: "Department Name",
      render: (value: string) => (
        <span
          style={{
            fontSize: fonts.body.sm.size,
            fontWeight: fonts.fontWeight.medium,
            color: theme.foreground,
          }}
        >
          {value}
        </span>
      ),
    },
    {
      key: "id",
      title: "Department ID",
      render: (value: string) => (
        <span
          style={{ fontSize: fonts.body.sm.size, color: theme.foregroundMuted }}
        >
          {value}
        </span>
      ),
    },
    {
      key: "createdAt",
      title: "Created Date",
      render: (value: string) => (
        <span
          style={{ fontSize: fonts.body.sm.size, color: theme.foregroundMuted }}
        >
          {new Date(value).toLocaleDateString()}
        </span>
      ),
    },
  ];

  const topBarActions = (
    <>
      <RefreshCw
        className="h-4 w-4 cursor-pointer"
        style={{ color: theme.foregroundMuted }}
        onClick={handleRefreshData}
      />
      <ExportButtons
        onExportCSV={handleExportCSV}
        onExportPDF={handleExportPDF}
        isLoading={isLoading}
      />
    </>
  );

  const reportFilters = [
    {
      id: "department",
      label: "Department",
      value: selectedDepartment,
      onChange: setSelectedDepartment,
      options: [
        { label: "All Departments", value: "all" },
        ...departmentData.map((dept) => ({ label: dept.name, value: dept.id })),
      ],
    },
  ];

  // Department name data for chart
  const departmentChartData = departmentData.map((dept) => ({
    name: dept.name,
    value: 1,
  }));

  return (
    <PageLayout>
      <TopBar
        title="Department Reports"
        subtitle="Department structure and organization"
        actions={topBarActions}
      />

      <div className="flex flex-col lg:flex-row gap-6 p-6">
        {/* Sidebar Filters */}
        <div className="lg:w-64 flex-shrink-0">
          <Card
            className="shadow-sm transition-colors sticky top-6"
            style={{
              backgroundColor: "var(--card)",
              borderColor: "var(--card-border)",
            }}
          >
            <CardContent className="p-4">
              <ReportFilters
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
                filters={reportFilters}
              />
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Key Metrics */}
          <MetricsGrid metrics={departmentMetrics} />

          {/* Chart */}
          <Card
            className="shadow-sm transition-colors"
            style={{
              backgroundColor: "var(--card)",
              borderColor: "var(--card-border)",
            }}
          >
            <CardHeader>
              <CardTitle
                style={{
                  fontSize: fonts.heading.sm.size,
                  fontWeight: fonts.heading.sm.weight,
                  color: theme.foreground,
                }}
              >
                All Departments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart
                categories={departmentChartData.map((d) => d.name)}
                series={[
                  {
                    name: "Departments",
                    data: departmentChartData.map((d) => d.value),
                  },
                ]}
                xAxisTitle="Departments"
                yAxisTitle="Number of Items"
              />
            </CardContent>
          </Card>

          {/* Detailed Table */}
          <DataTable
            title="Department Details"
            columns={departmentColumns}
            data={departmentData}
            emptyMessage="No departments found."
          />
        </div>
      </div>
    </PageLayout>
  );
}

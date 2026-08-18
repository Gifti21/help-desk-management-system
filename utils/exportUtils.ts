import { Ticket } from "@/types/ticket";

// Utility to export current ticket data as CSV
export const exportToCSV = (tickets: Ticket[], filename = "besys-hdms-ticket-report.csv") => {
  if (!tickets || tickets.length === 0) return;

  const headers = ["Ticket ID", "Title", "Requester", "Department/Category", "Priority", "Status", "Created At", "Updated At"];
  
  const rows = tickets.map((t) => [
    `"${t.ticketNumber || t.id}"`,
    `"${(t.title || "").replace(/"/g, '""')}"`,
    `"${(t.creatorName || "").replace(/"/g, '""')}"`,
    `"${(t.category || t.department || "IT Support").toString().replace(/"/g, '""')}"`,
    `"${t.priority}"`,
    `"${t.status}"`,
    `"${new Date(t.createdAt).toLocaleString()}"`,
    `"${new Date(t.updatedAt).toLocaleString()}"`,
  ]);

  const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Utility to dynamically generate and print a structured PDF Report Document
export const exportToPDF = (tickets: Ticket[], reportTitle = "Besys HDMS Operational Audit & Workload Report") => {
  if (typeof window === "undefined") return;

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups to generate the PDF report document.");
    return;
  }

  const currentDate = new Date().toLocaleString();
  const total = tickets.length;
  const openCount = tickets.filter((t) => t.status === "OPEN" || t.status === "IN_PROGRESS").length;
  const resolvedCount = tickets.filter((t) => t.status === "RESOLVED" || t.status === "CLOSED").length;
  const criticalCount = tickets.filter((t) => t.priority === "CRITICAL").length;

  const tableRowsHtml = tickets
    .map(
      (t) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-family: monospace; font-weight: bold; color: #0e2621;">${t.ticketNumber || t.id}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #0f172a;">${t.title}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; color: #475569;">${t.creatorName || "Employee"}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; color: #475569;">${t.category || t.department || "IT Support"}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">
          <span style="display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; ${
            t.priority === "CRITICAL"
              ? "background: #ffe4e6; color: #9f1239;"
              : t.priority === "HIGH"
              ? "background: #ffedd5; color: #9a3412;"
              : t.priority === "MEDIUM"
              ? "background: #fef9c3; color: #854d0e;"
              : "background: #f1f5f9; color: #475569;"
          }">${t.priority}</span>
        </td>
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">
          <span style="display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; ${
            t.status === "OPEN"
              ? "background: #e0f2fe; color: #0369a1;"
              : t.status === "IN_PROGRESS"
              ? "background: #fef3c7; color: #b45309;"
              : t.status === "RESOLVED"
              ? "background: #d1fae5; color: #047857;"
              : "background: #f1f5f9; color: #334155;"
          }">${t.status}</span>
        </td>
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-family: monospace; font-size: 11px; color: #64748b;">${new Date(t.createdAt).toLocaleDateString()}</td>
      </tr>
    `
    )
    .join("");

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${reportTitle}</title>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; margin: 24px; color: #0f172a; background: #ffffff; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0e2621; padding-bottom: 16px; margin-bottom: 20px; }
          .brand { display: flex; align-items: center; gap: 12px; }
          .brand-title { font-size: 20px; font-weight: 800; color: #0e2621; margin: 0; }
          .brand-sub { font-size: 12px; color: #2fd9c4; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; background: #0e2621; padding: 2px 8px; border-radius: 4px; }
          .meta { text-align: right; font-size: 11px; color: #64748b; }
          .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
          .summary-card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 8px; }
          .summary-card p { margin: 0; font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; }
          .summary-card h3 { margin: 4px 0 0 0; font-size: 20px; font-weight: 800; color: #0f172a; }
          table { width: 100%; border-collapse: collapse; text-align: left; font-size: 12px; }
          th { background: #0e2621; color: #ffffff; padding: 10px 8px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
          .footer { margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 12px; display: flex; justify-content: space-between; font-size: 10px; color: #94a3b8; }
          @media print {
            body { margin: 0; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="brand">
            <div>
              <h1 class="brand-title">BESYS TECHNOLOGIES</h1>
              <span class="brand-sub">Help Desk Management System (HDMS)</span>
            </div>
          </div>
          <div class="meta">
            <p style="margin: 0; font-weight: bold; color: #0f172a;">${reportTitle}</p>
            <p style="margin: 2px 0 0 0;">Generated: ${currentDate}</p>
            <p style="margin: 2px 0 0 0;">Agent: Bontu (IT Support Staff)</p>
          </div>
        </div>

        <div class="summary-grid">
          <div class="summary-card">
            <p>Total Evaluated</p>
            <h3>${total}</h3>
          </div>
          <div class="summary-card">
            <p>Active Queue</p>
            <h3 style="color: #b45309;">${openCount}</h3>
          </div>
          <div class="summary-card">
            <p>Resolved / Closed</p>
            <h3 style="color: #047857;">${resolvedCount}</h3>
          </div>
          <div class="summary-card">
            <p>Critical SLA Issues</p>
            <h3 style="color: #be123c;">${criticalCount}</h3>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Title / Subject</th>
              <th>Requester</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Created Date</th>
            </tr>
          </thead>
          <tbody>
            ${tableRowsHtml}
          </tbody>
        </table>

        <div class="footer">
          <span>Official Operational Audit Record &mdash; Besys HDMS Support System</span>
          <span>Page 1 of 1</span>
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
};
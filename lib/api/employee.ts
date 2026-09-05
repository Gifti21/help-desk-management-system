// API service for Employee Portal

export interface EmployeeDashboardData {
  stats: {
    total: number;
    open: number;
    inProgress: number;
    closed: number;
  };
  recentTickets: EmployeeTicket[];
}

export interface EmployeeTicket {
  id: string;
  title: string;
  description: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  categoryId: string;
  departmentId: string;
  requesterId: string;
  assigneeId: string | null;
  createdAt: string;
  updatedAt: string;
  category: { id: string; name: string };
  department: { id: string; name: string };
  assignee: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  _count?: {
    comments: number;
  };
}

export interface CreateTicketData {
  title: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  categoryId: string;
}

/**
 * Get employee dashboard data
 */
export async function getEmployeeDashboard(): Promise<EmployeeDashboardData> {
  const response = await fetch("/api/employee/dashboard", {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch dashboard data");
  }

  const result = await response.json();
  return result.data;
}

/**
 * Get employee's tickets
 */
export async function getEmployeeTickets(
  status?: string,
): Promise<EmployeeTicket[]> {
  const params = new URLSearchParams();
  if (status) params.append("status", status);

  const url = `/api/employee/tickets${params.toString() ? `?${params.toString()}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch tickets");
  }

  const result = await response.json();
  return result.data;
}

/**
 * Create new ticket
 */
export async function createEmployeeTicket(
  data: CreateTicketData,
): Promise<EmployeeTicket> {
  const response = await fetch("/api/employee/tickets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create ticket");
  }

  const result = await response.json();
  return result.data;
}

/**
 * Get employee profile
 */
export async function getEmployeeProfile(): Promise<{
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: string;
  department: string;
  departmentId: string | null;
  joinedDate: string;
}> {
  const response = await fetch("/api/employee/profile", {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch profile");
  }

  const result = await response.json();
  return result.data;
}

/**
 * Update employee profile
 */
export async function updateEmployeeProfile(data: {
  firstName?: string;
  lastName?: string;
  email?: string;
}): Promise<any> {
  const response = await fetch("/api/employee/profile", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update profile");
  }

  const result = await response.json();
  return result.data;
}

/**
 * Change employee password
 */
export async function changeEmployeePassword(data: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<void> {
  const response = await fetch("/api/employee/profile/password", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to change password");
  }
}

/**
 * Get ticket form data (categories)
 */
export async function getTicketFormData(): Promise<{
  categories: { id: string; name: string }[];
  departments: { id: string; name: string }[];
}> {
  const response = await fetch("/api/employee/ticket-form-data", {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch form data");
  }

  const result = await response.json();
  return result.data;
}

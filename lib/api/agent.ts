export interface AgentProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

import { handleJsonResponse } from "@/lib/api-client";

async function parseResponse(response: Response) {
  const result = await handleJsonResponse(response);
  return result.data;
}

export async function getAgentProfile(): Promise<AgentProfile> {
  return parseResponse(
    await fetch("/api/agent/profile", { credentials: "include" }),
  );
}

export async function updateAgentProfile(
  profile: Omit<AgentProfile, "id">,
): Promise<AgentProfile> {
  return parseResponse(
    await fetch("/api/agent/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(profile),
    }),
  );
}

export async function changeAgentPassword(data: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<void> {
  await parseResponse(
    await fetch("/api/agent/profile/password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    }),
  );
}

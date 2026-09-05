export interface AgentProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

async function parseResponse(response: Response) {
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Request failed");
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

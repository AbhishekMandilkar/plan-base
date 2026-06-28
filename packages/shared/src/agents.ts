export const AGENT_IDS = ["cursor", "claude"] as const;

export type AgentId = (typeof AGENT_IDS)[number];

export type Agent = {
  id: AgentId;
  label: string;
};

export const AGENTS: readonly Agent[] = [
  { id: "cursor", label: "Cursor" },
  { id: "claude", label: "Claude Code" },
];

export const AGENTS_BY_ID: Record<AgentId, Agent> = {
  cursor: AGENTS[0],
  claude: AGENTS[1],
};

export function isAgentId(value: string): value is AgentId {
  return (AGENT_IDS as readonly string[]).includes(value);
}

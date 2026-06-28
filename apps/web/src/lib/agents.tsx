import type { AgentId } from "@planview/shared/agents";
import type { ComponentType, SVGProps } from "react";

import { ClaudeCodeIcon } from "@/components/icons/claude-code-icon";
import { CursorIcon } from "@/components/icons/cursor-icon";

export type AgentIconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export const AGENT_ICONS: Record<AgentId, AgentIconComponent> = {
  cursor: CursorIcon,
  claude: ClaudeCodeIcon,
};

type AgentIconProps = SVGProps<SVGSVGElement> & {
  agent: AgentId;
};

export function AgentIcon({ agent, className, ...props }: AgentIconProps) {
  const Icon = AGENT_ICONS[agent];
  return <Icon className={className} {...props} />;
}

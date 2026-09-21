export interface ToolCall {
  id: string;
  toolName: string;
  arguments: unknown;
}

export type AgentDecision =
  | {
      type: 'tool_call';
      toolCall: ToolCall;
    }
  | {
      type: 'final';
      content: string;
    };

export interface ModelInput {
  objective: string;
  history: unknown[];
}

export interface Model {
  decide(input: ModelInput): Promise<AgentDecision>;
}

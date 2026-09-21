import type { AgentDecision, ToolCall } from '../agent/types.js';

export type TraceEvent =
  | {
      type: 'model_decision';
      timestamp: string;
      decision: AgentDecision;
    }
  | {
      type: 'tool_call';
      timestamp: string;
      toolCall: ToolCall;
    }
  | {
      type: 'tool_result';
      timestamp: string;
      toolCallId: string;
      result: unknown;
    }
  | {
      type: 'tool_error';
      timestamp: string;
      toolCallId: string;
      error: string;
    }
  | {
      type: 'final_response';
      timestamp: string;
      content: string;
    }
  | {
      type: 'execution_limit';
      timestamp: string;
      maxSteps: number;
    };

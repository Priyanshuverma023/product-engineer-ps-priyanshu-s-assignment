import type {
  AgentDecision,
  Model,
  ModelInput,
} from "../agent/types.js";

export class InfiniteModel implements Model {
  private callNumber = 0;

  async decide(input: ModelInput): Promise<AgentDecision> {
    this.callNumber++;

    return {
      type: "tool_call",
      toolCall: {
        id: `loop-call-${this.callNumber}`,
        toolName: "service_status",
        arguments: {
          service: "payments",
        },
      },
    };
  }
}
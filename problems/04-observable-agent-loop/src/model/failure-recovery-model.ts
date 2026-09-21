import type {
  AgentDecision,
  Model,
  ModelInput,
} from "../agent/types.js";

export class FailureRecoveryModel implements Model {
  private step = 0;

  async decide(input: ModelInput): Promise<AgentDecision> {
    this.step++;

    if (this.step === 1) {
      return {
        type: "tool_call",
        toolCall: {
          id: "failure-call-1",
          toolName: "failing_tool",
          arguments: {},
        },
      };
    }

    return {
      type: "final",
      content:
        "The requested diagnostic tool failed, so the investigation could not be completed.",
    };
  }
}
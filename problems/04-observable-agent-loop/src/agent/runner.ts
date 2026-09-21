import type {
  Model,
} from "./types.js";
import { ToolExecutor } from "./tool-executor.js";
import { TraceRecorder } from "../trace/recorder.js";
import type { TraceEvent } from "../trace/types.js";

export interface AgentRunnerOptions {
  maxSteps: number;
}

export interface AgentRunResult {
  content: string;
  trace: TraceEvent[];
}

export class AgentRunner {
  constructor(
    private readonly model: Model,
    private readonly toolExecutor: ToolExecutor,
    private readonly options: AgentRunnerOptions,
  ) {}

  async run(objective: string): Promise<AgentRunResult> {
    const traceRecorder = new TraceRecorder();
    const history: unknown[] = [];

    for (let step = 0; step < this.options.maxSteps; step++) {
      const decision = await this.model.decide({
        objective,
        history,
      });

      traceRecorder.record({
        type: "model_decision",
        timestamp: new Date().toISOString(),
        decision,
      });

      if (decision.type === "final") {
        traceRecorder.record({
          type: "final_response",
          timestamp: new Date().toISOString(),
          content: decision.content,
        });

        return {
          content: decision.content,
          trace: traceRecorder.getEvents(),
        };
      }

      const toolCall = decision.toolCall;

      traceRecorder.record({
        type: "tool_call",
        timestamp: new Date().toISOString(),
        toolCall,
      });

      try {
        const result = await this.toolExecutor.execute(toolCall);

        traceRecorder.record({
          type: "tool_result",
          timestamp: new Date().toISOString(),
          toolCallId: toolCall.id,
          result,
        });

        history.push({
          toolCall,
          result,
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : String(error);

        traceRecorder.record({
          type: "tool_error",
          timestamp: new Date().toISOString(),
          toolCallId: toolCall.id,
          error: message,
        });

        history.push({
          toolCall,
          error: message,
        });
      }
    }

    traceRecorder.record({
      type: "execution_limit",
      timestamp: new Date().toISOString(),
      maxSteps: this.options.maxSteps,
    });

    return {
      content: `Execution stopped after reaching the maximum of ${this.options.maxSteps} steps.`,
      trace: traceRecorder.getEvents(),
    };
  }
}
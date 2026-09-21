import { describe, expect, it } from "vitest";
import { AgentRunner } from "../src/agent/runner.js";
import { ToolExecutor } from "../src/agent/tool-executor.js";
import { FailureRecoveryModel } from "../src/model/failure-recovery-model.js";
import { ToolRegistry } from "../src/tools/registry.js";
import { failingTool } from "../src/tools/failing-tool.js";

describe("AgentRunner failure handling", () => {
  it("records a tool failure and allows the model to continue", async () => {
    const registry = new ToolRegistry();

    registry.register(failingTool);

    const executor = new ToolExecutor(registry);
    const model = new FailureRecoveryModel();

    const runner = new AgentRunner(model, executor, {
      maxSteps: 3,
    });

    const result = await runner.run(
      "Investigate the service incident.",
    );

    expect(result.content).toContain("tool failed");

    expect(
      result.trace.filter(
        (event) => event.type === "tool_error",
      ),
    ).toHaveLength(1);

    expect(
      result.trace.filter(
        (event) => event.type === "final_response",
      ),
    ).toHaveLength(1);
  });
});
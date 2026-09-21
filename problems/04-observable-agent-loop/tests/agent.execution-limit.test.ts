import { describe, expect, it } from "vitest";
import { AgentRunner } from "../src/agent/runner.js";
import { ToolExecutor } from "../src/agent/tool-executor.js";
import { InfiniteModel } from "../src/model/infinite-model.js";
import { ToolRegistry } from "../src/tools/registry.js";
import { serviceStatusTool } from "../src/tools/service-status.js";

describe("AgentRunner execution limit", () => {
  it("stops when maxSteps is reached", async () => {
    const registry = new ToolRegistry();

    registry.register(serviceStatusTool);

    const executor = new ToolExecutor(registry);
    const model = new InfiniteModel();

    const runner = new AgentRunner(model, executor, {
      maxSteps: 3,
    });

    const result = await runner.run(
      "Keep investigating forever.",
    );

    expect(result.content).toContain(
      "maximum of 3 steps",
    );

    expect(
      result.trace.filter(
        (event) => event.type === "execution_limit",
      ),
    ).toHaveLength(1);

    expect(
      result.trace.filter(
        (event) => event.type === "tool_call",
      ),
    ).toHaveLength(3);
  });
});
import { describe, expect, it } from "vitest";
import { ToolExecutor } from "../src/agent/tool-executor.js";
import { ToolRegistry } from "../src/tools/registry.js";
import { searchLogsTool } from "../src/tools/search-logs.js";

describe("ToolExecutor", () => {
  it("executes a registered tool", async () => {
    const registry = new ToolRegistry();
    registry.register(searchLogsTool);

    const executor = new ToolExecutor(registry);

    const result = await executor.execute({
      id: "call-1",
      toolName: "search_logs",
      arguments: {
        service: "payments",
        query: "database",
      },
    });

    expect(result).toMatchObject({
      count: 5,
    });
  });

  it("rejects invalid tool arguments", async () => {
    const registry = new ToolRegistry();
    registry.register(searchLogsTool);

    const executor = new ToolExecutor(registry);

    await expect(
      executor.execute({
        id: "call-2",
        toolName: "search_logs",
        arguments: {
          service: "payments",
        },
      }),
    ).rejects.toThrow("Invalid arguments");
  });

  it("rejects unknown tools", async () => {
    const registry = new ToolRegistry();

    const executor = new ToolExecutor(registry);

    await expect(
      executor.execute({
        id: "call-3",
        toolName: "does_not_exist",
        arguments: {},
      }),
    ).rejects.toThrow("Unknown tool");
  });
});
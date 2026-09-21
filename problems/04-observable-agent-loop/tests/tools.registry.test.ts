import { describe, expect, it } from "vitest";
import { z } from "zod";
import { ToolRegistry } from "../src/tools/registry.js";
import type { Tool } from "../src/tools/types.js";

const testTool: Tool<{ message: string }, { length: number }> = {
  name: "test_tool",
  description: "A test tool",
  inputSchema: z.object({
    message: z.string(),
  }),

  async execute(input) {
    return {
      length: input.message.length,
    };
  },
};

describe("ToolRegistry", () => {
  it("registers and retrieves a tool", () => {
    const registry = new ToolRegistry();

    registry.register(testTool);

    expect(registry.has("test_tool")).toBe(true);
    expect(registry.get("test_tool")).toBe(testTool);
  });

  it("rejects unknown tools", () => {
    const registry = new ToolRegistry();

    expect(() => registry.get("unknown_tool")).toThrow(
      "Unknown tool: unknown_tool",
    );
  });

  it("rejects duplicate tool names", () => {
    const registry = new ToolRegistry();

    registry.register(testTool);

    expect(() => registry.register(testTool)).toThrow(
      "Tool already registered: test_tool",
    );
  });

  it("lists registered tools", () => {
    const registry = new ToolRegistry();

    registry.register(testTool);

    expect(registry.list()).toEqual(["test_tool"]);
  });
});
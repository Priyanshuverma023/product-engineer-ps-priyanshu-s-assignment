import type { ToolCall } from "./types.js";
import { ToolRegistry } from "../tools/registry.js";

export class ToolExecutor {
  constructor(private readonly registry: ToolRegistry) {}

  async execute(toolCall: ToolCall): Promise<unknown> {
    const tool = this.registry.get(toolCall.toolName);

    const parsedInput = tool.inputSchema.safeParse(
      toolCall.arguments,
    );

    if (!parsedInput.success) {
      throw new Error(
        `Invalid arguments for tool ${toolCall.toolName}: ${parsedInput.error.message}`,
      );
    }

    return tool.execute(parsedInput.data);
  }
}
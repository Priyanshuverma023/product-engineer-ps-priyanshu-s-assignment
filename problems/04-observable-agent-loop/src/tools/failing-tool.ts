import { z } from "zod";
import type { Tool } from "./types.js";

const failingToolInputSchema = z.object({});

export const failingTool: Tool<Record<string, never>, never> = {
  name: "failing_tool",

  description: "A tool used to simulate an operational failure.",

  inputSchema: failingToolInputSchema,

  async execute() {
    throw new Error("Simulated tool failure");
  },
};
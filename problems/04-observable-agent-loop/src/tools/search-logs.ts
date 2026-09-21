import { z } from "zod";
import { logs } from "../data/logs.js";
import type { Tool } from "./types.js";

const searchLogsInputSchema = z.object({
  service: z.string().min(1),
  query: z.string().min(1),
});

export type SearchLogsInput = z.infer<typeof searchLogsInputSchema>;

export interface SearchLogsOutput {
  matches: typeof logs;
  count: number;
}

export const searchLogsTool: Tool<
  SearchLogsInput,
  SearchLogsOutput
> = {
  name: "search_logs",

  description:
    "Search application logs for a service using a text query.",

  inputSchema: searchLogsInputSchema,

  async execute(input) {
    const query = input.query.toLowerCase();

    const matches = logs.filter((log) => {
      const matchesService = log.service === input.service;

      const matchesQuery =
        log.message.toLowerCase().includes(query) ||
        log.level.toLowerCase().includes(query);

      return matchesService && matchesQuery;
    });

    return {
      matches,
      count: matches.length,
    };
  },
};
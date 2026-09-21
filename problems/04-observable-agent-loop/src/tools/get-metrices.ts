import { z } from "zod";
import { metrics } from "../data/metrics.js";
import type { Tool } from "./types.js";

const getMetricsInputSchema = z.object({
  service: z.string().min(1),
  metric: z.string().min(1),
});

export type GetMetricsInput = z.infer<typeof getMetricsInputSchema>;

export interface GetMetricsOutput {
  points: typeof metrics;
  count: number;
}

export const getMetricsTool: Tool<
  GetMetricsInput,
  GetMetricsOutput
> = {
  name: "get_metrics",

  description:
    "Get metric measurements for a service, such as error rate or latency.",

  inputSchema: getMetricsInputSchema,

  async execute(input) {
    const points = metrics.filter(
      (point) =>
        point.service === input.service &&
        point.metric === input.metric,
    );

    return {
      points,
      count: points.length,
    };
  },
};
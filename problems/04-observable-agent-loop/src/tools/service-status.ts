import { z } from "zod";
import { services } from "../data/services.js";
import type { Tool } from "./types.js";

const serviceStatusInputSchema = z.object({
  service: z.string().min(1),
});

export type ServiceStatusInput = z.infer<
  typeof serviceStatusInputSchema
>;

export interface ServiceStatusOutput {
  service: string;
  status: "healthy" | "degraded" | "down";
  version: string;
}

export const serviceStatusTool: Tool<
  ServiceStatusInput,
  ServiceStatusOutput
> = {
  name: "service_status",

  description:
    "Get the current operational status and version of a service.",

  inputSchema: serviceStatusInputSchema,

  async execute(input) {
    const service = services.find(
      (item) => item.service === input.service,
    );

    if (!service) {
      throw new Error(`Service not found: ${input.service}`);
    }

    return service;
  },
};
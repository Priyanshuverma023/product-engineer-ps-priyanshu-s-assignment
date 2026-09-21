import { describe, expect, it } from "vitest";
import { getMetricsTool } from "../src/tools/get-metrices.js";

describe("get_metrics", () => {
  it("returns metrics for a service", async () => {
    const result = await getMetricsTool.execute({
      service: "payments",
      metric: "error_rate",
    });

    expect(result.count).toBe(5);
    expect(result.points).toHaveLength(5);
  });

  it("returns latency metrics", async () => {
    const result = await getMetricsTool.execute({
      service: "payments",
      metric: "latency_ms",
    });

    expect(result.count).toBe(2);
    expect(result.points).toHaveLength(2);
  });

  it("returns no metrics for an unknown service", async () => {
    const result = await getMetricsTool.execute({
      service: "unknown",
      metric: "error_rate",
    });

    expect(result.count).toBe(0);
  });
});
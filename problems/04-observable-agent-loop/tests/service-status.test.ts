import { describe, expect, it } from "vitest";
import { serviceStatusTool } from "../src/tools/service-status.js";

describe("service_status", () => {
  it("returns the status of a service", async () => {
    const result = await serviceStatusTool.execute({
      service: "payments",
    });

    expect(result.status).toBe("degraded");
    expect(result.version).toBe("v2.4.1");
  });

  it("returns healthy status for notifications", async () => {
    const result = await serviceStatusTool.execute({
      service: "notifications",
    });

    expect(result.status).toBe("healthy");
  });

  it("throws when the service does not exist", async () => {
    await expect(
      serviceStatusTool.execute({
        service: "unknown",
      }),
    ).rejects.toThrow("Service not found: unknown");
  });
});
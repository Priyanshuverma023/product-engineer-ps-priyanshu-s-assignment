export interface ServiceStatus {
  service: string;
  status: "healthy" | "degraded" | "down";
  version: string;
}

export const services: ServiceStatus[] = [
  {
    service: "payments",
    status: "degraded",
    version: "v2.4.1",
  },
  {
    service: "notifications",
    status: "healthy",
    version: "v1.8.3",
  },
];
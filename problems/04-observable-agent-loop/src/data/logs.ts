export interface LogEntry {
  timestamp: string;
  service: string;
  level: "INFO" | "WARN" | "ERROR";
  message: string;
}

export const logs: LogEntry[] = [
  {
    timestamp: "2026-09-18T10:00:12Z",
    service: "payments",
    level: "INFO",
    message: "Payment request received",
  },
  {
    timestamp: "2026-09-18T10:02:31Z",
    service: "payments",
    level: "INFO",
    message: "Payment processed successfully",
  },
  {
    timestamp: "2026-09-18T10:04:12Z",
    service: "payments",
    level: "ERROR",
    message: "Database connection pool exhausted",
  },
  {
    timestamp: "2026-09-18T10:04:18Z",
    service: "payments",
    level: "ERROR",
    message: "Failed to process payment: database unavailable",
  },
  {
    timestamp: "2026-09-18T10:05:03Z",
    service: "payments",
    level: "ERROR",
    message: "Database connection timeout",
  },
  {
    timestamp: "2026-09-18T10:06:14Z",
    service: "payments",
    level: "WARN",
    message: "Retrying database connection",
  },
  {
    timestamp: "2026-09-18T10:08:42Z",
    service: "payments",
    level: "INFO",
    message: "Database connection restored",
  },
  {
    timestamp: "2026-09-18T10:09:11Z",
    service: "payments",
    level: "INFO",
    message: "Payment processing recovered",
  },
  {
    timestamp: "2026-09-18T10:10:05Z",
    service: "notifications",
    level: "INFO",
    message: "Notification sent successfully",
  },
];
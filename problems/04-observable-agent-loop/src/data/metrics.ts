export interface MetricPoint {
  timestamp: string;
  service: string;
  metric: string;
  value: number;
}

export const metrics: MetricPoint[] = [
  {
    timestamp: '2026-09-18T10:00:00Z',
    service: 'payments',
    metric: 'error_rate',
    value: 0.01,
  },
  {
    timestamp: '2026-09-18T10:04:00Z',
    service: 'payments',
    metric: 'error_rate',
    value: 0.18,
  },
  {
    timestamp: '2026-09-18T10:06:00Z',
    service: 'payments',
    metric: 'error_rate',
    value: 0.25,
  },
  {
    timestamp: '2026-09-18T10:08:00Z',
    service: 'payments',
    metric: 'error_rate',
    value: 0.05,
  },
  {
    timestamp: '2026-09-18T10:10:00Z',
    service: 'payments',
    metric: 'error_rate',
    value: 0.01,
  },
  {
    timestamp: '2026-09-18T10:04:00Z',
    service: 'payments',
    metric: 'latency_ms',
    value: 850,
  },
  {
    timestamp: '2026-09-18T10:08:00Z',
    service: 'payments',
    metric: 'latency_ms',
    value: 220,
  },
];

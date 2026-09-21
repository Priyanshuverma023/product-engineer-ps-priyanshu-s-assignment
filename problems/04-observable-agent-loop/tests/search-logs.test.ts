import { describe, expect, it } from 'vitest';
import { searchLogsTool } from '../src/tools/search-logs.js';

describe('search_logs', () => {
  it('finds matching logs for a service', async () => {
    const result = await searchLogsTool.execute({
      service: 'payments',
      query: 'database',
    });

    expect(result.count).toBe(5);
    expect(result.matches).toHaveLength(5);
  });

  it('does not return logs from another service', async () => {
    const result = await searchLogsTool.execute({
      service: 'notifications',
      query: 'database',
    });

    expect(result.count).toBe(0);
  });

  it('searches log levels too', async () => {
    const result = await searchLogsTool.execute({
      service: 'payments',
      query: 'error',
    });

    expect(result.count).toBe(3);
  });
});

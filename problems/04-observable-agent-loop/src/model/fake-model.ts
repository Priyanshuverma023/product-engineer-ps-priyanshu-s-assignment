import type { AgentDecision, Model, ModelInput } from '../agent/types.js';

export class FakeModel implements Model {
  async decide(input: ModelInput): Promise<AgentDecision> {
    const history = input.history;

    const hasLogResult = history.some(
      (entry) =>
        typeof entry === 'object' &&
        entry !== null &&
        'toolCall' in entry &&
        typeof entry.toolCall === 'object' &&
        entry.toolCall !== null &&
        'toolName' in entry.toolCall &&
        entry.toolCall.toolName === 'search_logs',
    );

    const hasMetricsResult = history.some(
      (entry) =>
        typeof entry === 'object' &&
        entry !== null &&
        'toolCall' in entry &&
        typeof entry.toolCall === 'object' &&
        entry.toolCall !== null &&
        'toolName' in entry.toolCall &&
        entry.toolCall.toolName === 'get_metrics',
    );

    const hasStatusResult = history.some(
      (entry) =>
        typeof entry === 'object' &&
        entry !== null &&
        'toolCall' in entry &&
        typeof entry.toolCall === 'object' &&
        entry.toolCall !== null &&
        'toolName' in entry.toolCall &&
        entry.toolCall.toolName === 'service_status',
    );

    if (!hasLogResult) {
      return {
        type: 'tool_call',
        toolCall: {
          id: 'call-1',
          toolName: 'search_logs',
          arguments: {
            service: 'payments',
            query: 'database',
          },
        },
      };
    }

    if (!hasMetricsResult) {
      return {
        type: 'tool_call',
        toolCall: {
          id: 'call-2',
          toolName: 'get_metrics',
          arguments: {
            service: 'payments',
            metric: 'error_rate',
          },
        },
      };
    }

    if (!hasStatusResult) {
      return {
        type: 'tool_call',
        toolCall: {
          id: 'call-3',
          toolName: 'service_status',
          arguments: {
            service: 'payments',
          },
        },
      };
    }

    return {
      type: 'final',
      content:
        'The payments service experienced a database-related incident. Logs show database connection failures, metrics show an elevated error rate, and the service is currently degraded.',
    };
  }
}

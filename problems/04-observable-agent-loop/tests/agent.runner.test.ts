import { describe, expect, it } from 'vitest';
import { AgentRunner } from '../src/agent/runner.js';
import { ToolExecutor } from '../src/agent/tool-executor.js';
import { FakeModel } from '../src/model/fake-model.js';
import { ToolRegistry } from '../src/tools/registry.js';
import { searchLogsTool } from '../src/tools/search-logs.js';
import { getMetricsTool } from '../src/tools/get-metrices.js';
import { serviceStatusTool } from '../src/tools/service-status.js';

describe('AgentRunner', () => {
  it('uses history to determine the next tool', async () => {
    const model = new FakeModel();

    const firstDecision = await model.decide({
      objective: 'Investigate payments',
      history: [],
    });

    expect(firstDecision).toMatchObject({
      type: 'tool_call',
      toolCall: {
        toolName: 'search_logs',
      },
    });

    const secondDecision = await model.decide({
      objective: 'Investigate payments',
      history: [
        {
          toolCall: {
            id: 'call-1',
            toolName: 'search_logs',
            arguments: {
              service: 'payments',
              query: 'database',
            },
          },
          result: {
            count: 5,
          },
        },
      ],
    });

    expect(secondDecision).toMatchObject({
      type: 'tool_call',
      toolCall: {
        toolName: 'get_metrics',
      },
    });
  });
  it('runs a multi-step investigation and returns a final response', async () => {
    const registry = new ToolRegistry();

    registry.register(searchLogsTool);
    registry.register(getMetricsTool);
    registry.register(serviceStatusTool);

    const executor = new ToolExecutor(registry);

    const model = new FakeModel();

    const runner = new AgentRunner(model, executor, {
      maxSteps: 5,
    });

    const result = await runner.run(
      'Investigate the payments service incident.',
    );

    expect(result.content).toContain('database-related incident');

    expect(
      result.trace.filter((event) => event.type === 'tool_call'),
    ).toHaveLength(3);

    expect(
      result.trace.filter((event) => event.type === 'tool_result'),
    ).toHaveLength(3);

    expect(
      result.trace.filter((event) => event.type === 'final_response'),
    ).toHaveLength(1);
  });
});

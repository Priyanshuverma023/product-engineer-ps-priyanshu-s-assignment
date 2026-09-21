import { InfiniteModel } from './model/infinite-model.js';
import { AgentRunner } from './agent/runner.js';
import { ToolExecutor } from './agent/tool-executor.js';
import { FakeModel } from './model/fake-model.js';
import { FailureRecoveryModel } from './model/failure-recovery-model.js';

import { ToolRegistry } from './tools/registry.js';
import { searchLogsTool } from './tools/search-logs.js';
import { getMetricsTool } from './tools/get-metrices.js';
import { serviceStatusTool } from './tools/service-status.js';
import { failingTool } from './tools/failing-tool.js';

import type { TraceEvent } from './trace/types.js';

function printTrace(trace: TraceEvent[]): void {
  console.log('\n=== Execution Trace ===\n');

  trace.forEach((event, index) => {
    const step = String(index + 1).padStart(2, '0');

    switch (event.type) {
      case 'model_decision':
        if (event.decision.type === 'tool_call') {
          console.log(
            `[${step}] MODEL → tool: ${event.decision.toolCall.toolName}`,
          );
        } else {
          console.log(`[${step}] MODEL → final response`);
        }
        break;

      case 'tool_call':
        console.log(`[${step}] TOOL  → ${event.toolCall.toolName}`);
        break;

      case 'tool_result':
        console.log(`[${step}] RESULT → ${summarizeResult(event.result)}`);
        break;

      case 'tool_error':
        console.log(`[${step}] ERROR → ${event.error}`);
        break;

      case 'final_response':
        console.log(`[${step}] FINAL → response generated`);
        break;

      case 'execution_limit':
        console.log(
          `[${step}] LIMIT → maximum ${event.maxSteps} steps reached`,
        );
        break;
    }
  });
}

function summarizeResult(result: unknown): string {
  if (
    typeof result === 'object' &&
    result !== null &&
    'count' in result &&
    typeof result.count === 'number'
  ) {
    return `${result.count} records`;
  }

  if (typeof result === 'object' && result !== null && 'status' in result) {
    return `service status: ${String(result.status)}`;
  }

  return 'result received';
}

async function runSuccessfulDemo() {
  const registry = new ToolRegistry();

  registry.register(searchLogsTool);
  registry.register(getMetricsTool);
  registry.register(serviceStatusTool);

  const executor = new ToolExecutor(registry);
  const model = new FakeModel();

  const runner = new AgentRunner(model, executor, {
    maxSteps: 5,
  });

  const objective = 'Investigate the payments service incident.';

  console.log('\n=== Observable Agent Demo ===\n');
  console.log(`Objective: ${objective}`);

  const result = await runner.run(objective);

  printTrace(result.trace);

  console.log('\n=== Final Response ===\n');
  console.log(result.content);
}

async function runFailureDemo() {
  const registry = new ToolRegistry();

  registry.register(failingTool);

  const executor = new ToolExecutor(registry);
  const model = new FailureRecoveryModel();

  const runner = new AgentRunner(model, executor, {
    maxSteps: 3,
  });

  const objective = 'Investigate a service failure.';

  console.log('\n=== Failure Recovery Demo ===\n');
  console.log(`Objective: ${objective}`);

  const result = await runner.run(objective);

  printTrace(result.trace);

  console.log('\n=== Final Response ===\n');
  console.log(result.content);
}

async function runExecutionLimitDemo() {
  const registry = new ToolRegistry();

  registry.register(serviceStatusTool);

  const executor = new ToolExecutor(registry);
  const model = new InfiniteModel();

  const runner = new AgentRunner(model, executor, {
    maxSteps: 3,
  });

  const objective = 'Keep investigating the payments service.';

  console.log('\n=== Execution Limit Demo ===\n');
  console.log(`Objective: ${objective}`);

  const result = await runner.run(objective);

  printTrace(result.trace);

  console.log('\n=== Final Response ===\n');
  console.log(result.content);
}

async function main() {
  await runSuccessfulDemo();
  await runFailureDemo();
  await runExecutionLimitDemo();
}

main().catch((error) => {
  console.error('Agent failed:', error);
});

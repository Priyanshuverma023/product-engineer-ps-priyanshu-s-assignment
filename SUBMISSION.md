# Product Engineering Challenge Submission

## Candidate

- **Name:** Priyanshu Verma
- **Email:** Priyanshuverma023@gmail.com
- **GitHub:** https://github.com/Priyanshuverma023
- **Selected problem:** Problem 4 — Observable Agent Loop
- **Demo video:** https://drive.google.com/file/d/15xBDl1MoZTF2CMUjKZXGMhoL27lKQ4je/view?usp=sharing

## Run the project

### Prerequisites

- Node.js 20+
- npm

### Setup

From the repository root, run:

```bash
cd problems/04-observable-agent-loop
npm install
```

### Run the project

```bash
npm run dev
```
### Successful scenario

Running:

```bash
npm run dev
```

automatically runs the successful demonstration first.

The agent investigates a payments-service incident using three tools:

```text
search_logs
→ get_metrics
→ service_status
→ final response
```

The CLI prints the execution trace so the reviewer can see the model decisions, tool calls, tool results, and final response.

### Failure and recovery scenario

The same `npm run dev` command also runs a failure demonstration using `failing_tool`.

The expected flow is:

```text
Model decision
→ failing_tool
→ tool error
→ error recorded in trace
→ error added to agent history
→ model makes another decision
→ final response
```

The tool failure does not crash the agent loop.

### Execution-limit scenario

The CLI also demonstrates protection against an agent running indefinitely.

The `InfiniteModel` continuously requests another tool call, while the `AgentRunner` is configured with:

```text
maxSteps = 3
```

After three iterations, execution stops and an `execution_limit` event is recorded.

### Build

To verify the TypeScript build:

```bash
npm run build
```

## Run the tests

```bash
npm test
```

The test suite covers tool registration and validation, agent execution, tool failures, recovery, trace recording, and execution limits.

## Architecture and data flow

The implementation is organized around a small set of focused components:

- **AgentRunner** — orchestrates the agent loop, maintains execution history, enforces the maximum step limit, and records trace events.
- **Model** — decides whether the agent should call a tool or produce a final response.
- **ToolRegistry** — stores and resolves the tools available to the agent.
- **ToolExecutor** — validates tool inputs with Zod and executes the selected tool.
- **TraceRecorder** — records model decisions, tool calls, results, errors, and execution-limit events.
- **Tools** — provide the actual capabilities used by the agent, such as `search_logs`, `get_metrics`, and `service_status`.

### Data flow

```text
Objective
   ↓
AgentRunner
   ↓
Model decision
   ↓
ToolRegistry
   ↓
ToolExecutor
   ↓
Tool execution
   ↓
Tool result / error
   ↓
Agent history + TraceRecorder
   ↓
Model makes next decision
   ↓
Final response
```

The `AgentRunner` continues this loop until the model returns a final response or the configured `maxSteps` limit is reached.

## Technology choices

The project uses TypeScript with Node.js.

- **TypeScript** provides static typing and makes the agent, tool, and trace interfaces explicit.
- **Zod** is used for runtime validation of tool inputs.
- **Vitest** is used for automated testing.
- **tsx** is used to run the TypeScript application directly during development.

The implementation intentionally avoids an external LLM, database, or API dependency. A deterministic model is used so the agent loop and its failure scenarios can be reproduced consistently without API keys or external services.

An alternative would be to integrate a real LLM and external tools. That would make the prototype closer to a production agent system, but would introduce API credentials, network failures, nondeterministic behavior, and additional testing complexity.

## Important decisions

### 1. Separate orchestration from tool execution

The `AgentRunner` is responsible for controlling the agent loop, while `ToolExecutor` handles tool lookup, input validation, and execution. This keeps the core loop focused on orchestration and makes tool behavior easier to test independently.

### 2. Record errors instead of terminating the loop

Tool failures are captured as trace events and added to the agent history. The model can then make another decision instead of the entire process crashing. This demonstrates recovery as part of the agent loop.

### 3. Enforce a maximum execution limit

The `AgentRunner` uses a configurable `maxSteps` limit to prevent an agent from running indefinitely. When the limit is reached, execution stops in a controlled way and an `execution_limit` event is recorded.

## Assumptions and limitations

- The model is represented by deterministic implementations rather than a real LLM. This keeps the prototype reproducible and avoids external API dependencies.
- Tool data is synthetic and stored in memory for demonstration purposes.
- The prototype does not include persistent storage, authentication, or authorization.
- Tool execution does not currently include production-grade timeouts, cancellation, or retry/backoff policies.
- The agent supports the scenarios implemented by the provided model adapters rather than arbitrary natural-language objectives.
- The trace is stored in memory and is intended to demonstrate observability rather than replace a production tracing system.

## Production and scale

If this prototype were moved toward production, the first priorities would be reliability, observability, and external-system integration.

- Replace the deterministic model with a production LLM adapter with structured tool-calling support.
- Add persistent storage for agent state, execution history, and trace data.
- Add timeouts, cancellation, retry/backoff policies, and error classification for tool execution.
- Use a production observability system for traces, metrics, and alerts.
- Add authentication and authorization around tools and sensitive operations.
- Add safeguards for tool permissions, resource limits, and potentially long-running agent executions.
- Support external services through well-defined adapters so individual integrations can be changed without modifying the core agent loop.

## AI usage

AI tools were used during development as a coding and review assistant.

They helped with:
- Understanding the assignment requirements and acceptance criteria.
- Reviewing the project architecture and suggesting component boundaries.
- Debugging TypeScript and implementation issues.
- Reviewing tests and failure-handling scenarios.
- Improving the structure and clarity of the submission documentation.

All implementation decisions were reviewed and tested locally. The final behavior was verified using the project's build, test suite, and CLI demonstrations.

## Credibility note

### Nexum — AI Productivity Application

- **Problem it solved:** Nexum is a full-stack AI productivity application designed to help users interact with connected services through an AI-driven interface.
- **My personal contribution:** I worked across the frontend and backend, including Next.js application development, API routes, database integration, AI-driven intent parsing, and integrations with Gmail and Google Calendar.
- **Scale or operational complexity:** The project involved database-backed conversation and action logging, authentication, external service integrations, and coordinating multiple backend workflows.
- **Difficult engineering decision:** A key challenge was coordinating AI intent parsing with tool execution and external service integrations while keeping actions traceable and reliable.
- **Evidence:** https://github.com/Priyanshuverma023/Nexum
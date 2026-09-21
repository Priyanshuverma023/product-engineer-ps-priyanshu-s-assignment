import { describe, expect, it } from "vitest";
import { TraceRecorder } from "../src/trace/recorder.js";

describe("TraceRecorder", () => {
  it("records events in order", () => {
    const recorder = new TraceRecorder();

    recorder.record({
      type: "execution_limit",
      timestamp: "2026-09-19T10:00:00Z",
      maxSteps: 3,
    });

    recorder.record({
      type: "final_response",
      timestamp: "2026-09-19T10:00:01Z",
      content: "Done",
    });

    expect(recorder.getEvents()).toHaveLength(2);

    expect(recorder.getEvents()[0].type).toBe(
      "execution_limit",
    );

    expect(recorder.getEvents()[1].type).toBe(
      "final_response",
    );
  });

  it("does not expose its internal event array", () => {
    const recorder = new TraceRecorder();

    recorder.record({
      type: "final_response",
      timestamp: "2026-09-19T10:00:00Z",
      content: "Done",
    });

    const events = recorder.getEvents();

    events.pop();

    expect(recorder.getEvents()).toHaveLength(1);
  });
});
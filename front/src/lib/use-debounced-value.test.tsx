import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useDebouncedValue } from "./use-debounced-value";

afterEach(() => vi.useRealTimers());
describe("search debounce", () => {
  it("waits for typing to settle", () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value), {
      initialProps: { value: "" },
    });
    rerender({ value: "fisio" });
    act(() => vi.advanceTimersByTime(200));
    rerender({ value: "fisioterapia" });
    act(() => vi.advanceTimersByTime(200));
    expect(result.current).toBe("");
    act(() => vi.advanceTimersByTime(150));
    expect(result.current).toBe("fisioterapia");
  });
});

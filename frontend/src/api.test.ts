import { describe, expect, it, vi } from "vitest";

import { getSpikeStatus } from "./api";

describe("getSpikeStatus", () => {
  it("parses the FastAPI spike response", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        service: "FastAPI",
        message: "React is connected to the local API.",
      }),
    });

    await expect(getSpikeStatus(fetcher)).resolves.toEqual({
      service: "FastAPI",
      message: "React is connected to the local API.",
    });
    expect(fetcher).toHaveBeenCalledWith("/api/spike");
  });

  it("rejects failed API responses", async () => {
    const fetcher = vi.fn().mockResolvedValue({ ok: false, status: 503 });

    await expect(getSpikeStatus(fetcher)).rejects.toThrow("API request failed (503)");
  });
});

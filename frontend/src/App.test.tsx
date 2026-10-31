import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import App from "./App";

describe("App", () => {
  it("states the fixed decision-replay scope", () => {
    const html = renderToStaticMarkup(<App />);

    expect(html).toContain("Wind decision replay");
    expect(html).toContain("January 2026");
    expect(html).toContain("Forecast versus outturn");
    expect(html).toContain("Connecting to local API");
  });
});

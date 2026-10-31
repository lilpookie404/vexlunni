import { useEffect, useState } from "react";

import { getSpikeStatus, type SpikeStatus } from "./api";
import "./styles.css";

function App() {
  const [apiStatus, setApiStatus] = useState<SpikeStatus | null>(null);
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    let active = true;

    getSpikeStatus()
      .then((status) => {
        if (active) setApiStatus(status);
      })
      .catch(() => {
        if (active) setApiError(true);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="shell">
      <header className="masthead">
        <p className="eyebrow">National wind · decision-time view</p>
        <span className="status">Stage 2 · Local API spike</span>
      </header>

      <section className="intro" aria-labelledby="page-title">
        <div className="wind-mark" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div>
          <h1 id="page-title">Wind decision replay</h1>
          <p className="lede">
            January 2026 forecasts will be reconstructed from the information
            available at each day-ahead decision time.
          </p>
        </div>
      </section>

      <section className="scope" aria-label="Analysis scope">
        <article>
          <p className="label">Question</p>
          <p>What forecast was available, and how did it compare with outturn?</p>
        </article>
        <article>
          <p className="label">Measure</p>
          <p>Forecast versus outturn error in MW.</p>
        </article>
        <article>
          <p className="label">Sources</p>
          <p>Elexon WINDFOR and FUELHH WIND only.</p>
        </article>
      </section>
      <p className="api-status" role="status">
        {apiStatus?.message ??
          (apiError ? "Local API unavailable." : "Connecting to local API…")}
      </p>
    </main>
  );
}

export default App;

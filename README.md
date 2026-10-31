# Wind decision replay

A small React and FastAPI application for reviewing the national wind forecast
available at a day-ahead decision time and comparing it with Elexon generation
outturn. The analysis is descriptive; it does not recommend procurement volumes
or estimate costs or savings.

## Scope and date interpretation

- The only data sources are Elexon WINDFOR forecasts and FUELHH records filtered
  to `fuelType=WIND`.
- Decision timestamps fall in January 2026. Each decision is paired with the
  following day's 30-minute delivery intervals.
- Until authoritative assignment material establishes another cutoff, the
  working assumption is a decision at **09:00 Europe/London** on the preceding
  day. The app will label this assumption explicitly.
- Forecast selection will use the latest `publishTime` at or before the decision
  time, including a pre-January lookback where needed.
- Error is forecast minus outturn and is reported in MW over matched intervals.

## Project structure

```text
backend/   FastAPI service and Python tests
frontend/  React and TypeScript application
```

## Local development

Use Node 22 and Python 3.12.

```bash
cd backend
python -m pip install -r requirements-dev.txt
uvicorn app.main:app --reload
```

```bash
cd frontend
npm install
npm run dev
```

The API health endpoint is `GET /api/health`.

The Stage 2 API/packaging findings and unresolved source checks are recorded in
[`docs/stage-02-api-discovery.md`](docs/stage-02-api-discovery.md). In local
development, start FastAPI on port 8000 and Vite on its default port; Vite
proxies `/api` requests to FastAPI.

## Current stage

Stage 2 adds a local React-to-FastAPI status slice. Elexon retrieval and
deployment packaging are not implemented yet; source-schema limitations are
documented in the Stage 2 discovery note.

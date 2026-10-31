# Stage 2: API discovery and packaging spike

## Decision window

The working assumption from the project README is one decision per day at
09:00 Europe/London on January 1–31, 2026. Each decision concerns all 48
half-hour delivery periods on the following local calendar day: January 2
through February 1. The market cutoff is not established by the assignment;
09:00 is an explicit assumption, not a verified market gate.

For a decision at time `d`, the eligible forecast is the row with greatest
`publishTime <= d` for the delivery `startTime`. These are separate times:
decision time is the assumed purchase cutoff, `publishTime` is the forecast
vintage, and `startTime` is the delivery interval. The first decision falls
in January while its delivery is in January 2; retrieval must include forecast
publications before January. A December 31 publication lookback is required;
the exact earliest adequate lookback remains to be confirmed against a real
WINDFOR response before snapshot work.

## Source contract

| Dataset | Documented request shape | Fields and meaning | Pagination / limits |
| --- | --- | --- | --- |
| FUELHH | `GET /datasets/FUELHH/stream`; `publishDateTimeFrom`, `publishDateTimeTo`, `settlementDateFrom`, `settlementDateTo`, `settlementPeriod`, and `fuelType`. Use `fuelType=WIND` here only. The docs state publication-time and settlement-date ranges cannot be combined. | Elexon's generation-by-fuel definition says 30-minute values are average MW. The legacy BSC interface describes publication date, settlement date, settlement period, fuel type and generation (MW). Exact current stream JSON property names and revision metadata are unresolved because the current endpoint page is client-rendered and a real response could not be fetched. | Stream docs expose no page/offset/limit parameters. The developer portal describes stream responses as JSON without a return limit; still bound the snapshot request by the smallest documented date window. |
| WINDFOR | `GET /datasets/WINDFOR/stream`; use `publishDateTimeFrom` and `publishDateTimeTo`. Do not send `fuelType`. | The official WINDFOR forecast-view example (a separate endpoint) uses `publishTime`, `startTime`, settlement date/period and `generation` in MW. The forecast documentation describes the operationally visible/metred wind fleet. The exact `/datasets/WINDFOR/stream` JSON schema and January 2026 vintage rows remain unverified without a real response. | Stream docs expose no page/offset/limit parameters. Bound requests by publication time and save the returned snapshot; do not proxy broad upstream requests to visitors. |

### Revision and fleet handling

The current FUELHH stream's documented row schema could not be inspected from
this environment, so whether it exposes `documentRevisionNumber`, `publishTime`,
or another revision indicator is unresolved. Do not deduplicate or order
duplicate actual rows by an assumed field. Stage 3 must obtain the current
schema/response and decide revision handling from that evidence. The old BSC
interface guide does describe a publishing date, but that alone does not prove
the current stream's revision semantics.

Fleet equality is not established. Elexon describes WINDFOR as forecasts for
wind farms visible to the ESO with operational metering. FUELHH outturn excludes
embedded wind and wind farms without operational meters; NESO estimated its
operational-meter representation at about 82% of wind farms in 2025. Until
coverage is demonstrated to match, metrics must be labeled **forecast-versus-
outturn error**, with a coverage limitation beside them.

## Verification status and unresolved items

- Official stream endpoint pages and the Elexon developer portal were reviewed.
- A small live request to each stream could not be completed: this environment
  cannot resolve `data.elexon.co.uk` (`curl` returned DNS resolution error).
  Therefore no live response parsing, actual FUELHH revision check, or
  December/January WINDFOR vintage check is claimed as passed.
- Current endpoint page content is JavaScript-rendered in the documentation
  reader. Exact FUELHH/WINDFOR stream sample fields and timestamp serialization
  must be confirmed from the official OpenAPI/response before Stage 3 writes a
  source parser. No guessed fields are used in this stage's code.
- Dataset stream docs list publication-time filters and no pagination controls;
  the developer portal says stream JSON endpoints have no return limit. Keep
  the fixed retrieval window bounded regardless.
- FUELHH timestamps use settlement date/period in the older interface guide;
  WINDFOR's documented forecast view uses ISO 8601 timestamps with `Z`. Their
  exact current stream formats and timezone edge cases remain unresolved.
- A production public deployment was not created. Local server binding is
  denied by this execution sandbox, so the Vite proxy and frontend production
  build are verified, while live browser-to-API HTTP traffic and production
  hosting are not. The simplest planned production shape is one same-origin
  host/reverse proxy for the built React assets and FastAPI `/api` routes; the
  final container wiring remains Stage 5 work.

## Local React-to-FastAPI slice

The page requests `GET /api/spike` and displays the FastAPI response. Vite
proxies `/api` to `http://127.0.0.1:8000`, keeping the browser request same-
origin during local development. The production frontend build succeeds; the
deployment/host choice remains a single-origin frontend plus API route and
must be proven when Docker integration is implemented.

## Official references

- [FUELHH stream documentation](https://bmrs.elexon.co.uk/api-documentation/endpoint/datasets/FUELHH/stream)
- [WINDFOR stream documentation](https://bmrs.elexon.co.uk/api-documentation/endpoint/datasets/WINDFOR/stream)
- [Elexon Insights API developer portal](https://developer.data.elexon.co.uk/)
- [Elexon generation by fuel type definition and coverage note](https://bmrs.elexon.co.uk/generation-by-fuel-type)
- [Elexon wind forecast definition](https://bmrs.elexon.co.uk/wind-generation)
- [BSC glossary: WINDFOR](https://www.elexon.co.uk/bsc/glossary/wind-generation-forecast/)
- [Legacy BSC interface definition (FUELHH fields)](https://www.elexon.co.uk/bsc/documents/groups/isg/2022-meetings-isg/253-may/isg253-04b-cp1562-neta-idd-part-1-redline-text-v49/)

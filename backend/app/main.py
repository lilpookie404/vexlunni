from fastapi import FastAPI

app = FastAPI(title="Wind decision replay API")


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}

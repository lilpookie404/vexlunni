from fastapi import FastAPI

app = FastAPI(title="Wind decision replay API")


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/spike")
def spike_status() -> dict[str, str]:
    return {
        "service": "FastAPI",
        "message": "React is connected to the local API.",
    }

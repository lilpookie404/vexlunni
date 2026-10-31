from fastapi.testclient import TestClient

from app.main import app


def test_health_reports_service_ready() -> None:
    response = TestClient(app).get("/api/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_spike_endpoint_returns_local_api_status() -> None:
    response = TestClient(app).get("/api/spike")

    assert response.status_code == 200
    assert response.json() == {
        "service": "FastAPI",
        "message": "React is connected to the local API.",
    }

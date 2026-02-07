import pytest
from fastapi.testclient import TestClient

# Patch dependencies before importing the app so startup uses the fakes
class FakeIndex:
    def __init__(self):
        self.queries = []

    def query(self, vector, top_k=10, include_metadata=True):
        self.queries.append((vector, top_k, include_metadata))
        return {"matches": [{"id": "doc-1", "score": 0.95, "metadata": {"path": "x"}, "text": "hello"}]}


class FakeClient:
    def Index(self, name):
        return FakeIndex()

    def list_indexes(self):
        return ["gitSense_index"]


@pytest.fixture(autouse=True)
def patch_env(monkeypatch):
    import services.embedding_service as emb
    import vectorstore.pinecone as vp

    # Replace embed with a simple deterministic function
    monkeypatch.setattr(emb, "embed", lambda texts, batch_size=1: [[0.1] * 768 for _ in texts])

    # Replace init_pinecone to return a fake client
    monkeypatch.setattr(vp, "init_pinecone", lambda api_key=None: FakeClient())


def test_query_endpoint():
    from api.query_service import app

    client = TestClient(app)
    resp = client.post("/query", json={"query": "test query", "top_k": 5})

    assert resp.status_code == 200
    data = resp.json()
    assert "results" in data
    assert len(data["results"]) == 1
    r = data["results"][0]
    assert r["id"] == "doc-1"
    assert r["metadata"]["path"] == "x"


def test_health_ok():
    from api.query_service import app

    client = TestClient(app)
    resp = client.get("/health")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "ok"

from typing import Any, Dict, List, Optional
import logging

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from services import embedding_service
from vectorstore import pinecone as vs_pinecone

logger = logging.getLogger(__name__)

app = FastAPI(title="GitSense Query Service")

# Globals populated on startup
PC_CLIENT = None
INDEX = None


class QueryRequest(BaseModel):
    query: str
    top_k: Optional[int] = 10
    include_metadata: Optional[bool] = True


class QueryResult(BaseModel):
    id: str
    score: float
    metadata: Dict[str, Any]
    text: Optional[str]


class QueryResponse(BaseModel):
    results: List[QueryResult]
    query_time_ms: Optional[int] = None


@app.on_event("startup")
def startup_event():
    global PC_CLIENT, INDEX
    PC_CLIENT = vs_pinecone.init_pinecone()
    # Ensure index exists (no-op if already present)
    try:
        vs_pinecone.ensure_index(PC_CLIENT)
    except Exception as exc:
        logger.warning("Could not ensure index on startup: %s", exc)
    INDEX = PC_CLIENT.Index(vs_pinecone.INDEX_NAME)
    logger.info("Query service started and connected to Pinecone index '%s'", vs_pinecone.INDEX_NAME)


@app.post("/query", response_model=QueryResponse)
def query_endpoint(req: QueryRequest):
    """Embed the incoming query and run a nearest-neighbors search."""
    if not req.query:
        raise HTTPException(status_code=400, detail="query is required")

    # 1) Embed the query text
    try:
        emb = embedding_service.embed_query(req.query)
    except Exception as exc:
        logger.exception("Embedding failed: %s", exc)
        raise HTTPException(status_code=500, detail="embedding failed")

    # 2) Query the Pinecone index
    try:
        resp = INDEX.query(vector=emb, top_k=req.top_k, include_metadata=req.include_metadata)
    except Exception as exc:
        logger.exception("Pinecone query failed: %s", exc)
        raise HTTPException(status_code=500, detail="vector query failed")

    # 3) Normalize response
    results = []
    # Pinecone SDK response shapes differ; support common fields
    matches = []
    if isinstance(resp, dict):
        matches = resp.get("matches", [])
    else:
        # object-like response (SDK Index.query returns object with .matches)
        matches = getattr(resp, "matches", []) or []

    for m in matches:
        # match may have id, score, metadata, and optional text field
        results.append(
            QueryResult(
                id=m.get("id") or getattr(m, "id", ""),
                score=m.get("score") or getattr(m, "score", 0.0),
                metadata=m.get("metadata") or getattr(m, "metadata", {}) or {},
                text=m.get("text") or getattr(m, "text", None),
            )
        )

    return QueryResponse(results=results)


@app.get("/health")
def health():
    """Simple health check verifying connectivity to embedding provider and Pinecone."""
    ok = True
    messages = []

    # Check embedding
    try:
        _ = embedding_service.embed_query("health check")
    except Exception as exc:
        ok = False
        messages.append(f"embed_error: {exc}")

    # Check pinecone
    try:
        client = vs_pinecone.init_pinecone()
        _ = client.list_indexes()
    except Exception as exc:
        ok = False
        messages.append(f"pinecone_error: {exc}")

    status = "ok" if ok else "fail"
    return {"status": status, "messages": messages}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("api.query_service:app", host="0.0.0.0", port=8000, reload=True)

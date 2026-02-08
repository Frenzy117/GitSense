import os
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, HTTPException
import logging
from pydantic import BaseModel
import uvicorn
from langchain_community.document_loaders import GithubFileLoader
import cohere
from fastapi.middleware.cors import CORSMiddleware


from services.embedding_service import embed_query
from vectorstore import pinecone as pc

logger = logging.getLogger(__name__)
co = cohere.ClientV2(api_key=os.getenv("COHERE_TOKEN"))

app = FastAPI(title='GitSense Semantic Search Service')
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite default
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PC_CLIENT = None
INDEX = None

class QueryRequest(BaseModel):
    query: str
    top_k: Optional[int] = 5
    include_metadata: Optional[bool] = True

class IndexStats(BaseModel):
    vectorCount: int
    dimension: int
    metric: str
    vectorType: str

class QueryResult(BaseModel):
    id: str
    score: float
    metadata: Dict[str, Any]
    text: Optional[str]

class QueryResponse(BaseModel):
    results: List[QueryResult]
    query_time_ms: Optional[int] = None
    # file_content: Optional[str] = None

@app.on_event("startup")
def startup_event():
    global PC_CLIENT, INDEX
    PC_CLIENT = pc.init_pinecone()
    try:
        pc.ensure_index(PC_CLIENT)
    except Exception as exception:
        logger.warning("Could not ensure index on startup: %s", exception)
    INDEX = PC_CLIENT.Index(pc.INDEX_NAME)
    logger.info("Query service started and connected to Pinecone index: %s", pc.INDEX_NAME)

@app.post("/stats", response_model=IndexStats)
def get_index_stats():
    try:
        raw = INDEX.describe_index_stats()
        return IndexStats(
            vectorCount=int(raw.get("total_vector_count", "totalVectorCount")),
            dimension=int(raw.get("dimension")),
            metric=str(raw.get("metric")),
            vectorType=str(raw.get("vector_type")),
        )
    except Exception as exception:
        logger.exception("Failed to get index stats: %s", exception)
        raise HTTPException(status_code=500, detail="Failed to get index stats.")


@app.post("/query", response_model=QueryResponse)
def query_endpoint(req: QueryRequest):
    if not req.query:
        raise HTTPException(status_code = 400, detail="Please provide a query string.")
    print(req.query)
    try:
        query_embedding = embed_query(req.query)
    except Exception as exception:
        logger.exception("Embedding failed: %s", exception)
        raise HTTPException(status_code = 500, detail = "embedding failed")
    
    try:
        response = INDEX.query(vector=query_embedding, top_k=req.top_k, include_metadata= req.include_metadata)
    except Exception as exception:
        logger.exception("Pinecone query failed: %s", exception)
        raise HTTPException(status_code= 500, detail="Pinecone vector query failed.")
    
    query_results = []
    document_matches = []

    if isinstance(response, dict):
        document_matches = response.get("matches", [])
    else:
        document_matches = getattr(response, "matches", [])
    

    for match in document_matches:
        importance = match.get("metadata").get("importance", 1.0)
        match.score *= importance
        query_results.append(
            QueryResult(
                id=match.get("id") or getattr(match, "id", ""),
                score = match.get("score") or getattr(match, "score", 0.0),
                metadata = match.get("metadata") or getattr(match, "metadata", {}) or {},
                text = match.get("page_content") or getattr(match, "page_content", None),
            )
        )
    # sorted_results = sorted(query_results, key=lambda x: x.score, reverse=True)

    # If there are no results just return early
    if not query_results:
        return QueryResponse(results=query_results)

    # Try to load the actual file from GitHub only if repo_id and path are present
    file_content = None
    first_meta = query_results[0].metadata or {}
    repo_id = first_meta.get("repo_id")
    path = first_meta.get("path")

    if repo_id and path:
        try:
            loader = GithubFileLoader(
                repo=repo_id,
                access_token=os.getenv("GITHUB_TOKEN"),
                file_filter=lambda fp: fp == path,
            )
            content = loader.get_file_content_by_path(path)
            if content is None:
                logger.warning("Github loader returned no content for repo %s path %s", repo_id, path)
            else:
                file_content = content
                logger.info("Successfully loaded file content from GitHub for repo %s path %s", repo_id, path)
        except Exception as e:
            logger.warning("Could not load file from GitHub for repo %s path %s: %s", repo_id, path, e)
    else:
        logger.info("Top query result missing repo_id or path metadata; skipping GitHub file load.")

    return QueryResponse(results=query_results
                        #  file_content=file_content
                         )

if __name__ == "__main__":
    uvicorn.run("api.query_service_scnd:app", host="0.0.0.0",port = 8000, reload=True)

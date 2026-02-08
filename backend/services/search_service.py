from typing import List, Dict, Any
from services.embedding_service import embed_query
from pinecone import Pinecone

def search_relevant_documents(query: str, top_k: int = 5, pinecone_client=None) -> List[Dict[str, Any]]:
    query_embedding = embed_query(query)
    query_results = pinecone_client.query(
        vector=query_embedding,
        top_k=top_k,
        include_metadata=True
    )
    return query_results["matches"]
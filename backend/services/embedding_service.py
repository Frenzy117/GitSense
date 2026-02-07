from typing import List, Dict, Any, Optional, Callable, Tuple
from google import genai
import os
import hashlib
import logging
from langchain_pinecone import PineconeEmbeddings, PineconeVectorStore
from langchain_core.documents import Document
from langchain_ollama import OllamaEmbeddings

logger = logging.getLogger(__name__)


def embed(model, texts: List[str], batch_size: int = 100) -> List[List[float]]:
    """Return embeddings for a list of texts using GenAI.

    Args:
        texts: List of strings to embed.
        batch_size: Number of texts to embed per request.

    Returns:
        List of embedding vectors (list of floats) in the same order as inputs.
    """

    embeddings: List[List[float]] = []
    for i in range(0, len(texts), batch_size):
        batch = texts[i : i + batch_size]
        response = model.embed_documents(texts= batch)
        embeddings.extend([e for e in response])
    return embeddings


def _make_id(doc):
    meta = doc.get("metadata", {})
    path = meta.get("path", "unknown_path")
    start = meta.get("start_index", 0)
    return hashlib.sha1(f"{path}:{start}".encode()).hexdigest()


def embed_and_upsert(
    index,
    documents: List[Dict[str, Any]],
    id_fn: Optional[Callable[[Dict[str, Any]], str]] = None,
    batch_size: int = 100
) -> None:
    """Embed a list of documents and upsert them into the given Pinecone index.

    Args:
        index: Pinecone Index object (e.g., result of client.Index(name)).
        documents: List of dicts with 'text' and optional 'metadata'.
        id_fn: Optional function to generate an id for each document. Defaults to a SHA1 of path+text.
        batch_size: Number of documents to embed/upsert per batch.
    """
    if id_fn is None:
        id_fn = _make_id

    model = OllamaEmbeddings(model="llama3")
    vectorstore = PineconeVectorStore(embedding=model, index=index)

    texts = [d.get("page_content", "") for d in documents]
    metadatas = [d.get("metadata", {}) for d in documents]

    for i in range(0, len(texts), batch_size):
        batch_texts = texts[i : i + batch_size]
        batch_metas = metadatas[i : i + batch_size]
        embeddings = embed(model, batch_texts, batch_size=batch_size)

        vectors: List[Tuple[str, List[float], Dict[str, Any]]] = []
        for j, emb in enumerate(embeddings):
            doc = documents[i + j]
            doc_id = id_fn(doc)
            vectors.append((doc_id, emb, batch_metas[j]))
        vectorstore.add_documents(
            documents=[Document(page_content=text, metadata=meta) for text, meta in zip(batch_texts, batch_metas)]
        )
        logger.info("Upserted %d vectors (docs %d-%d)", len(vectors), i, i + len(vectors) - 1)

      
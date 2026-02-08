from typing import List, Dict, Any, Optional, Callable
import hashlib
import logging
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_pinecone import PineconeVectorStore
from langchain_core.documents import Document
from langchain_core.embeddings import Embeddings

logger = logging.getLogger(__name__)

EMBEDDING_MODEL = "BAAI/bge-base-en-v1.5"

_QUERY_INSTRUCTION = "Represent this sentence for searching relevant passages: "
_PASSAGE_INSTRUCTION = "Represent this sentence for retrieving relevant passages: "


class BGEEmbeddings(Embeddings):

    def __init__(self):
        self._model = HuggingFaceEmbeddings(
            model_name=EMBEDDING_MODEL,
            model_kwargs={"device": "cpu"},
            encode_kwargs={"normalize_embeddings": True},
        )

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        prefixed = [_PASSAGE_INSTRUCTION + t for t in texts]
        return self._model.embed_documents(prefixed)

    def embed_query(self, text: str) -> List[float]:
        prefixed = _QUERY_INSTRUCTION + text
        return self._model.embed_query(prefixed)


_embeddings: Optional[BGEEmbeddings] = None


def _model() -> BGEEmbeddings:
    global _embeddings
    if _embeddings is None:
        _embeddings = BGEEmbeddings()
    return _embeddings


def embed(texts: List[str], batch_size: int = 100) -> List[List[float]]:
    """Return embeddings for a list of texts using BAAI/bge-base-en-v1.5.

    Args:
        texts: List of strings to embed (passages/documents).
        batch_size: Number of texts to embed per batch.

    Returns:
        List of embedding vectors (768-dim each) in the same order as inputs.
    """
    model = _model()
    embeddings: List[List[float]] = []
    for i in range(0, len(texts), batch_size):
        batch = texts[i : i + batch_size]
        vectors = model.embed_documents(batch)
        embeddings.extend(vectors)
    return embeddings


def embed_query(text: str) -> List[float]:
    """Return embedding for a single query string.

    Uses the BGE query instruction prefix for better retrieval.
    """
    return _model().embed_query(text)


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
        documents: List of dicts with 'page_content' and optional 'metadata'.
        id_fn: Optional function to generate an id for each document.
        batch_size: Number of documents to embed/upsert per batch.
    """
    if id_fn is None:
        id_fn = _make_id

    model = _model()
    vectorstore = PineconeVectorStore(embedding=model, index=index)

    texts = [d.get("page_content", "") for d in documents]
    metadatas = [d.get("metadata", {}) for d in documents]

    # BGEEmbeddings adds passage instruction automatically in embed_documents
    for i in range(0, len(texts), batch_size):
        batch_texts = texts[i : i + batch_size]
        batch_metas = metadatas[i : i + batch_size]
        batch_docs = [
            Document(page_content=text, metadata=meta)
            for text, meta in zip(batch_texts, batch_metas)
        ]
        vectorstore.add_documents(batch_docs)
        logger.info("Upserted batch (docs %d-%d)", i, i + len(batch_docs) - 1)

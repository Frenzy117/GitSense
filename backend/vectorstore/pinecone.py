from pinecone import Pinecone, ServerlessSpec
from dotenv import load_dotenv
import logging
import os
from typing import List, Tuple, Dict, Any

from services.embedding_service import embed_and_upsert


load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_REGION = os.getenv("PINECONE_REGION", "us-east-1")
INDEX_NAME = os.getenv("PINECONE_INDEX_NAME", "gitsense-index")
VECTOR_DIM = int(os.getenv("VECTOR_DIM", "4096"))
METRIC = os.getenv("PINECONE_METRIC", "cosine")

def init_pinecone(api_key: str = None) -> Pinecone:
    """Return a Pinecone client instance after validating credentials."""
    api_key = api_key or PINECONE_API_KEY
    if not api_key:
        raise RuntimeError("PINECONE_API_KEY is not set in environment")

    pc = Pinecone(api_key=api_key)
    logger.info("Created Pinecone client")
    return pc


def ensure_index(client: Pinecone, name: str = INDEX_NAME, dimension: int = VECTOR_DIM, metric: str = METRIC, region: str = PINECONE_REGION) -> None:
    """Create the index if it doesn't already exist. Gracefully ignore 'already exists' errors."""
    # client.delete_index(name)
    try:
        client.create_index(
            name,
            dimension=dimension,
            metric=metric,
            spec=ServerlessSpec(cloud="aws", region=region),
        )
        logger.info("Created index '%s'", name)
    except Exception as exc:
        # Some Pinecone SDKs raise a generic exception if the index already exists; inspect message and continue.
        msg = str(exc).lower()
        if "already exists" in msg or "already exists" in msg.replace("'", ""):
            logger.info("Index '%s' already exists — continuing", name)
        else:
            logger.exception("Failed to create index '%s'", name)
            raise

def index_chunked_documents(client: Pinecone, index_name: str, chunked_docs: List[Dict[str, Any]], batch_size: int = 100) -> None:
    """Wrapper that delegates embedding and upsert to services.embedding_service.embed_and_upsert."""
    idx = client.Index(index_name)
    embed_and_upsert(idx, chunked_docs, batch_size=batch_size)
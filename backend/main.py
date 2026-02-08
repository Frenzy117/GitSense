import os
import logging
from typing import List, Tuple, Dict, Any
from dotenv import load_dotenv
from langchain_text_splitters import TextSplitter


import api.routes.ingest as ingest
import services.chunking_service as chunking_service
import services.embedding_service as embedding_service
from vectorstore.pinecone import index_chunked_documents, init_pinecone, ensure_index, INDEX_NAME
from langchain_community.document_loaders import GithubFileLoader
from services.search_service import search_relevant_documents

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()



if __name__ == "__main__":
    pc = init_pinecone()
    ensure_index(pc)
    index = pc.Index(INDEX_NAME)

    # Local ingest -> chunk -> index
    # manual_documents = ingest.load_documents(repos[0], EXTENSIONS)
    # manual_raw_documents = ingest.process_file(manual_documents)
    # manual_chunked_documents = chunking_service.file_type_chunk(manual_raw_documents)
    # if manual_chunked_documents:
    #     index_chunked_documents(pc, INDEX_NAME, manual_chunked_documents)
    # else:
    #     logger.info("No manual chunked documents found to index")

    repos = [
        # {
        #     "repo": "aws-samples/aws-mainframe-modernization-carddemo",
        #     "extensions": [".cbl", ".cpy", ".jcl", ".bms", ".dcl", ".txt", ".md"],
        # },
        # {
        #     "repo": "vercel/next.js",
        #     "extensions": [".ts", ".tsx", ".js", ".jsx", ".md", ".css"],
        # },
        {
            "repo": "sveltejs/svelte.dev",
            "extensions": [".svelte", ".ts", ".tsx", ".js", ".jsx",".css", ".html"],
        },
        {
            "repo": "chakra-ui/chakra-ui",
            "extensions": [".ts", ".tsx", ".js", ".jsx", ".mdx"],
        },
    ]

    for repo_config in repos:
        logger.info("Ingesting repo: %s", repo_config["repo"])
        ingest.load_and_chunk(repo_config, pc, INDEX_NAME)
    logger.info("Finished indexing run")




    
    
    
    
    
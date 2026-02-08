import os
from pathlib import Path
from langchain_community.document_loaders import GithubFileLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from typing import Dict

from vectorstore.pinecone import index_chunked_documents

file_type_map = {
    ".cbl": "cobol",
    ".cpy": "copybook",
    ".jcl": "jcl",
    ".bms": "basic_mapping_support",
    ".dcl": "declaration",
    ".txt": "text",
    ".md": "markdown",
}

EXTENSIONS = [
    ".cbl",
    ".cpy",
    ".jcl",
    ".bms",
    ".dcl",
    ".txt",
    ".md",
]
SKIP_KEYWORDS = [
    "code_of_conduct",
    "contributing",
    "license",
]

def should_skip(path: str) -> bool:
    p = path.lower()
    return any(k in p for k in SKIP_KEYWORDS)

def load_documents(path, extensions):
    files = []
    for path in Path(path).rglob("*"):
        if path.suffix in extensions and path.is_file():
            files.append(path)

    return files
    
def read_file(path: Path):
    try:
        return path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        return None
    
def process_file(files: list[Path]):
    raw_documents = []
    for file in files:
        if file.suffix in file_type_map:
            file_type = file_type_map[file.suffix]
        else:
            continue
        content = read_file(file)
        if not content:
            continue
        raw_documents.append({
            "text": content,
            "metadata": {
                "source": str(file),
                "file_name": file.name,
                "file_type": file_type,
                "artifact_type": "code" if file_type in ["cobol", "copybook", "jcl", "basic_mapping_support", "declaration"] else "text",
                }
            }
        )
    return raw_documents

def load_and_chunk(repo_config: Dict, client, index_name) -> None:
    """Load documents from a GitHub repo, chunk, and index into Pinecone.

    Repo config must have "repo" (GitHub owner/repo). Optional "extensions" overrides
    the default file type filter; e.g. [".ts", ".tsx", ".md"] for a TypeScript project.
    """
    repo = repo_config.get("repo")
    extensions = repo_config.get("extensions", EXTENSIONS)
    loader = GithubFileLoader(
        repo=repo,
        access_token=os.getenv("GITHUB_TOKEN"),
        file_filter=lambda file_path: any(file_path.endswith(ext) for ext in extensions) and not should_skip(file_path),
    )
    code_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100, add_start_index=True)
    readme_splitter = RecursiveCharacterTextSplitter(chunk_size=1500, chunk_overlap=200, add_start_index=True)

    github_documents = loader.load()
    docs = []
    if github_documents:
        for doc in github_documents:
            if doc.metadata["path"].lower().endswith("readme.md"):
                docs.extend(readme_splitter.split_documents([doc]))
            else:
                docs.extend(code_splitter.split_documents([doc]))
    if docs:
        # Convert to expected shape for indexing
        for d in docs:
            d.metadata["repo_id"] = repo
            path = d.metadata.get("path", "").lower()
            d.metadata["end_index"] = d.metadata.get("start_index",0) + len(d.page_content)

            if path.endswith("readme.md"):
                d.metadata["file_type"] = "readme"
                d.metadata["importance"] = 1.2
            elif path.endswith(".md"):
                d.metadata["file_type"] = "doc"
                d.metadata["importance"] = 1.1
            else:
                d.metadata["file_type"] = "code"
                d.metadata["importance"] = 1.0
        chunked = [
            {"page_content": d.page_content, "metadata": d.metadata} for d in docs
        ]
        index_chunked_documents(client, index_name, chunked)
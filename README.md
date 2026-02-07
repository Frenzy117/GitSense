# 🔍 Codebase Semantic Search with RAG

> Semantic search and retrieval over real-world GitHub repositories using embeddings, vector databases, and Retrieval-Augmented Generation (RAG).

This project allows developers to **search and explore source code using natural language queries**, instead of relying on traditional keyword-based search. It is built as a **production-oriented AI system**, focusing on correctness, scalability, and real-world engineering tradeoffs.

---

## 🚀 What This Project Does

- Ingests source code and documentation from GitHub repositories
- Splits files into meaningful chunks and generates embeddings
- Stores embeddings in a vector database (Pinecone)
- Accepts natural language queries via a FastAPI backend
- Retrieves the most relevant files and code snippets
- Returns GitHub source links for easy navigation
- (Planned) Highlights relevant code ranges in Monaco Editor

### Example Queries
- *“Which file defines the card data structure?”*
- *“Where is customer information handled?”*
- *“What code validates transactions?”*

---

## 🧠 System Architecture

**Backend**
- FastAPI (Python)
- Embedding generation (local & cloud models)
- Vector database: Pinecone
- GitHub ingestion with metadata enrichment
- Query-time scoring and reranking

**Frontend**
- React + Vite
- Monaco Editor (planned for code highlighting)
- REST-based API integration

### Data Flow
GitHub Repository
↓
Chunking + Embeddings (Langchain and Ollama)
↓
Vector Database (Pinecone)
↓
FastAPI Query Service
↓
React Frontend

---

## 🛠️ Tech Stack

- **Python**
- **FastAPI**
- **Pinecone (Vector Database)**
- **Embedding Models (Local & Cloud)**
- **GitHub API**
- **React + Vite**
- **Monaco Editor**
- **REST APIs**

---

## 📌 Current Scope

The current implementation focuses on:
- Ingesting one or two real GitHub repositories
- Supporting semantic search over code and documentation
- Returning top-K relevant results with metadata
- Displaying GitHub links to matched source files

This intentionally scoped approach ensures **high-quality retrieval and system stability** before scaling to hundreds or thousands of repositories.

---

## 🧩 Key Engineering Decisions

- Semantic search over keyword-based search
- Metadata-aware scoring (README dominance reduced)
- Chunk-level embeddings for better recall and precision
- Clean separation of ingestion, query, and frontend services
- Production-first API design (no notebook-only workflows)

---

## 📈 Planned Improvements

- Multi-repository ingestion at scale
- Automated repository discovery and indexing
- Reranking with cross-encoders
- Monaco Editor code highlighting using chunk offsets
- Authentication and user-level query history
- Retrieval evaluation metrics (precision@k, recall@k)

---

## 🎯 Why This Project Matters

This project demonstrates:
- Real-world RAG system design
- Practical handling of rate limits and memory constraints
- Experience with vector databases and semantic retrieval
- Full-stack AI engineering (backend + frontend)
- Production-aware architectural decision making

It is intended as a **portfolio-grade AI engineering project**, suitable for technical interviews and recruiter review.

---

## 🧪 Status

🚧 **Actively under development**

Initial deployment planned once ingestion and indexing are stable.

---

## 📬 Contact

If you’re interested in AI engineering, RAG systems, or semantic search over large codebases, feel free to explore the code or reach out.

import re

def chunk_text(doc, file_type, overlap):
        chunks = []

        pattern = file_chunk_map[file_type]
        raw_chunks = [s.strip() for s in re.split(pattern, doc["text"]) if s.strip()]

        for i in range(len(raw_chunks)):
            current_chunk = raw_chunks[i]
            if i > 0:
                 overlap = raw_chunks[i-1][-overlap:]
                 current_chunk = overlap + " " + current_chunk
            chunks.append(current_chunk)

        return chunks

file_chunk_map = {
    "copybook": r'\n(?=[A-Z0-9\-]+\.\s*\n)',
    "cobol": r'\n(?=[A-Z0-9\-]+\.\s*\n)',
    "jcl": r'\n(?=//\S+\s+EXEC\s+)',
    "declaration": r'\n(?=//\S+\s+EXEC\s+)',
    "basic_mapping_support": r'\n(?=\S+\s+DFHMDI\s)',
    "text": r'\n\s*\n',
    "markdown": r'\n(?=#{1,6}\s)',
}
    
def file_type_chunk(documents):
    chunked_documents = []
    for doc in documents:
        file_type = doc["metadata"]["file_type"]

        if file_chunk_map.get(file_type):
            chunks = chunk_text(doc, file_type=file_type, overlap=200)  
        else:
            continue

        for i, chunk in enumerate(chunks):
            chunked_documents.append({
                "text": chunk,
                "metadata": {
                    **doc["metadata"],
                    "chunk_index": i
                }
            })
    return chunked_documents
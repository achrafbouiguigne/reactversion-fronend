from flask import Flask, request, jsonify
from flask_cors import CORS
import fitz  
import faiss
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
import requests
import google.generativeai as genai
from langchain.schema import Document
from langchain_community.vectorstores import FAISS

app = Flask(__name__)
CORS(app)  
# --- Load and setup models ---
genai.configure(api_key="AIzaSyCAi1XPo_dBVxTjTln7LVJVMvBgRd1Qzgk")  

def load_pdf_chunks(pdf_path, chunk_size=500, overlap=50):
    doc = fitz.open(pdf_path)
    full_text = ""
    for page in doc:
        full_text += page.get_text()
    chunks = []
    start = 0
    while start < len(full_text):
        end = min(start + chunk_size, len(full_text))
        chunk = full_text[start:end]
        chunks.append(chunk.strip())
        start += chunk_size - overlap
    return chunks


pdf_chunks = load_pdf_chunks("ruthless.pdf")
docs = [Document(page_content=chunk) for chunk in pdf_chunks]


texts = [doc.page_content for doc in docs]
vectorizer = TfidfVectorizer()
vectors = vectorizer.fit_transform(texts).toarray().astype('float32')


index = faiss.IndexFlatL2(vectors.shape[1])
index.add(vectors)


faiss_store = FAISS(
    embedding_function=None,
    index=index,
    docstore=docs,
    index_to_docstore_id=lambda i: str(i)
)

def retrieve(query, vectorizer, faiss_store, k=3):
    query_vector = vectorizer.transform([query]).toarray().astype('float32')
    _, indices = faiss_store.index.search(query_vector, k)
    return [faiss_store.docstore[i] for i in indices[0]]

def generate_ruthless_response(query, relevant_docs, api_key):
    context = "\n".join([doc.page_content for doc in relevant_docs])
    prompt = f"""
You're a savage motivational chatbot. No sugarcoating.
Context:
{context}
Question: {query}
Respond like a badass life coach:
"""
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}"
    headers = { "Content-Type": "application/json" }
    body = { "contents": [ { "parts": [ { "text": prompt } ] } ] }
    try:
        response = requests.post(url, headers=headers, json=body)
        response.raise_for_status()
        data = response.json()
        return data['candidates'][0]['content']['parts'][0]['text']
    except Exception as e:
        return f"⚠️ Error: {str(e)}"

@app.route('/api/query', methods=['POST'])
def query_rag():
    data = request.get_json()
    user_query = data.get('query')
    relevant_docs = retrieve(user_query, vectorizer, faiss_store)
    answer = generate_ruthless_response(user_query, relevant_docs, "AIzaSyCAi1XPo_dBVxTjTln7LVJVMvBgRd1Qzgk")  # replace with your real API key
    return jsonify({'response': answer})

if __name__ == '__main__':
    app.run(port=2000)
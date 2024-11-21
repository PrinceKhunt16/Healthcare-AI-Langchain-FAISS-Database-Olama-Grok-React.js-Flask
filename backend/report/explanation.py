import os
import tempfile
from dotenv import load_dotenv
from io import BytesIO
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_groq import ChatGroq
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
load_dotenv(dotenv_path=".env.local")
session_store = {}

api_key = os.environ.get("GROQ_API_KEY")
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
llm = ChatGroq(model="Gemma2-9b-It")

def get_summary(file):
    try:
        if api_key is None: 
            return {
                "status": "error",
                "message": "Groq api key is required."
            }

        file_buffer = BytesIO(file.read())
        
        with tempfile.NamedTemporaryFile(suffix=".pdf", delete=True) as temp_file:
            temp_file.write(file_buffer.getvalue())
            temp_file.flush()  
            loader = PyPDFLoader(temp_file.name)
            docs = loader.load()
        
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        splits = text_splitter.split_documents(docs)
        vectorstore = Chroma.from_documents(documents=splits, embedding=embeddings)
        retriever = vectorstore.as_retriever(search_kwargs={"k": 4})

        prompt_template = PromptTemplate.from_template(
            "You are an expert summarizer. Provide a concise, comprehensive summary of the following context. "
            "Highlight the key points, main arguments, and critical insights:\n\n{context}"
        )

        def format_docs(docs):
            return "\n\n".join(doc.page_content for doc in docs)

        rag_chain = (
            {"context": retriever | format_docs}
            | prompt_template
            | llm
            | StrOutputParser()
        )

        summary = rag_chain.invoke("")

        return {
            "status": "success",
            "summary": summary
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }
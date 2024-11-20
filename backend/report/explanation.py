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
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.chat_history import BaseChatMessageHistory
from langchain.chains.combine_documents.stuff import StuffDocumentsChain

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

def get_session_history(session_id):
    if session_id not in session_store:
        session_store[session_id] = BaseChatMessageHistory()
    return session_store[session_id]
    
def initialize_chatbot_chain(summary, session_id):
    system_prompt = f"""
    You are an AI assistant specializing in answering questions based on the following medical report summary:
    {summary}

    Your responses should be concise, accurate, and user-friendly. If the user's question is unrelated to the 
    summary, respond politely and suggest they ask questions based on the medical context.

    ## Key Instructions
    1. Always prioritize the content of the summary for generating responses.
    2. If the user question is unclear, politely ask for clarification.
    3. Avoid providing medical advice that is not backed by the summary.
    """
    qa_prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        MessagesPlaceholder("chat_hist"),
        ("human", "{input}")
    ])
    qa_chain = StuffDocumentsChain(llm, qa_prompt)
    chatbot_chain = RunnableWithMessageHistory(
        qa_chain,
        get_session_history=get_session_history(session_id),
        input_messages_key="input",
        history_messages_key="chat_hist",
        output_messages_key="answer"
    )

    return chatbot_chain

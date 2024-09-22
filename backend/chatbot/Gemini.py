import google
import google.generativeai as genai
from time import sleep
from GeminiHist import data

def Gemini(prompt, retries=3):
    # Configure the API key for Google Generative AI
    api_key = "AIzaSyD9EnNQ6cxCVAlIsY5O0m-6rwdb-4tVEfU"
    genai.configure(api_key=api_key)

    # Define the generation configuration
    generation_config = {
        "temperature": 1,
        "top_p": 0.95,
        "top_k": 64,
        "max_output_tokens": 8192,
        "response_mime_type": "text/plain",
    }

    # Initialize the GenerativeModel with the configuration
    model = genai.GenerativeModel(
        model_name="gemini-1.5-pro",
        generation_config=generation_config,
        system_instruction="You are made to help patients and keep supportive and polite.",
    )

    chat_session = model.start_chat(history=data)

    for attempt in range(retries):
        try:
            response = chat_session.send_message(prompt)
            return response.text
        except google.api_core.exceptions.InternalServerError as e:
            print(f"Attempt {attempt + 1} failed: {e}")
            sleep(2) 
        except Exception as e:
            print(f"An unexpected error occurred: {e}")
            break

    if response:
        return response.text
    else:
        return "Failed to get a response after multiple attempts."
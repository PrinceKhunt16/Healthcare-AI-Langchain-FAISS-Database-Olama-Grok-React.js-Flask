import os
import pandas as pd
from sklearn.neighbors import NearestNeighbors
import tensorflow as tf
import tensorflow_hub as hub
import kagglehub
import pickle

def Recommender(input):
    os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'  # Disable oneDNN optimizations

    # Download latest version of the model
    try:
        path = kagglehub.model_download("google/universal-sentence-encoder/tensorFlow2/universal-sentence-encoder")
    except Exception as e:
        print(f"Error downloading model: {e}")
        path = "local_path_to_model"  # Fallback to a local path if download fails

    # Load the Universal Sentence Encoder model from local directory
    try:
        model = hub.load(path)
        print("Model is loaded.")
    except Exception as e:
        print(f"Error loading model: {e}")
        return []

    # Load datasets
    file_name = 'resource/data.csv'
    absolute_path = os.path.abspath(file_name)

    try:
        df = pd.read_csv(absolute_path)
    except Exception as e:
        print(f"Error loading datasets: {e}")
        return []

    # Fill missing values
    df = df.fillna('')

    # Define embedding function with batching
    def embed(texts, batch_size=200):
        embeddings = []
        for i in range(0, len(texts), batch_size):
            batch = texts[i:i+batch_size]
            embeddings.append(model(batch))
        return tf.concat(embeddings, axis=0)

    embeddings_path = 'recommendation.pkl'

    if not os.path.exists(embeddings_path):
        # Get embeddings for titles and descriptions
        titles = df['Title_Description'].tolist()
        embeddings = embed(titles)

        # Save embeddings to file
        with open(embeddings_path, 'wb') as f:
            pickle.dump(embeddings, f)
        print("Embeddings saved successfully.")
    else:
        # Load embeddings from file
        with open(embeddings_path, 'rb') as f:
            embeddings = pickle.load(f)
        print("Embeddings loaded successfully.")

    # Fit Nearest Neighbors model
    nn = NearestNeighbors(n_neighbors=9)
    nn.fit(embeddings)

    # Function to process YouTube URLs
    yt_url = "https://www.youtube.com/embed/"

    def process(url):
        return yt_url + url

    # Function to recommend videos based on input text
    def recommend(text):
        try:
            emd = embed([text])
            neighbours = nn.kneighbors(emd, return_distance=False)[0]
            results = df.iloc[neighbours]

            # Limit description length for brevity and remove excess information
            recommendations = [
                {
                    'title': row['Title_Description'].split('.')[0],  # Limit to first sentence
                    'url': process(row['ids']),
                    'description': row['Title_Description'][:100]  # Limit description length to 100 characters
                } for _, row in results.iterrows()
            ]
        
            return recommendations
        except Exception as e:
            print(f"Error in recommendation: {e}")
            return []

    # Get recommendations based on provided input
    recommendations = recommend(input)
    return recommendations
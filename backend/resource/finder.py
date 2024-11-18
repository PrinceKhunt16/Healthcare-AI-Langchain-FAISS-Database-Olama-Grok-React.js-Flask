import os
import pandas as pd
from sklearn.neighbors import NearestNeighbors
import tensorflow as tf
import tensorflow_hub as hub
import kagglehub
import pickle

def recommander(input):
    os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

    try:
        path = kagglehub.model_download("google/universal-sentence-encoder/tensorFlow2/universal-sentence-encoder")
    except Exception as e:
        print(f"Error downloading model: {e}")
        path = "local_path_to_model" 

    try:
        model = hub.load(path)
        print("Model is loaded.")
    except Exception as e:
        print(f"Error loading model: {e}")
        return []

    file_name = 'data.csv'
    absolute_path = os.path.abspath(file_name)

    try:
        df = pd.read_csv(absolute_path)
    except Exception as e:
        print(f"Error loading datasets: {e}")
        return []

    df = df.fillna('')

    def embed(texts, batch_size=200):
        embeddings = []
        for i in range(0, len(texts), batch_size):
            batch = texts[i:i+batch_size]
            embeddings.append(model(batch))
        return tf.concat(embeddings, axis=0)

    embeddings_path = 'model.pkl'

    if not os.path.exists(embeddings_path):
        titles = df['Title_Description'].tolist()
        embeddings = embed(titles)

        with open(embeddings_path, 'wb') as f:
            pickle.dump(embeddings, f)
        print("Embeddings saved successfully.")
    else:
        with open(embeddings_path, 'rb') as f:
            embeddings = pickle.load(f)
        print("Embeddings loaded successfully.")

    nn = NearestNeighbors(n_neighbors=9)
    nn.fit(embeddings)

    yt_url = "https://www.youtube.com/embed/"

    def process(url):
        return yt_url + url

    def recommend(text):
        try:
            emd = embed([text])
            neighbours = nn.kneighbors(emd, return_distance=False)[0]
            results = df.iloc[neighbours]

            recommendations = [
                {
                    'title': row['Title_Description'].split('.')[0], 
                    'url': process(row['ids']),
                    'description': row['Title_Description'][:100] 
                } for _, row in results.iterrows()
            ]
        
            return recommendations
        except Exception as e:
            print(f"Error in recommendation: {e}")
            return []

    recommendations = recommend(input)
    return recommendations
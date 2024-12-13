import os
import numpy as np
import pandas as pd
import tensorflow as tf
from sklearn.metrics.pairwise import cosine_similarity
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from tensorflow.keras.applications.vgg16 import VGG16, preprocess_input
import argparse
import re
import requests
from io import BytesIO
from PIL import Image
import json

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3' 
tf.get_logger().setLevel('ERROR')  


def load_model():
    model = VGG16(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
    model.trainable = False
    return model


def extract_features(image_path, model):
    if is_valid_http_url(image_path):
        img_data = requests.get(image_path).content
        img = Image.open(BytesIO(img_data))
    else:
        img = load_img(image_path, target_size=(224, 224))

    img = img.resize((224, 224))
    img_array = img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)
    features = model.predict(img_array)
    return features.flatten()


def is_valid_http_url(url):
    return re.match(r'^(http://|https://)', url) is not None


def is_image_accessible(url):
    try:
        response = requests.head(url, allow_redirects=True)
        return response.status_code == 200 and 'image' in response.headers.get('Content-Type', '').lower()
    except requests.exceptions.RequestException:
        return False


def calculate_similarity(query_features, df, model):
    similar_images = {"data": []}
    for _, row in df.iterrows():
        try:
            image_url = row['image']
            if not is_valid_http_url(image_url) or not is_image_accessible(image_url):
                continue

            stored_features = extract_features(image_url, model)
            similarity_score = cosine_similarity([query_features], [stored_features])[0][0]

            if similarity_score > 0.6:
                similar_images["data"].append({
                    'image_url': image_url,
                    'title': row.get('Title', 'Unknown Title'),
                    'color': row.get('Color', 'Unknown Color'),
                    'size': row.get('Size', 'Unknown Size'),
                    'price': row.get('Price', 'Unknown Price'),
                    'description': row.get('Description', 'No description available'),
                    'similarity_score': float(similarity_score)
                })
        except Exception:
            continue
    
    return similar_images


def main(query_img, excel_file):
    model = load_model()
    query_features = extract_features(query_img, model)

    df = pd.read_excel(excel_file)
    similar_images = calculate_similarity(query_features, df, model)


    print(json.dumps(similar_images))

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Image similarity search based on query image.")
    parser.add_argument('--query_img', type=str, required=True, help="Path to the query image")
    parser.add_argument('--excel_file', type=str, required=True, help="Path to the Excel file with image links and metadata")
    
    args = parser.parse_args()
    main(args.query_img, args.excel_file)
import os, uuid
from flask import request, jsonify
from flask_smorest import Blueprint

from db import db
from models import ItemImages

blp = Blueprint("ImageUpload", "imageupload", description="Upload Item Images")

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@blp.route("/upload-image", methods=["POST"])
def uploadImage():
    if "image" not in request.files:
        return jsonify({"message":"No image provided"}), 400
    
    file = request.files["image"]
    filename = f"{uuid.uuid4()}.jpg"
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    image_url = f"/uploads/{filename}"
    return jsonify({"image_url": image_url}), 201
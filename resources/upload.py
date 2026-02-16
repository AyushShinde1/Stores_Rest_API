from flask import Blueprint, request, jsonify
import os,uuid

blp = Blueprint("Uploads", "uploads", description="Image uploads")

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@blp.route("/upload-image", methods=["POST"])
def upload_image():
    if "image" not in request.files:
        return jsonify({"message": "No image provided"}), 400

    file = request.files["image"]
    filename = f"{uuid.uuid4()}.jpg"
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    image_url = f"/uploads/{filename}"
    return jsonify({"image_url": image_url}), 201
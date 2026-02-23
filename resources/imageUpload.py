import os
import uuid
from flask import request, jsonify, send_from_directory
from flask_smorest import Blueprint

from db import db
from models.upload import ItemImages, StoreImages
from schemas import ItemImageSchema, StoreImageSchema

blp = Blueprint("ImageUpload", "imageupload", description="Upload Item Images")

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@blp.route("/upload-image", methods=["POST"])
@blp.response(201, ItemImageSchema)
def uploadImage():
    if "image" not in request.files:
        return jsonify({"message": "No image provided"}), 400
    
    file = request.files["image"]
    if not file.filename:
        return jsonify({"message": "No selected file"}), 400
    
    filename = f"{uuid.uuid4()}.jpg"
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    name = request.form.get('name') or request.form.get('itemname')
    item_id_str = request.form.get('item_id') or request.form.get('itemid')
    description = request.form.get('description') or request.form.get('imagedesc')

    if not name:
        return jsonify({"message": "name required"}), 400
    if not item_id_str:
        return jsonify({"message": "item_id required"}), 400
    
    try:
        item_id = int(item_id_str)
    except ValueError:
        return jsonify({"message": "item_id must be integer"}), 400

    from models.item import ItemModel 
    if not ItemModel.query.get(item_id):
        return jsonify({"message": f"Item ID {item_id} not found"}), 404

    image = ItemImages(
        name=name,
        image_url=f"/uploads/{filename}",
        description=description,
        item_id=item_id
    )

    db.session.add(image)
    db.session.commit()

    return {
        "id": image.id,
        "name": image.name,
        "image_url": image.image_url,
        "description": image.description,
        "item_id": image.item_id
    }, 201


@blp.route("/upload-store-image", methods=["POST"])
@blp.response(201, StoreImageSchema)
def uploadStoreImage():
    if "image" not in request.files:
        return jsonify({"message": "No image provided"}), 400

    file = request.files["image"]
    if not file.filename:
        return jsonify({"message": "No selected file"}), 400

    filename = f"{uuid.uuid4()}.jpg"
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    name = request.form.get("name") or request.form.get("storename")
    store_id_str = request.form.get("store_id") or request.form.get("storeid")
    description = request.form.get("description") or request.form.get("imagedesc")

    if not name:
        return jsonify({"message": "name required"}), 400
    if not store_id_str:
        return jsonify({"message": "store_id required"}), 400

    try:
        store_id = int(store_id_str)
    except ValueError:
        return jsonify({"message": "store_id must be integer"}), 400

    from models.store import StoreModel
    if not StoreModel.query.get(store_id):
        return jsonify({"message": f"Store ID {store_id} not found"}), 404

    image = StoreImages(
        name=name,
        image_url=f"/uploads/{filename}",
        description=description,
        store_id=store_id,
    )

    db.session.add(image)
    db.session.commit()

    return {
        "id": image.id,
        "name": image.name,
        "image_url": image.image_url,
        "description": image.description,
        "store_id": image.store_id,
    }, 201
# @blp.route("/uploads/<path:filename>")
# def uploaded_file(filename):
#     return send_from_directory("uploads", filename)



# import os, uuid
# from flask import request, jsonify
# from flask_smorest import Blueprint

# from db import db
# from models import ItemImages
# from schemas import ItemImageSchema

# blp = Blueprint("ImageUpload", "imageupload", description="Upload Item Images")

# UPLOAD_FOLDER = "uploads"
# os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# @blp.route("/upload-image", methods=["POST"])
# #@blp.arguments(ItemImageSchema) This does not expect json it expects multi-form data
# @blp.response(201,ItemImageSchema)
# def uploadImage():
#     if "image" not in request.files:
#         return jsonify({"message":"No image provided"}), 400
    
#     file = request.files["image"]
#     filename = f"{uuid.uuid4()}.jpg"
#     filepath = os.path.join(UPLOAD_FOLDER, filename)
#     file.save(filepath)

#     name = request.form.get('itemname')
#     itemid = request.form.get('itemid')
#     img_description = request.form.get('imagedesc')

#     image = ItemImages(
#         name=name,
#         item_id=itemid,
#         description=img_description,
#         image_url=f"/uploads/{filename}"
#     )

#     db.session.add(image)
#     db.session.commit()

#     return jsonify({
#         "id": image.id,
#         "itemid": itemid,
#         "img_description": img_description,
#         "image_url": f"/uploads/{filename}"
#     }), 201
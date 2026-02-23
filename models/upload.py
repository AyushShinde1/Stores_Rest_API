from db import db

class ItemImages(db.Model):
    __tablename__ = "itemImages"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    image_url = db.Column(db.String, nullable=False)
    description = db.Column(db.String)
    item_id = db.Column(db.Integer, db.ForeignKey("items.id"), nullable=False)

    items = db.relationship("ItemModel", back_populates="itemImages")

class StoreImages(db.Model):
    __tablename__ = 'storeImages'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    image_url = db.Column(db.String)
    description = db.Column(db.String)
    store_id = db.Column(db.Integer, db.ForeignKey("stores.id"), nullable=False)

    store = db.relationship("StoreModel", back_populates="storeImages")
from db import db

class ItemImages(db.Model):
    __tablename__ = "itemImages"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)
    image_url = db.Column(db.String, nullable=False)
    description = db.Column(db.String)
    item_id = db.Column(db.Integer, db.ForeignKey("items.id"), nullable=False)

    items = db.relationship("ItemModel", back_populates="itemImages")
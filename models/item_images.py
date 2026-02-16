from db import db

class ItemImageModel(db.Model):
    __tablename__ = "item_images"
    
    id = db.Column(db.Integer, primary_key=True)
    item_id = db.Column(db.Integer, db.ForeignKey("items.id"))
    image_url = db.Column(db.String, nullable=False)
    description = db.Column(db.String)

    item = db.relationship("ItemModel", back_populates="images")
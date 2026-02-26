from db import db


class StoreModel(db.Model):
    __tablename__ = "stores"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)

    # tags = db.relationship("TagModel", back_populates="store", lazy="dynamic")
    # items = db.relationship("ItemModel", back_populates="store", lazy="dynamic")
    # storeImages = db.relationship("StoreImages", back_populates="store", lazy="dynamic")

    tags = db.relationship("TagModel", back_populates="store")
    items = db.relationship("ItemModel", back_populates="store")
    storeImages = db.relationship("StoreImages", back_populates="store")
    '''
    Remember that if we don't use lazy equal dynamic, when we create a StoreModel

object, or we get it from the database, it will make, a query into the database

to fetch all the tag information.

And that can be okay.

But if we didn't have lazy equal dynamic here, or here then every

time we fetch a StoreModel, we would have two queries running.

One for items and one for tags.

So this adds up if you don't use lazy dynamic.

The more relationships you have, the heavier the models become and the slower

it is to get them from the database.

So generally I like using this unless I'm really gonna be using

the relationship constantly.
    '''

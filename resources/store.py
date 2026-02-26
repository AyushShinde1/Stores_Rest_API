from flask.views import MethodView
from flask_smorest import Blueprint, abort
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from sqlalchemy.orm import joinedload

from db import db
from models import StoreModel, ItemModel
from schemas import StoreSchema


blp = Blueprint("Stores", "stores", description="Operations on stores")

@blp.route("/store/name/<string:name>")
class StoreName(MethodView):
    #@blp.response(200, StoreSchema)
    def get(self, name):
        store = StoreModel.query.filter_by(name=name).first_or_404()
        return {"store":store.id}

@blp.route("/store/<string:store_id>")
class Store(MethodView):
    @blp.response(200, StoreSchema)
    def get(self, store_id):
        # store = StoreModel.query.get_or_404(store_id)
        # return store
        store = StoreModel.query.options(
            joinedload(StoreModel.items).joinedload(ItemModel.itemImages),
            joinedload(StoreModel.tags),
            joinedload(StoreModel.storeImages)
        ).filter_by(id=store_id).first_or_404()
        return store

    def delete(self, store_id):
        store = StoreModel.query.get_or_404(store_id)
        db.session.delete(store)
        db.session.commit()
        return {"message": "Store deleted"}, 200


@blp.route("/store")
class StoreList(MethodView):
    @blp.response(200, StoreSchema(many=True))
    def get(self):
        return StoreModel.query.all()

    @blp.arguments(StoreSchema)
    @blp.response(201, StoreSchema)
    def post(self, store_data):
        store = StoreModel(**store_data)
        try:
            db.session.add(store)
            db.session.commit()
        except IntegrityError:
            abort(
                400,
                message="A store with that name already exists.",
            )
        except SQLAlchemyError:
            abort(500, message="An error occurred creating the store.")

        return store
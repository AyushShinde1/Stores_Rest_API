from marshmallow import Schema, fields


class PlainItemSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    price = fields.Float(required=True)


class PlainStoreSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str()


class PlainTagSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str()


class ItemImageSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str()
    image_url = fields.Str(dump_only=True)
    description = fields.Str()
    item_id = fields.Int(required=True)


class StoreImageSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    image_url = fields.Str(dump_only=True)
    description = fields.Str()
    store_id = fields.Int(required=True)



class ItemSchema(PlainItemSchema):
    store_id = fields.Int(required=True, load_only=True)
    store = fields.Nested(PlainStoreSchema(), dump_only=True)
    tags = fields.List(fields.Nested(PlainTagSchema()), dump_only=True)
    
    itemImages = fields.List(fields.Nested(ItemImageSchema()), dump_only=True)


class ItemUpdateSchema(Schema):
    name = fields.Str()
    price = fields.Float()


class StoreSchema(PlainStoreSchema):
    #items = fields.List(fields.Nested(PlainItemSchema()), dump_only=True)
    items = fields.List(fields.Nested(ItemSchema()), dump_only=True)
    tags = fields.List(fields.Nested(PlainTagSchema()), dump_only=True)

    storeImages = fields.List(fields.Nested(StoreImageSchema()), dump_only=True)


class TagSchema(PlainTagSchema):
    store_id = fields.Int(load_only=True)
    items = fields.List(fields.Nested(PlainItemSchema()), dump_only=True)
    store = fields.Nested(PlainStoreSchema(), dump_only=True)


class TagAndItemSchema(Schema):
    message = fields.Str()
    item = fields.Nested(ItemSchema)
    tag = fields.Nested(TagSchema)


class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    username = fields.Str(required=True)
    password = fields.Str(required=True, load_only=True)


class UserRegisterSchema(UserSchema):
    email = fields.Str(required=True)
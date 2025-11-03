const Mongose = require('mongoose');

const productSchema = new Mongose.Schema({
  name: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  category: {
    type: String,
  },
  stock: {
    type: String,
  },
  availableLocations: {
    type: [String],
  },
});

const Product = Mongose.model('Product', productSchema);

async function getProducts() {
  try {
    const data = await Product.collection.find({}).toArray();
    return data;
  } catch (e) {
    console.log(e.message);
  }
}

async function getProductByName(name) {
  try {
    const data = await Product.collection.find({ name }).toArray();
    return data;
  } catch (e) {
    console.log(e.message);
  }
}

async function removeProduct(id) {
  try {
    const data = await Product.collection.deleteOne({
      _id: Mongose.Types.ObjectId.createFromHexString(id),
    });
    return data;
  } catch (e) {
    console.log(e.message);
  }
}

async function updateProduct(id, updatedData) {
  try {
    const item = await Product.collection.findOne({
      _id: Mongose.Types.ObjectId.createFromHexString(id),
    });
    if (!item) {
      throw new Error('Product not found');
    }
    const data = await Product.collection.updateOne(
      { _id: Mongose.Types.ObjectId.createFromHexString(id) },
      { $set: { ...item, ...updatedData } }
    );
    return data;
  } catch (e) {
    console.log(e.message);
  }
}




async function addProducts(product) {
  try {
    const data = await Product.collection.insertOne(product);
  } catch (e) {
    console.log(e.message);
  }
}
module.exports = { Product, addProducts,getProducts,getProductByName,removeProduct,updateProduct };

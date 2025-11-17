const { getUserInfoFromToken } = require('../utils/helper');
require('dotenv').config();

function addToCart(req) {
  const token = req.headers.get('token');
  const user = getUserInfoFromToken(token);
  const productInfo = getProductDetales(productId);
}

async function getProductDetales(productId) {
  try {
    const PRODUCT_SERVICE = process.env.PRODUCT_URL;
    const res = await axios.get(PRODUCT_SERVICE);
    return res.data;
  } catch (e) {
    console.log(e);
  }
}

module.exports = {
  addToCart,
};

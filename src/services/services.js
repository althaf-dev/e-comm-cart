const { getUserInfoFromToken } = require('../utils/helper');
const {
  addToDb,
  getFromDb,
  getItemQty,
  deleteItemFromDb,
  updateItemFromDb,
} = require('../model/cart');
require('dotenv').config();
const axios = require('axios');
const END_POINTS = require('../constants/endpoints');
const APIError = require('../controller/errorController');

async function addToCart(token, productId, qty) {
  try {
    const user = getUserInfoFromToken(token);
    const productInfo = await getProductDetales(productId);
    productInfo['productId'] = productInfo['_id'];
    delete productInfo['_id'];
    const existingQty = await getItemQty(user.userId, productInfo.productId);
    productInfo['qty'] = existingQty + qty;
    await addToDb({
      userId: user.userId,
      userName: user.username,
      ...productInfo,
    });
    return { userId: user.userId, userName: user.username, ...productInfo };
  } catch (e) {
    throw e;
  }
}

async function getCartData(token) {
  try {
    const userId = getUserInfoFromToken(token)?.userId ?? null;
    if (!userId)
      throw new APIError('Not authenticateed, user id not availble', 401);
    const data = await getFromDb(userId);
    console.log(data);
    return data;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

async function deleteCartItem(token, productId) {
  const userId = getUserInfoFromToken(token)?.userId ?? '';
  if (!userId) throw new APIError('Not authorized', 401);
  const res = await deleteItemFromDb(userId, productId);
  return res;
}

async function updateCartItem(token, prodcutId, operation, qty = 1) {
  const userId = getUserInfoFromToken(token)?.userId ?? '';
  if (!userId) throw new APIError('Not authorized', 401);
  let existingQty = await getItemQty(userId, prodcutId);
  if (existingQty - qty > 0 && operation === 'dec') {
    existingQty = existingQty - qty;
  }
  if (operation === 'inc') {
    existingQty = existingQty + qty;
  }
  if (!operation) {
    existingQty = qty;
  }
  const result = await updateItemFromDb(userId, prodcutId, existingQty);
  return result;
}

async function getProductDetales(productId) {
  try {
    const PRODUCT_SERVICE = process.env.PRODUCT_URL;
    const url = `${PRODUCT_SERVICE}/${END_POINTS.PRODUCT.GET_PRODUCT}/${productId}`;
    const res = await axios.get(url);
    return res.data;
  } catch (e) {
    throw new APIError(
      e?.response?.data?.message ?? e?.message ?? 'Something went wrong',
      e?.response?.status ?? 500
    );
  }
}

module.exports = {
  addToCart,
  getCartData,
  deleteCartItem,
  updateCartItem,
};

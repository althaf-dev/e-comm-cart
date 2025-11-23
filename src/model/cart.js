const { redisClient } = require('../config/db');
const APIError = require('../controller/errorController');

const getKey = (userId) => `cart:${userId}`;
const getField = (productId) => `product:${productId}`;

async function addToDb(data) {
  const { userId, username, ...productInfo } = data;
  const { productId, ...values } = productInfo;
  console.log(values);
  redisClient.hSet(getKey(userId), getField(productId), JSON.stringify(values));
}

async function getFromDb(userId) {
  const data = await redisClient.hGetAll(`cart:${userId}`);
  const keys = Object.keys(data);
  if (keys.length === 0) throw new APIError('User has no items in cart', 404);
  keys.forEach((key) => {
    data[key] = JSON.parse(data[key]);
  });
  return data;
}
async function getItemQty(userId, productId) {
  const data = await redisClient.hGet(getKey(userId), getField(productId));
  console.log('qty d', data, getField[productId]);
  const value = JSON.parse(data);
  console.log('qty data', value.qty);
  return value?.qty ?? 0;
}

async function deleteItemFromDb(userId, productId) {
  await redisClient.hDel(getKey(userId), getField(productId));
  return true;
}
async function updateItemFromDb(userId,prodcutId,newQty){
   let data = await redisClient.hGet(getKey(userId),getField(prodcutId));
   if(Object.keys(data).length ===0)
     throw new APIError(`Item with id ${prodcutId} does not exist`);
   data = JSON.parse(data);
   data.qty = newQty;
   await redisClient.hSet(getKey(userId),getField(prodcutId),JSON.stringify(data))
   return true;
}

module.exports = {
  addToDb,
  getFromDb,
  getItemQty,
  deleteItemFromDb,
  updateItemFromDb
};

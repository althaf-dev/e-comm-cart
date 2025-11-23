const jwt = require('json-web-token');
require('dotenv').config();

function getUserInfoFromToken(token) {
  const tokenKey = process.env.TOKEN_KEY;
  try {
    const user = jwt.decode(tokenKey, token);
    return user.value;
  } catch (e) {
    console.log('token verification failed');
  }
}

const getToken = (req) => req.headers.authorization?.split(' ')[1];

module.exports = {
  getUserInfoFromToken,
  getToken
};

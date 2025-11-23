class APIError extends Error {
  static messages = {
    PRODUCT_NOT_FOUND: 'The product is not avialble',
  };

  constructor(messages, status, name) {
    super(messages);
    this.status = status;
    this.name = name;
  }
}

module.exports = APIError;

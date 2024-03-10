class AppError  {
    constructor(message, statusCode) {
      this.message=message
      // super(message)
  
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      this.isOperational = true;
      // console.log(this)
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  module.exports = AppError;
  
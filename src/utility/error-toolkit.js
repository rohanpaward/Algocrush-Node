/*
 * This file contains helpers for Error management
 *
 * Author: Manmath Baral
 */

const Exception = (errorObj, statusCode = 500) => {
    const error = new Error(errorObj);
    error.statusCode = statusCode;
    throw error;
  };
  
  module.exports = {
    Exception,
  };
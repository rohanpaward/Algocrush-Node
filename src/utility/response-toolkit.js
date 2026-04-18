
/* eslint-disable indent */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-confusing-arrow */
/* eslint-disable implicit-arrow-linebreak */
/*
 * This is a response toolkit designed to handle the response to an incoming request.
 * Use this toolkit where ever a response has to be returned
 *
 * Author: Manmath Baral
 */
const { Boom } = require('@hapi/boom');
const { Exception } = require('./error-toolkit');
const { logger } = require('./logger');

// eslint-disable-next-line default-param-last, max-len
const sendResponse = (serviceResponse, res) =>
  serviceResponse?.isBoom
    ? serviceResponse
    : res?.response(serviceResponse)?.code(serviceResponse?.statusCode);

const sendFileResponse = (serviceResponse, h) => {
  if (process.env.SOURCE === 'Local') {
    return serviceResponse.isBoom
      ? serviceResponse
      : h
        .file(serviceResponse.data.filePath, {
          confine: false,
          mode: 'attachment',
          filename: serviceResponse.data.filename,
        })
        .code(serviceResponse?.statusCode);
  }
  // Incase the source is selected as AWS S3
  return serviceResponse.isBoom
    ? serviceResponse
    : h
      .response(serviceResponse.data.Body)
      .header('Content-Disposition')
      .header('Content-Type', serviceResponse.data.ContentType);
};

const formatResponse = (data, code = 500) => {
  const options = {
    data,
    statusCode: code,
  };
  if (code >= 400) {
    const error = new Boom(data, options);
    logger.error(error);
    return error;
  }
  options.isBoom = false;
  return options;
};

const tokenValidationResponse = (isValid, error = {}) => {
  if (isValid) {
    return {
      isValid,
    };
  }
  const err = Exception(error?.message, 401);
  logger.error(err);
  return err;
};

module.exports = {
  sendResponse,
  tokenValidationResponse,
  formatResponse,
  sendFileResponse,
};

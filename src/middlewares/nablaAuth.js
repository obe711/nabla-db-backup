const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const nablaEnvSchema = Joi.string().required().description('Nabla API Key');

module.exports = () => async (req, res, next) => {
  const userAgent = req.headers['user-agent'];

  if (!userAgent.includes('Nabla')) return next(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));


  const { value: nablaEnvKey, error } = nablaEnvSchema.validate(process.env.NABLA_KEY);
  if (error) {
    return next(new ApiError(httpStatus.UNAUTHORIZED, 'Missing Nabla API Key'));
  }
  const nabla = req.headers['x-nabla'];

  if (nabla !== nablaEnvKey) return next(new ApiError(httpStatus.UNAUTHORIZED, 'Invalid Nabla API Key'));

  return next();
};
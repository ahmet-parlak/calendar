const { validationResult } = require('express-validator');

exports.getValidationErrors = (req) => {
  const errors = [];

  validationResult(req)
    .array()
    .forEach((err) => errors.push(err.msg));

  return errors;
};

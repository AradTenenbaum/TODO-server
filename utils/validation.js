// VALIDATION
const Joi = require("@hapi/joi");


// Register Validation
const registerValidation = (data) => {
   
    // VALIDATION SCHEMA
    const schema = Joi.object({
    username: Joi.string().min(3).required(),
    password: Joi.string().min(6).required()
  });

  return schema.validate(data);
};


// Login Validation
const loginValidation = (data) => {
   
    // VALIDATION SCHEMA
    const schema = Joi.object({
    username: Joi.string().min(3).required(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};


module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;

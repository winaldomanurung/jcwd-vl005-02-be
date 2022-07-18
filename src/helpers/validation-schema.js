const Joi = require("joi");

module.exports.addProductSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  description: Joi.string().min(3).max(200).required(),
  category: Joi.number().required(),
  stock: Joi.number().required(),
  volume: Joi.number().required(),
  unit: Joi.string().max(10).required(),
  price: Joi.number().required(),
  // picture: Joi.string().max(200).required(),
});

module.exports.editProductSchema = Joi.object({
  name: Joi.string().min(3).max(50).allow(null, ""),
  description: Joi.string().min(3).max(200).allow(null, ""),
  category: Joi.number().allow(null, ""),
  stock: Joi.number().allow(null, ""),
  volume: Joi.number().allow(null, ""),
  unit: Joi.string().max(10).allow(null, ""),
  price: Joi.number().allow(null, ""),
  // picture: Joi.string().max(200).allow(null, ""),
});

module.exports.addCategorySchema = Joi.object({
  name: Joi.string().min(3).max(25).required(),
});

module.exports.editCategorySchema = Joi.object({
  name: Joi.string().min(3).max(25).allow(null, ""),
});

module.exports.loginSchema = Joi.object({
  username: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string()
    // .min(8)
    // .pattern(/[!@#$%&*_!]/)
    // .pattern(/[A-Z]/)
    // .pattern(/[a-z]/)
    // .pattern(/[0-9]/)
    .required(),
});

module.exports.registerSchema = Joi.object({
  username: Joi.string().min(8).alphanum().required(),
  email: Joi.string().email().required(),
  firstName: Joi.string().required().error(new Error('Give your error message here for first name')),
  lastName: Joi.string().required(),
  password: Joi.string()
    .min(8)
    .pattern(/[!@#$%&*_!]/)
    .pattern(/[A-Z]/)
    .pattern(/[a-z]/)
    .pattern(/[0-9]/)
    .required(),
  repassword: Joi.ref("password"),
});

module.exports.resetPasswordSchema = Joi.object({
  password: Joi.string()
    .min(8)
    .pattern(/[!@#$%&*_!]/)
    .pattern(/[A-Z]/)
    .pattern(/[a-z]/)
    .pattern(/[0-9]/)
    .required(),
  repassword: Joi.ref("password"),
});

module.exports.forgotPasswordSchema = Joi.object({
  Email: Joi.string().email().required(),
});
module.exports.addAddressSchema = Joi.object({
  label: Joi.string().min(3).max(50).required(),
  address: Joi.string().min(3).max(200).required(),
  phone: Joi.number().required(),
  city: Joi.string().min(3).max(50).required(),
  postal_code: Joi.number().required(),
  province: Joi.string().min(3).max(50).required(),
});

module.exports.addProofSchema = Joi.object({
  invoiceId: Joi.number().required(),
});

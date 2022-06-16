const Joi = require("joi");

module.exports.registerUserSchema = Joi.object({
  username: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(6)
    .max(20)
    .pattern(/[!@#$%&*_!]/)
    .required(),
  repeat_password: Joi.ref("password"),
});

module.exports.editProductSchema = Joi.object({
  name: Joi.string().min(3).max(50).allow(null, ""),
  description: Joi.string().min(3).max(200).allow(null, ""),
  category: Joi.string().min(3).max(25).allow(null, ""),
  stock: Joi.number().allow(null, ""),
  volume: Joi.number().allow(null, ""),
  unit: Joi.string().max(10).allow(null, ""),
  price: Joi.number().allow(null, ""),
  picture: Joi.string().max(200).allow(null, ""),
});

module.exports.loginUserSchema = Joi.object({
  credential: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(6).max(13).required(),
  // password : Joi.string().min(6).max(13).pattern(/[!@#$%&*_!]/).required()
});

module.exports.resetPasswordUserSchema = Joi.object({
  email: Joi.string().email().required(),
});

module.exports.addRestaurantSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  location: Joi.string().min(3).max(20).required(),
  type: Joi.string().required(),
  price: Joi.number().required(),
  description: Joi.string().min(3).max(400).required(),
});

module.exports.addReviewSchema = Joi.object({
  restaurantId: Joi.required(),
  userId: Joi.required(),
  reviewTitle: Joi.string().min(3).max(30).required(),
  reviewDescription: Joi.string().min(3).max(300).required(),
});

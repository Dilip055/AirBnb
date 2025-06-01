
import Joi from "joi";

export const listingSchema = Joi.object({
  title: Joi.string().trim().required(),
  description: Joi.string().allow("").trim(),
  image: Joi.string().uri().allow(""),
  price: Joi.number().min(0).required(),
  location: Joi.string().trim().required(),
  country: Joi.string().trim().required(),
});

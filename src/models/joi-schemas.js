import Joi from "joi";

export const UserCredentialsSpec = {
  email: Joi.string().email().required(),
  password: Joi.string().required(),
};

export const UserSpec = {
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
};

export const PlaceSpec = {
  name: Joi.string().required(),
  location: Joi.string().required(),
  latitude: Joi.number().greater(-90).less(90).required(),
  longitude: Joi.number().greater(-180).less(180).required(),
  description: Joi.string().optional(),
}
import Joi from "joi";

export const signUpSchema = {
  body: Joi.object({
    username: Joi.string().min(5).max(15).required().messages({
      'any.required': 'Please enter a username'
    }),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(20).required(),
    age: Joi.number().positive().min(15).max(90).required(),
    gender: Joi.string().valid("male", "female").required(),
    phone: Joi.number().required(),
  })
};

export const signInSchema = {
  body: Joi.object({
    username: Joi.string().min(5).max(15),
    email: Joi.string().email(),
    password: Joi.string().min(6).max(20).required(),
  }),
};

export const chPassSchema = {
  body: Joi.object({
      password: Joi.string().min(6).max(20),
      newPassword: Joi.string().min(6).max(20)
    }).options({
      presence: 'required'
    })
    .with("password", "newPassword"),
  headers: Joi.object({
    accesstoken: Joi.string().trim().required()
  }).options({
    allowUnknown: true
  })
};

export const updateUserSchema = {
  body: Joi.object({
    username: Joi.string().min(5).max(15),
    email: Joi.string().email(),
    password: Joi.string().min(6).max(20),
    age: Joi.number().positive().min(15).max(90),
    gender: Joi.string().valid("male", "female"),
    phone: Joi.number()
  }),
  headers: Joi.object({
    accesstoken: Joi.string().trim().required()
  }).options({
    allowUnknown: true
  })
};

export const deleteUserSchema = {
  headers: Joi.object({
    accesstoken: Joi.string().trim().required()
  }).options({
    allowUnknown: true
  })
}

export const softDeleteUserSchema = {
  headers: Joi.object({
    accesstoken: Joi.string().trim().required()
  }).options({
    allowUnknown: true
  })
}
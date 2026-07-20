const Joi = require('joi');

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email is invalid',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'any.required': 'Password is required',
  }),
});

const signupSchema = loginSchema.keys({
  name: Joi.string().required().messages({
    'any.required': 'Name is required',
  }),
});


const passwordSchema = Joi.object({
  newPassword: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'any.required': 'Password is required',
  }),
});


const schemas = { login: loginSchema, signup: signupSchema , password: passwordSchema};



const validateRequest = (type) => (req, res, next) => {
  const { error } = schemas[type].validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      status: 400,
      message: 'Request validation failed',
      errors: error.details.reduce((acc, d) => {
        acc[d.path[0]] = d.message;
        return acc;
      }, {}) 
    });
  }
  next();
};


module.exports = validateRequest ;

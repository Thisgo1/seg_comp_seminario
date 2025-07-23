import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { auditLog } from '../services/auditService'; // Certifique-se do .js

// Esquemas de validação Joi
const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email must be a valid email address.',
    'string.empty': 'Email cannot be empty.',
    'any.required': 'Email is required.'
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters long.',
    'string.empty': 'Password cannot be empty.',
    'any.required': 'Password is required.'
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const signPayloadSchema = Joi.object({
  payloadToSign: Joi.object().required().messages({
    'any.required': 'Payload to sign is required.',
    'object.base': 'Payload to sign must be an object.'
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password for signing cannot be empty.',
    'any.required': 'Password for signing is required.'
  }),
});

const purchaseSchema = Joi.object({
  payload: Joi.object({
    orderId: Joi.string().required(),
    item: Joi.string().required(),
    quantity: Joi.number().integer().min(1).required(),
    price: Joi.number().positive().required(),
    currency: Joi.string().length(3).required(),
    timestamp: Joi.string().isoDate().required(),
    productId: Joi.string().required(), // Adicionado para corresponder ao modelo
    amount: Joi.number().positive().required(), // Adicionado para corresponder ao modelo
  }).required().messages({
    'any.required': 'Purchase payload is required.',
    'object.base': 'Purchase payload must be an object.'
  }),
  signature: Joi.string().required().messages({
    'string.empty': 'Signature cannot be empty.',
    'any.required': 'Signature is required.'
  }),
});

// Middleware de validação genérico
const validate = (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction) => {
  const { error } = schema.validate(req.body, { abortEarly: false }); // abortEarly: false para coletar todos os erros

  if (error) {
    const errors = error.details.map(detail => detail.message);
    const userId = req.user?.id || null;
    auditLog(userId, 'INPUT_VALIDATION_ERROR', `Validation failed for ${req.path}: ${errors.join(', ')}`, req.ip);
    return res.status(400).json({ errors });
  }
  next();
};

// Exportar middlewares de validação específicos
export const validateRegister = validate(registerSchema);
export const validateLogin = validate(loginSchema);
export const validateSignPayload = validate(signPayloadSchema);
export const validatePurchase = validate(purchaseSchema);

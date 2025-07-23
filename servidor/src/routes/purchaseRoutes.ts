import { Router } from 'express';
import { createPurchase } from '../controllers/purchaseController';
import { validatePurchase } from '../middleware/validationMiddleware';
const router = Router();

router.post('/', validatePurchase, createPurchase); // Aplicar validação

export default router;

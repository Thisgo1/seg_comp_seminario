import { Router } from 'express';
import { requestSignature } from '../controllers/signingController';
import { validateSignPayload } from '../middleware/validationMiddleware'; 

const router = Router();

router.post('/', validateSignPayload, requestSignature);

export default router;

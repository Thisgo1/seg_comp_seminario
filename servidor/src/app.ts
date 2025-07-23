import express from 'express';
import authRoutes from './routes/authRoutes';
import purchaseRoutes from './routes/purchaseRoutes';
import signingRoutes from './routes/signingRoutes';
import jwt from 'jsonwebtoken';
import { auditLog } from './services/auditService';
import { prisma } from './lib/prisma';
import cors from 'cors'; // Importar CORS
import helmet from 'helmet'; // Importar Helmet
import rateLimit from 'express-rate-limit'; // Importar Rate Limiting

// Declarar a interface Request para adicionar o campo 'user'
declare global {
  namespace Express {
    interface Request {
      user?: { id: string; email: string };
    }
  }
}

const app = express();

// --- Barreiras de Segurança Adicionadas ---

// 1. Helmet: Protege o app de vulnerabilidades conhecidas definindo cabeçalhos HTTP
app.use(helmet());

// 2. CORS: Configuração para permitir requisições do seu frontend React
// Em produção, substitua '*' pelo domínio específico do seu frontend (ex: 'https://seufrontend.com')
app.use(cors({
  origin: 'http://localhost:5173', // Ou o domínio do seu frontend React
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// 3. Rate Limiting: Limita o número de requisições para prevenir ataques de força bruta/DoS
// Aplicar globalmente ou em rotas específicas. Aqui, um limite geral.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limite cada IP a 100 requisições por janela
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Aplicar o limitador de taxa a todas as requisições que começam com /api/
app.use('/api/', apiLimiter);

// Rate Limiting mais rigoroso para rotas sensíveis como login e registro
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Limite cada IP a 5 tentativas de login/registro por janela
  message: 'Too many authentication attempts from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// --- Fim das Barreiras de Segurança Adicionadas ---


app.use(express.json()); // Habilita o parsing de JSON no corpo das requisições

// Middleware de autenticação JWT
app.use((req, res, next) => {
  if (req.path === '/api/auth/register' || req.path === '/api/auth/login') {
    return next(); // Não aplica autenticação para rotas de registro e login
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    auditLog(null, 'UNAUTHORIZED_ACCESS', `Attempted access to ${req.path} without token from IP: ${req.ip}`);
    return res.status(401).send('Access Denied: No token provided');
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    auditLog(null, 'UNAUTHORIZED_ACCESS', `Attempted access to ${req.path} with malformed token from IP: ${req.ip}`);
    return res.status(401).send('Access Denied: Token malformed');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string; email: string };
    req.user = { id: decoded.userId, email: decoded.email };
    next();
  } catch (error: any) {
    auditLog(null, 'INVALID_TOKEN', `Invalid or expired token for ${req.path} from IP: ${req.ip}. Error: ${error.message}`);
    res.status(400).send('Invalid Token');
  }
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/purchase', purchaseRoutes);
app.use('/api/sign-payload', signingRoutes); // Adicionar nova rota de assinatura

// Middleware para auditoria de todas as requisições
app.use((req, res, next) => {
  res.on('finish', () => {
    const userId = req.user?.id || null;
    const action = `API_CALL: ${req.method} ${req.path}`;
    const details = `Status: ${res.statusCode}`;
    auditLog(userId, action, details, req.ip);
  });
  next();
});

export default app;

import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import * as csurf from "csurf";

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  private csrfProtection: ReturnType<typeof csurf>;

  constructor() {
    this.csrfProtection = csurf({
      cookie: {
        key: '_csrf',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 // 24 horas
      },
      value: (req) => {
        // Extrai o token do header ou do body
        return req.headers['x-csrf-token'] || req.body?.csrfToken;
      }
    });
  }

  use(req: Request, res: Response, next: NextFunction) {
    // Ignora métodos seguros (GET, HEAD, OPTIONS)
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
      return next();
    }

    // Ignora rotas públicas (login, register, etc.)
    const publicRoutes = ['/auth/login', '/auth/register'];
    if (publicRoutes.includes(req.path)) {
      return next();
    }

    this.csrfProtection(req, res, (err) => {
      if (err) {
        console.error('CSRF Validation Error:', err);
        return res.status(403).json({
          statusCode: 403,
          message: 'Invalid CSRF Token',
          error: 'Forbidden'
        });
      }

      res.locals.csrfToken = req.csrfToken();
      next();
    });
  }
}

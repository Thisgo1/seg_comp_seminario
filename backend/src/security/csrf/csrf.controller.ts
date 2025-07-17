// src/security/csrf/csrf.controller.ts
import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('csrf')
export class CsrfController {
  @Get('token')
  getCsrfToken(@Req() req: Request, @Res() res: Response) {
    // Verifica se o token está disponível
    if (!req.csrfToken) {
      return res.status(500).json({ 
        message: 'CSRF middleware not properly configured' 
      });
    }

    // Configura o cookie (opcional, mas recomendado)
    res.cookie('XSRF-TOKEN', req.csrfToken(), {
      httpOnly: false, // Permite que o frontend leia
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    return res.json({ 
      csrfToken: req.csrfToken() 
    });
  }
}

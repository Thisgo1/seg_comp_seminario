import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from '../../auth/auth.guard';

@Controller('csrf')
export class CsrfController {
  @Get('token')
  @UseGuards(AuthGuard) // Usando seu AuthGuard existente
  getCsrfToken(@Req() req: Request, @Res() res: Response) {
    if (!req.csrfToken) {
      return res.status(500).json({ 
        message: 'CSRF middleware not properly configured' 
      });
    }

    const csrfToken = req.csrfToken();

    // Configura o cookie para o frontend
    res.cookie('XSRF-TOKEN', csrfToken, {
      httpOnly: false, // Permite leitura pelo JS
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
    });

    return res.json({ 
      csrfToken,
      expiresIn: '24h'
    });
  }
}

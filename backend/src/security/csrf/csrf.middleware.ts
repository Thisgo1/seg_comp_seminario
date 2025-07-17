import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import * as csurf from "csurf";

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
	private csrf = csurf({ cookie: true }); // Configura o csurf com cookies

	use(req: Request, res: Response, next: NextFunction) {
		// Aplica o middleware csurf
		this.csrf(req, res, (err) => {
			if (err) return next(err);

			// Adiciona o token ao response locals para uso nas rotas
			res.locals.csrfToken = req.csrfToken ? req.csrfToken() : null;
			next();
		});
	}
}

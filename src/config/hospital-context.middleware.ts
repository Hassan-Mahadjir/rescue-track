import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class HospitalContextMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      try {
        const decoded = this.jwtService.decode(token);
        if (decoded && 'hospitalId' in decoded) {
          req['hospitalId'] = decoded.hospitalId;
        }
      } catch (error) {
        // Silently continue - auth guard will handle invalid tokens
      }
    }
    next();
  }
}

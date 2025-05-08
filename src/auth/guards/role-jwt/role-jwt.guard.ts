import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from '../jwt-auth/jwt-auth.guard';
import { AllowedRoles } from 'src/auth/types/auth-jwtPayload'; // Union of Role and UserRole

@Injectable()
export class RolesJwtAuthGuard extends JwtAuthGuard implements CanActivate {
  constructor(protected reflector: Reflector) {
    super(reflector);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isJwtValid = await super.canActivate(context);
    if (!isJwtValid) return false;

    const requiredRoles = this.reflector.get<AllowedRoles[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    return true;
  }
}

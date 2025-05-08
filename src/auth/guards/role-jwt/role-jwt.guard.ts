import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from '../jwt-auth/jwt-auth.guard';
import { Role } from 'src/auth/enums/role.enums';

@Injectable()
export class RolesJwtAuthGuard extends JwtAuthGuard implements CanActivate {
  constructor(reflector: Reflector) {
    super(reflector);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Call the parent guard's canActivate to validate the JWT
    const isJwtValid = await super.canActivate(context);
    if (!isJwtValid) return false;

    // Get the required roles from the route's metadata
    const requiredRoles = this.reflector.get<Role[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) return true; // If no roles are specified, allow access

    // Get the user from the request
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Check if the user's role matches the required roles
    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    return true;
  }
}

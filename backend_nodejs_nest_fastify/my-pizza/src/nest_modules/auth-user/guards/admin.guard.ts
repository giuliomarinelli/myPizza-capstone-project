import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { JwtUtilsService } from '../services/jwt-utils.service';
import { User } from '../entities/user.entity';
import { UserScope } from '../enums/user-scope.enum';

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(private jwtUtils: JwtUtilsService) { }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    const req = context.switchToHttp().getRequest<FastifyRequest>()

    const user: User = await this.jwtUtils.getUserFromReq(req)
    if (!user) throw new UnauthorizedException('You don\'t have the permissions to access this resource',
      { cause: new Error(), description: 'Unauthorized' })

    if (!user.scope.includes(UserScope.ADMIN))
      throw new UnauthorizedException('You don\'t have the permissions to access this resource',
        { cause: new Error(), description: 'Unauthorized' })

    return true
  }
}

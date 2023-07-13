import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { SetMetadata } from '@nestjs/common';
import { Observable } from 'rxjs';
import { OfficeService } from 'src/office/office.service';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private officeService: OfficeService,
    private reflector: Reflector
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      try {
        await super.canActivate(context);

        try {
          const user = context.switchToHttp().getRequest().user
          const offices = await this.officeService.getMyOffices(user._id)
          context.switchToHttp().getRequest().offices = offices
        } catch (error) { }


      } catch (error) { }

      // 
      return true;
    }
    try {
      await super.canActivate(context);

      try {
        const user = context.switchToHttp().getRequest().user
        const offices = await this.officeService.getMyOffices(user._id)
        context.switchToHttp().getRequest().offices = offices
      } catch (error) { }

    } catch (error) {
      throw new UnauthorizedException("You must login for this action", "Unauthorized")
    }
    return true;
  }
}

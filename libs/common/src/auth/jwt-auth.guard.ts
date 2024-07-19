import {
  Inject,
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { Observable, tap, map, catchError, of } from 'rxjs';
import { AUTH_SERVICE } from '../constans/services';
import { ClientProxy } from '@nestjs/microservices';
import { UserDto } from '@app/common';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const jwt = context.switchToHttp().getRequest().cookies?.Authentification;

    if (!jwt) {
      false;
    }

    return this.authClient
      .send<UserDto>('authenticate', {
        Authentifiacation: jwt,
      })
      .pipe(
        tap((res) => {
          context.switchToHttp().getRequest().user = res;
        }),
        map(() => true),
        catchError(() => of(false)),
      );
  }
}

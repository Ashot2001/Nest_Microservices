import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UsersService } from '../src/users/users.service';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from '../src/interfaces/token-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) =>
          request?.cookies?.Authentification || request?.Authentifiacation,
      ]),
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }
  async validate({ userId }: TokenPayload) {
    return this.usersService.getUser({ _id: userId });
  }
}

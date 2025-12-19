import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { ConfigType } from 'src/config/configuration';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../JwtPayload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authservice: AuthService,
    configService: ConfigService<ConfigType>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<ConfigType['jwt']>('jwt').secret,
    });
  }

 async validate(paylaod:JwtPayload) {
      const user = await this.authservice.validateUser(paylaod.userId);
      
      if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    return user;
  }
}

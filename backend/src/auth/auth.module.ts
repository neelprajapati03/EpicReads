import { Global, Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ConfigType } from "src/config/configuration";
import { StringValue } from "ms";
import { JwtStrategy } from "./startegies/Jwt.startegy";
import { AuthService } from "./auth.service";

@Global()
@Module({
    controllers:[AuthController],
    imports:[
        JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<ConfigType>) => ({
        secret: configService.getOrThrow<ConfigType['jwt']>('jwt').secret,
        signOptions: {
          expiresIn:
            configService.getOrThrow<ConfigType['jwt']>('jwt')
              .accessTokenExpiresIn as StringValue,
        },
      }),
      inject: [ConfigService],
    }),
    ],
    providers:[
        JwtStrategy,
        AuthService
    ],
    exports:[AuthService,JwtModule]
})

export class AuthModule {}
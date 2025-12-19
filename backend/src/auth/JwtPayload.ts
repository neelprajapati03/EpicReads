import { JwtStrategy } from "./startegies/Jwt.startegy";

export type JwtPayload={
    userId:string,
    email:string
}

export type RequestUserEntity = Awaited<
  ReturnType<typeof JwtStrategy.prototype.validate>
>;
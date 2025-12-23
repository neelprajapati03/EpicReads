import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DrizzleService } from 'src/db/drizzle.service';
import { GetUserDto } from 'src/Dtos/GetUser.dto';
import { RegisterDto } from 'src/Dtos/types/register.dto';
import * as bcrypt from 'bcrypt';
import { userTable } from 'src/db/schema';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from 'src/Dtos/types/login.dto';
import { eq } from 'drizzle-orm';

@Injectable()
export class AuthService {
  constructor(
    protected jwtservice: JwtService,
    private drizzleservice: DrizzleService,
  ) {}

  async register(data: RegisterDto): Promise<GetUserDto> {
    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // create user

    const [user] = await this.drizzleservice.db
      .insert(userTable)
      .values({
        firstName: data.firstname,
        lastName: data.lastname,
        email: data.email,
        password: hashedPassword,
      })
      .returning({
        userId: userTable.userId,
        email: userTable.email,
      });

    return {
      userId: user.userId,
      email: user.email,
    };
  }

  async login(data: LoginDto): Promise<{ access_token: string }> {
    const existingUser = await this.drizzleservice.db.query.userTable.findFirst(
      {
        where: eq(userTable.email, data.email),
      },
    );

    if (!existingUser || !existingUser.password) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(
      data.password,
      existingUser.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.jwtservice.sign({
      userId: existingUser.userId,
      email: existingUser.email,
      userType: existingUser.userType,
    });

    return { access_token: token };
  }

  async validateUser(userId: string) {
    const user = await this.drizzleservice.db.query.userTable.findFirst({
      where: eq(userTable.userId, userId),
      columns: {
        userId: true,
        email: true,
        firstName: true,
        lastName: true,
        userType: true,
      },
    });

    return user || null;
  }
}

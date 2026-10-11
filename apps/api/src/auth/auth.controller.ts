import { Body, Controller, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';

class LoginDto {
  email: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto.email, dto.password);

    res.cookie('library_session', result.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return result;
  }

  @Post('logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = req.cookies?.library_session;
    if (token) {
      await this.authService.logout(token);
    }

    res.clearCookie('library_session', { path: '/' });

    return {
      success: true,
      message: 'Logged out successfully.',
      timestamp: new Date().toISOString(),
    };
  }

  @Post('me')
  async me(@Req() req: Request) {
    const token = req.cookies?.library_session;
    if (!token) {
      throw new UnauthorizedException('Authentication required.');
    }

    const user = await this.authService.validateSession(token);
    if (!user) {
      throw new UnauthorizedException('Session expired or invalid.');
    }

    return {
      success: true,
      data: { user },
      timestamp: new Date().toISOString(),
    };
  }
}

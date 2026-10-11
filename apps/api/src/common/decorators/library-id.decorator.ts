import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common';

export const LibraryId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.libraryId) {
      throw new BadRequestException('User context missing or invalid.');
    }

    return user.libraryId;
  },
);

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaService } from './prisma/prisma.service';
import { UsersService } from './user/user.service';
import { PostsService } from './post/post.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, PrismaService, UsersService, PostsService],
})
export class AppModule {}
